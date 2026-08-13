type PasswordRequirementsProps = {
  password: string;
};

export function PasswordRequirements({
  password,
}: PasswordRequirementsProps) {
  const hasMinimumLength = password.length >= 8;

  return (
    <div
      className="mt-2 text-xs text-[#696977]"
      aria-live="polite"
    >
      <p className="font-medium text-[#34343c]">
        Password requirements
      </p>

      <p
        className={
          hasMinimumLength
            ? "mt-1 text-green-600"
            : "mt-1 text-[#696977]"
        }
      >
        {hasMinimumLength ? "✓" : "•"} At least 8 characters
      </p>
    </div>
  );
}