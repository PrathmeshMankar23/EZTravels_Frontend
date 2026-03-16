"use client";

import React, { useState } from "react";
import { submitReview } from "@/lib/api";
interface ReviewFormData {
  name: string;
  email: string;
  rating: number;
  review: string;
}

const ReviewForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  
  const [form, setForm] = useState<ReviewFormData>({
    name: "",
    email: "",
    rating: 0,
    review: "",
  });

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStarClick = (rating: number) => {
    setForm({ ...form, rating });
  };

  const handleStarHover = (rating: number) => {
    setHoveredStar(rating);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.rating || !form.review) {
      alert('Please fill in all fields and select a rating');
      return;
    }
    
    if (form.rating < 1 || form.rating > 5) {
      alert('Please select a rating between 1 and 5 stars');
      return;
    }
    
    setLoading(true);
    
    try {
      await submitReview({
        name: form.name,
        email: form.email,
        rating: form.rating,
        review: form.review
      });
      
      // Show success message
      setSubmitted(true);
      
      // Reset form
      setForm({
        name: '',
        email: '',
        rating: 0,
        review: ''
      });
      setHoveredStar(0);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="review-form-container">
        <div className="review-form-card success-card">
          <div className="success-icon-wrapper">
            <div className="success-icon">✓</div>
          </div>
          <h3 className="success-title">Review Submitted Successfully!</h3>
          <p className="success-message">
            Thank you for your valuable feedback. We appreciate your review and look forward to serving you again!
          </p>
          <button
            onClick={resetForm}
            className="submit-btn success-btn"
          >
            Submit Another Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-form-container">
      <div className="review-form-header">
        <h2 className="form-main-title">Share Your Travel Experience</h2>
        <p className="form-subtitle">Your feedback helps us improve and serve you better</p>
      </div>
      
      <div className="review-form-card">
        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={change}
              placeholder="Enter your full name"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={change}
              placeholder="your.email@example.com"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Rating</label>
            <div className="star-rating">
              <div className="stars-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                    className="star-btn"
                  >
                    <span
                      className={
                        star <= (hoveredStar || form.rating)
                          ? "star filled"
                          : "star empty"
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
              {form.rating > 0 && (
                <p className="rating-text">
                  You rated: {form.rating} star{form.rating > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Your Review</label>
            <textarea
              name="review"
              value={form.review}
              onChange={change}
              placeholder="Tell us about your experience with Easy Travels..."
              rows={4}
              required
              className="form-textarea"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? (
              <span className="btn-content">
                <span className="spinner"></span>
                Submitting...
              </span>
            ) : (
              <span className="btn-content">Submit Review</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
