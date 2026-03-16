"use client";

import React, { useState } from 'react';
import { api, ContactFormData } from '../../lib/api';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await api.submitContactForm(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <section id="contact" className="contact-section">
        <div className="contact-container">
          <div className="contact-success">
            <h2>Thank you for contacting us!</h2>
            <p>We'll get back to you within 24 hours.</p>
            <button onClick={() => setSubmitted(false)} className="btn-primary">
              Send Another Message
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-info-panel">
          <div className="contact-header">
            <span className="contact-subtitle">Get in Touch</span>
            <h2 className="contact-main-title">Contact Us</h2>
            <p style={{ color: 'white' }}>Have questions? Our travel experts are here to help you plan your next perfect getaway.</p>
          </div>

          <div className="info-item-list">
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div>
                <h4>Our Office</h4>
                <p>123 Travel Street, Adventure City, AC 12345</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📞</div>
              <div>
                <h4>Phone Number</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div>
                <h4>Email Address</h4>
                <p>info@easytravels.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-panel">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your Phone Number"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your travel plans..."
                rows={5}
                required
                className="form-textarea"
              />
            </div>
            <button type="submit" disabled={isLoading} className="btn-submit">
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;