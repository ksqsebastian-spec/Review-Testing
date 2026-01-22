export interface Business {
  id: string;
  name: string;
  placeId: string; // Google Place ID for deep linking
  category: string;
  tags: string[]; // Suggested tags for this business type
}

// Configure your 6 businesses here
// To find Place ID: https://developers.google.com/maps/documentation/places/web-service/place-id
export const businesses: Business[] = [
  {
    id: "business-1",
    name: "Sample Restaurant",
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4", // Replace with real Place ID
    category: "Restaurant",
    tags: ["Great food", "Friendly staff", "Nice ambiance", "Quick service", "Good portions", "Clean environment"],
  },
  {
    id: "business-2",
    name: "Sample Cafe",
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4", // Replace with real Place ID
    category: "Cafe",
    tags: ["Amazing coffee", "Cozy atmosphere", "Fast WiFi", "Tasty pastries", "Friendly baristas", "Great workspace"],
  },
  {
    id: "business-3",
    name: "Sample Salon",
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4", // Replace with real Place ID
    category: "Salon",
    tags: ["Professional service", "Great results", "Relaxing atmosphere", "Skilled stylists", "Fair prices", "Clean facility"],
  },
  {
    id: "business-4",
    name: "Sample Gym",
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4", // Replace with real Place ID
    category: "Gym",
    tags: ["Modern equipment", "Clean facilities", "Helpful trainers", "Good hours", "Motivating atmosphere", "Great classes"],
  },
  {
    id: "business-5",
    name: "Sample Store",
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4", // Replace with real Place ID
    category: "Retail",
    tags: ["Great selection", "Helpful staff", "Fair prices", "Quality products", "Easy parking", "Quick checkout"],
  },
  {
    id: "business-6",
    name: "Sample Spa",
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4", // Replace with real Place ID
    category: "Spa",
    tags: ["Relaxing experience", "Professional therapists", "Clean rooms", "Peaceful atmosphere", "Great treatments", "Value for money"],
  },
];

export function getBusinessById(id: string): Business | undefined {
  return businesses.find((b) => b.id === id);
}

export function getGoogleReviewUrl(placeId: string): string {
  return `https://search.google.com/local/writereview?placeid=${placeId}`;
}
