"use client";

import React, { useState, useEffect } from "react";
import { api, getApprovedReviews } from "../../lib/api";
import ReviewForm from "./ReviewForm";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
}

const About: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Rajesh Sharma",
      role: "Founder & CEO",
      image: "/assets/images/12345.png",
      bio: "With over 15 years of experience in travel industry, Rajesh founded Eazy Travels with a vision to make travel accessible to everyone."
    },
    {
      id: "2",
      name: "Priya Patel",
      role: "Co-Founder & CTO",
      image: "/assets/images/67890.png",
      bio: "Priya brings her tech expertise to create seamless travel experiences through innovative technology solutions."
    },
    {
      id: "3",
      name: "Amit Kumar",
      role: "Head of Operations",
      image: "/assets/images/33333.png",
      bio: "Amit ensures every journey is perfectly executed with attention to detail and customer satisfaction."
    },
    {
      id: "4",
      name: "Neha Singh",
      role: "Head of Customer Experience",
      image: "/assets/images/444444.png",
      bio: "Neha leads our customer service team to provide exceptional support throughout your travel journey."
    }
  ]);

  const handleStartJourney = () => {
    const destinationsSection = document.getElementById('destinations');
    if (destinationsSection) {
      destinationsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToReview = (index: number) => {
    const reviewsScroll = document.getElementById('reviewsScroll');
    if (reviewsScroll) {
      const cardWidth = 350; // Approximate card width including gap
      const scrollPosition = index * (cardWidth * 3); // 3 cards per dot
      reviewsScroll.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      
      // Update active dot
      updateActiveDot(index);
    }
  };

  const updateActiveDot = (index: number) => {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const handleScroll = () => {
    const reviewsScroll = document.getElementById('reviewsScroll');
    if (reviewsScroll) {
      const cardWidth = 350;
      const scrollLeft = reviewsScroll.scrollLeft;
      const currentIndex = Math.round(scrollLeft / (cardWidth * 3));
      updateActiveDot(currentIndex);
    }
  };

  React.useEffect(() => {
    const reviewsScroll = document.getElementById('reviewsScroll');
    if (reviewsScroll) {
      reviewsScroll.addEventListener('scroll', handleScroll);
      return () => {
        reviewsScroll.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    const loadApprovedReviews = async () => {
      try {
        const data = await getApprovedReviews();
        setReviews(data || []);
      } catch (error) {
        console.error("Failed to load approved reviews:", error);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    loadApprovedReviews();
  }, []);

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-header">
          <h2>About Easy Travels</h2>
          <p>Your trusted partner for unforgettable travel experiences</p>
        </div>

        <div className="about-content">
          <div className="about-text">
            <h3>Our Story</h3>
            <p>
              Founded with a passion for exploration and a commitment to excellence, Easy Travels has been creating 
              memorable journeys for travelers across the globe. We believe that travel should be accessible, 
              enjoyable, and transformative.
            </p>
            <p>
              Our team of experienced travel experts works tirelessly to curate unique experiences that go beyond 
              typical tourist trails. From pristine beaches to majestic mountains, from cultural immersion to 
              adventure sports - we have something for every type of traveler.
            </p>
            
            <button onClick={handleStartJourney} className="btn-start-journey">
              Start Your Journey →
            </button>
          </div>

          <div className="about-stats">
            <div className="stat-item">
              <h4>5000+</h4>
              <p>Happy Travelers</p>
            </div>
            <div className="stat-item">
              <h4>50+</h4>
              <p>Destinations</p>
            </div>
            <div className="stat-item">
              <h4>15+</h4>
              <p>Years Experience</p>
            </div>
            <div className="stat-item">
              <h4>98%</h4>
              <p>Satisfaction Rate</p>
            </div>
          </div>
        </div>

        <div className="why-choose-section">
          <h3>Why Choose Us</h3>
          <div className="services-grid">
            <div className="service-item">
              <div className="service-icon-box">🛡️</div>
              <h4>Safe & Secure</h4>
              <p>Verified partners & secure payments</p>
            </div>
            <div className="service-item">
              <div className="service-icon-box">🏅</div>
              <h4>Best Price Guarantee</h4>
              <p>Best prices with extra discounts</p>
            </div>
            <div className="service-item">
              <div className="service-icon-box">🏠</div>
              <h4>Accommodation</h4>
              <p>Local & overseas stays</p>
            </div>
            <div className="service-item">
              <div className="service-icon-box">📅</div>
              <h4>Travel Planning</h4>
              <p>Expert planning support</p>
            </div>
            <div className="service-item">
              <div className="service-icon-box">🎧</div>
              <h4>24/7 Support</h4>
              <p>Always available for you</p>
            </div>
          </div>
        </div>

        <div className="team-section">
          <h3>Meet Our Team</h3>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card">
                <img src={member.image} alt={member.name} />
                <h4>{member.name}</h4>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="reviews-section">
          <div className="destinations-header">
            <h2>What Our Travelers Say</h2>
            <p>Join thousands of happy travelers</p>
          </div>
          <div className="reviews-container">
            <div className="reviews-scroll" id="reviewsScroll">
              {loadingReviews ? (
                <div className="loading-reviews">Loading reviews...</div>
              ) : reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={review.id || index} className="review-card">
                    <div className="stars">
                      {'⭐'.repeat(Math.floor(review.rating || 0))}
                    </div>
                    <p>"{review.review || 'Great experience!'}"</p>
                    <div className="reviewer">
                      <div className="reviewer-avatar">
                        {(review.name || 'Anonymous').split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="reviewer-info">
                        <div className="reviewer-name">{review.name || 'Anonymous'}</div>
                        <div className="reviewer-location">{review.location || 'Traveler'}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-reviews">
                  <p>No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>
          </div>
          <div className="review-dots">
            <button className="dot active" onClick={() => scrollToReview(0)}></button>
            <button className="dot" onClick={() => scrollToReview(1)}></button>
            <button className="dot" onClick={() => scrollToReview(2)}></button>
          </div>
        </div>

        <div className="review-form-section">
          <ReviewForm />
        </div>
      </div>
    </section>
  );
};

export default About;
