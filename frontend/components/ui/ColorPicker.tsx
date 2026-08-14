"use client";

import { useState } from "react";

/**
 * Canvas-LMS-style accessible palette. Reused wherever a course color is
 * rendered (Calendar, course cards) so a given course's color always maps
 * back to the same named swatch the user picked, not a re-derived guess.
 */
export const COURSE_COLOR_PALETTE: { name: string; hex: string }[] = [
  { name: "Blue", hex: "#315BD8" },
  { name: "Indigo", hex: "#4F46E5" },
  { name: "Purple", hex: "#7C3AED" },
  { name: "Pink", hex: "#DB2777" },
  { name: "Red", hex: "#DC2626" },
  { name: "Orange", hex: "#EA580C" },
  { name: "Yellow", hex: "#CA8A04" },
  { name: "Green", hex: "#16A34A" },
  { name: "Teal", hex: "#0D9488" },
  { name: "Cyan", hex: "#0891B2" },
];

function normalizeHex(hex: string): string {
  return hex.trim().toUpperCase();
}

export function ColorPicker({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (hex: string) => void;
  disabled?: boolean;
}) {
  const normalizedValue = value ? normalizeHex(value) : "";
  const matchesSwatch = COURSE_COLOR_PALETTE.some((swatch) => swatch.hex === normalizedValue);
  const [showCustom, setShowCustom] = useState(!matchesSwatch && normalizedValue !== "");

  return (
    <div>
      <div role="group" aria-label="Course color" className="flex flex-wrap gap-2">
        {COURSE_COLOR_PALETTE.map((swatch) => {
          const selected = swatch.hex === normalizedValue;
          return (
            <button
              key={swatch.hex}
              type="button"
              disabled={disabled}
              onClick={() => {
                setShowCustom(false);
                onChange(swatch.hex);
              }}
              aria-pressed={selected}
              aria-label={swatch.name}
              title={swatch.name}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 ${
                selected
                  ? "ring-2 ring-offset-2 ring-[#17171c] dark:ring-[#f2f2f5] dark:ring-offset-[#1b1b23]"
                  : "hover:scale-105"
              }`}
              style={{ backgroundColor: swatch.hex }}
            >
              {selected && (
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4 text-white">
                  <path
                    d="M4 10.5l3.5 3.5L16 5.5"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          );
        })}

        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowCustom((open) => !open)}
          aria-pressed={showCustom}
          aria-label="Custom color"
          title="Custom color"
          className={`flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-[#aeb3cf] text-xs text-[#696977] transition disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#4c4c5c] dark:text-[#9797a6] ${
            showCustom ? "ring-2 ring-offset-2 ring-[#17171c] dark:ring-[#f2f2f5] dark:ring-offset-[#1b1b23]" : "hover:scale-105"
          }`}
        >
          +
        </button>
      </div>

      {showCustom && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="color"
            aria-label="Pick a custom color"
            value={/^#[0-9A-Fa-f]{6}$/.test(normalizedValue) ? normalizedValue : "#315BD8"}
            onChange={(event) => onChange(normalizeHex(event.target.value))}
            disabled={disabled}
            className="h-8 w-10 cursor-pointer rounded border border-[#cfd2e3] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#3a3a48]"
          />
          <span className="text-xs text-[#696977] dark:text-[#9797a6]">{normalizedValue || "No color selected"}</span>
        </div>
      )}
    </div>
  );
}
