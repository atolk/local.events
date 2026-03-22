import Link from "next/link";
import { Sparkles } from "lucide-react";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/utils/constants";
import { HeaderAuth } from "./header-auth";
import { HomeButton } from "./home-button";
import { ViewSwitcher } from "./view-switcher";

function oauthFlags() {
  return {
    google: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
    yandex: Boolean(process.env.AUTH_YANDEX_ID && process.env.AUTH_YANDEX_SECRET),
  };
}

export function Header() {
  const oauth = oauthFlags();
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
      <div className="container mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3">
        <div className="min-w-0">
          <Link href="/" className="group inline-flex items-center gap-2">
            <span className="bg-primary/15 text-primary ring-primary/20 group-hover:bg-primary/20 inline-flex size-8 items-center justify-center rounded-xl ring-1 transition-colors">
              <Sparkles className="size-4" />
            </span>
            <span className="from-primary via-primary to-primary/70 bg-gradient-to-r bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
              {APP_NAME}
            </span>
          </Link>
          <p className="text-muted-foreground/90 mt-1 truncate text-xs">{APP_DESCRIPTION}</p>
        </div>

        <div className="flex items-center gap-2">
          <ViewSwitcher />
          <HomeButton />
        </div>

        <div className="ml-auto flex items-center gap-1">
          <HeaderAuth oauth={oauth} />
        </div>
      </div>
    </header>
  );
}
