import { Button } from "@/components/ui/Button";
import type { Conversation } from "@/types/chat";

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMinutes = Math.round((Date.now() - then) / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

export function ConversationSidebar({
  conversations,
  activeConversationId,
  onSelect,
  onNewChat,
}: {
  conversations: Conversation[];
  activeConversationId: number | null;
  onSelect: (id: number) => void;
  onNewChat: () => void;
}) {
  return (
    <aside className="flex h-full w-full shrink-0 flex-col border-r border-[#dedee9] bg-white dark:border-[#2d2d38] dark:bg-[#1b1b23] sm:w-64">
      <div className="p-3">
        <Button type="button" variant="secondary" className="w-full" onClick={onNewChat}>
          + New chat
        </Button>
      </div>

      <nav aria-label="Conversation history" className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
        {conversations.length === 0 && (
          <p className="px-2 py-4 text-center text-xs text-[#92929e] dark:text-[#6f6f7d]">No conversations yet.</p>
        )}

        {conversations.map((conversation) => {
          const active = conversation.id === activeConversationId;
          return (
            <button
              key={conversation.id}
              type="button"
              onClick={() => onSelect(conversation.id)}
              aria-current={active ? "true" : undefined}
              className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${
                active
                  ? "bg-[#f6f4ff] text-[#284fc4] dark:bg-[#1e2a56] dark:text-[#a9bdff]"
                  : "text-[#454550] hover:bg-[#f6f4ff] dark:text-[#c7c7d1] dark:hover:bg-[#22222c]"
              }`}
            >
              <span className="block truncate font-medium">{conversation.title || "New conversation"}</span>
              <span className="mt-0.5 block text-xs text-[#92929e] dark:text-[#6f6f7d]">
                {formatRelativeTime(conversation.updatedAt)}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
