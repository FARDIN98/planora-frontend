"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, SendHorizontal, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatbot } from "@/hooks/use-chatbot";
import { cn } from "@/lib/utils";

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2">
      <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
        <Bot className="h-3.5 w-3.5 text-secondary" />
      </div>
      <div className="flex items-center gap-1 bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export function ChatbotBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, isLoading } = useChatbot();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Backdrop when chat is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat window */}
        <div
          className={cn(
            "absolute bottom-16 right-0 w-[340px] sm:w-[380px] h-[480px] rounded-2xl shadow-2xl flex flex-col origin-bottom-right transition-all duration-200 overflow-hidden",
            "bg-background border border-border",
            isOpen
              ? "scale-100 opacity-100 pointer-events-auto"
              : "scale-0 opacity-0 pointer-events-none"
          )}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-primary text-primary-foreground flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight">Planora Assistant</h3>
                <p className="text-[11px] opacity-80">Ask me about events</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages area */}
          <ScrollArea className="flex-1 px-4 py-3">
            <div className="flex flex-col gap-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-2",
                    msg.role === "user" && "flex-row-reverse"
                  )}
                >
                  {msg.role !== "user" && (
                    <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-secondary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed max-w-[80%] whitespace-pre-wrap",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted rounded-tl-sm"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input area */}
          <div className="px-3 py-3 border-t bg-background flex gap-2 shrink-0">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={isLoading}
              className="h-9 rounded-full text-sm px-4"
            />
            <Button
              size="icon"
              className="h-9 w-9 rounded-full shrink-0"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Floating bubble */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "rounded-full w-12 h-12 flex items-center justify-center shadow-lg cursor-pointer transition-all duration-200",
            isOpen
              ? "bg-muted text-muted-foreground hover:bg-muted/80 scale-90"
              : "bg-primary text-primary-foreground hover:scale-110"
          )}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <MessageCircle className="h-5 w-5" />
          )}
        </button>
      </div>
    </>
  );
}
