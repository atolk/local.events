"use client";

import { useSession } from "next-auth/react";
import { LoginDialog, type OAuthAvailability, UserMenu } from "@/components/features/auth";
import { Button } from "@/components/ui/primitives/button";

export function HeaderAuth({ oauth }: { oauth: OAuthAvailability }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Button type="button" variant="outline" disabled>
        …
      </Button>
    );
  }

  if (session?.user) {
    return <UserMenu />;
  }

  return <LoginDialog oauth={oauth} />;
}
