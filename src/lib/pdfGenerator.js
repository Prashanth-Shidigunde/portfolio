import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate and download PDF Invoice for a booking record
 */
export async function downloadBookingPDF(elementId, bookingId = 'PBM-2026-00001') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Invoice element not found for PDF generation');
    return false;
  }

  try {
    // Hide UI buttons during capture
    const actionButtons = element.querySelectorAll('.no-print');
    actionButtons.forEach((el) => (el.style.visibility = 'hidden'));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0a0f1d',
      logging: false
    });

    // Restore UI buttons
    actionButtons.forEach((el) => (el.style.visibility = 'visible'));

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const cleanBookingId = bookingId.replace(/[^a-zA-Z0-9_-]/g, '_');
    pdf.save(`PulseBlendMedia_Booking_${cleanBookingId}.pdf`);
    return true;
  } catch (err) {
    console.error('PDF Generation Error:', err);
    // Fallback to native print dialog
    window.print();
    return false;
  }
}
