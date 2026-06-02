"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils-chat";
import { Message } from "@/types/chat";
import { AlertCircle, Bot, Check, Copy, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isError = message.status === "error";
  const isStreaming = message.status === "streaming";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "group flex gap-3 px-4 py-3",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      {/* Avatar */}
      <Avatar isUser={isUser} isError={isError} />

      {/* Main Content */}
      <div
        className={cn(
          "relative max-w-[80%] min-w-0 ",
          isUser ? "items-end " : "items-start",
          "flex flex-col gap-1",
        )}
      >
        <div
          className={cn(
            "relative rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "rounded-tr-sm bg-primary text-primary-foreground shadow-lg"
              : isError
                ? "rounded-tl-sm bg-destructive/10 text-destructive ring-1 ring-destructive/30"
                : "rounded-tl-sm bg-card text-card-foreground ring-1 ring-border",
          )}
        >
          {isError && (
            <AlertCircle className="mb-1.5 h-3.5 w-3.5 text-destructive" />
          )}

          {message.content ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : isStreaming ? (
            <ThinkingDots />
          ) : null}

          {isStreaming && message.content && (
            <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse rounded-full bg-primary/80 align-middle" />
          )}
        </div>

        {/* Meta row */}
        <div
          className={cn(
            "flex items-center gap-2 px-1",
            isUser ? "flex-row-reverse" : "flex-row",
            "opacity-0 transition-opacity duration-200 group-hover:opacity-100",
          )}
        >
          <span className="text-[10px] text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>

          {!isUser && message.status === "done" && (
            <CopyButton content={message.content} />
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Avatar({ isUser, isError }: { isUser: boolean; isError: boolean }) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
        "mt-1 ring-1",
        isUser
          ? "bg-primary/20 ring-primary/40"
          : isError
            ? "bg-destructive/10 ring-destructive/30"
            : "bg-muted ring-border",
      )}
    >
      {isUser ? (
        <User className="h-3.5 w-3.5 text-primary" />
      ) : (
        <Bot
          className={cn(
            "h-3.5 w-3.5",
            isError ? "text-destructive" : "text-muted-foreground",
          )}
        />
      )}
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.18,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={copy}
      className="h-5 w-5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    >
      {copied ? (
        <Check className="h-3 w-3 text-primary" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );
}
