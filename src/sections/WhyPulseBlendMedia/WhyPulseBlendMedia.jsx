import React from 'react';
import logoImg from '../../assets/images/pulse-blend-media-logo.png';
import './WhyPulseBlendMedia.css';

// Minimal, modern icon components (1.75px stroke width, cyan accent)
const ExperienceIcon = ({ className = '' }) => (
  <svg className={`feature-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const DeliveryIcon = ({ className = '' }) => (
  <svg className={`feature-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CommunicationIcon = ({ className = '' }) => (
  <svg className={`feature-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const PricingIcon = ({ className = '' }) => (
  <svg className={`feature-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 7h-7a2 2 0 0 1-2-2V3a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
    <circle cx="16" cy="14" r="1" fill="currentColor" />
  </svg>
);

const RevisionsIcon = ({ className = '' }) => (
  <svg className={`feature-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </svg>
);

const ServicesIcon = ({ className = '' }) => (
  <svg className={`feature-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const matrixRows = [
  {
    id: 'row-01',
    num: '01',
    feature: 'Experience',
    Icon: ExperienceIcon,
    pulseBlendMedia: '2+ years of hands-on creative work across editing, design and digital projects.',
    otherOptions: 'Experience can vary from one provider to another.',
    whatToCheck: 'Ask to see work that matches the kind of project you need.',
  },
  {
    id: 'row-02',
    num: '02',
    feature: 'Delivery',
    Icon: DeliveryIcon,
    pulseBlendMedia: 'Project timelines are discussed around the service and scope before work begins.',
    otherOptions: 'Delivery times depend on the provider and project.',
    whatToCheck: 'Know when you can expect the first version and final delivery.',
  },
  {
    id: 'row-03',
    num: '03',
    feature: 'Direct Communication',
    Icon: CommunicationIcon,
    pulseBlendMedia: 'Discuss your idea, references, changes and requirements directly.',
    otherOptions: 'Communication methods vary by provider.',
    whatToCheck: 'Make sure you know who to contact when you need an update or change.',
  },
  {
    id: 'row-04',
    num: '04',
    feature: 'Clear Pricing',
    Icon: PricingIcon,
    pulseBlendMedia: 'Pricing is discussed around the actual service, scope and requirement.',
    otherOptions: 'Pricing depends on the provider and project scope.',
    whatToCheck: 'Confirm what is included before you agree to the price.',
  },
  {
    id: 'row-05',
    num: '05',
    feature: 'Revisions',
    Icon: RevisionsIcon,
    pulseBlendMedia: 'Revision expectations can be discussed clearly before the project starts.',
    otherOptions: 'Revision policies vary by provider.',
    whatToCheck: 'Know how changes will be handled before approving the project.',
  },
  {
    id: 'row-06',
    num: '06',
    feature: 'Multiple Creative Services',
    Icon: ServicesIcon,
    pulseBlendMedia: 'Video editing, photo editing, shooting, website design, piano classes, computer teaching and custom requirements.',
    otherOptions: 'Some providers focus on one specialty or a smaller service range.',
    whatToCheck: 'Choose a provider whose skills match what you actually need.',
  },
];

export function WhyPulseBlendMedia() {
  return (
    <section id="why-pulseblend" className="why-pbm-section">
      <div className="why-pbm-header reveal-on-scroll">
        <div className="section-pill-badge">
          <span className="badge-dot"></span>
          <span>WHY CLIENTS CHOOSE US</span>
        </div>
        <h2 className="why-pbm-heading">
          WHY PULSE_BLEND_MEDIA?
        </h2>
        <p className="why-pbm-subtext">
          Creative work should feel clear from the first conversation to the final delivery.
        </p>
      </div>

      {/* Main Glass Comparison Panel */}
      <div className="why-pbm-container reveal-on-scroll">
        <div className="why-pbm-glass-panel">
          
          {/* DESKTOP / TABLET MATRIX TABLE */}
          <div className="matrix-table-wrapper">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th className="col-feature">
                    <span className="col-label-muted">WHAT MATTERS</span>
                  </th>
                  <th className="col-pbm highlighted-header">
                    <div className="pbm-brand-header">
                      <img src={logoImg} alt="Pulse_Blend_Media" className="pbm-header-logo-img" />
                      <div className="pbm-header-titles">
                        <span className="pbm-brand-title">PULSE_BLEND_MEDIA</span>
                        <span className="pbm-brand-sub">CREATIVE STUDIO</span>
                      </div>
                    </div>
                  </th>
                  <th className="col-neutral">
                    <span className="col-title">OTHER OPTIONS</span>
                    <span className="col-sub">MARKETPLACE &amp; FREELANCERS</span>
                  </th>
                  <th className="col-smartcheck">
                    <span className="col-title">WHAT TO CHECK</span>
                    <span className="col-sub">SMART CHECK GUIDE</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {matrixRows.map((row) => (
                  <tr key={row.id} className="matrix-row">
                    <td className="cell-feature">
                      <div className="feature-cell-content">
                        <row.Icon />
                        <span className="feature-name">{row.feature}</span>
                      </div>
                    </td>
                    <td className="cell-pbm highlighted-cell">
                      <div className="cell-content">
                        <span className="icon-check">✓</span>
                        <span className="cell-text font-pbm">{row.pulseBlendMedia}</span>
                      </div>
                    </td>
                    <td className="cell-neutral">
                      <div className="cell-content">
                        <span className="icon-bullet">•</span>
                        <span className="cell-text">{row.otherOptions}</span>
                      </div>
                    </td>
                    <td className="cell-smartcheck">
                      <div className="cell-content">
                        <span className="icon-bullet">•</span>
                        <span className="cell-text font-smartcheck">{row.whatToCheck}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE STACKED CARDS VIEW (<= 768px) */}
          <div className="matrix-mobile-cards">
            {matrixRows.map((row) => (
              <div key={row.id} className="pbm-mobile-card">
                <div className="mobile-card-top">
                  <span className="row-index">{row.num}</span>
                  <div className="mobile-feature-header">
                    <row.Icon />
                    <h3 className="mobile-feature-title">{row.feature}</h3>
                  </div>
                </div>

                {/* Pulse_Blend_Media Highlighted Block */}
                <div className="mobile-block pbm-highlight-block">
                  <div className="mobile-block-head">
                    <span className="badge-dot-cyan"></span>
                    <span className="block-brand-name">PULSE_BLEND_MEDIA</span>
                    <span className="block-brand-sub">CREATIVE STUDIO</span>
                  </div>
                  <p className="mobile-block-body">
                    <span className="icon-check">✓</span>
                    <span>{row.pulseBlendMedia}</span>
                  </p>
                </div>

                {/* Other Options Block */}
                <div className="mobile-block neutral-block">
                  <div className="mobile-block-head">
                    <span className="badge-dot-muted"></span>
                    <span className="block-title-muted">OTHER OPTIONS</span>
                  </div>
                  <p className="mobile-block-body">
                    <span className="icon-bullet">•</span>
                    <span>{row.otherOptions}</span>
                  </p>
                </div>

                {/* What To Check Block */}
                <div className="mobile-block smartcheck-block">
                  <div className="mobile-block-head">
                    <span className="badge-dot-smartcheck"></span>
                    <span className="block-title-smartcheck">WHAT TO CHECK</span>
                    <span className="block-sub-smartcheck">SMART CHECK</span>
                  </div>
                  <p className="mobile-block-body">
                    <span className="icon-bullet">•</span>
                    <span>{row.whatToCheck}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

export default WhyPulseBlendMedia;

