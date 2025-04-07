import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Navbar = ({ onLoginClick, onRegisterClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  const navLinks = [
    { href: '#features', text: 'Funkcje' },
    { href: '#why-us', text: 'Dlaczego my' },
    { href: '#how-it-works', text: 'Jak to działa' },
    { href: '#roadmap', text: 'Roadmapa' },
    { href: '#contact', text: 'Kontakt' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <a href="#" className="logo" aria-label="TimeManager - Strona główna">
          <i className="bx bx-time" aria-hidden="true"></i>
          <span>TimeManager</span>
        </a>

        <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="nav-link"
                onClick={handleNavLinkClick}
              >
                {link.text}
              </a>
            </li>
          ))}
        </ul>

        <div className="auth-buttons">
          <button
            className="btn btn-outline"
            onClick={onLoginClick}
            aria-label="Zaloguj się"
          >
            Logowanie
          </button>
          <button
            className="btn btn-primary"
            onClick={onRegisterClick}
            aria-label="Utwórz konto"
          >
            Utwórz konto
          </button>
        </div>

        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={handleMobileMenuToggle}
          aria-label={isMobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <i className="bx bx-menu" aria-hidden="true"></i>
        </button>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="mobile-link"
            onClick={handleNavLinkClick}
          >
            {link.text}
          </a>
        ))}
        <div className="mobile-auth">
          <button
            className="btn btn-outline btn-block"
            onClick={() => {
              onLoginClick();
              handleNavLinkClick();
            }}
          >
            Logowanie
          </button>
          <button
            className="btn btn-primary btn-block"
            onClick={() => {
              onRegisterClick();
              handleNavLinkClick();
            }}
          >
            Utwórz konto
          </button>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
  onRegisterClick: PropTypes.func.isRequired,
};

export default Navbar; 