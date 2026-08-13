"use client";

import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { ErrorState } from "@/components/ui/ErrorState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { PageHeader } from "@/components/ui/PageHeader";
import { useChat } from "@/hooks/useChat";

export default function ChatPage() {
  const {
    conversationId,
    conversations,
    messages,
    isLoadingMessages,
    isSending,
    loadError,
    loadConversation,
    startNewConversation,
    send,
    retry,
  } = useChat();

  return (
    <div className="mx-auto flex max-w-6xl flex-col">
      <PageHeader title="Study Coach" description="Ask about deadlines, syllabus policies, or your courses." />

      <div className="flex h-[calc(100vh-14rem)] min-h-[420px] overflow-hidden rounded-2xl border border-[#dedee9] bg-white">
        <div className="hidden sm:block">
          <ConversationSidebar
            conversations={conversations}
            activeConversationId={conversationId}
            onSelect={loadConversation}
            onNewChat={startNewConversation}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            {isLoadingMessages && <ListSkeleton rows={3} />}
            {!isLoadingMessages && loadError && <ErrorState message={loadError} onRetry={() => loadConversation(conversationId)} />}
            {!isLoadingMessages && !loadError && <ChatMessageList messages={messages} onRetry={retry} />}
          </div>

          <ChatComposer isSending={isSending} onSend={send} />
        </div>
      </div>
    </div>
  );
}
