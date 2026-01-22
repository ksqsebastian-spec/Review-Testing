"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Business, getBusinessById, getGoogleReviewUrl } from "@/lib/businesses";
import BusinessSelector from "@/components/BusinessSelector";
import StarRating from "@/components/StarRating";
import TagSelector from "@/components/TagSelector";
import ReviewOutput from "@/components/ReviewOutput";

function ReviewGeneratorContent() {
  const searchParams = useSearchParams();
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [generatedReview, setGeneratedReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <>
      {/* Steps */}
      <div className="space-y-8">
        {/* Step 1: Select Business */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
              1
            </span>
            <h2 className="text-lg font-semibold text-gray-800">
              Choose Business
            </h2>
          </div>
          <BusinessSelector
            selectedBusiness={selectedBusiness}
            onSelect={setSelectedBusiness}
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
                Rate Your Experience
              </h2>
            </div>
            <StarRating rating={rating} onRatingChange={setRating} />
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
                What Made It Great?
              </h2>
            </div>
            <TagSelector
              availableTags={selectedBusiness.tags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
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
            Generate My Review
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
                Your Review
              </h2>
            </div>
            <ReviewOutput
              review={generatedReview}
              googleReviewUrl={getGoogleReviewUrl(selectedBusiness.placeId)}
              onRegenerate={generateReview}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-gray-400">
        <p>Scan the QR code or share the link to get reviews</p>
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
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quick Review Generator
          </h1>
          <p className="text-gray-600">
            Generate and submit your Google review in seconds
          </p>
        </div>

        <Suspense fallback={<LoadingFallback />}>
          <ReviewGeneratorContent />
        </Suspense>
      </div>
    </main>
  );
}
