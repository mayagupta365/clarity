import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  variant?: "landing" | "compact";
  className?: string;
}

export function SearchBar({ onSearch, initialQuery = "", variant = "landing", className }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setshowHistory] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("claritytube-history");
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setshowHistory(false)
    if (!query.trim()) return;
    const newHistory = [query.trim(), ...history.filter((h) => h !== query.trim())].slice(0, 10);
    setHistory(newHistory);
    try { localStorage.setItem("claritytube-history", JSON.stringify(newHistory)); } catch {}
    onSearch(query.trim());
  };

  const isLanding = variant === "landing";

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={handleSubmit}
        className="relative"
        onClick={() => setshowHistory(true)}
      >
        <Search

          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground",
            isLanding ? "h-6 w-6" : "h-5 w-5"
          )}
        />
        <input
          type="text"
          value={query}

          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any topic to learn..."
          className={cn(
            "w-full rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
            isLanding ? "pl-14 pr-6 py-5 text-lg" : "pl-12 pr-5 py-3 text-base"
          )}
        />
      </form>
      { showHistory &&  history.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {history.map((item) => (
            <button
              key={item}
              onClick={() => {
                setQuery(item);
                onSearch(item);
              }}
              className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:bg-accent transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
