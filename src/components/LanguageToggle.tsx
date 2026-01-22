"use client";

import { Language } from "@/lib/translations";

interface LanguageToggleProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageToggle({
  language,
  onLanguageChange,
}: LanguageToggleProps) {
  return (
    <div className="flex items-center gap-2 justify-center mb-6">
      <button
        onClick={() => onLanguageChange("en")}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          language === "en"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onLanguageChange("de")}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          language === "de"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        DE
      </button>
    </div>
  );
}
