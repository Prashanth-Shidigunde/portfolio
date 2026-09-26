/**
 * Excel Booking Integration Service
 * Sends ORIGINAL bookingPayload directly to backend server endpoint (/api/bookings/excel)
 * without fetching from Supabase.
 */

export const excelBookingService = {
  /**
   * Send original bookingPayload directly to Excel backend API
   */
  async sendBookingToExcel(bookingPayload) {
    if (!bookingPayload || !bookingPayload.bookingId) {
      console.warn('⚠️ sendBookingToExcel notice: invalid bookingPayload provided.');
      return { success: false, message: 'Invalid booking payload.' };
    }

    try {
      const apiBaseUrl = (import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

      // Send original bookingPayload to backend endpoint POST /api/bookings/excel
      const response = await fetch(`${apiBaseUrl}/bookings/excel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });

      if (!response.ok) {
        console.warn(`⚠️ Excel backend endpoint responded with status ${response.status}`);
        return {
          success: false,
          status: 'EXCEL_SYNC_PENDING',
          message: `Backend response error (${response.status})`
        };
      }

      const resData = await response.json();
      if (resData && (resData.success || resData.data?.success)) {
        console.log(`📊 Excel Sync Success for booking ${bookingPayload.bookingId}`);
        return {
          success: true,
          status: 'SYNCED',
          data: resData.data
        };
      } else {
        console.warn(`⚠️ Excel Sync Pending for booking ${bookingPayload.bookingId}:`, resData?.message || resData?.data?.message);
        return {
          success: false,
          status: 'EXCEL_SYNC_PENDING',
          message: resData?.message || 'Excel server sync pending'
        };
      }
    } catch (err) {
      console.warn('⚠️ Excel Sync Exception (Graceful fallback):', err.message);
      return {
        success: false,
        status: 'EXCEL_SYNC_PENDING',
        error: err.message
      };
    }
  }
};

export default excelBookingService;
