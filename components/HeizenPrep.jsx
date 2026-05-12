"use client";

import { useState } from "react";

const CHALLENGES = [
  {
    id: 1,
    title: "Debounce Search",
    difficulty: "Medium",
    time: "20 min",
    tag: "Hooks + Performance",
    description: `Build a search input that debounces API calls.
    
Requirements:
• Input field that accepts a search query
• Debounce the search by 500ms (don't call on every keystroke)
• Show a "Searching..." state while waiting
• Display mock results after the debounce fires
• Add a clear button to reset`,
    hint: "Use useRef to store the timer ID so it persists across renders without causing re-renders.",
    solution: `import { useState, useEffect, useRef } from "react";

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer); // cleanup on every change
  }, [value, delay]);

  return debouncedValue;
}

// Mock API call
const mockSearch = async (query) => {
  await new Promise(res => setTimeout(res, 300));
  const data = ["React", "NextJS", "NestJS", "TypeScript", "JavaScript"];
  return data.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  );
};

export default function DebounceSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }
    setLoading(true);
    mockSearch(debouncedQuery).then(data => {
      setResults(data);
      setLoading(false);
    });
  }, [debouncedQuery]);

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {query && <button onClick={() => setQuery("")}>Clear</button>}
      {loading && <p>Searching...</p>}
      {results.map(r => <div key={r}>{r}</div>)}
    </div>
  );
}`,
    concepts: ["useEffect cleanup", "Custom hooks", "Debounce pattern", "Async in useEffect"],
  },
  {
    id: 2,
    title: "Infinite Scroll List",
    difficulty: "Medium",
    time: "25 min",
    tag: "DOM + Performance",
    description: `Build an infinite scroll list using IntersectionObserver.

Requirements:
• Render a list of items (mock data is fine)
• Load more items when user scrolls to the bottom
• Show a loading spinner at the bottom while fetching
• Prevent duplicate fetches (loading guard)
• Stop loading when all items are fetched`,
    hint: "Use IntersectionObserver on a sentinel div at the bottom. Unobserve it when all data is loaded.",
    solution: `import { useState, useEffect, useRef, useCallback } from "react";

const fetchItems = async (page) => {
  await new Promise(res => setTimeout(res, 800));
  if (page > 5) return []; // simulate end of data
  return Array.from({ length: 10 }, (_, i) => ({
    id: page * 10 + i,
    text: \`Item \${page * 10 + i + 1}\`
  }));
};

export default function InfiniteScroll() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const newItems = await fetchItems(page);
    if (newItems.length === 0) {
      setHasMore(false);
    } else {
      setItems(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);
    }
    setLoading(false);
  }, [loading, hasMore, page]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { threshold: 1.0 }
    );
    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }
    return () => observerRef.current?.disconnect();
  }, [loadMore]);

  return (
    <div style={{ height: "400px", overflowY: "auto" }}>
      {items.map(item => <div key={item.id}>{item.text}</div>)}
      <div ref={sentinelRef} />
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more items</p>}
    </div>
  );
}`,
    concepts: ["IntersectionObserver", "useCallback", "Pagination logic", "Loading guards"],
  },
  {
    id: 3,
    title: "Custom useLocalStorage Hook",
    difficulty: "Easy",
    time: "15 min",
    tag: "Custom Hooks",
    description: `Build a custom useLocalStorage hook that syncs state with localStorage.

Requirements:
• API: const [value, setValue] = useLocalStorage(key, initialValue)
• Reads from localStorage on mount
• Writes to localStorage on every state change
• Handles JSON serialization/deserialization
• Handles localStorage errors gracefully (private mode)
• Works across tabs (listen to storage event)`,
    hint: "Use a function as the initial useState value (lazy initializer) to avoid reading localStorage on every render.",
    solution: `import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
  // Lazy initializer - only runs once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      // Allow value to be a function (like useState)
      const valueToStore = value instanceof Function
        ? value(storedValue)
        : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("localStorage error:", error);
    }
  };

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

// Usage
export default function App() {
  const [name, setName] = useLocalStorage("name", "");
  return (
    <input
      value={name}
      onChange={e => setName(e.target.value)}
      placeholder="Type name (persists on refresh)"
    />
  );
}`,
    concepts: ["Lazy state initializer", "localStorage API", "Cross-tab sync", "Error boundaries"],
  },
  {
    id: 4,
    title: "Drag & Drop List",
    difficulty: "Hard",
    time: "35 min",
    tag: "DOM Events + State",
    description: `Build a reorderable drag-and-drop list without any library.

Requirements:
• List of items that can be reordered by dragging
• Visual indicator showing where item will drop
• Smooth reorder on drop
• Works with keyboard (bonus)
• No external DnD library allowed`,
    hint: "Use HTML5 Drag and Drop API: draggable, onDragStart, onDragOver, onDrop. Store the dragged item's index in a ref.",
    solution: `import { useState, useRef } from "react";

const initialItems = [
  { id: 1, text: "Build debounce hook" },
  { id: 2, text: "Implement infinite scroll" },
  { id: 3, text: "Create DnD list" },
  { id: 4, text: "Write custom hook" },
  { id: 5, text: "Deploy to Vercel" },
];

export default function DragDropList() {
  const [items, setItems] = useState(initialItems);
  const [dragOver, setDragOver] = useState(null);
  const dragIndex = useRef(null);

  const handleDragStart = (index) => {
    dragIndex.current = index;
  };

  const handleDragOver = (e, index) => {
    e.preventDefault(); // Required to allow drop
    setDragOver(index);
  };

  const handleDrop = (dropIndex) => {
    const newItems = [...items];
    const [dragged] = newItems.splice(dragIndex.current, 1);
    newItems.splice(dropIndex, 0, dragged);
    setItems(newItems);
    setDragOver(null);
    dragIndex.current = null;
  };

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {items.map((item, index) => (
        <li
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={() => handleDrop(index)}
          onDragLeave={() => setDragOver(null)}
          style={{
            padding: "12px",
            margin: "4px 0",
            background: dragOver === index ? "#e0f0ff" : "#fff",
            border: dragOver === index
              ? "2px dashed #3b82f6"
              : "1px solid #ddd",
            cursor: "grab",
            borderRadius: "8px",
            transform: dragOver === index ? "scale(1.02)" : "scale(1)",
            transition: "all 0.15s ease",
          }}
        >
          ☰ {item.text}
        </li>
      ))}
    </ul>
  );
}`,
    concepts: ["HTML5 DnD API", "useRef for non-state data", "Array splice/reorder", "Visual feedback"],
  },
  {
    id: 5,
    title: "Promise.all from Scratch",
    difficulty: "Hard",
    time: "20 min",
    tag: "Core JS",
    description: `Implement Promise.all, Promise.allSettled, and Promise.race from scratch.

Requirements:
• myPromiseAll(promises) — rejects if any rejects
• myPromiseAllSettled(promises) — always resolves with status objects  
• myPromiseRace(promises) — resolves/rejects with first settled promise
• Handle edge cases: empty array, non-promise values`,
    hint: "For Promise.all, use a counter to track resolved count. Don't use Promise.all itself inside your implementation.",
    solution: `// Promise.all — fails fast on first rejection
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) return resolve([]);
    
    const results = new Array(promises.length);
    let resolved = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise) // handles non-promise values
        .then(value => {
          results[index] = value;
          resolved++;
          if (resolved === promises.length) resolve(results);
        })
        .catch(reject); // first rejection wins
    });
  });
}

// Promise.allSettled — always resolves
function myPromiseAllSettled(promises) {
  return new Promise((resolve) => {
    if (promises.length === 0) return resolve([]);

    const results = new Array(promises.length);
    let settled = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = { status: "fulfilled", value };
        })
        .catch(reason => {
          results[index] = { status: "rejected", reason };
        })
        .finally(() => {
          settled++;
          if (settled === promises.length) resolve(results);
        });
    });
  });
}

// Promise.race — first one wins
function myPromiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(promise => {
      Promise.resolve(promise).then(resolve).catch(reject);
    });
  });
}

// Test
myPromiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3),
]).then(console.log); // [1, 2, 3]`,
    concepts: ["Promise internals", "Counter pattern", "Edge cases", "Promise.resolve wrapping"],
  },
];

