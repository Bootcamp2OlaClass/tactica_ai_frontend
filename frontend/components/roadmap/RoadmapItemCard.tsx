"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formFieldInputClassName } from "@/components/ui/FormField";
import { formatDate } from "@/lib/format";
import type { RoadmapItem, RoadmapItemType } from "@/types/roadmap";

const TYPE_LABELS: Record<RoadmapItemType, string> = {
  MILESTONE: "Milestone",
  ASSIGNMENT_PREPARATION: "Assignment prep",
  EXAM_PREPARATION: "Exam prep",
  RECOMMENDATION: "Coach recommendation",
};

const TYPE_BADGE_TONE: Record<RoadmapItemType, "neutral" | "blue" | "amber" | "purple"> = {
  MILESTONE: "neutral",
  ASSIGNMENT_PREPARATION: "blue",
  EXAM_PREPARATION: "amber",
  RECOMMENDATION: "purple",
};

export function RoadmapItemCard({
  item,
  onSave,
}: {
  item: RoadmapItem;
  onSave: (itemId: number, values: { title?: string; description?: string }) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setIsSaving(true);
    setError(null);
    try {
      await onSave(item.id, { title, description });
      setIsEditing(false);
    } catch {
      setError("Couldn't save that edit. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setTitle(item.title);
    setDescription(item.description ?? "");
    setError(null);
    setIsEditing(false);
  }

  return (
    <div className="rounded-xl border border-[#dedee9] bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={TYPE_BADGE_TONE[item.itemType]}>{TYPE_LABELS[item.itemType]}</Badge>
        <Badge tone={item.origin === "AI_GENERATED" ? "purple" : "neutral"}>
          {item.origin === "AI_GENERATED" ? "AI suggestion" : "From your data"}
        </Badge>
        {item.isUserEdited && <Badge tone="green">Edited by you</Badge>}
        {item.dueDate && <span className="text-xs text-[#696977]">Due {formatDate(item.dueDate)}</span>}
      </div>

      {isEditing ? (
        <div className="mt-3 space-y-2">
          <input
            aria-label="Item title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className={formFieldInputClassName}
          />
          <textarea
            aria-label="Item description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={2}
            className={`${formFieldInputClassName} resize-none`}
            placeholder="Add your own notes…"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button type="button" onClick={handleSave} isLoading={isSaving} disabled={!title.trim()}>
              Save
            </Button>
            <Button type="button" variant="secondary" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#17171c]">{item.title}</p>
            {item.description && <p className="mt-1 text-sm text-[#696977]">{item.description}</p>}
          </div>
          <Button
            type="button"
            variant="ghost"
            className="!px-2 !py-1 text-xs"
            onClick={() => setIsEditing(true)}
            aria-label="Edit this item"
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}
