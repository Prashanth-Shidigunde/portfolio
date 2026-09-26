import { supabase } from './supabase';
import storageService from '../services/storageService';

export { supabase };

// Helper to generate a random unique Booking ID (e.g., PBM-2026-00001 or PBM-2026-8K9F2)
export function generateBookingId() {
  const currentYear = new Date().getFullYear();
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomCode = '';
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(5);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < 5; i++) {
      randomCode += chars.charAt(bytes[i] % chars.length);
    }
  } else {
    for (let i = 0; i < 5; i++) {
      randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return `PBM-${currentYear}-${randomCode}`;
}

/**
 * Save booking record to Supabase DB & Storage
 */
export async function saveServiceBooking(payload, files = []) {
  const bookingId = payload.bookingId || generateBookingId();
  const createdAt = payload.createdAt || new Date().toISOString();

  if (!supabase) {
    console.error('❌ Supabase client is not initialized. Please verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    return {
      success: false,
      message: 'Your booking could not be submitted. Please try again.'
    };
  }

  try {
    // 1. Upload each selected reference file to Supabase Storage ('client-files' bucket)
    const uploadedFilesReferences = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const uploadRes = await storageService.uploadClientFile(bookingId, file);

        if (!uploadRes.success) {
          console.error(`❌ Storage upload failed for file "${file.name}":`, uploadRes.error);
          return {
            success: false,
            message: 'One or more reference files could not be uploaded. Please try again.',
            error: uploadRes.error
          };
        }

        uploadedFilesReferences.push(uploadRes.fileRef);
      }
    }

    // Extract customer, service, consent from payload (supporting both bookingPayload structure & legacy form format)
    const customer = payload.customer || {};
    const service = payload.service || {};
    const consent = payload.consent || {};

    const fullName = customer.fullName || payload.fullName || '';
    const email = customer.email || payload.email || '';
    const country = customer.country || payload.country || '';
    const state = customer.state || payload.state || '';
    const mobileNumber = customer.mobileNumber || (payload.mobile ? `${payload.countryCode || '+91'} ${payload.mobile}` : '');

    const selectedService = service.selectedService || payload.selectedService || '';
    const customServiceName = service.customServiceName || payload.customServiceName || null;

    let formattedService = selectedService;
    if (selectedService === 'Custom Requirement' && customServiceName) {
      formattedService = `Custom Requirement (${customServiceName})`;
    }

    // 2. Prepare DB Payload containing all booking details with status = 'REQUESTED'
    const dbBookingPayload = {
      booking_id: bookingId,
      full_name: fullName,
      email: email,
      country: country,
      state: state,
      mobile_number: mobileNumber,
      service: formattedService,
      custom_service_name: customServiceName,
      project_requirements: service.projectRequirements || payload.projectRequirements || '',
      preferred_date: service.preferredDate || payload.preferredDate || null,
      preferred_time: service.preferredTime || service.preferredTimeSlot || payload.preferredTimeSlot || null,
      estimated_budget: Number(service.estimatedBudget || payload.estimatedBudget) || 0,
      reference_link: service.referenceLink || payload.referenceLink || null,
      uploaded_files: uploadedFilesReferences,
      terms_accepted: Boolean(consent.termsAccepted ?? payload.termsAccepted ?? true),
      privacy_accepted: Boolean(consent.privacyAccepted ?? payload.termsAccepted ?? true),
      status: payload.status || 'REQUESTED',
      sync_status: 'EXCEL_SYNC_PENDING',
      created_at: createdAt,
      updated_at: createdAt
    };

    // 3. Insert record into Supabase service_bookings table
    let { data, error: dbError } = await supabase
      .from('service_bookings')
      .insert([dbBookingPayload])
      .select();

    // Fallback if uploaded_files or sync_status columns do not exist on database table yet
    if (dbError && (dbError.code === '42703' || dbError.message?.includes('uploaded_files') || dbError.message?.includes('sync_status'))) {
      console.warn('Notice: extra columns missing on database. Retrying insert without extra columns...');
      delete dbBookingPayload.uploaded_files;
      delete dbBookingPayload.sync_status;
      const retryRes = await supabase
        .from('service_bookings')
        .insert([dbBookingPayload])
        .select();

      data = retryRes.data;
      dbError = retryRes.error;
    }

    if (dbError) {
      console.error('❌ SUPABASE DB INSERT ERROR:', dbError);
      return {
        success: false,
        message: 'Your booking could not be submitted. Please try again.',
        error: dbError.message
      };
    }

    if (!data || !data[0]) {
      console.error('❌ Supabase insert returned empty data.');
      return {
        success: false,
        message: 'Your booking could not be submitted. Please try again.'
      };
    }

    console.log('🎉 SUPABASE DB BOOKING INSERT SUCCESS:', data[0]);
    let dbRecord = data[0];
    const dbId = dbRecord.id;

    // Attach uploaded_files references to dbRecord for immediate UI rendering
    if (!dbRecord.uploaded_files || dbRecord.uploaded_files.length === 0) {
      dbRecord.uploaded_files = uploadedFilesReferences;
    }

    // 4. Save metadata entries into booking_files table
    if (uploadedFilesReferences.length > 0) {
      for (const fileRef of uploadedFilesReferences) {
        try {
          await supabase.from('booking_files').insert([{
            booking_id: dbId,
            booking_code: bookingId,
            file_name: fileRef.name,
            storage_path: fileRef.path,
            mime_type: fileRef.type,
            file_size: fileRef.size,
            created_at: createdAt
          }]);
        } catch (fileDbErr) {
          console.warn('Notice: booking_files metadata insertion notice:', fileDbErr);
        }
      }
    }

    // 5. Cache latest booking record locally for instant invoice rendering
    try {
      localStorage.setItem(`pbm_booking_${bookingId}`, JSON.stringify(dbRecord));
      localStorage.setItem('pbm_latest_booking', JSON.stringify(dbRecord));
    } catch (e) {
      console.warn('LocalStorage save notice:', e);
    }

    return {
      success: true,
      bookingId,
      bookingRecord: dbRecord
    };
  } catch (err) {
    console.error('❌ Unexpected Supabase Booking Exception:', err);
    return {
      success: false,
      message: 'Your booking could not be submitted. Please try again.'
    };
  }
}

