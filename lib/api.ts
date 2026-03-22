// API utility functions for frontend
const API_BASE_URL = 'https://easy-travels-backend.onrender.com/api';

// Debug: Log API URL being used
console.log('Frontend API Base URL:', API_BASE_URL);

// Test connectivity to backend
export const testConnectivity = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET'
    });
    return response.ok;
  } catch (error) {
    console.error('Backend connectivity test failed:', error);
    return false;
  }
};

export interface Destination {
  id: string;
  title: string;
  img: string;
  description: string;
  price: string;
  rating: number;
  duration: string;
  nights?: number;
  groupSize: string;
  about: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  itinerary: Itinerary[];
}

export interface Itinerary {
  id: string;
  day: number;
  title: string;
  description: string;
  image: string;
  activities: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface EnquiryData {
  customerName: string;
  email: string;
  phone: string;
  message?: string;
  destinationId?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Demo data for development when API is not available
const demoDestinations: Destination[] = [
  {
    id: 'dest1',
    title: 'Sunny Beach Resort',
    img: 'https://images.unsplash.com/photo-1506905925346-56b1e46b7554?w=800&h=600&fit=crop',
    description: 'A beautiful beachfront resort with crystal clear waters and white sand beaches. Perfect for relaxation and water sports.',
    price: '25000',
    rating: 4.8,
    duration: '5D/4N',
    nights: 4,
    groupSize: '2-8',
    about: 'Experience paradise at our luxury beach resort with world-class amenities and stunning ocean views.',
    highlights: ['Beach Access', 'Water Sports', 'Spa Services', 'Ocean View Rooms'],
    included: ['Daily Breakfast', 'Airport Transfer', 'Beach Umbrella', 'Towel Service'],
    notIncluded: ['Airfare', 'Travel Insurance', 'Personal Expenses'],
    categoryId: 'cat1',
    category: {
      id: 'cat1',
      name: 'Beaches',
      slug: 'beaches'
    },
    itinerary: [
      {
        id: 'day1',
        day: 1,
        title: 'Arrival & Beach Day',
        description: 'Welcome to paradise! Check in, relax on beach, enjoy welcome dinner.',
        image: 'https://images.unsplash.com/photo-1506905925346-56b1e46b7554?w=800&h=400&fit=crop',
        activities: ['Beach Walk', 'Swimming', 'Sunset Watching', 'Welcome Dinner']
      },
      {
        id: 'day2',
        day: 2,
        title: 'Water Sports Adventure',
        description: 'Full day of exciting water activities including snorkeling, jet skiing, and parasailing.',
        image: 'https://images.unsplash.com/photo-1506905925346-56b1e46b7554?w=800&h=400&fit=crop',
        activities: ['Snorkeling', 'Jet Ski', 'Parasailing', 'Beach Volleyball', 'Lunch']
      },
      {
        id: 'day3',
        day: 3,
        title: 'Relaxation & Spa',
        description: 'Indulge in spa treatments and relaxation by the pool with ocean views.',
        image: 'https://images.unsplash.com/photo-1506905925346-56b1e46b7554?w=800&h=400&fit=crop',
        activities: ['Spa Treatment', 'Pool Relaxation', 'Massage Therapy', 'Healthy Lunch']
      },
      {
        id: 'day4',
        day: 4,
        title: 'Departure Day',
        description: 'Final beach breakfast, souvenir shopping, and departure to airport.',
        image: 'https://images.unsplash.com/photo-1506905925346-56b1e46b7554?w=800&h=400&fit=crop',
        activities: ['Breakfast', 'Souvenir Shopping', 'Check-out']
      }
    ]
  },
  {
    id: 'dest2',
    title: 'Mountain Peak Trek',
    img: 'https://images.unsplash.com/photo-1464821697019-f8bbcc01999?w=800&h=600&fit=crop',
    description: 'Challenging mountain trek with breathtaking views and professional guides. Experience the thrill of high altitude.',
    price: '35000',
    rating: 4.9,
    duration: '7D/6N',
    nights: 6,
    groupSize: '4-12',
    about: 'Conquer majestic peaks with our expert guides and premium camping equipment.',
    highlights: ['Mountain Views', 'Professional Guide', 'Camping Equipment', 'Altitude Experience'],
    included: ['All Meals', 'Camping Gear', 'Guide Services', 'Porter Service'],
    notIncluded: ['Personal Clothing', 'Travel Insurance', 'Tips'],
    categoryId: 'cat2',
    category: {
      id: 'cat2',
      name: 'Mountains',
      slug: 'mountains'
    },
    itinerary: [
      {
        id: 'day1',
        day: 1,
        title: 'Base Camp Arrival',
        description: 'Arrive at base camp, meet your guide, and prepare for the trek.',
        image: 'https://images.unsplash.com/photo-1464821697019-f8bbcc01999?w=800&h=400&fit=crop',
        activities: ['Camp Setup', 'Guide Briefing', 'Equipment Check', 'Welcome Dinner']
      },
      {
        id: 'day2',
        day: 2,
        title: 'Summit Day',
        description: 'The big day! Early start, challenging climb to the summit with spectacular views.',
        image: 'https://images.unsplash.com/photo-1464821697019-f8bbcc01999?w=800&h=400&fit=crop',
        activities: ['Summit Attempt', 'Mountain Climbing', 'Peak Photography', 'Celebration Lunch']
      },
      {
        id: 'day3',
        day: 3,
        title: 'Descent Day',
        description: 'Begin descent back to base camp with beautiful valley views and rest stops.',
        image: 'https://images.unsplash.com/photo-1464821697019-f8bbcc01999?w=800&h=400&fit=crop',
        activities: ['Descent Hiking', 'Valley Views', 'Rest Stops', 'Camp Dinner']
      },
      {
        id: 'day4',
        day: 4,
        title: 'Departure',
        description: 'Final breakfast, certificate distribution, and farewell to mountain team.',
        image: 'https://images.unsplash.com/photo-1464821697019-f8bbcc01999?w=800&h=400&fit=crop',
        activities: ['Breakfast', 'Certificate Ceremony', 'Group Photo', 'Departure']
      }
    ]
  },
  {
    id: 'dest3',
    title: 'City Explorer Package',
    img: 'https://images.unsplash.com/photo-1464821697019-f8bbcc01999?w=800&h=600&fit=crop',
    description: 'Comprehensive city tour with cultural experiences, local cuisine, and urban exploration.',
    price: '20000',
    rating: 4.7,
    duration: '4D/3N',
    nights: 3,
    groupSize: '2-6',
    about: 'Discover vibrant cities with our expert local guides and immersive cultural experiences.',
    highlights: ['City Tours', 'Museums', 'Local Cuisine', 'Shopping Districts'],
    included: ['Hotel Accommodation', 'City Tours', 'Museum Entry', 'Guide Services'],
    notIncluded: ['Personal Shopping', 'Evening Entertainment', 'Tips'],
    categoryId: 'cat3',
    category: {
      id: 'cat3',
      name: 'Cities',
      slug: 'cities'
    },
    itinerary: [
      {
        id: 'day1',
        day: 1,
        title: 'City Arrival & Orientation',
        description: 'Arrive in the city, check into hotel, and get oriented with welcome dinner.',
        image: 'https://images.unsplash.com/photo-1464821697019-f8bbcc01999?w=800&h=400&fit=crop',
        activities: ['Hotel Check-in', 'City Orientation', 'Welcome Dinner', 'Evening Walk']
      },
      {
        id: 'day2',
        day: 2,
        title: 'Cultural Exploration',
        description: 'Visit museums, historical sites, and experience local culture and traditions.',
        image: 'https://images.unsplash.com/photo-1464821697019-f8bbcc01999?w=800&h=400&fit=crop',
        activities: ['Museum Tours', 'Historical Sites', 'Cultural Shows', 'Local Lunch']
      },
      {
        id: 'day3',
        day: 3,
        title: 'Shopping & Leisure',
        description: 'Free time for shopping, exploring markets, and personal leisure activities.',
        image: 'https://images.unsplash.com/photo-1464821697019-f8bbcc01999?w=800&h=400&fit=crop',
        activities: ['Market Shopping', 'Souvenir Hunting', 'Cafe Hopping', 'Dinner Show']
      },
      {
        id: 'day4',
        day: 4,
        title: 'Departure Day',
        description: 'Final city breakfast, last-minute sightseeing, and airport transfer.',
        image: 'https://images.unsplash.com/photo-1464821697019-f8bbcc01999?w=800&h=400&fit=crop',
        activities: ['Farewell Breakfast', 'Last Sightseeing', 'Airport Transfer']
      }
    ]
  }
];

const demoCategories: Category[] = [
  {
    id: 'cat1',
    name: 'Beaches',
    slug: 'beaches',
    description: 'Pristine beaches and crystal clear waters for perfect relaxation',
    image: 'https://images.unsplash.com/photo-1506905925346-56b1e46b7554?w=800&h=400&fit=crop'
  },
  {
    id: 'cat2',
    name: 'Mountains',
    slug: 'mountains',
    description: 'Majestic mountain ranges and challenging trekking adventures',
    image: 'https://images.unsplash.com/photo-1464821697019-f8bbcc01999?w=800&h=400&fit=crop'
  },
  {
    id: 'cat3',
    name: 'Cities',
    slug: 'cities',
    description: 'Vibrant urban destinations with rich cultural experiences',
    image: 'https://images.unsplash.com/photo-1464821697019-f8bbcc01999?w=800&h=400&fit=crop'
  }
];

// API functions
export const api = {
  // Destinations
  async getDestinations(): Promise<Destination[]> {
    try {
      console.log('🔗 Fetching from:', API_BASE_URL);
      const response = await fetch(`${API_BASE_URL}/destinations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || err.message || "Failed to fetch destinations");
      }
      return response.json();
    } catch (error) {
      console.error('Destinations API Error:', error);
      // Return empty array as fallback for any network issues
      return [];
    }
  },

  async getDestinationById(id: string): Promise<Destination> {
    try {
      const response = await fetch(`${API_BASE_URL}/destinations/${id}`);
      if (!response.ok) throw new Error('Failed to fetch destination');
      return response.json();
    } catch (error) {
      console.error('Destination by ID API Error:', error);
      throw new Error('Failed to fetch destination. Please check if the backend destinations endpoint exists.');
    }
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || err.message || "Failed to fetch categories");
      }
      return response.json();
    } catch (error) {
      console.error('Categories API Error:', error);
      // Return empty array as fallback for any network issues
      return [];
    }
  },

  async getCategoryById(id: string): Promise<Category> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`);
      if (!response.ok) throw new Error('Failed to fetch category');
      return response.json();
    } catch (error) {
      console.error('Category by ID API Error:', error);
      throw new Error('Failed to fetch category. Please check if the backend categories endpoint exists.');
    }
  },

  // Enquiries
  submitEnquiry: async (enquiryData: EnquiryData): Promise<void> => {
    try {
      console.log("🚀 Submitting enquiry to:", `${API_BASE_URL}/enquiry`);
      console.log("📝 Enquiry data:", enquiryData);

      const response = await fetch(`${API_BASE_URL}/enquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: enquiryData.customerName,   // ✅ FIXED
          email: enquiryData.email,
          phone: enquiryData.phone,
          message: enquiryData.message || "",
        }),
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response ok:", response.ok);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error("❌ Enquiry Error:", err);
        console.error("❌ Response Status:", response.status);
        throw new Error(err.error || err.message || `Failed to submit enquiry (${response.status})`);
      }

      console.log("✅ Enquiry sent successfully");

    } catch (error) {
      console.error("❌ Enquiry API Error:", error);
      console.error("❌ API Base URL:", API_BASE_URL);

      // More specific error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Please ensure the backend server is running on localhost:5001');
      }

      throw error;
    }
  },
  // Contact Form
  submitContactForm: async (contactData: ContactFormData): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });
    if (!response.ok) throw new Error('Failed to submit contact form');
  },

  // Admin - Destinations CRUD
  addDestination: async (destinationData: Omit<Destination, 'id'>): Promise<Destination> => {
    const response = await fetch(`${API_BASE_URL}/destinations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(destinationData),
    });
    if (!response.ok) throw new Error('Failed to add destination');
    return response.json();
  },

  updateDestination: async (id: string, destinationData: Partial<Destination>): Promise<Destination> => {
    const response = await fetch(`${API_BASE_URL}/destinations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(destinationData),
    });
    if (!response.ok) throw new Error('Failed to update destination');
    return response.json();
  },

  deleteDestination: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/destinations/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete destination');
  },

  // Admin - Categories CRUD
  addCategory: async (categoryData: Omit<Category, 'id'>): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error('Failed to add category');
    return response.json();
  },

  async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  },

  async deleteCategory(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete category');
  },
};

// ================= REVIEWS =================

// Submit review (User)
export const submitReview = async (data: {
  name: string;
  email: string;
  rating: number;
  review: string;
  destinationId?: string;
}) => {

  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to submit review");
  }

  return response.json();
};


// Get approved reviews (for website)
export const getApprovedReviews = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/approved`);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("Approved Reviews API Error:", err);
      // Gracefully degrade to empty list so frontend doesn't crash
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Approved Reviews Network/Error:", error);
    // Return empty array as fallback for any network or server issues
    return [];
  }
};