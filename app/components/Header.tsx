"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Listen for modal open/close events
    const handleModalStateChange = () => {
      const modal = document.querySelector('.destination-modal') as HTMLElement;
      if (modal) {
        const isOpen = window.getComputedStyle(modal).display !== 'none';
        setIsModalOpen(isOpen);
        
        // Hide header when modal is open, show when closed
        if (isOpen) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }
    };

    // Create a MutationObserver to watch for modal changes
    const observer = new MutationObserver(handleModalStateChange);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style']
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`main-header ${isVisible ? 'header-visible' : 'header-hidden'}`}>
      {/* Video Background */}
      <div className="header-video-background">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="header-video"
        >
          <source src="/assets/videos/header-background.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
        <div className="header-video-overlay"></div>
      </div>
      
      {/* Header Content */}
      <div className="header-content">
        <div className="logo">
          <img src="/assets/images/EZ_logo.png" alt="Eazy Travels" className="logo-image" />
        </div>
        
        {/* Desktop Navigation */}
        <nav className="nav-links desktop-nav">
          {/* These must match 'id' attributes in your sections */}
          <Link href="#hero">Home</Link>
          <Link href="#destinations">Destinations</Link>
          <Link href="#about">About</Link>
          <Link href="#footer">Contact Us</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn" 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <nav className={`mobile-nav ${isMobileMenuOpen ? 'mobile-nav-open' : ''}`}>
        <Link href="#hero" onClick={closeMobileMenu}>Home</Link>
        <Link href="#destinations" onClick={closeMobileMenu}>Destinations</Link>
        <Link href="#about" onClick={closeMobileMenu}>About</Link>
        <Link href="#footer" onClick={closeMobileMenu}>Contact Us</Link>
        
        {/* Mobile Close Button */}
        <button 
          className="mobile-nav-close" 
          onClick={closeMobileMenu}
          aria-label="Close mobile menu"
        >
          <X size={20} />
        </button>
      </nav>
    </header>
  );
};

export default Header;