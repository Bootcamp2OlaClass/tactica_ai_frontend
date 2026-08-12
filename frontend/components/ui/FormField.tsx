import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

const FIELD_CLASSES =
  "mt-1.5 w-full rounded-xl border border-[#cfd2e3] bg-white px-3.5 py-2.5 text-sm text-[#17171c] outline-none transition placeholder:text-[#92929e] hover:border-[#aeb3cf] focus:border-[#315bd8] focus:ring-4 focus:ring-[#315bd8]/10 disabled:cursor-not-allowed disabled:opacity-60";

export function FormField({ id, label, error, hint, required, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-[#34343c]">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>

      {children}

      {hint && !error && <p className="mt-1.5 text-xs text-[#92929e]">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export { FIELD_CLASSES as formFieldInputClassName };
