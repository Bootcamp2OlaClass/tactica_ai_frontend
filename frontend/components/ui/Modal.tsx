"use client";

import { useEffect, useId } from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  const headingId = useId();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-[#1b1b23]"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id={headingId} className="text-lg font-semibold text-[#17171c] dark:text-[#f2f2f5]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-[#696977] transition hover:bg-[#f6f4ff] hover:text-[#17171c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8] dark:text-[#9797a6] dark:hover:bg-[#22222c] dark:hover:text-[#f2f2f5]"
          >
            <X size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
