"use client";

import { SWRConfig } from "swr";
import { useServiceWorker } from "@/hooks/use-service-worker";
import { fetcher } from "@/lib/fetcher";

export function Providers({ children }: { children: React.ReactNode }) {
  useServiceWorker();
  return <SWRConfig value={{ fetcher }}>{children}</SWRConfig>;
}