const difficultyColor = {
  Easy: { bg: "#d1fae5", text: "#065f46" },
  Medium: { bg: "#fef3c7", text: "#92400e" },
  Hard: { bg: "#fee2e2", text: "#991b1b" },
};

export default function HeizenPrep() {
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(new Set());
  const [tab, setTab] = useState("problem");

  const handleSelect = (c) => {
    setSelected(c);
    setShowHint(false);
    setTab("problem");
  };

  const markDone = (id) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div style={{
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      background: "#0a0a0f",
      minHeight: "100vh",
      color: "#e2e8f0",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        padding: "24px 32px 20px",
        borderBottom: "1px solid #1e2a3a",
        background: "#0d1117",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <div style={{
            width: 36, height: 36,
            background: "#3b82f6",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>⚡</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px", color: "#f1f5f9" }}>
              Heizen Round 2 Prep
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 1 }}>
              Build real components · Crack the interview
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "center" }}>
          {CHALLENGES.map(c => (
            <div
              key={c.id}
              onClick={() => markDone(c.id)}
              title={`Mark challenge ${c.id} complete`}
              style={{
                width: 28, height: 6,
                borderRadius: 3,
                background: completed.has(c.id) ? "#3b82f6" : "#1e2a3a",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            />
          ))}
          <span style={{ fontSize: 11, color: "#475569", marginLeft: 6 }}>
            {completed.size}/{CHALLENGES.length} done
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{
          width: 260,
          background: "#0d1117",
          borderRight: "1px solid #1e2a3a",
          overflowY: "auto",
          padding: "12px 0",
          flexShrink: 0,
        }}>
          {CHALLENGES.map(c => (
            <div
              key={c.id}
              onClick={() => handleSelect(c)}
              style={{
                padding: "14px 20px",
                cursor: "pointer",
                borderLeft: selected?.id === c.id ? "3px solid #3b82f6" : "3px solid transparent",
                background: selected?.id === c.id ? "#0f172a" : "transparent",
                transition: "all 0.15s",
                borderBottom: "1px solid #0f172a",
              }}
            >
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: selected?.id === c.id ? "#93c5fd" : "#cbd5e1",
                marginBottom: 6,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                {completed.has(c.id) && <span style={{ color: "#34d399", fontSize: 11 }}>✓</span>}
                {c.title}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: difficultyColor[c.difficulty].bg,
                  color: difficultyColor[c.difficulty].text,
                  fontWeight: 600,
                }}>
                  {c.difficulty}
                </span>
                <span style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: "#1e2a3a",
                  color: "#64748b",
                }}>
                  {c.time}
                </span>
              </div>
              <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>{c.tag}</div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          {!selected ? (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              height: "60vh", gap: 12,
            }}>
              <div style={{ fontSize: 48 }}>🎯</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#475569" }}>
                Select a challenge to start
              </div>
              <div style={{ fontSize: 13, color: "#334155", textAlign: "center", maxWidth: 320 }}>
                These are real patterns tested in frontend interviews at startups like Heizen.
                Build them from scratch, then check the solution.
              </div>
            </div>
          ) : (
            <div>
              {/* Challenge Header */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>
                    {selected.title}
                  </h2>
                  <span style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 4,
                    background: difficultyColor[selected.difficulty].bg,
                    color: difficultyColor[selected.difficulty].text,
                    fontWeight: 700,
                  }}>
                    {selected.difficulty}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>⏱ {selected.time}</span>
                  <span style={{ fontSize: 12, color: "#64748b" }}>•</span>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{selected.tag}</span>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid #1e2a3a" }}>
                {["problem", "solution", "concepts"].map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      padding: "10px 20px",
                      background: "none",
                      border: "none",
                      borderBottom: tab === t ? "2px solid #3b82f6" : "2px solid transparent",
                      color: tab === t ? "#93c5fd" : "#475569",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      textTransform: "capitalize",
                      transition: "all 0.15s",
                      fontFamily: "inherit",
                    }}
                  >
                    {t === "problem" ? "📋 Problem" : t === "solution" ? "💡 Solution" : "🧠 Concepts"}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {tab === "problem" && (
                <div>
                  <div style={{
                    background: "#0d1117",
                    border: "1px solid #1e2a3a",
                    borderRadius: 10,
                    padding: "20px 24px",
                    marginBottom: 16,
                    whiteSpace: "pre-line",
                    fontSize: 14,
                    lineHeight: 1.8,
                    color: "#cbd5e1",
                  }}>
                    {selected.description}
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      style={{
                        padding: "8px 16px",
                        background: showHint ? "#1e2a3a" : "transparent",
                        border: "1px solid #1e2a3a",
                        borderRadius: 6,
                        color: "#fbbf24",
                        fontSize: 12,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontWeight: 600,
                      }}
                    >
                      {showHint ? "🙈 Hide Hint" : "💡 Show Hint"}
                    </button>
                    {showHint && (
                      <div style={{
                        marginTop: 10,
                        padding: "14px 18px",
                        background: "#1c1a0a",
                        border: "1px solid #3d3000",
                        borderRadius: 8,
                        fontSize: 13,
                        color: "#fcd34d",
                        lineHeight: 1.7,
                      }}>
                        💡 {selected.hint}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => setTab("solution")}
                      style={{
                        padding: "10px 20px",
                        background: "#3b82f6",
                        border: "none",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      View Solution →
                    </button>
                    <button
                      onClick={() => markDone(selected.id)}
                      style={{
                        padding: "10px 20px",
                        background: completed.has(selected.id) ? "#064e3b" : "#0f172a",
                        border: `1px solid ${completed.has(selected.id) ? "#34d399" : "#1e2a3a"}`,
                        borderRadius: 8,
                        color: completed.has(selected.id) ? "#34d399" : "#64748b",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {completed.has(selected.id) ? "✓ Completed" : "Mark Complete"}
                    </button>
                  </div>
                </div>
              )}

              {tab === "solution" && (
                <div>
                  <div style={{
                    background: "#020917",
                    border: "1px solid #1e2a3a",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}>
                    <div style={{
                      padding: "10px 20px",
                      background: "#0d1117",
                      borderBottom: "1px solid #1e2a3a",
                      fontSize: 11,
                      color: "#475569",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                      <span>solution.jsx</span>
                      <span style={{ color: "#34d399" }}>● JavaScript / React</span>
                    </div>
                    <pre style={{
                      margin: 0,
                      padding: "20px 24px",
                      fontSize: 12.5,
                      lineHeight: 1.8,
                      color: "#a5f3fc",
                      overflowX: "auto",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}>
                      {selected.solution}
                    </pre>
                  </div>
                  <div style={{
                    marginTop: 12, fontSize: 12, color: "#475569",
                    padding: "10px 14px",
                    background: "#0d1117",
                    borderRadius: 6,
                    border: "1px solid #1e2a3a",
                  }}>
                    ⚠️ Try building it yourself first before looking at the solution. Interviewers notice when you understand the "why."
                  </div>
                </div>
              )}

              {tab === "concepts" && (
                <div>
                  <div style={{ marginBottom: 16, fontSize: 13, color: "#64748b" }}>
                    Key concepts tested in this challenge — make sure you can explain these:
                  </div>
                  {selected.concepts.map((concept, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "16px 20px",
                        background: "#0d1117",
                        border: "1px solid #1e2a3a",
                        borderRadius: 8,
                        marginBottom: 10,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div style={{
                        width: 28, height: 28,
                        background: "#3b82f6",
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                        color: "#fff",
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>
                        {concept}
                      </div>
                    </div>
                  ))}

                  <div style={{
                    marginTop: 20,
                    padding: "16px 20px",
                    background: "#0a1628",
                    border: "1px solid #1e3a5f",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "#93c5fd",
                    lineHeight: 1.7,
                  }}>
                    <strong>💬 Interview Tip:</strong> After solving, be ready to explain your approach.
                    Heizen uses a cultural fit round — they want to see how you think, not just that you coded it.
                    Talk through trade-offs and edge cases.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
