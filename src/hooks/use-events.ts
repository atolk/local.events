"use client";

import { useMemo } from "react";
import useSWR from "swr";
import type { Event } from "@/lib/types";
import { useAppStateStore } from "@/stores/app-state-store";

interface UseEventsResult {
  events: Event[];
  isLoading: boolean;
  error: string | null;
}

function toQueryString(params: {
  query: string;
  category: string | null;
  dateFrom: string | null;
  dateTo: string | null;
}) {
  const searchParams = new URLSearchParams();

  if (params.query) {
    searchParams.set("q", params.query);
  }
  if (params.category) {
    searchParams.set("category", params.category);
  }
  if (params.dateFrom) {
    searchParams.set("dateFrom", params.dateFrom);
  }
  if (params.dateTo) {
    searchParams.set("dateTo", params.dateTo);
  }

  return searchParams.toString();
}

export function useEvents(): UseEventsResult {
  const query = useAppStateStore((state) => state.query);
  const category = useAppStateStore((state) => state.category);
  const dateFrom = useAppStateStore((state) => state.dateFrom);
  const dateTo = useAppStateStore((state) => state.dateTo);

  const queryString = useMemo(
    () =>
      toQueryString({
        query,
        category,
        dateFrom,
        dateTo,
      }),
    [category, dateFrom, dateTo, query]
  );

  const key = queryString ? `/api/events?${queryString}` : "/api/events";
  const { data, error, isLoading } = useSWR<Event[]>(key);

  return {
    events: data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
