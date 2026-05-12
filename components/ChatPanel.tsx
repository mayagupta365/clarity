import type { ChatMessage } from "@/lib/types";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatPanelProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  onSendMessage: (message: string) => void;
  hasTranscript: boolean;
}

const STARTER_CHIPS = [
  "Explain this in simpler terms",
  "What's the most important concept here?",
  "Give me a quiz question from this video",
  "What should I learn next?",
];

export function ChatPanel({ messages, isStreaming, onSendMessage, hasTranscript }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    onSendMessage(input.trim());
    setInput("");
  };

  if (!hasTranscript) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <p className="text-sm">Transcript needed to enable the AI tutor</p>
      </div>
    );
  }

  return (
    <div className="flex h-[400px] flex-col">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1 pb-3">
        {messages.length === 0 && (
          <div className="space-y-4 pt-4">
            <p className="text-center text-sm text-muted-foreground">
              Ask anything about this video
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {STARTER_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => onSendMessage(chip)}
                  className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground hover:bg-accent hover:border-primary/30 transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                msg.role === "user"
                  ? "bg-chat-user text-primary-foreground rounded-br-md"
                  : "bg-chat-ai text-foreground rounded-bl-md"
              )}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <div className="bg-chat-ai rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border pt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this video..."
          disabled={isStreaming}
          className="flex-1 rounded-xl border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          className="rounded-xl bg-primary px-4 py-2.5 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
