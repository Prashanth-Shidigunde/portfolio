import React, { useState, useEffect } from 'react';
import invoiceService from '../../services/invoiceService';
import notificationService from '../../services/notificationService';
import { BookingFilesViewer } from '../common/BookingFilesViewer';
import logoImg from '../../assets/images/pulse-blend-media-logo.png';
import './BookingInvoice.css';

export function BookingInvoice({ bookingId: propBookingId }) {
  const [record, setRecord] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    async function loadInvoice() {
      // Get booking ID from props or URL search params or path
      const searchParams = new URLSearchParams(window.location.search);
      let urlBookingId = searchParams.get('id') || propBookingId;
      if (!urlBookingId) {
        const pathParts = window.location.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart && lastPart.startsWith('PBM-')) {
          urlBookingId = lastPart;
        }
      }

      const fetched = await invoiceService.getInvoiceData(urlBookingId);
      if (fetched) {
        setRecord(fetched);
      } else {
        // Fallback mock record if opened directly without params
        setRecord({
          booking_id: urlBookingId || 'PBM-2026-00001',
          full_name: 'Valued Client',
          email: 'client@example.com',
          country: 'India',
          state: 'Andhra Pradesh',
          mobile_number: '+91 6304834605',
          service: 'Video Editing',
          custom_service_name: null,
          project_requirements: 'Creative video concept project details.',
          preferred_date: '2026-09-20',
          preferred_time: 'Flexible Slot (Recommended)',
          estimated_budget: 15000,
          reference_link: 'https://example.com',
          reference_files: [],
          terms_accepted: true,
          privacy_accepted: true,
          status: 'REQUESTED',
          created_at: new Date().toISOString()
        });
      }
    }
    loadInvoice();
  }, [propBookingId]);

  if (!record) {
    return (
      <div className="invoice-loading-container">
        <p>Loading Booking Summary...</p>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    await invoiceService.downloadInvoicePDF('invoice-document-root', record.booking_id);
    setIsGeneratingPDF(false);
  };

  const handleNotifyOwnerWhatsApp = () => {
    notificationService.openWhatsAppOwnerChat(record);
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    return new Date(isoStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="invoice-page-wrapper">
      {/* Top Action Bar (no-print) */}
      <div className="invoice-action-bar no-print">
        <div className="action-bar-left">
          <img src={logoImg} alt="Pulse_Blend_Media" className="action-bar-logo-img" />
          <span className="action-tag">PROVISIONAL INVOICE</span>
        </div>
        <div className="action-bar-right">
          <button
            className="btn-invoice-action btn-pdf"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'GENERATING PDF...' : 'DOWNLOAD INVOICE PDF 📥'}
          </button>
          <button className="btn-invoice-action btn-wa" onClick={handleNotifyOwnerWhatsApp}>
            NOTIFY VIA WHATSAPP 💬
          </button>
          <button className="btn-invoice-action btn-print" onClick={() => window.print()}>
            PRINT
          </button>
        </div>
      </div>

      {/* Main Printable Document Card */}
      <div id="invoice-document-root" className="invoice-card glass-panel">
        {/* Document Header */}
        <div className="invoice-doc-header">
          <div className="doc-brand-block">
            <img src={logoImg} alt="Pulse_Blend_Media" className="invoice-header-logo-img" />
            <span className="doc-brand-subtitle">Creative Visuals &amp; Digital Studio</span>
          </div>
          <div className="doc-type-block">
            <h1 className="doc-main-heading">PROVISIONAL BOOKING INVOICE</h1>
            <span className="doc-sub-heading">BOOKING REQUEST SUMMARY</span>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="invoice-disclaimer-banner">
          <span className="disclaimer-icon">⚠️</span>
          <p className="disclaimer-text">
            <strong>PAYMENT &amp; BOOKING NOTICE:</strong> Estimated budget is provided by the customer. Payment terms: 50% advance required upon booking confirmation to schedule work; 50% balance payable after project completion. Booking status is currently <strong>REQUESTED (UNPAID)</strong>.
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="invoice-meta-grid">
          <div className="meta-item">
            <span className="meta-label">BOOKING ID</span>
            <span className="meta-value highlight-id">{record.booking_id}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">DATE CREATED</span>
            <span className="meta-value">{formatDate(record.created_at)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">REQUEST STATUS</span>
            <span className="meta-value status-badge">{record.status || 'REQUESTED'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">PAYMENT TERMS</span>
            <span className="meta-value payment-terms-text">50% ADVANCE / 50% AFTER COMPLETION</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">PAYMENT STATUS</span>
            <span className="meta-value status-unpaid">UNPAID (Pending Advance)</span>
          </div>
        </div>

        {/* Customer Details Table Section */}
        <div className="invoice-section">
          <h3 className="section-block-title">01. CUSTOMER DETAILS</h3>
          <div className="details-grid">
            <div className="detail-row">
              <span className="detail-label">Full Name:</span>
              <span className="detail-value">{record.full_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email Address:</span>
              <span className="detail-value">{record.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Mobile Number:</span>
              <span className="detail-value">{record.mobile_number}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Country:</span>
              <span className="detail-value">{record.country}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">State / Region:</span>
              <span className="detail-value">{record.state}</span>
            </div>
          </div>
        </div>

        {/* Service Details Section */}
        <div className="invoice-section">
          <h3 className="section-block-title">02. SERVICE &amp; PROJECT DETAILS</h3>
          <div className="details-grid">
            <div className="detail-row full">
              <span className="detail-label">Selected Service:</span>
              <span className="detail-value service-highlight">
                {record.service}
                {record.custom_service_name ? ` (${record.custom_service_name})` : ''}
              </span>
            </div>
            <div className="detail-row full">
              <span className="detail-label">Project Requirements / Notes:</span>
              <p className="detail-requirements">{record.project_requirements}</p>
            </div>
            <div className="detail-row">
              <span className="detail-label">Preferred Date:</span>
              <span className="detail-value">{record.preferred_date || 'Flexible'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Preferred Time / Slot:</span>
              <span className="detail-value">{record.preferred_time || 'Flexible Slot (Recommended)'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Estimated Budget / Amount:</span>
              <span className="detail-value budget-highlight">₹{record.estimated_budget}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Payment Terms:</span>
              <span className="detail-value">50% Advance / 50% Balance After Completion</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">50% Advance Required:</span>
              <span className="detail-value advance-value">
                ₹{Math.round((Number(record.estimated_budget) || 0) * 0.5)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">50% Final Balance Due:</span>
              <span className="detail-value">
                ₹{Math.round((Number(record.estimated_budget) || 0) * 0.5)}
              </span>
            </div>
            <div className="detail-row full">
              <span className="detail-label">Reference Link:</span>
              <span className="detail-value">
                {record.reference_link ? (
                  <a href={record.reference_link} target="_blank" rel="noopener noreferrer" className="link-text">
                    {record.reference_link}
                  </a>
                ) : (
                  'None provided'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Reference & Client Files Section */}
        {((record.uploaded_files && record.uploaded_files.length > 0) || (record.reference_files && record.reference_files.length > 0)) && (
          <div className="invoice-section">
            <h3 className="section-block-title">03. ATTACHED REFERENCE FILES &amp; IMAGES</h3>
            <BookingFilesViewer
              files={record.uploaded_files || record.reference_files || []}
              title="CLIENT ATTACHED FILES"
            />
          </div>
        )}

        {/* Consent & Legal Note */}
        <div className="invoice-footer-note">
          <p className="consent-confirm-text">
            ✓ Terms &amp; Conditions and Privacy Policy consent accepted on {formatDate(record.created_at)}.
          </p>
          <p className="footer-copyright">
            © {new Date().getFullYear()} Pulse_Blend_Media. Creative visuals, website design, photography, video editing &amp; computer teaching.
          </p>
        </div>
      </div>
    </div>
  );
}