/**
 * Get booking record by booking ID from Supabase DB with local fallback
 */
export async function getBookingRecord(bookingId) {
  if (supabase && bookingId) {
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .select('*')
        .eq('booking_id', bookingId)
        .single();

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase query notice:', err);
    }
  }

  if (!bookingId) {
    const latestStr = localStorage.getItem('pbm_latest_booking');
    return latestStr ? JSON.parse(latestStr) : null;
  }

  const cachedStr = localStorage.getItem(`pbm_booking_${bookingId}`);
  if (cachedStr) {
    return JSON.parse(cachedStr);
  }

  const latestStr = localStorage.getItem('pbm_latest_booking');
  if (latestStr) {
    const latest = JSON.parse(latestStr);
    if (latest.booking_id === bookingId) return latest;
  }

  return null;
}

/**
 * Save Contact submission to Supabase DB table contact_submissions
 */
export async function saveContactSubmission(contactPayload) {
  const createdAt = new Date().toISOString();
  const record = {
    full_name: contactPayload.fullName || contactPayload.name,
    email: contactPayload.email,
    phone: contactPayload.mobile || contactPayload.phone || null,
    service: contactPayload.service || null,
    message: contactPayload.message,
    created_at: createdAt
  };

  if (!supabase) {
    return {
      success: false,
      message: 'Supabase client is not configured.'
    };
  }

  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([record])
      .select();

    if (error) {
      console.error('❌ Supabase Contact Submission Error:', error);
      return {
        success: false,
        message: `Supabase Error (${error.code}): ${error.message}`
      };
    }

    console.log('🎉 Supabase Contact Submission Saved:', data[0]);
    return {
      success: true,
      message: 'Your message has been sent successfully.',
      record: data[0]
    };
  } catch (err) {
    console.error('❌ Unexpected Contact Submission Error:', err);
    return {
      success: false,
      message: err.message
    };
  }
}
