import { Button } from "./Button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section role="alert" className="rounded-2xl border border-[#ead3ce] bg-white px-6 py-14 text-center dark:border-[#4a3630] dark:bg-[#1b1b23]">
      <h3 className="text-base font-semibold text-[#17171c] dark:text-[#f2f2f5]">Something went wrong</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#696977] dark:text-[#9797a6]">{message}</p>
      {onRetry && (
        <div className="mt-6 flex justify-center">
          <Button type="button" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </section>
  );
}
