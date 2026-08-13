"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getApiErrorMessage } from "@/lib/api/client";
import { getConversation, listConversations, streamChatMessage } from "@/services/chat.service";
import type { ChatMessage, Conversation } from "@/types/chat";

// A message not yet confirmed by the server -- either still streaming in
// (pending) or the turn failed before/during the stream (failed, offers
// Retry). Never persisted as such; once a turn completes successfully the
// real, server-assigned ChatMessage rows replace it.
export type DisplayMessage = ChatMessage & { pending?: boolean; failed?: boolean };

let localMessageIdCounter = -1;
function nextLocalMessageId(): number {
  return localMessageIdCounter--;
}

export function useChat(initialConversationId: number | null = null) {
  const [conversationId, setConversationId] = useState<number | null>(initialConversationId);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reloadConversations = useCallback(() => {
    listConversations()
      .then(setConversations)
      .catch(() => {
        // The sidebar list is a convenience, not the primary surface --
        // a failure here shouldn't block the chat itself, so it's
        // deliberately swallowed rather than surfaced as a page-level error.
      });
  }, []);

  useEffect(() => {
    reloadConversations();
  }, [reloadConversations]);

  const loadConversation = useCallback((id: number | null) => {
    setConversationId(id);
    setLoadError(null);

    if (id === null) {
      setMessages([]);
      return;
    }

    setIsLoadingMessages(true);
    getConversation(id)
      .then((detail) => setMessages(detail.messages))
      .catch((error: unknown) => setLoadError(getApiErrorMessage(error, "Unable to load this conversation.")))
      .finally(() => setIsLoadingMessages(false));
  }, []);

  const startNewConversation = useCallback(() => {
    setConversationId(null);
    setMessages([]);
    setLoadError(null);
  }, []);

  const send = useCallback(
    (text: string, courseId?: number) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      setLastFailedMessage(null);
      setIsSending(true);

      const userMessage: DisplayMessage = {
        id: nextLocalMessageId(),
        conversationId: conversationId ?? -1,
        role: "USER",
        content: trimmed,
        grounded: null,
        citations: null,
        createdAt: new Date().toISOString(),
        pending: true,
      };
      const assistantPlaceholderId = nextLocalMessageId();
      const assistantPlaceholder: DisplayMessage = {
        id: assistantPlaceholderId,
        conversationId: conversationId ?? -1,
        role: "ASSISTANT",
        content: "",
        grounded: null,
        citations: null,
        createdAt: new Date().toISOString(),
        pending: true,
      };
      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);

      let accumulated = "";
      const controller = new AbortController();
      abortRef.current = controller;

      streamChatMessage(
        { message: trimmed, conversationId: conversationId ?? undefined, courseId },
        {
          onDelta: (delta) => {
            accumulated += delta;
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantPlaceholderId ? { ...m, content: accumulated } : m)),
            );
          },
          onDone: (final) => {
            setMessages((prev) =>
              prev.map((m) => {
                if (m.id === userMessage.id) return { ...m, pending: false };
                if (m.id === assistantPlaceholderId) {
                  return {
                    id: final.messageId,
                    conversationId: final.conversationId,
                    role: "ASSISTANT",
                    content: accumulated,
                    grounded: final.grounded,
                    citations: final.citations,
                    createdAt: new Date().toISOString(),
                  };
                }
                return m;
              }),
            );
            setConversationId(final.conversationId);
            setIsSending(false);
            reloadConversations();
          },
          onError: (error) => {
            setMessages((prev) =>
              prev
                .filter((m) => m.id !== assistantPlaceholderId)
                .map((m) => (m.id === userMessage.id ? { ...m, pending: false, failed: true } : m)),
            );
            setLastFailedMessage(trimmed);
            setIsSending(false);
            void error; // surfaced via the failed-message Retry affordance, not a page-level error
          },
        },
        controller.signal,
      );
    },
    [conversationId, isSending, reloadConversations],
  );

  const retry = useCallback(() => {
    if (!lastFailedMessage) return;
    setMessages((prev) => prev.filter((m) => !m.failed));
    send(lastFailedMessage);
  }, [lastFailedMessage, send]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return {
    conversationId,
    conversations,
    messages,
    isLoadingMessages,
    isSending,
    loadError,
    lastFailedMessage,
    loadConversation,
    startNewConversation,
    send,
    retry,
  };
}
