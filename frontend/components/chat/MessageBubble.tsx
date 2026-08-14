import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { DisplayMessage } from "@/hooks/useChat";

function CitationChips({ message }: { message: DisplayMessage }) {
  if (!message.citations || message.citations.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {message.citations.map((citation, index) => (
        <Badge key={`${citation.chunkId}-${index}`} tone="blue">
          📄 Source: document #{citation.documentId}
        </Badge>
      ))}
    </div>
  );
}

export function MessageBubble({ message, onRetry }: { message: DisplayMessage; onRetry?: () => void }) {
  const isUser = message.role === "USER";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] sm:max-w-[70%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap ${
            isUser
              ? "bg-[#315bd8] text-white dark:bg-[#4d6fe0]"
              : "border border-[#dedee9] bg-white text-[#17171c] dark:border-[#2d2d38] dark:bg-[#1b1b23] dark:text-[#f2f2f5]"
          } ${message.failed ? "border-red-300 bg-red-50 text-red-800 dark:border-red-800/60 dark:bg-red-900/30 dark:text-red-300" : ""}`}
        >
          {message.content}
          {message.pending && message.role === "ASSISTANT" && message.content === "" && (
            <span aria-hidden="true" className="inline-flex gap-1 py-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9a9aa8] [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9a9aa8]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9a9aa8] [animation-delay:0.2s]" />
            </span>
          )}
        </div>

        {!isUser && !message.pending && message.grounded === false && (
          <p className="mt-1 text-xs text-[#9a6b1f] dark:text-amber-400">⚠ Not grounded in your documents or course data.</p>
        )}

        <CitationChips message={message} />

        {message.failed && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-xs text-red-700 dark:text-red-400">{message.failedReason ?? "Couldn't send."}</span>
            {onRetry && (
              <Button type="button" variant="ghost" className="!px-2 !py-1 text-xs" onClick={onRetry}>
                Retry
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
