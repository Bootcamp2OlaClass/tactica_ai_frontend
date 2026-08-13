"use client";

import { useEffect, useRef } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import type { DisplayMessage } from "@/hooks/useChat";

import { MessageBubble } from "./MessageBubble";

export function ChatMessageList({
  messages,
  onRetry,
}: {
  messages: DisplayMessage[];
  onRetry: () => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <EmptyState
        title="Ask your Study Coach anything"
        description="Questions are answered from your own uploaded course documents and your semester/course/task data — the coach says so honestly when it doesn't know."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 py-2">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} onRetry={message.failed ? onRetry : undefined} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
