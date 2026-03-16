"use client";

import React, { useState, useEffect } from 'react';
import { Star, Clock, Users, X, ChevronLeft, ChevronRight } from "lucide-react";
import { api, Destination, Category } from '../../../lib/api';
import { realtimeService } from '../../../lib/realtime-service';
import EnquireForm from '../EnquireForm';

export default function Destinations() {
  const [activeDest, setActiveDest] = useState<Destination | null>(null);
  const [showEnquire, setShowEnquire] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [showAllDestinations, setShowAllDestinations] = useState(false);
  const [reorderedDestinations, setReorderedDestinations] = useState<Destination[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch destinations from API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await api.getDestinations();
        setDestinations(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
        setIsLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data);
        console.log('✅ Categories loaded:', data.length);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        // Set empty categories array to prevent undefined error
        setCategories([]);
        // Show user-friendly error message
        alert('Unable to load categories. Please check if the backend categories endpoint is working.');
      }
    };
    fetchCategories();
  }, []);

  // Reset logic
  const handleCloseModal = () => {
    setActiveDest(null);
    setShowEnquire(false);
    setReorderedDestinations([]); 
    setSelectedCategory("All");
    sessionStorage.removeItem("searchData");
    sessionStorage.removeItem("reorderedDestinations");
  };

  // Sync search data
  const syncSearchData = () => {
    const storedSearchData = sessionStorage.getItem('searchData');
    
    if (storedSearchData) {
      try {
        const searchData = JSON.parse(storedSearchData);
        
        if (searchData.destination) {
          setActiveDest(searchData.destination);
          setSelectedCategory(searchData.destination.category?.name || "All");

          let filteredResults = [...destinations];

          // Filter by Duration
          if (searchData.duration && searchData.duration !== "Duration") {
            filteredResults = filteredResults.filter(dest => {
              const destDays = parseInt(dest.duration?.match(/\d+/)?.[0] || '0');
              if (searchData.duration.includes("1-3")) return destDays >= 1 && destDays <= 3;
              if (searchData.duration.includes("4-5")) return destDays >= 4 && destDays <= 5;
              if (searchData.duration.includes("5-7")) return destDays >= 5 && destDays <= 7;
              if (searchData.duration.includes("7-10")) return destDays >= 7 && destDays <= 10;
              return true;
            });
          }

          const foundIndex = filteredResults.findIndex(d => d.id === searchData.destination.id);
          if (foundIndex >= 0) {
            const [foundDest] = filteredResults.splice(foundIndex, 1);
            filteredResults.unshift(foundDest);
          } else {
            filteredResults.unshift(searchData.destination);
          }

          setReorderedDestinations(filteredResults);
        }
      } catch (error) {
        console.error('Error processing search data:', error);
      }
    }
  };

  useEffect(() => {
    if (destinations.length > 0) {
      syncSearchData();
    }
  }, [destinations]);

  useEffect(() => {
    const handleSearchEvent = () => syncSearchData();
    window.addEventListener('destinationSearchPerformed', handleSearchEvent);
    return () => window.removeEventListener('destinationSearchPerformed', handleSearchEvent);
  }, [destinations]);

  // Logic
  const baseDestinations = reorderedDestinations.length > 0 ? reorderedDestinations : destinations;

  const filteredDestinations = selectedCategory === "All"
    ? baseDestinations
    : baseDestinations.filter((dest: Destination) => dest.category?.name === selectedCategory);

  const displayedDestinations = showAllDestinations 
    ? filteredDestinations 
    : filteredDestinations.slice(0, 6);

  const handleImageClick = (imageUrl: string) => setEnlargedImage(imageUrl);
  const closeEnlargedImage = () => setEnlargedImage(null);

  // Refresh functions for real-time updates
  const refreshDestinations = async () => {
    try {
      const data = await api.getDestinations();
      setDestinations(data);
      // Clear search data to show fresh results
      sessionStorage.removeItem("searchData");
      setReorderedDestinations([]);
      // Don't reset category - let user stay on their selected category
    } catch (error) {
      console.error("Failed to refresh destinations:", error);
    }
  };

  const refreshCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to refresh categories:", error);
    }
  };

  // Subscribe to real-time updates from backend
  useEffect(() => {
    const handleRealtimeUpdate = (event: any) => {
      const { type, action } = event;
      
      console.log(`🔄 Real-time update received: ${action} ${type}`);
      
      // Refresh data based on update type
      if (type === 'destination' || action === 'refresh') {
        refreshDestinations();
      }
      if (type === 'category' || action === 'refresh') {
        refreshCategories();
      }
    };

    // Subscribe to real-time service
    realtimeService.subscribe(handleRealtimeUpdate);
    
    return () => {
      realtimeService.unsubscribe(handleRealtimeUpdate);
    };
  }, []);

  // Auto-refresh every 5 seconds for real-time admin updates
  useEffect(() => {
    const interval = setInterval(() => {
      refreshDestinations();
      refreshCategories();
    }, 5000); // 5 seconds for faster updates

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <section id="destinations" className="destinations-container">
        <div className="destinations-header">
          <h2>Loading Destinations...</h2>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="destinations" className="destinations-container">
        <div className="destinations-header">
          <h2>Explore Destinations</h2>
          <p>Curated journeys for modern travelers</p>
        </div>

        <div className="categories-list">
          {/* All Category - Shows all destinations */}
          <button
            className={`category-btn ${selectedCategory === "All" ? "active" : ""}`}
            onClick={() => {
              setReorderedDestinations([]);
              setSelectedCategory("All");
            }}
          >
            All
          </button>
          
          {/* Individual Categories */}
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`category-btn ${selectedCategory === cat.name ? "active" : ""}`}
              onClick={() => {
                setReorderedDestinations([]);
                setSelectedCategory(cat.name);
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="dest-grid">
          {displayedDestinations.map((item: Destination) => (
            <div className="destination-card" key={item.id}>
              <div className="image-container">
                <img src={item.img} alt={item.title} />
                <span className="rating-float">⭐ {item.rating}</span>
              </div>
              <div className="card-info">
                <h3>{item.title}</h3>
                <div className="price-wrapper">
                  <span className="price-text">₹{item.price}</span>
                  <span className="per-person"> / person</span>
                </div>
                <button className="btn-view-details" onClick={() => setActiveDest(item)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDestinations.length > 6 && (
          <div className="see-more-container">
            <button className="btn-see-more" onClick={() => setShowAllDestinations(!showAllDestinations)}>
              {showAllDestinations ? "See Less" : "See More"}
            </button>
          </div>
        )}
      </section>

      {/* MODAL */}
      {activeDest && (
        <div className="destination-overlay">
          <div className="destination-modal">
            <button className="close-destination" onClick={handleCloseModal}>
              <X size={26} />
            </button>

            <div className="destination-hero" style={{ backgroundImage: `url(${activeDest.img})` }} onClick={() => handleImageClick(activeDest.img)}>
              <div className="hero-overlay">
                <h1>{activeDest.title}</h1>
                <div className="hero-meta">
                  <span><Star size={14} /> {activeDest.rating}</span>
                  <span><Clock size={14} /> {activeDest.duration} / {activeDest.nights || 0} Nights</span>
                </div>
              </div>
            </div>

            <div className="destination-content">
              <section>
                <h3>About This Destination</h3>
                <p>{activeDest.description}</p>
              </section>

              <section>
                <h3>Highlights</h3>
                <div className="highlights">
                  {activeDest?.highlights?.map((h: string) => (
                    <span className="highlight-chip" key={h}>{h}</span>
                  ))}
                </div>
              </section>

              <section>
                <h3>Day-by-Day Itinerary</h3>
                {activeDest?.itinerary?.map((day: any) => (
                  <div className="itinerary-card" key={day.day}>
                    <img src={day.image} alt={day.title} onClick={() => handleImageClick(day.image)} />
                    <div className="itinerary-content">
                      <div className="day-title-wrapper">
                        <span className="day-number">{day.day}</span>
                        <strong>{day.title}</strong>
                      </div>
                      <p>{day.desc}</p>
                      <ul className="activities-list">
                        {day.activities?.map((act: string, i: number) => <li key={i}>{act}</li>)}
                      </ul>
                    </div>
                  </div>
                ))}
              </section>

              <section className="inc-exc">
                <div className="inc-exc-card included-card">
                  <h3>✓ Included</h3>
                  <ul>{activeDest?.included?.map((i: string) => <li key={i}>{i}</li>)}</ul>
                </div>
                <div className="inc-exc-card not-included-card">
                  <h3>✕ Not Included</h3>
                  <ul>{activeDest?.notIncluded?.map((i: string) => <li key={i}>{i}</li>)}</ul>
                </div>
              </section>

              <div className="price-action-box">
                <div className="price-only">
                  <span>Starting From</span>
                  <h2>₹{activeDest.price}</h2>
                </div>
                <button className="btn-enquire" onClick={() => setShowEnquire(true)}>
                  Enquire Now
                </button>
              </div>
            </div>

            {/* Enquire Form Overlay - Inside Modal */}
            {showEnquire && (
              <div className="enquire-overlay-inside-modal">
                <div className="enquire-form-inside-modal">
                  <button className="enquire-close-inside" onClick={() => setShowEnquire(false)}>
                    <X size={24} />
                  </button>
                  <EnquireForm 
                    isOpen={showEnquire} 
                    onClose={() => setShowEnquire(false)} 
                    destinationTitle={activeDest?.title} 
                    destinationId={activeDest?.id} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {enlargedImage && (
        <div className="enlarged-image-overlay" onClick={closeEnlargedImage}>
          <div className="enlarged-image-container">
            <button className="enlarged-image-close" onClick={closeEnlargedImage}><X size={24} /></button>
            <img src={enlargedImage} alt="Enlarged" />
          </div>
        </div>
      )}
    </>
  );
}
