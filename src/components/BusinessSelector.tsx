"use client";

import { Business, businesses } from "@/lib/businesses";

interface BusinessSelectorProps {
  selectedBusiness: Business | null;
  onSelect: (business: Business) => void;
}

export default function BusinessSelector({
  selectedBusiness,
  onSelect,
}: BusinessSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Select a Business
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
            <div className="text-sm text-gray-500">{business.category}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
