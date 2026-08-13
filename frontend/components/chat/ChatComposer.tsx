"use client";

import { useState, type KeyboardEvent } from "react";

import { Button } from "@/components/ui/Button";
import { formFieldInputClassName } from "@/components/ui/FormField";

const MAX_MESSAGE_LENGTH = 4000;

export function ChatComposer({
  isSending,
  onSend,
}: {
  isSending: boolean;
  onSend: (text: string) => void;
}) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || isSending) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex items-end gap-2 border-t border-[#dedee9] bg-white px-4 py-3 sm:px-6">
      <textarea
        aria-label="Message the Study Coach"
        value={value}
        onChange={(event) => setValue(event.target.value.slice(0, MAX_MESSAGE_LENGTH))}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Ask about a deadline, a syllabus policy, or your courses…"
        className={`${formFieldInputClassName} mt-0 max-h-40 min-h-[44px] resize-none`}
        disabled={isSending}
      />
      <Button type="button" onClick={handleSubmit} isLoading={isSending} disabled={!value.trim()}>
        Send
      </Button>
    </div>
  );
}
