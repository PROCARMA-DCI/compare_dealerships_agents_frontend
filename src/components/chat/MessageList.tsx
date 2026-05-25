"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/chat";
import { Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
}

const EMPTY_SUGGESTIONS = [
  "Summarize last quarter's sales data",
  "Run a query on the users table",
  "Draft a project status report",
  "Search the web for AI news",
];

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="mx-auto max-w-3xl">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <EmptyState key="empty" />
            ) : (
              messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))
            )}
          </AnimatePresence>
          <div ref={bottomRef} className="h-6" />
        </div>
      </ScrollArea>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col items-center justify-center px-6 py-24 text-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative mb-6"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        {/* Glow */}
        <div className="absolute inset-0 -z-10 rounded-2xl bg-primary/20 blur-xl" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.4 }}
        className="mb-2 text-xl font-semibold text-foreground"
      >
        How can I help?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.4 }}
        className="mb-10 max-w-sm text-md text-muted-foreground"
      >
        Your AI agent is ready. Ask anything — I can use tools, query data, and
        reason step-by-step.
      </motion.p>

      {/* Suggestion chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {EMPTY_SUGGESTIONS.map((s, i) => (
          <SuggestionChip key={s} text={s} delay={0.3 + i * 0.07} />
        ))}
      </div>
    </motion.div>
  );
}

function SuggestionChip({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="rounded-full border border-border bg-card px-4 py-2 text-[0.9em] text-muted-foreground transition-colors hover:border-ring hover:bg-accent hover:text-accent-foreground"
    >
      {text}
    </motion.button>
  );
}
