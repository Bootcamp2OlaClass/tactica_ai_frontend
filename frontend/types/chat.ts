export type MessageRole = "USER" | "ASSISTANT";

// Matches app/schemas/chat.py's ChatCitation exactly.
export interface ChatCitation {
  chunkId: number;
  documentId: number;
}

// Matches app/schemas/chat.py's MessageResponse exactly.
export interface ChatMessage {
  id: number;
  conversationId: number;
  role: MessageRole;
  content: string;
  grounded: boolean | null;
  citations: ChatCitation[] | null;
  createdAt: string;
}

// Matches app/schemas/chat.py's ConversationResponse exactly.
export interface Conversation {
  id: number;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationDetail extends Conversation {
  messages: ChatMessage[];
}

// Terminal event of the POST /api/v1/chat/stream SSE stream
// (app/routers/chat.py's stream_chat_message final_event).
export interface ChatStreamDoneEvent {
  conversationId: number;
  messageId: number;
  grounded: boolean | null;
  citations: ChatCitation[];
}
