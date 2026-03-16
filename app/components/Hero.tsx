"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import EnquireForm from "./EnquireForm";
import { api, Destination } from "../../lib/api";
import Link from "next/link";

const Hero: React.FC = () => {
  const router = useRouter();

  const [showEnquireForm, setShowEnquireForm] = useState(false);
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("Duration");
  const [budget, setBudget] = useState("Budget");

  // --- Dropdown States ---
  const [filteredSuggestions, setFilteredSuggestions] = useState<Destination[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch destinations from API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await api.getDestinations();
        setDestinations(data);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
      }
    };
    fetchDestinations();
  }, []);

  // Close dropdown when clicking outside of the search group
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= INPUT HANDLER ================= */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestination(value);

    if (value.trim().length > 0) {
      const matches = destinations.filter((dest) =>
        dest.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  /* ================= DROPDOWN SELECTION ================= */
  const handleDropdownSelection = (selectedTitle: string) => {
    setDestination(selectedTitle);
    setShowSuggestions(false);
  };

  /* ================= SEARCH ================= */
  const handleSearch = () => {
    const searchTerm = destination.toLowerCase().trim();

    if (!searchTerm) {
      alert("Please enter a destination");
      return;
    }

    const foundDestination = destinations.find((dest) =>
      dest.title.toLowerCase().includes(searchTerm)
    );

    if (foundDestination) {
      sessionStorage.removeItem("searchData");
      sessionStorage.removeItem("reorderedDestinations");

      const searchPayload = {
        destination: foundDestination,
        duration,
        budget,
      };
      
      sessionStorage.setItem("searchData", JSON.stringify(searchPayload));
      window.dispatchEvent(new Event("destinationSearchPerformed"));
      setShowSuggestions(false);
    } else {
      alert("Destination not found. Showing all destinations.");
      sessionStorage.removeItem("searchData");
      sessionStorage.removeItem("reorderedDestinations");
    }

    document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" });
  };

  /* ================= CLEAR ================= */
  const handleClear = () => {
    setDestination("");
    setDuration("Duration");
    setBudget("Budget");
    setShowSuggestions(false);

    sessionStorage.removeItem("searchData");
    sessionStorage.removeItem("reorderedDestinations");
    sessionStorage.removeItem("searchedDestination");

    window.dispatchEvent(new Event("destinationSearchPerformed"));

    document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" });
  };

  /* ================= UI ================= */
  return (
    <section id="hero" className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">Discover Your Next Adventure</h1>

        <p className="hero-subtitle">
          Explore breathtaking destinations around the world with exclusive deals
        </p>

        {/* ================= SEARCH CARD ================= */}
        <div className="search-card">
          {/* Destination with Dropdown Logic */}
          <div className="search-input-group" ref={dropdownRef} style={{ position: 'relative' }}>
            <span>📍</span>
            <input
              type="text"
              placeholder="Enter destination"
              value={destination}
              onChange={handleInputChange}
              onFocus={() => destination.length > 0 && setShowSuggestions(true)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />

            {/* Dropdown List */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {filteredSuggestions.map((dest, index: number) => (
                  <li
                    key={dest.id}
                    onClick={() => {
                      handleDropdownSelection(dest.title);
                    }}
                  >
                    {dest.title}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Duration */}
          <div className="search-input-group">
            <span>📅</span>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option>Duration</option>
              <option>1-3 Days</option>
              <option>4-5 Days</option>
              <option>5-7 Days</option>
              <option>7-10 Days</option>
            </select>
          </div>

          {/* Budget */}
          <div className="search-input-group">
            <span>₹</span>
            <select value={budget} onChange={(e) => setBudget(e.target.value)}>
              <option>Budget</option>
              <option>Under ₹20,000</option>
              <option>₹20,000 - ₹50,000</option>
              <option>₹50,000 - ₹1,00,000</option>
              <option>Above ₹1,00,000</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="search-button-group">
            <button className="btn-search" onClick={() => handleSearch()}>
              Search
            </button>

            <button className="btn-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="hero-actions">
          <button
            className="btn-primary"
            onClick={() =>
              document
                .getElementById("destinations")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore More →
          </button>

          <button
            className="btn-outline"
            onClick={() => setShowEnquireForm(true)}
          >
            💬 Enquire Now
          </button>
        </div>
      </div>

      <EnquireForm
        isOpen={showEnquireForm}
        onClose={() => setShowEnquireForm(false)}
      />
    </section>
  );
};

export default Hero;
