export interface Business {
  id: string;
  name: string;
  googleReviewLink: string;
  category: string;
}

// ===========================================
// BUSINESSES - Links hier eintragen!
// ===========================================
// So findest du den Google Review Link:
// 1. Suche das Unternehmen auf Google
// 2. Klicke auf "Rezension schreiben"
// 3. Kopiere die URL aus der Adresszeile
// ===========================================

export const businesses: Business[] = [
  {
    id: "malerei-hantke",
    name: "Malerei Hantke",
    googleReviewLink: "", // <- Link hier einfügen
    category: "Malerei",
  },
  {
    id: "seehafer-elemente",
    name: "Seehafer Elemente",
    googleReviewLink: "", // <- Link hier einfügen
    category: "Bau",
  },
  {
    id: "werner-bau",
    name: "Werner Bau",
    googleReviewLink: "", // <- Link hier einfügen
    category: "Bau",
  },
  {
    id: "werner-geruest-bau",
    name: "Werner Gerüst Bau",
    googleReviewLink: "", // <- Link hier einfügen
    category: "Gerüstbau",
  },
  {
    id: "ground-passion",
    name: "Ground Passion",
    googleReviewLink: "", // <- Link hier einfügen
    category: "Bau",
  },
  {
    id: "creyou",
    name: "Creyou",
    googleReviewLink: "", // <- Link hier einfügen
    category: "Bau",
  },
  {
    id: "brink",
    name: "Brink",
    googleReviewLink: "", // <- Link hier einfügen
    category: "Bau",
  },
  {
    id: "gruppenwerk-gmbh",
    name: "Gruppenwerk GmbH",
    googleReviewLink: "", // <- Link hier einfügen
    category: "Bau",
  },
  {
    id: "gruppenwerk-projektentwicklung",
    name: "Gruppenwerk Projektentwicklung",
    googleReviewLink: "", // <- Link hier einfügen
    category: "Projektentwicklung",
  },
];

// Get all businesses
export function getBusinesses(): Business[] {
  return businesses;
}

// Get a single business by ID
export function getBusinessById(id: string): Business | undefined {
  return businesses.find((b) => b.id === id);
}

// Convert Google review link or Place ID to proper URL
export function getGoogleReviewUrl(linkOrPlaceId: string): string {
  if (!linkOrPlaceId) return "#";

  if (linkOrPlaceId.startsWith("http")) {
    return linkOrPlaceId;
  }

  return `https://search.google.com/local/writereview?placeid=${linkOrPlaceId}`;
}

// Legacy exports for compatibility (not used anymore)
export function saveBusinesses(): void {}
export function addBusiness(): Business { return businesses[0]; }
export function updateBusiness(): Business | null { return null; }
export function removeBusiness(): boolean { return false; }
