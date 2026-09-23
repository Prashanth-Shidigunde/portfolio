import React, { useState } from 'react';
import logoImg from '../../assets/images/pulse-blend-media-logo.png';
import './Header.css';

export function Header({ activeSection, onOpenBooking }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'HOME', href: '#home' },
    { id: 'services', label: 'SERVICES', href: '#services' },
    { id: 'why-pulseblend', label: 'WORK', href: '#why-pulseblend' },
    { id: 'about', label: 'ABOUT', href: '#about' },
    { id: 'contact', label: 'CONTACT', href: '#contact' },
  ];

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleBookClick = (e) => {
    e.preventDefault();
    closeMenu();
    if (onOpenBooking) onOpenBooking('');
  };

  return (
    <header className="site-header">
      {/* Top Horizontal Automated Marquee Strip */}
      <div className="marquee-strip">
        <div className="marquee-track">
          <div className="marquee-content">
            <span>
              <strong className="brand-highlight">Pulse_Blend_Media</strong> &nbsp;—&nbsp; AS PER YOUR REQUIREMENTS, PRICES MAY CHANGE
            </span>
            <span className="dot">&nbsp;•&nbsp;</span>
            <span>
              <strong className="brand-highlight">Pulse_Blend_Media</strong> &nbsp;—&nbsp; AS PER YOUR REQUIREMENTS, PRICES MAY CHANGE
            </span>
            <span className="dot">&nbsp;•&nbsp;</span>
            <span>
              <strong className="brand-highlight">Pulse_Blend_Media</strong> &nbsp;—&nbsp; AS PER YOUR REQUIREMENTS, PRICES MAY CHANGE
            </span>
            <span className="dot">&nbsp;•&nbsp;</span>
            <span>
              <strong className="brand-highlight">Pulse_Blend_Media</strong> &nbsp;—&nbsp; AS PER YOUR REQUIREMENTS, PRICES MAY CHANGE
            </span>
            <span className="dot">&nbsp;•&nbsp;</span>
          </div>
          <div className="marquee-content" aria-hidden="true">
            <span>
              <strong className="brand-highlight">Pulse_Blend_Media</strong> &nbsp;—&nbsp; AS PER YOUR REQUIREMENTS, PRICES MAY CHANGE
            </span>
            <span className="dot">&nbsp;•&nbsp;</span>
            <span>
              <strong className="brand-highlight">Pulse_Blend_Media</strong> &nbsp;—&nbsp; AS PER YOUR REQUIREMENTS, PRICES MAY CHANGE
            </span>
            <span className="dot">&nbsp;•&nbsp;</span>
            <span>
              <strong className="brand-highlight">Pulse_Blend_Media</strong> &nbsp;—&nbsp; AS PER YOUR REQUIREMENTS, PRICES MAY CHANGE
            </span>
            <span className="dot">&nbsp;•&nbsp;</span>
            <span>
              <strong className="brand-highlight">Pulse_Blend_Media</strong> &nbsp;—&nbsp; AS PER YOUR REQUIREMENTS, PRICES MAY CHANGE
            </span>
            <span className="dot">&nbsp;•&nbsp;</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="main-nav">
        <div className="nav-container">
          <a href="#home" className="brand-logo" onClick={closeMenu}>
            <img src={logoImg} alt="Pulse_Blend_Media" className="header-logo-img" />
          </a>

          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button className="btn-book" onClick={handleBookClick}>
              BOOK A SLOT ↗
            </button>

            <button
              className={`mobile-nav-toggle ${menuOpen ? 'open' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle mobile menu"
            >
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Backdrop Overlay */}
      <div
        className={`nav-backdrop ${menuOpen ? 'active' : ''}`}
        onClick={closeMenu}
      ></div>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu-drawer ${menuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className={activeSection === item.id ? 'active' : ''}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li style={{ marginTop: '16px' }}>
            <button className="btn-book" onClick={handleBookClick} style={{ width: '100%' }}>
              BOOK A SLOT ↗
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}

