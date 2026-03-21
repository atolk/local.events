"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { useServiceWorker } from "@/hooks/use-service-worker";
import { fetcher } from "@/lib/fetcher";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  useServiceWorker();
  return (
    <SessionProvider session={session}>
      <SWRConfig value={{ fetcher }}>{children}</SWRConfig>
    </SessionProvider>
  );
}
