export interface Business {
  id: string;
  name: string;
  googleReviewLink: string; // Direct Google review URL or Place ID
  category: string;
}

// Construction-focused tags for "What made it great?"
export const constructionTags = [
  "Quality workmanship",
  "On time delivery",
  "Professional team",
  "Fair pricing",
  "Clean job site",
  "Great communication",
  "Attention to detail",
  "Reliable service",
  "Exceeded expectations",
  "Would hire again",
];

// Default businesses (construction focused)
const defaultBusinesses: Business[] = [
  {
    id: "business-1",
    name: "Add Your First Business",
    googleReviewLink: "",
    category: "Construction",
  },
];

const STORAGE_KEY = "review-generator-businesses";

// Get businesses from localStorage or return defaults
export function getBusinesses(): Business[] {
  if (typeof window === "undefined") {
    return defaultBusinesses;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load businesses from storage:", e);
  }

  return defaultBusinesses;
}

// Save businesses to localStorage
export function saveBusinesses(businesses: Business[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(businesses));
  } catch (e) {
    console.error("Failed to save businesses to storage:", e);
  }
}

// Add a new business
export function addBusiness(business: Omit<Business, "id">): Business {
  const businesses = getBusinesses();
  const newBusiness: Business = {
    ...business,
    id: `business-${Date.now()}`,
  };
  businesses.push(newBusiness);
  saveBusinesses(businesses);
  return newBusiness;
}

// Update an existing business
export function updateBusiness(id: string, updates: Partial<Business>): Business | null {
  const businesses = getBusinesses();
  const index = businesses.findIndex((b) => b.id === id);
  if (index === -1) return null;

  businesses[index] = { ...businesses[index], ...updates };
  saveBusinesses(businesses);
  return businesses[index];
}

// Remove a business
export function removeBusiness(id: string): boolean {
  const businesses = getBusinesses();
  const filtered = businesses.filter((b) => b.id !== id);
  if (filtered.length === businesses.length) return false;

  saveBusinesses(filtered);
  return true;
}

// Get a single business by ID
export function getBusinessById(id: string): Business | undefined {
  return getBusinesses().find((b) => b.id === id);
}

// Convert Google review link or Place ID to proper URL
export function getGoogleReviewUrl(linkOrPlaceId: string): string {
  if (!linkOrPlaceId) return "#";

  // If it's already a full URL, return it
  if (linkOrPlaceId.startsWith("http")) {
    return linkOrPlaceId;
  }

  // Otherwise treat it as a Place ID
  return `https://search.google.com/local/writereview?placeid=${linkOrPlaceId}`;
}
