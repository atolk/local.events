import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/primitives/button";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/utils/constants";
import { HomeButton } from "./home-button";
import { ViewSwitcher } from "./view-switcher";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3">
        <div className="min-w-0">
          <Link href="/" className="group inline-flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary/20">
              <Sparkles className="size-4" />
            </span>
            <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
              {APP_NAME}
            </span>
          </Link>
          <p className="mt-1 truncate text-xs text-muted-foreground/90">{APP_DESCRIPTION}</p>
        </div>

        <div className="flex items-center gap-2">
          <ViewSwitcher />
          <HomeButton />
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button type="button" variant="outline">
            Войти
          </Button>
        </div>
      </div>
    </header>
  );
}
