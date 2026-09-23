import React from 'react';
import logoImg from '../../assets/images/pulse-blend-media-logo.png';
import './WhyPulseBlendMedia.css';

const matrixRows = [
  {
    id: 'row-01',
    feature: 'Experience',
    pulseBlendMedia: '2+ years of hands-on creative work across editing, design and digital projects.',
    otherOptions: 'Experience can vary from provider to provider.',
    whatToCheck: 'Ask to see relevant work, not just a list of services.',
  },
  {
    id: 'row-02',
    feature: 'Delivery Time',
    pulseBlendMedia: 'Project timelines are discussed according to the service and scope before work begins.',
    otherOptions: 'Timelines depend on the provider and project.',
    whatToCheck: 'Know when you can expect the first version and final delivery.',
  },
  {
    id: 'row-03',
    feature: 'Communication',
    pulseBlendMedia: 'Discuss your idea, requirements, references and changes directly.',
    otherOptions: 'Communication methods vary by provider.',
    whatToCheck: 'Make sure there is a clear way to discuss changes and updates.',
  },
  {
    id: 'row-04',
    feature: 'Pricing',
    pulseBlendMedia: 'Pricing is discussed around the actual service, scope and requirement.',
    otherOptions: 'Pricing depends on the provider and project scope.',
    whatToCheck: 'Understand what is included before you agree to the price.',
  },
  {
    id: 'row-05',
    feature: 'Creative Quality',
    pulseBlendMedia: 'Each project is shaped around the idea, audience and visual direction.',
    otherOptions: 'Creative approach varies from one provider to another.',
    whatToCheck: 'Look for work similar to the style you actually want.',
  },
  {
    id: 'row-06',
    feature: 'Revisions',
    pulseBlendMedia: 'Revision expectations can be discussed clearly before the project starts.',
    otherOptions: 'Revision terms vary by provider.',
    whatToCheck: 'Ask how changes are handled before approving the project.',
  },
  {
    id: 'row-07',
    feature: 'Service Range',
    pulseBlendMedia: 'Video editing, photo editing, shooting, website design, piano classes, computer teaching and custom requirements.',
    otherOptions: 'Some providers focus on one specialty or a smaller service range.',
    whatToCheck: 'Choose someone whose skills match your actual requirement.',
  },
  {
    id: 'row-08',
    feature: 'Custom Requirements',
    pulseBlendMedia: 'Have an unusual idea? Discuss it directly and find the right approach.',
    otherOptions: 'Custom work depends on what each provider offers.',
    whatToCheck: 'Ask whether your specific idea can actually be handled.',
  },
  {
    id: 'row-09',
    feature: 'Final Delivery',
    pulseBlendMedia: 'Final deliverables are provided according to the agreed project scope and format.',
    otherOptions: 'Final delivery depends on the provider and project.',
    whatToCheck: 'Confirm exactly what files, formats and assets you will receive.',
  },
  {
    id: 'row-10',
    feature: 'After-Delivery Support',
    pulseBlendMedia: 'Questions or follow-up needs can be discussed after delivery according to the project.',
    otherOptions: 'Support policies vary by provider.',
    whatToCheck: 'Know who to contact if you need help after delivery.',
  },
  {
    id: 'row-11',
    feature: 'Getting Started',
    pulseBlendMedia: 'Tell us what you need, share references and we can discuss the next step.',
    otherOptions: 'Each provider has their own starting process.',
    whatToCheck: 'Choose a process that feels clear and comfortable before you commit.',
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
          Because creative work is not just about making something look good. It's about getting the right result, at the right time, with clear communication.
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
                    <span className="col-title">WHAT TO CHECK BEFORE YOU BOOK</span>
                    <span className="col-sub">SMART CHECK GUIDE</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {matrixRows.map((row) => (
                  <tr key={row.id} className="matrix-row">
                    <td className="cell-feature">
                      <span className="feature-name">{row.feature}</span>
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
            {matrixRows.map((row, idx) => (
              <div key={row.id} className="pbm-mobile-card">
                <div className="mobile-card-top">
                  <span className="row-index">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                  <h3 className="mobile-feature-title">{row.feature}</h3>
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

                {/* What To Check Before You Book Block */}
                <div className="mobile-block smartcheck-block">
                  <div className="mobile-block-head">
                    <span className="badge-dot-smartcheck"></span>
                    <span className="block-title-smartcheck">WHAT TO CHECK BEFORE YOU BOOK</span>
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
