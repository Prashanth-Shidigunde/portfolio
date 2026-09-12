/**
 * Invoice Service
 * Handles PDF generation and invoice data formatting.
 */
import { downloadBookingPDF } from '../lib/pdfGenerator';
import bookingRepository from '../repositories/bookingRepository';

export const invoiceService = {
  async getInvoiceData(bookingId) {
    return await bookingRepository.getBookingById(bookingId);
  },

  async downloadInvoicePDF(elementId, bookingId) {
    return await downloadBookingPDF(elementId, bookingId);
  }
};

export default invoiceService;
