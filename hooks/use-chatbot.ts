"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      content:
        "Hi! I'm Planora Assistant. How can I help you find or learn about events?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string) => {
    const userMsg: ChatMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const response = await apiFetch<{ reply: string }>(
        `${API_URL}/api/v1/chatbot/chat`,
        {
          method: "POST",
          body: JSON.stringify({ message, history }),
        }
      );
      setMessages((prev) => [
        ...prev,
        { role: "model", content: response.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    }
    setIsLoading(false);
  };

  const clearMessages = () => {
    setMessages([
      {
        role: "model",
        content:
          "Hi! I'm Planora Assistant. How can I help you find or learn about events?",
      },
    ]);
  };

  return { messages, sendMessage, isLoading, clearMessages };
}
