import type {
  ChatCitation,
  ChatMessage,
  ChatStreamDoneEvent,
  Conversation,
  ConversationDetail,
  MessageRole,
} from "@/types/chat";

export interface RawChatCitation {
  chunk_id: number;
  document_id: number;
}

export interface RawChatMessage {
  id: number;
  conversation_id: number;
  role: MessageRole;
  content: string;
  grounded: boolean | null;
  citations: RawChatCitation[] | null;
  created_at: string;
}

export interface RawConversation {
  id: number;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface RawConversationDetail extends RawConversation {
  messages: RawChatMessage[];
}

export interface RawConversationListResponse {
  items: RawConversation[];
}

export interface RawChatResponse {
  conversation: RawConversation;
  message: RawChatMessage;
}

export interface RawChatStreamDoneEvent {
  done: true;
  conversation_id: number;
  message_id: number;
  grounded: boolean | null;
  citations: RawChatCitation[];
}

function mapCitation(raw: RawChatCitation): ChatCitation {
  return { chunkId: raw.chunk_id, documentId: raw.document_id };
}

export function mapChatMessage(raw: RawChatMessage): ChatMessage {
  return {
    id: raw.id,
    conversationId: raw.conversation_id,
    role: raw.role,
    content: raw.content,
    grounded: raw.grounded,
    citations: raw.citations ? raw.citations.map(mapCitation) : null,
    createdAt: raw.created_at,
  };
}

export function mapConversation(raw: RawConversation): Conversation {
  return {
    id: raw.id,
    title: raw.title,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function mapConversationDetail(raw: RawConversationDetail): ConversationDetail {
  return {
    ...mapConversation(raw),
    messages: raw.messages.map(mapChatMessage),
  };
}

export function mapConversationList(raw: RawConversationListResponse): Conversation[] {
  return raw.items.map(mapConversation);
}

export function mapChatResponse(
  raw: RawChatResponse,
): { conversation: Conversation; message: ChatMessage } {
  return {
    conversation: mapConversation(raw.conversation),
    message: mapChatMessage(raw.message),
  };
}

export function mapChatStreamDoneEvent(raw: RawChatStreamDoneEvent): ChatStreamDoneEvent {
  return {
    conversationId: raw.conversation_id,
    messageId: raw.message_id,
    grounded: raw.grounded,
    citations: raw.citations.map(mapCitation),
  };
}
