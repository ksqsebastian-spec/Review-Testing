"use client";

import { useEffect, useState } from "react";
import { Business, getBusinesses } from "@/lib/businesses";
import { Language, t } from "@/lib/translations";

interface BusinessSelectorProps {
  selectedBusiness: Business | null;
  onSelect: (business: Business) => void;
  language: Language;
}

export default function BusinessSelector({
  selectedBusiness,
  onSelect,
  language,
}: BusinessSelectorProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const tr = t(language);

  useEffect(() => {
    setBusinesses(getBusinesses());
  }, []);

  if (businesses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>{tr.noBusinesses}</p>
        <a href="/admin" className="text-blue-500 hover:text-blue-600 text-sm mt-2 inline-block">
          {tr.goToAdmin}
        </a>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {businesses.map((business) => (
          <button
            key={business.id}
            onClick={() => onSelect(business)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              selectedBusiness?.id === business.id
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
            }`}
          >
            <div className="font-semibold text-gray-900">{business.name}</div>
            {!business.googleReviewLink && (
              <div className="text-xs text-orange-500 mt-1">{tr.noReviewLink}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
