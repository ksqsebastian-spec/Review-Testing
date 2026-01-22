"use client";

interface TagSelectorProps {
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export default function TagSelector({
  availableTags,
  selectedTags,
  onTagToggle,
}: TagSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        What did you like? (Select all that apply)
      </label>
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
          Select at least one to generate a better review
        </p>
      )}
    </div>
  );
}
