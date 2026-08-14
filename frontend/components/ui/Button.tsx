import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-[#315bd8] text-white hover:bg-[#284fc4] focus-visible:ring-[#315bd8] disabled:bg-[#315bd8]/60 dark:bg-[#4d6fe0] dark:hover:bg-[#6a8dff]",
  secondary:
    "border border-[#cfd2e3] bg-white text-[#34343c] hover:border-[#aeb3cf] hover:bg-[#f6f4ff] focus-visible:ring-[#315bd8] dark:border-[#3a3a48] dark:bg-[#1b1b23] dark:text-[#e5e5eb] dark:hover:border-[#4c4c5c] dark:hover:bg-[#22222c]",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 disabled:bg-red-400 dark:bg-red-500 dark:hover:bg-red-600",
  ghost: "text-[#454550] hover:bg-[#f6f4ff] focus-visible:ring-[#315bd8] dark:text-[#c7c7d1] dark:hover:bg-[#22222c]",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

export function Button({ variant = "primary", isLoading = false, disabled, className = "", children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}
