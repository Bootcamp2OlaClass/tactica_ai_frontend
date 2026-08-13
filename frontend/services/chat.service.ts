import { authenticatedApiRequest, authenticatedStream } from "@/lib/api/client";
import {
  mapChatResponse,
  mapChatStreamDoneEvent,
  mapConversationDetail,
  mapConversationList,
  type RawChatResponse,
  type RawChatStreamDoneEvent,
  type RawConversationDetail,
  type RawConversationListResponse,
} from "@/lib/mappers/chat";
import type { ChatMessage, ChatStreamDoneEvent, Conversation, ConversationDetail } from "@/types/chat";

const BASE_PATH = "/api/v1/chat";

export interface SendChatMessageInput {
  message: string;
  conversationId?: number;
  courseId?: number;
}

/** Non-streaming variant of POST /api/v1/chat -- used by the retry path and
 * anywhere a single awaited result is simpler than consuming a stream. The
 * chat UI's primary send path uses streamChatMessage below instead. */
export async function sendChatMessage(
  input: SendChatMessageInput,
): Promise<{ conversation: Conversation; message: ChatMessage }> {
  const raw = await authenticatedApiRequest<RawChatResponse>(BASE_PATH, {
    json: {
      message: input.message,
      conversation_id: input.conversationId ?? null,
      course_id: input.courseId ?? null,
    },
  });
  return mapChatResponse(raw);
}

export async function listConversations(): Promise<Conversation[]> {
  const raw = await authenticatedApiRequest<RawConversationListResponse>(`${BASE_PATH}/conversations`);
  return mapConversationList(raw);
}

export async function getConversation(conversationId: number): Promise<ConversationDetail> {
  const raw = await authenticatedApiRequest<RawConversationDetail>(
    `${BASE_PATH}/conversations/${conversationId}`,
  );
  return mapConversationDetail(raw);
}

export interface ChatStreamHandlers {
  onDelta: (delta: string) => void;
  onDone: (event: ChatStreamDoneEvent) => void;
  onError: (error: unknown) => void;
}

/**
 * Consumes POST /api/v1/chat/stream's Server-Sent Events. Not built on the
 * browser's EventSource API — EventSource only supports GET requests with
 * no custom headers, and this call needs both a POST body and the bearer
 * Authorization header every other authenticated call uses. Reads the
 * response body incrementally instead, splitting on the "\n\n" event
 * boundary the backend emits (app/routers/chat.py's event_stream).
 */
export async function streamChatMessage(
  input: SendChatMessageInput,
  handlers: ChatStreamHandlers,
  signal?: AbortSignal,
): Promise<void> {
  try {
    const response = await authenticatedStream(
      `${BASE_PATH}/stream`,
      {
        message: input.message,
        conversation_id: input.conversationId ?? null,
        course_id: input.courseId ?? null,
      },
      signal,
    );

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Streaming responses aren't supported in this browser.");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let boundaryIndex: number;
      while ((boundaryIndex = buffer.indexOf("\n\n")) !== -1) {
        const rawEvent = buffer.slice(0, boundaryIndex);
        buffer = buffer.slice(boundaryIndex + 2);

        if (!rawEvent.startsWith("data: ")) continue;

        const payload = JSON.parse(rawEvent.slice("data: ".length)) as
          | { delta: string }
          | RawChatStreamDoneEvent;

        if ("delta" in payload) {
          handlers.onDelta(payload.delta);
        } else if (payload.done) {
          handlers.onDone(mapChatStreamDoneEvent(payload));
        }
      }
    }
  } catch (error) {
    handlers.onError(error);
  }
}
