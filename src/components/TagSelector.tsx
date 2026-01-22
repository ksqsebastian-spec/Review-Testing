"use client";

import { Language, t } from "@/lib/translations";

interface TagSelectorProps {
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  language: Language;
}

export default function TagSelector({
  availableTags,
  selectedTags,
  onTagToggle,
  language,
}: TagSelectorProps) {
  const tr = t(language);

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 justify-center">
        {availableTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onTagToggle(tag)}
            className={`tag-button ${
              selectedTags.includes(tag) ? "selected" : ""
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      {selectedTags.length === 0 && (
        <p className="text-center mt-2 text-sm text-gray-400">
          {tr.selectTags}
        </p>
      )}
    </div>
  );
}
