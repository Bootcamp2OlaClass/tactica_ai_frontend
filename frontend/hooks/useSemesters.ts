"use client";

import { getSemester, listSemesters } from "@/services/semester.service";
import type { SemesterListFilters } from "@/types/semester";

import { useAsyncData } from "./useAsyncData";

export function useSemesters(filters: SemesterListFilters = {}) {
  return useAsyncData(() => listSemesters(filters), [JSON.stringify(filters)]);
}

export function useSemester(semesterId: number) {
  return useAsyncData(() => getSemester(semesterId), [semesterId]);
}
