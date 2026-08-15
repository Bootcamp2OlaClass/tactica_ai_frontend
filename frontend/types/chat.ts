export type MessageRole = "USER" | "ASSISTANT";

// Matches app/models/message.py's AnswerMode exactly. Only set on
// ASSISTANT messages -- why the answer looks the way it does:
// - GENERAL: a normal general-knowledge/conversational answer. No
//   personal Tactica data was needed, so grounded=false here is expected
//   and should never be shown as a warning.
// - GROUNDED: the answer relies on the student's own Tactica data
//   (document excerpts and/or courses/deadlines).
// - MISSING_PERSONAL_CONTEXT: the question needed the student's own data,
//   but Tactica doesn't have it on file -- worth surfacing, unlike GENERAL.
export type AnswerMode = "GENERAL" | "GROUNDED" | "MISSING_PERSONAL_CONTEXT";

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
  answerMode: AnswerMode | null;
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
  answerMode: AnswerMode | null;
  citations: ChatCitation[];
}
