export type Language = "en" | "de";

export const translations = {
  en: {
    // Main page
    title: "Quick Review Generator",
    subtitle: "Generate and submit your Google review in seconds",

    // Steps
    step1: "Choose Business",
    step2: "Rate Your Experience",
    step3: "What Made It Great?",
    step4: "Your Review",

    // Ratings
    clickToRate: "Click to rate",
    poor: "Poor",
    fair: "Fair",
    good: "Good",
    veryGood: "Very Good",
    excellent: "Excellent",

    // Tags
    selectTags: "Select at least one to generate a better review",

    // Buttons
    generateReview: "Generate My Review",
    copyReview: "Copy Review",
    copied: "Copied!",
    regenerate: "Regenerate",
    openGoogle: "Open Google Reviews & Paste",

    // Review output
    generatedReview: "Your Generated Review",
    generating: "Generating your review...",
    pasteInstruction: "Click the button above, then paste your review on Google",
    noLinkConfigured: "No Google review link configured for this business.",
    copyManually: "Copy the review and paste it manually on Google.",

    // Business selector
    noBusinesses: "No businesses configured yet.",
    goToAdmin: "Go to Admin Panel to add businesses",
    noReviewLink: "No review link",

    // Admin page
    adminTitle: "Admin Panel",
    adminSubtitle: "Manage your businesses for quick reviews",
    addNewBusiness: "Add New Business",
    businessName: "Business Name",
    googleReviewLink: "Google Review Link",
    googleLinkHint: "Find this by searching your business on Google → Click \"Write a review\" → Copy the URL",
    addBusiness: "Add Business",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    linkConfigured: "Google link configured",
    noLinkYet: "No Google link yet",
    confirmDelete: "Are you sure you want to remove this business?",
    confirmClearAll: "Are you sure you want to remove ALL businesses? This cannot be undone.",
    clearAll: "Clear all businesses",
    noBusinessesYet: "No businesses added yet",
    clickToStart: "Click \"Add New Business\" to get started",
    backToGenerator: "← Back to Review Generator",

    // Construction tags
    tags: {
      qualityWorkmanship: "Quality workmanship",
      onTimeDelivery: "On time delivery",
      professionalTeam: "Professional team",
      fairPricing: "Fair pricing",
      cleanJobSite: "Clean job site",
      greatCommunication: "Great communication",
      attentionToDetail: "Attention to detail",
      reliableService: "Reliable service",
      exceededExpectations: "Exceeded expectations",
      wouldHireAgain: "Would hire again",
    },

    // Footer
    adminPanel: "Admin Panel",
  },

  de: {
    // Main page
    title: "Schneller Bewertungs-Generator",
    subtitle: "Erstelle und sende deine Google-Bewertung in Sekunden",

    // Steps
    step1: "Unternehmen wählen",
    step2: "Erfahrung bewerten",
    step3: "Was hat dir gefallen?",
    step4: "Deine Bewertung",

    // Ratings
    clickToRate: "Klicke zum Bewerten",
    poor: "Schlecht",
    fair: "Ausreichend",
    good: "Gut",
    veryGood: "Sehr gut",
    excellent: "Ausgezeichnet",

    // Tags
    selectTags: "Wähle mindestens eine Option für eine bessere Bewertung",

    // Buttons
    generateReview: "Bewertung erstellen",
    copyReview: "Bewertung kopieren",
    copied: "Kopiert!",
    regenerate: "Neu generieren",
    openGoogle: "Google Bewertungen öffnen",

    // Review output
    generatedReview: "Deine generierte Bewertung",
    generating: "Bewertung wird erstellt...",
    pasteInstruction: "Klicke den Button oben und füge deine Bewertung bei Google ein",
    noLinkConfigured: "Kein Google-Bewertungslink für dieses Unternehmen konfiguriert.",
    copyManually: "Kopiere die Bewertung und füge sie manuell bei Google ein.",

    // Business selector
    noBusinesses: "Noch keine Unternehmen konfiguriert.",
    goToAdmin: "Zum Admin-Bereich um Unternehmen hinzuzufügen",
    noReviewLink: "Kein Bewertungslink",

    // Admin page
    adminTitle: "Admin-Bereich",
    adminSubtitle: "Verwalte deine Unternehmen für schnelle Bewertungen",
    addNewBusiness: "Neues Unternehmen hinzufügen",
    businessName: "Unternehmensname",
    googleReviewLink: "Google Bewertungslink",
    googleLinkHint: "Finde diesen Link indem du dein Unternehmen auf Google suchst → Klicke \"Rezension schreiben\" → Kopiere die URL",
    addBusiness: "Unternehmen hinzufügen",
    saveChanges: "Änderungen speichern",
    cancel: "Abbrechen",
    linkConfigured: "Google-Link konfiguriert",
    noLinkYet: "Noch kein Google-Link",
    confirmDelete: "Bist du sicher, dass du dieses Unternehmen entfernen möchtest?",
    confirmClearAll: "Bist du sicher, dass du ALLE Unternehmen entfernen möchtest? Dies kann nicht rückgängig gemacht werden.",
    clearAll: "Alle Unternehmen löschen",
    noBusinessesYet: "Noch keine Unternehmen hinzugefügt",
    clickToStart: "Klicke \"Neues Unternehmen hinzufügen\" um zu starten",
    backToGenerator: "← Zurück zum Generator",

    // Construction tags
    tags: {
      qualityWorkmanship: "Qualitätsarbeit",
      onTimeDelivery: "Pünktliche Lieferung",
      professionalTeam: "Professionelles Team",
      fairPricing: "Faire Preise",
      cleanJobSite: "Saubere Baustelle",
      greatCommunication: "Tolle Kommunikation",
      attentionToDetail: "Liebe zum Detail",
      reliableService: "Zuverlässiger Service",
      exceededExpectations: "Erwartungen übertroffen",
      wouldHireAgain: "Würde wieder beauftragen",
    },

    // Footer
    adminPanel: "Admin-Bereich",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

const LANGUAGE_KEY = "review-generator-language";

export function getLanguage(): Language {
  if (typeof window === "undefined") return "de";

  const stored = localStorage.getItem(LANGUAGE_KEY);
  if (stored === "en" || stored === "de") return stored;

  return "de";
}

export function setLanguage(lang: Language): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANGUAGE_KEY, lang);
}

export function t(lang: Language) {
  return translations[lang];
}

// Get construction tags in the selected language
export function getConstructionTags(lang: Language): string[] {
  const tags = translations[lang].tags;
  return Object.values(tags);
}
