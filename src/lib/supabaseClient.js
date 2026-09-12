import { supabase } from './supabase';
import storageService from '../services/storageService';

export { supabase };

// Helper to generate a random unique Booking ID (e.g., PBM-2026-8K9F2)
export function generateBookingId() {
  const currentYear = new Date().getFullYear();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomCode = '';
  for (let i = 0; i < 5; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PBM-${currentYear}-${randomCode}`;
}

/**
 * Save booking record to Supabase DB & Storage
 */
export async function saveServiceBooking(formData, files = []) {
  const bookingId = generateBookingId();
  const createdAt = new Date().toISOString();

  if (!supabase) {
    console.error('❌ Supabase client is not initialized. Please verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    return {
      success: false,
      message: 'Supabase client is not configured. Please check environment variables.'
    };
  }

  try {
    // 1. Upload each selected actual browser File object to Supabase Storage ('client-files' bucket)
    const uploadedFilesReferences = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const uploadRes = await storageService.uploadClientFile(bookingId, file);

        if (!uploadRes.success) {
          console.error(`❌ Storage upload failed for file "${file.name}":`, uploadRes.error);
          return {
            success: false,
            message: `Storage Upload Failed (${file.name}): ${uploadRes.error}. Please check Storage bucket and RLS policies.`,
            error: uploadRes.error
          };
        }

        uploadedFilesReferences.push(uploadRes.fileRef);
      }
    }

    // 2. Prepare DB Payload containing uploaded_files JSONB array with real Storage file paths
    const dbBookingPayload = {
      booking_id: bookingId,
      full_name: formData.customer.fullName,
      email: formData.customer.email,
      country: formData.customer.country,
      state: formData.customer.state,
      mobile_number: formData.customer.mobile,
      service: formData.service.selectedService,
      custom_service_name: formData.service.customServiceName || null,
      project_requirements: formData.service.projectRequirements,
      preferred_date: formData.service.preferredDate || null,
      preferred_time: formData.service.preferredTimeSlot || null,
      estimated_budget: Number(formData.service.estimatedBudget) || 0,
      reference_link: formData.service.referenceLink || null,
      uploaded_files: uploadedFilesReferences,
      terms_accepted: Boolean(formData.consent.termsAccepted),
      privacy_accepted: Boolean(formData.consent.privacyAccepted),
      status: 'REQUESTED'
    };

    // 3. Insert record into Supabase service_bookings table
    let { data, error: dbError } = await supabase
      .from('service_bookings')
      .insert([dbBookingPayload])
      .select();

    // Fallback if uploaded_files column does not exist on database table yet
    if (dbError && (dbError.code === '42703' || dbError.message?.includes('uploaded_files'))) {
      console.warn('Notice: uploaded_files column missing on database. Retrying insert without column...');
      delete dbBookingPayload.uploaded_files;
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
        message: `Database Insert Error (${dbError.code}): ${dbError.message}`,
        error: dbError.message
      };
    }

    if (!data || !data[0]) {
      console.error('❌ Supabase insert returned empty data.');
      return {
        success: false,
        message: 'Database insertion did not return created record.'
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
        await supabase.from('booking_files').insert([{
          booking_id: dbId,
          booking_code: bookingId,
          file_name: fileRef.name,
          storage_path: fileRef.path,
          mime_type: fileRef.type,
          file_size: fileRef.size,
          created_at: createdAt
        }]);
      }
    }

    // 5. Cache latest booking record locally for instant invoice rendering
    localStorage.setItem(`pbm_booking_${bookingId}`, JSON.stringify(dbRecord));
    localStorage.setItem('pbm_latest_booking', JSON.stringify(dbRecord));

    return {
      success: true,
      bookingId,
      bookingRecord: dbRecord
    };
  } catch (err) {
    console.error('❌ Unexpected Supabase Booking Exception:', err);
    return {
      success: false,
      message: err.message || 'An unexpected error occurred during booking processing.'
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
