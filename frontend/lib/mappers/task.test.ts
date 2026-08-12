import { describe, expect, it } from "vitest";

import { mapTask, toTaskWritePayload } from "./task";
import type { RawTask } from "./task";
import type { TaskFormValues } from "@/types/task";

const RAW_TASK: RawTask = {
  id: 1,
  course_id: 5,
  title: "Problem set 3",
  description: null,
  task_type: "assignment",
  status: "todo",
  priority: "high",
  due_at: "2026-08-20T17:00:00Z",
  estimated_minutes: 90,
  completed_at: null,
  source: "manual",
  source_document_id: null,
  is_deleted: false,
  deleted_at: null,
  created_at: "2026-08-01T00:00:00Z",
  updated_at: "2026-08-01T00:00:00Z",
  is_overdue: false,
};

describe("mapTask", () => {
  it("maps snake_case fields to camelCase", () => {
    const task = mapTask(RAW_TASK);
    expect(task.courseId).toBe(5);
    expect(task.taskType).toBe("assignment");
    expect(task.dueAt).toBe("2026-08-20T17:00:00Z");
    expect(task.isOverdue).toBe(false);
  });
});

describe("toTaskWritePayload", () => {
  it("sends null for an empty description and estimated minutes", () => {
    const values: TaskFormValues = {
      title: "Read chapter 4",
      description: "",
      taskType: "reading",
      status: "todo",
      priority: "medium",
      dueAt: "",
      estimatedMinutes: "",
    };

    const payload = toTaskWritePayload(values);
    expect(payload.description).toBeNull();
    expect(payload.due_at).toBeNull();
    expect(payload.estimated_minutes).toBeNull();
  });

  it("converts a datetime-local value to an ISO timestamp", () => {
    const values: TaskFormValues = {
      title: "Submit essay",
      description: "",
      taskType: "assignment",
      status: "todo",
      priority: "urgent",
      dueAt: "2026-09-01T09:30",
      estimatedMinutes: "45",
    };

    const payload = toTaskWritePayload(values);
    expect(payload.due_at).toBe(new Date("2026-09-01T09:30").toISOString());
    expect(payload.estimated_minutes).toBe(45);
  });
});
