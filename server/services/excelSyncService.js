/**
 * Personal Microsoft Account Excel Synchronization Service
 * 
 * Target: Personal Microsoft Account (OneDrive / Personal Excel)
 * Auth Strategy: Delegated OAuth 2.0 User Authorization (offline_access + Files.ReadWrite)
 * Write Strategy: Worksheet Range Patch (PATCH /range(address='A{N}:Q{N}')) for Personal Accounts
 */
const fs = require('fs');
const path = require('path');
const env = require('../config/env');
const logger = require('../utils/logger');

const TOKEN_FILE_PATH = path.join(__dirname, '../data/ms_tokens.json');

// Memory cache for duplicate protection & simple mutex queue
const syncedBookingIds = new Set();
let isWritingLock = false;
const writeQueue = [];

class PersonalExcelSyncService {
  constructor() {
    this.ensureDataDir();
  }

  ensureDataDir() {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  /**
   * Read stored Microsoft OAuth tokens from server storage
   */
  readTokens() {
    try {
      if (fs.existsSync(TOKEN_FILE_PATH)) {
        const raw = fs.readFileSync(TOKEN_FILE_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      logger.error('Error reading ms_tokens.json:', err.message);
    }
    return null;
  }

  /**
   * Save Microsoft OAuth tokens securely on server
   */
  saveTokens(tokenData) {
    try {
      this.ensureDataDir();
      fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(tokenData, null, 2), 'utf-8');
      return true;
    } catch (err) {
      logger.error('Error saving ms_tokens.json:', err.message);
      return false;
    }
  }

  /**
   * Get Microsoft OAuth authorization URL for Owner authorization
   */
  getOAuthLoginUrl() {
    const tenant = env.MICROSOFT_TENANT_ID || 'consumers';
    const clientId = env.MICROSOFT_CLIENT_ID;
    const redirectUri = env.MICROSOFT_REDIRECT_URI;

    if (!clientId) {
      throw new Error('MICROSOFT_CLIENT_ID is missing in server environment variables.');
    }

    const scope = encodeURIComponent('offline_access Files.ReadWrite User.Read');
    const encodedRedirect = encodeURIComponent(redirectUri);

    return `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodedRedirect}&response_mode=query&scope=${scope}&prompt=select_account`;
  }

  /**
   * Handle OAuth Callback: exchange authorization code for access & refresh tokens
   */
  async handleOAuthCallback(code) {
    const tenant = env.MICROSOFT_TENANT_ID || 'consumers';
    const clientId = env.MICROSOFT_CLIENT_ID;
    const clientSecret = env.MICROSOFT_CLIENT_SECRET;
    const redirectUri = env.MICROSOFT_REDIRECT_URI;

    const tokenEndpoint = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;

    const params = new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      scope: 'offline_access Files.ReadWrite User.Read'
    });

    if (clientSecret) {
      params.append('client_secret', clientSecret);
    }

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OAuth token exchange failed (${response.status}): ${errText}`);
    }

    const tokenRes = await response.json();
    const expiresAt = Date.now() + (tokenRes.expires_in || 3600) * 1000 - 60000;

    // Fetch owner profile details
    let userEmail = 'Personal Microsoft Account';
    let userName = 'Owner';
    try {
      const profileRes = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: `Bearer ${tokenRes.access_token}` }
      });
      if (profileRes.ok) {
        const profile = await profileRes.json();
        userEmail = profile.userPrincipalName || profile.mail || profile.displayName || userEmail;
        userName = profile.displayName || userName;
      }
    } catch (pErr) {
      logger.warn('Could not fetch user profile:', pErr.message);
    }

    const tokenData = {
      access_token: tokenRes.access_token,
      refresh_token: tokenRes.refresh_token,
      expires_at: expiresAt,
      user_email: userEmail,
      user_name: userName,
      connected_at: new Date().toISOString()
    };

    this.saveTokens(tokenData);
    logger.info(`🎉 Personal Microsoft Account connected for owner: ${userEmail}`);
    return tokenData;
  }

  /**
   * Retrieve valid access token, auto-refreshing if expired using refresh token
   */
  async getValidAccessToken() {
    const tokens = this.readTokens();
    if (!tokens || !tokens.refresh_token) {
      const err = new Error('EXCEL_NOT_CONNECTED: Personal Microsoft account has not been connected yet.');
      err.code = 'EXCEL_NOT_CONNECTED';
      throw err;
    }

    // Check if current access token is valid
    if (tokens.access_token && tokens.expires_at && Date.now() < tokens.expires_at) {
      return tokens.access_token;
    }

    // Refresh access token using stored refresh token
    logger.info('Refreshing Microsoft OAuth access token...');
    const tenant = env.MICROSOFT_TENANT_ID || 'consumers';
    const clientId = env.MICROSOFT_CLIENT_ID;
    const clientSecret = env.MICROSOFT_CLIENT_SECRET;

    const tokenEndpoint = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
    const params = new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh_token,
      scope: 'offline_access Files.ReadWrite User.Read'
    });

    if (clientSecret) {
      params.append('client_secret', clientSecret);
    }

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    if (!response.ok) {
      const errText = await response.text();
      logger.error('Failed to refresh Microsoft token:', errText);
      const err = new Error(`Microsoft authentication expired: ${errText}`);
      err.code = 'EXCEL_NOT_CONNECTED';
      throw err;
    }

    const tokenRes = await response.json();
    const expiresAt = Date.now() + (tokenRes.expires_in || 3600) * 1000 - 60000;

    const updatedTokens = {
      ...tokens,
      access_token: tokenRes.access_token,
      refresh_token: tokenRes.refresh_token || tokens.refresh_token,
      expires_at: expiresAt,
      last_refreshed: new Date().toISOString()
    };

    this.saveTokens(updatedTokens);
    return updatedTokens.access_token;
  }

  /**
   * Get connection status for owner setup dashboard
   */
  async getConnectionStatus() {
    const tokens = this.readTokens();
    const isConfigured = Boolean(env.MICROSOFT_CLIENT_ID && env.EXCEL_WORKBOOK_ID);

    if (!tokens || !tokens.refresh_token) {
      return {
        isConnected: false,
        statusText: 'NOT CONNECTED',
        isConfigured,
        message: 'Personal Microsoft account is not connected. Click below to authorize.',
        clientConfigured: Boolean(env.MICROSOFT_CLIENT_ID),
        workbookId: env.EXCEL_WORKBOOK_ID || 'Not set',
        worksheetName: env.EXCEL_WORKSHEET_NAME || 'Bookings'
      };
    }

    return {
      isConnected: true,
      statusText: 'CONNECTED',
      isConfigured,
      accountEmail: tokens.user_email || 'Personal Account',
      accountName: tokens.user_name || 'Owner',
      connectedAt: tokens.connected_at,
      workbookId: env.EXCEL_WORKBOOK_ID || 'Configured',
      worksheetName: env.EXCEL_WORKSHEET_NAME || 'Bookings'
    };
  }

  /**
   * Format reference files list into comma-separated string
   */
  formatReferenceFiles(files) {
    if (!files) return 'None';
    if (typeof files === 'string') return files;
    if (Array.isArray(files)) {
      if (files.length === 0) return 'None';
      return files
        .map((f) => (typeof f === 'string' ? f : f.fileName || f.name || f.file_name || f.storagePath || f.path || 'File'))
        .join(', ');
    }
    return 'None';
  }

  /**
   * Format 17 exact columns for Excel row
   */
  formatRowValues(payload) {
    const bookingId = payload.bookingId || payload.booking_id || '';
    const dateRaw = payload.createdAt || payload.created_at || payload.bookingDate;
    const bookingDate = dateRaw
      ? new Date(dateRaw).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    const customer = payload.customer || {};
    const fullName = customer.fullName || payload.fullName || payload.full_name || '';
    const email = customer.email || payload.email || '';
    const country = customer.country || payload.country || '';
    const state = customer.state || payload.state || '';
    const mobileNumber = customer.mobileNumber || payload.mobileNumber || payload.mobile_number || '';

    const service = payload.service || {};
    let serviceName = '';
    if (typeof service === 'string') {
      serviceName = service;
    } else {
      serviceName = service.selectedService || payload.service || '';
      if (service.selectedService === 'Custom Requirement' && service.customServiceName) {
        serviceName = `Custom Requirement (${service.customServiceName})`;
      }
    }

    const projectRequirements = service.projectRequirements || payload.projectRequirements || payload.project_requirements || '';
    const preferredDate = service.preferredDate || payload.preferredDate || payload.preferred_date || 'Flexible';
    const preferredTime = service.preferredTime || service.preferredTimeSlot || payload.preferredTime || payload.preferred_time || 'Flexible Slot (Recommended)';
    const estimatedBudget = Number(service.estimatedBudget || payload.estimatedBudget || payload.estimated_budget) || 0;
    const referenceLink = service.referenceLink || payload.referenceLink || payload.reference_link || 'None';

    const files = payload.referenceFiles || payload.uploaded_files || payload.reference_files || payload.references;
    const refFilesStr = this.formatReferenceFiles(files);

    const consent = payload.consent || {};
    const termsAccepted = Boolean(consent.termsAccepted ?? payload.termsAccepted ?? payload.terms_accepted ?? true);
    const privacyAccepted = Boolean(consent.privacyAccepted ?? payload.privacyAccepted ?? payload.privacy_accepted ?? true);

    return [
      String(bookingId),
      String(bookingDate),
      String(payload.status || 'REQUESTED'),
      String(fullName),
      String(email),
      String(country),
      String(state),
      String(mobileNumber),
      String(serviceName),
      String(projectRequirements),
      String(preferredDate),
      String(preferredTime),
      Number(estimatedBudget),
      String(referenceLink),
      String(refFilesStr),
      Boolean(termsAccepted),
      Boolean(privacyAccepted)
    ];
  }

  /**
   * TEST EXCEL CONNECTION: Reads usedRange of target personal workbook
   */
  async testConnection() {
    const { EXCEL_WORKBOOK_ID, EXCEL_WORKSHEET_NAME } = env;

    if (!EXCEL_WORKBOOK_ID) {
      return {
        success: false,
        message: 'EXCEL_WORKBOOK_ID is missing in server environment variables.'
      };
    }

    try {
      const accessToken = await this.getValidAccessToken();
      const worksheetName = EXCEL_WORKSHEET_NAME || 'Bookings';
      const endpoint = `https://graph.microsoft.com/v1.0/me/drive/items/${EXCEL_WORKBOOK_ID}/workbook/worksheets('${worksheetName}')/usedRange`;

      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`❌ Test connection error (${response.status}):`, errorText);
        return {
          success: false,
          error: errorText,
          message: `Your personal Microsoft Excel account is authenticated, but this workbook cannot be read (${response.status}). Details: ${errorText}`
        };
      }

      const data = await response.json();
      const rowCount = data.values ? data.values.length : 0;

      return {
        success: true,
        message: `Successfully connected! Found worksheet "${worksheetName}" with ${rowCount} occupied rows.`,
        address: data.address,
        rowCount: rowCount
      };
    } catch (err) {
      return {
        success: false,
        message: err.message
      };
    }
  }

  /**
   * TEST WRITE: Appends a safe test row into next available row and verifies write
   */
  async testWrite() {
    const testPayload = {
      bookingId: `TEST-EXCEL-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
      status: 'TEST_VERIFIED',
      customer: {
        fullName: 'Test Connection System',
        email: 'test@pulseblendmedia.com',
        country: 'India',
        state: 'Andhra Pradesh',
        mobileNumber: '+91 0000000000'
      },
      service: {
        selectedService: 'Custom Requirement',
        customServiceName: 'Connection Test',
        projectRequirements: 'Verifying personal OneDrive Excel write capability.',
        preferredDate: '2026-09-26',
        preferredTime: 'Immediate',
        estimatedBudget: 0,
        referenceLink: 'https://pulseblendmedia.com'
      },
      referenceFiles: [],
      consent: {
        termsAccepted: true,
        privacyAccepted: true
      }
    };

    return await this.syncBookingToExcel(testPayload);
  }

  /**
   * MAIN METHOD: Append booking row directly to Personal OneDrive Excel file using Worksheet Range Patch strategy
   */
  async syncBookingToExcel(bookingPayload) {
    const bookingId = bookingPayload.bookingId || bookingPayload.booking_id;

    // Idempotency Check: Prevent duplicate insertions
    if (bookingId && syncedBookingIds.has(bookingId)) {
      logger.info(`Notice: Booking ${bookingId} already synchronized in memory. Skipping.`);
      return {
        success: true,
        isDuplicate: true,
        message: `Booking ${bookingId} already synchronized to Excel.`
      };
    }

    const { EXCEL_WORKBOOK_ID, EXCEL_WORKSHEET_NAME } = env;

    if (!EXCEL_WORKBOOK_ID) {
      logger.warn('Notice: EXCEL_WORKBOOK_ID is missing. Excel sync skipped.');
      return {
        success: false,
        status: 'EXCEL_NOT_CONFIGURED',
        message: 'EXCEL_WORKBOOK_ID is missing in server environment.'
      };
    }

    // Acquire lock for sequential safely calculated row insertion
    return new Promise((resolve) => {
      writeQueue.push(async () => {
        try {
          const res = await this._performRangeWrite(bookingPayload);
          resolve(res);
        } catch (err) {
          resolve({
            success: false,
            status: 'EXCEL_SYNC_PENDING',
            error: err.message,
            message: err.message
          });
        }
      });

      this.processQueue();
    });
  }

  async processQueue() {
    if (isWritingLock || writeQueue.length === 0) return;
    isWritingLock = true;

    const task = writeQueue.shift();
    try {
      if (task) await task();
    } catch (err) {
      logger.error('Write queue execution exception:', err);
    } finally {
      isWritingLock = false;
      if (writeQueue.length > 0) {
        this.processQueue();
      }
    }
  }

  /**
   * Internal Range Patch write implementation
   */
  async _performRangeWrite(bookingPayload) {
    const bookingId = bookingPayload.bookingId || bookingPayload.booking_id;
    const worksheetName = env.EXCEL_WORKSHEET_NAME || 'Bookings';
    const workbookId = env.EXCEL_WORKBOOK_ID;

    let accessToken;
    try {
      accessToken = await this.getValidAccessToken();
    } catch (authErr) {
      logger.warn('Notice: Excel authentication missing or expired:', authErr.message);
      return {
        success: false,
        status: 'EXCEL_NOT_CONNECTED',
        message: 'Personal Microsoft account is not connected. Please connect via /admin/microsoft-excel.'
      };
    }

    try {
      // 1. Fetch current usedRange to calculate next available row & check idempotency
      const usedRangeEndpoint = `https://graph.microsoft.com/v1.0/me/drive/items/${workbookId}/workbook/worksheets('${worksheetName}')/usedRange`;

      const usedRangeRes = await fetch(usedRangeEndpoint, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      let nextRow = 2; // Default if sheet is empty or headers only
      let usedValues = [];

      if (usedRangeRes.ok) {
        const usedData = await usedRangeRes.json();
        usedValues = usedData.values || [];

        // Check if Booking ID already exists in Column A
        for (const row of usedValues) {
          if (row && String(row[0]).trim() === String(bookingId).trim()) {
            if (bookingId) syncedBookingIds.add(bookingId);
            logger.info(`Notice: Booking ${bookingId} found in worksheet. Skipping duplicate row write.`);
            return {
              success: true,
              isDuplicate: true,
              message: `Booking ${bookingId} already exists in Excel worksheet.`
            };
          }
        }

        nextRow = usedValues.length > 0 ? usedValues.length + 1 : 2;
      } else {
        logger.warn(`usedRange query returned status ${usedRangeRes.status}. Defaulting next row to 2.`);
      }

      // 2. Format exact 17 column values
      const rowValues = [this.formatRowValues(bookingPayload)];

      // 3. Range Patch Strategy for Personal Accounts (PATCH /range(address='A{N}:Q{N}'))
      const rangeAddress = `A${nextRow}:Q${nextRow}`;
      const patchEndpoint = `https://graph.microsoft.com/v1.0/me/drive/items/${workbookId}/workbook/worksheets('${worksheetName}')/range(address='${rangeAddress}')`;

      logger.info(`Writing booking ${bookingId} to Personal OneDrive Excel range: ${rangeAddress}...`);

      const patchRes = await fetch(patchEndpoint, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: rowValues })
      });

      if (!patchRes.ok) {
        const errorText = await patchRes.text();
        logger.error(`❌ Personal Excel range write error (${patchRes.status}):`, errorText);
        return {
          success: false,
          status: 'EXCEL_SYNC_PENDING',
          error: errorText,
          message: `Your personal Microsoft Excel account is authenticated, but this workbook cannot be modified through the selected Microsoft Graph Excel operation (${patchRes.status}). Details: ${errorText}`
        };
      }

      const result = await patchRes.json();
      if (bookingId) syncedBookingIds.add(bookingId);

      logger.info(`🎉 Successfully wrote booking ${bookingId} into Personal OneDrive Excel row ${nextRow}!`);

      return {
        success: true,
        status: 'SYNCED',
        nextRow,
        data: result
      };
    } catch (err) {
      logger.error(`❌ Personal Excel Sync Exception for booking ${bookingId}:`, err.message);
      return {
        success: false,
        status: 'EXCEL_SYNC_PENDING',
        error: err.message,
        message: err.message
      };
    }
  }
}

module.exports = new PersonalExcelSyncService();
