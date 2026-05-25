import { Search, Clock, X } from "lucide-react";
import { useState, useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  variant?: "landing" | "compact";
  className?: string;
  style?: CSSProperties;
}

export function SearchBar({
  onSearch,
  initialQuery = "",
  variant = "landing",
  className,
  style,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("claritytube-history");
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setShowHistory(false);

    const newHistory = [
      query.trim(),
      ...history.filter((h) => h !== query.trim()),
    ].slice(0, 10);

    setHistory(newHistory);
    try {
      localStorage.setItem("claritytube-history", JSON.stringify(newHistory));
    } catch {}

    onSearch(query.trim());
  };

  const handleSelectHistory = (item: string) => {
    setQuery(item);
    setShowHistory(false);
    onSearch(item);
  };

  const handleDeleteHistory = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const updated = history.filter((h) => h !== item);
    setHistory(updated);
    try {
      localStorage.setItem("claritytube-history", JSON.stringify(updated));
    } catch {}
  };

  const isLanding = variant === "landing";

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      style={style}
    >
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <Search
          onClick={() => handleSubmit()}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-primary transition-colors",
            isLanding ? "h-6 w-6" : "h-5 w-5"
          )}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowHistory(true)}
          placeholder="Search any topic to learn..."
          className={cn(
            "w-full rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
            isLanding ? "pl-6 pr-14 py-5 text-lg" : "pl-4 pr-12 py-3 text-sm"
          )}
        />
      </form>

      {/* Dropdown */}
      {showHistory && history.length > 0 && (
        <div
          className={cn(
            "absolute left-0 right-0 z-50 mt-2 overflow-hidden",
            "bg-card border border-border rounded-2xl shadow-lg",
            "max-h-64 overflow-y-auto"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground">
              Recent searches
            </span>
            <button
              onClick={() => {
                setHistory([])
                localStorage.removeItem("claritytube-history")
              }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Clear all
            </button>
          </div>

          {/* History Items */}
          <ul className="py-1">
            {history.map((item) => (
              <li key={item}>
                <button
                  onClick={() => handleSelectHistory(item)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors text-left group"
                >
                  <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="flex-1 text-sm text-foreground truncate">
                    {item}
                  </span>
                  <X
                    onClick={(e) => handleDeleteHistory(e, item)}
                    className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:text-primary"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}