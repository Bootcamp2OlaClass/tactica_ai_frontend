"use client";

import { useCallback, useEffect, useState } from "react";

import { getApiErrorMessage } from "@/lib/api/client";

export type AsyncDataState<T> =
  | { status: "loading"; data: undefined; error: undefined }
  | { status: "error"; data: undefined; error: string }
  | { status: "success"; data: T; error: undefined };

export type UseAsyncDataResult<T> = AsyncDataState<T> & { reload: () => void };

/**
 * Generic client-side data-loading hook: loading/success/error state plus a
 * manual reload, shared across every domain (semesters/courses/tasks/
 * documents) instead of duplicating fetch/error/loading wiring per page.
 *
 * The return type is the actual discriminated union (not a flattened
 * `{status, data, error}` shape) so that `result.status === "success"`
 * narrows `result.data` to `T` at every call site — do not destructure
 * `data`/`error` separately from `status`, since that breaks narrowing.
 */
export function useAsyncData<T>(fetcher: () => Promise<T>, deps: unknown[]): UseAsyncDataResult<T> {
  const [state, setState] = useState<AsyncDataState<T>>({ status: "loading", data: undefined, error: undefined });
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    let isCurrent = true;

    fetcher()
      .then((data) => {
        if (isCurrent) setState({ status: "success", data, error: undefined });
      })
      .catch((error: unknown) => {
        if (isCurrent) setState({ status: "error", data: undefined, error: getApiErrorMessage(error) });
      });

    return () => {
      isCurrent = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken]);

  return { ...state, reload };
}
