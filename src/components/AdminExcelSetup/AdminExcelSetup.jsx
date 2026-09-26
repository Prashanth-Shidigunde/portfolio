import React, { useState, useEffect } from 'react';
import logoImg from '../../assets/images/pulse-blend-media-logo.png';
import './AdminExcelSetup.css';

export function AdminExcelSetup() {
  const [status, setStatus] = useState({
    isConnected: false,
    statusText: 'LOADING...',
    accountEmail: '',
    connectedAt: '',
    workbookId: '',
    worksheetName: ''
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const apiBaseUrl = (import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/auth/microsoft/status`);
      const data = await res.json();
      if (data && data.success && data.data) {
        setStatus(data.data);
      }
    } catch (err) {
      console.warn('Status fetch error:', err);
      setFeedback({ type: 'error', message: 'Could not connect to backend server. Ensure node backend is running.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Parse URL params for OAuth return status
    const params = new URLSearchParams(window.location.search);
    const authStatus = params.get('status');
    const authMsg = params.get('message');

    if (authStatus === 'connected') {
      setFeedback({ type: 'success', message: '🎉 Personal Microsoft Account authorized and connected successfully!' });
      // Clean query params from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authStatus === 'error') {
      setFeedback({ type: 'error', message: `Authorization error: ${authMsg || 'Failed to complete login.'}` });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleConnect = async () => {
    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await fetch(`${apiBaseUrl}/auth/microsoft/login`);
      const data = await res.json();

      if (data && data.success && data.data?.url) {
        window.location.href = data.data.url;
      } else {
        setFeedback({
          type: 'error',
          message: data?.message || 'MICROSOFT_CLIENT_ID is missing in server config.'
        });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: `Connection error: ${err.message}` });
    } finally {
      setActionLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await fetch(`${apiBaseUrl}/auth/microsoft/test-connection`, {
        method: 'POST'
      });
      const data = await res.json();

      if (data && data.success) {
        setFeedback({
          type: 'success',
          message: `✓ CONNECTION TEST PASSED: ${data.message || 'Target personal workbook and worksheet verified successfully.'}`
        });
      } else {
        setFeedback({
          type: 'error',
          message: data?.message || 'Connection test failed. Verify Microsoft account authorization.'
        });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: `Test connection error: ${err.message}` });
    } finally {
      setActionLoading(false);
    }
  };

  const handleTestWrite = async () => {
    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await fetch(`${apiBaseUrl}/auth/microsoft/test-write`, {
        method: 'POST'
      });
      const data = await res.json();

      if (data && data.success) {
        const nextRow = data.data?.nextRow ? ` Row ${data.data.nextRow}` : '';
        setFeedback({
          type: 'success',
          message: `✓ TEST WRITE PASSED: Safe test record written to Personal Excel file${nextRow}. Cell contents verified.`
        });
      } else {
        setFeedback({
          type: 'error',
          message: data?.message || 'Test write failed.'
        });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: `Test write exception: ${err.message}` });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-excel-page">
      <div className="admin-excel-card glass-panel">
        <div className="admin-card-header">
          <img src={logoImg} alt="Pulse_Blend_Media" className="admin-logo-img" />
          <h1 className="admin-page-title">PERSONAL MICROSOFT EXCEL INTEGRATION</h1>
          <p className="admin-page-subtitle">
            Owner setup &amp; authorization for personal OneDrive Excel workbook booking sync.
          </p>
        </div>

        {/* STATUS BADGE */}
        <div className="admin-status-banner">
          <span className="status-label">CONNECTION STATUS:</span>
          <span className={`status-badge-val ${status.isConnected ? 'connected' : 'disconnected'}`}>
            {loading ? 'CHECKING...' : status.isConnected ? '● CONNECTED' : '○ NOT CONNECTED'}
          </span>
        </div>

        {/* FEEDBACK DISPLAY BANNER */}
        {feedback && (
          <div className={`feedback-banner ${feedback.type}`}>
            <span className="feedback-icon">{feedback.type === 'success' ? '✓' : '⚠️'}</span>
            <span className="feedback-text">{feedback.message}</span>
          </div>
        )}

        {/* CONNECTION DETAILS CARD */}
        <div className="details-box glass-panel">
          <h3 className="box-title">01. ONEDRIVE EXCEL TARGET DETAILS</h3>
          <div className="info-grid">
            <div className="info-row">
              <span className="info-key">Microsoft Account:</span>
              <span className="info-val">{status.accountEmail || 'Not Connected'}</span>
            </div>
            <div className="info-row">
              <span className="info-key">Target Workbook ID:</span>
              <span className="info-val monospace">{status.workbookId || 'Configured in backend .env'}</span>
            </div>
            <div className="info-row">
              <span className="info-key">Target Worksheet:</span>
              <span className="info-val highlight">{status.worksheetName || 'Bookings'}</span>
            </div>
            <div className="info-row">
              <span className="info-key">Write Strategy:</span>
              <span className="info-val">Delegated Range Patch (PATCH /range(A&#123;N&#125;:Q&#123;N&#125;))</span>
            </div>
          </div>
        </div>

        {/* ACTIONS & CONTROLS */}
        <div className="actions-card glass-panel">
          <h3 className="box-title">02. OWNER SETUP &amp; TESTING ACTIONS</h3>

          <div className="btn-actions-stack">
            <button
              className="admin-btn btn-connect"
              onClick={handleConnect}
              disabled={actionLoading}
            >
              {status.isConnected ? 'RE-CONNECT PERSONAL MICROSOFT ACCOUNT 🔑' : 'CONNECT PERSONAL MICROSOFT ACCOUNT 🔑'}
            </button>

            <button
              className="admin-btn btn-test-conn"
              onClick={handleTestConnection}
              disabled={actionLoading || !status.isConnected}
            >
              TEST EXCEL CONNECTION 🔍
            </button>

            <button
              className="admin-btn btn-test-write"
              onClick={handleTestWrite}
              disabled={actionLoading || !status.isConnected}
            >
              SAFE TEST WRITE 📝
            </button>

            <button
              className="admin-btn btn-back"
              onClick={() => { window.location.href = '/'; }}
            >
              RETURN TO WEBSITE ↗
            </button>
          </div>
        </div>

        {/* INSTRUCTIONS & NOTES */}
        <div className="notes-box">
          <p className="note-item">
            <strong>Note for Prashanth:</strong> This setup page is for the website owner only. Website visitors/customers submitting bookings will <strong>NEVER</strong> see a Microsoft login. The customer form runs independently in the background.
          </p>
        </div>
      </div>
    </div>
  );
}
