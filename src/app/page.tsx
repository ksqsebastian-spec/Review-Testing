"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Business, getBusinessById, getGoogleReviewUrl } from "@/lib/businesses";
import { Language, getLanguage, setLanguage, t, getConstructionTags } from "@/lib/translations";
import BusinessSelector from "@/components/BusinessSelector";
import StarRating from "@/components/StarRating";
import TagSelector from "@/components/TagSelector";
import ReviewOutput from "@/components/ReviewOutput";
import LanguageToggle from "@/components/LanguageToggle";

function ReviewGeneratorContent() {
  const searchParams = useSearchParams();
  const [language, setLang] = useState<Language>("en");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [generatedReview, setGeneratedReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const tr = t(language);

  // Load language on mount
  useEffect(() => {
    setLang(getLanguage());
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLang(lang);
    setLanguage(lang);
    // Reset selected tags when language changes (tags are translated)
    setSelectedTags([]);
    setGeneratedReview("");
  };

  // Check for pre-selected business from URL
  useEffect(() => {
    const businessId = searchParams.get("business");
    if (businessId) {
      const business = getBusinessById(businessId);
      if (business) {
        setSelectedBusiness(business);
      }
    }
  }, [searchParams]);

  // Reset tags when business changes
  useEffect(() => {
    setSelectedTags([]);
    setGeneratedReview("");
    setRating(0);
  }, [selectedBusiness?.id]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const generateReview = async () => {
    if (!selectedBusiness || rating === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: selectedBusiness.name,
          category: selectedBusiness.category,
          rating,
          selectedTags,
          language, // Pass language to API
        }),
      });

      const data = await response.json();
      setGeneratedReview(data.review);
    } catch (error) {
      console.error("Failed to generate review:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const canGenerate = selectedBusiness && rating > 0;
  const hasValidLink = selectedBusiness?.googleReviewLink;

  return (
    <>
      {/* Language Toggle */}
      <LanguageToggle language={language} onLanguageChange={handleLanguageChange} />

      {/* Steps */}
      <div className="space-y-8">
        {/* Step 1: Select Business */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
              1
            </span>
            <h2 className="text-lg font-semibold text-gray-800">
              {tr.step1}
            </h2>
          </div>
          <BusinessSelector
            selectedBusiness={selectedBusiness}
            onSelect={setSelectedBusiness}
            language={language}
          />
        </div>

        {/* Step 2: Rate */}
        {selectedBusiness && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fadeIn">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
                2
              </span>
              <h2 className="text-lg font-semibold text-gray-800">
                {tr.step2}
              </h2>
            </div>
            <StarRating rating={rating} onRatingChange={setRating} language={language} />
          </div>
        )}

        {/* Step 3: Select Tags */}
        {selectedBusiness && rating > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fadeIn">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
                3
              </span>
              <h2 className="text-lg font-semibold text-gray-800">
                {tr.step3}
              </h2>
            </div>
            <TagSelector
              availableTags={getConstructionTags(language)}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              language={language}
            />
          </div>
        )}

        {/* Generate Button */}
        {canGenerate && !generatedReview && !isLoading && (
          <button
            onClick={generateReview}
            disabled={selectedTags.length === 0}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
              selectedTags.length > 0
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {tr.generateReview}
          </button>
        )}

        {/* Step 4: Review Output */}
        {(generatedReview || isLoading) && selectedBusiness && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fadeIn">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-sm">
                4
              </span>
              <h2 className="text-lg font-semibold text-gray-800">
                {tr.step4}
              </h2>
            </div>
            <ReviewOutput
              review={generatedReview}
              googleReviewUrl={getGoogleReviewUrl(selectedBusiness.googleReviewLink)}
              onRegenerate={generateReview}
              isLoading={isLoading}
              hasValidLink={!!hasValidLink}
              language={language}
            />
          </div>
        )}
      </div>

      {/* Footer with Admin Link */}
      <footer className="mt-12 text-center">
        <a
          href="/admin"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          {tr.adminPanel}
        </a>
      </footer>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default function Home() {
  const [language, setLang] = useState<Language>("en");

  useEffect(() => {
    setLang(getLanguage());
  }, []);

  const tr = t(language);

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {tr.title}
          </h1>
          <p className="text-gray-600">
            {tr.subtitle}
          </p>
        </div>

        <Suspense fallback={<LoadingFallback />}>
          <ReviewGeneratorContent />
        </Suspense>
      </div>
    </main>
  );
}
