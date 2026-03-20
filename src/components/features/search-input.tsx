"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/primitives/input";
import { Button } from "@/components/ui/primitives/button";
import { useDebounce } from "@/hooks/use-debounce";
import { useAppStateStore } from "@/stores/app-state-store";

export function SearchInput() {
  const [isPending, startTransition] = useTransition();
  const query = useAppStateStore((state) => state.query);
  const setQuery = useAppStateStore((state) => state.setQuery);
  const [inputValue, setInputValue] = useState(query);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const updateSearch = useCallback(
    (value: string) => {
      startTransition(() => {
        setQuery(value);
      });
    },
    [setQuery]
  );

  const debouncedSearch = useDebounce(updateSearch, 300);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={inputValue}
        onChange={(e) => {
          const nextValue = e.target.value;
          setInputValue(nextValue);
          debouncedSearch(nextValue);
        }}
        placeholder="Поиск событий..."
        className="pl-9 pr-9"
        aria-label="Поиск событий"
      />
      {query && !isPending && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
          onClick={() => {
            setInputValue("");
            updateSearch("");
          }}
        >
          <X className="size-4" />
        </Button>
      )}
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        </div>
      )}
    </div>
  );
}
