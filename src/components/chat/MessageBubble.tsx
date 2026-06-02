"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils-chat";
import { Message } from "@/types/chat";
import { AlertCircle, Bot, Check, Copy, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
// react-markdown renders markdown string to React elements
// remark-gfm adds GitHub Flavored Markdown: tables, strikethrough, task lists, etc.
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
            // MarkdownContent handles rendering: paragraphs, tables, code, lists, etc.
            <MarkdownContent content={message.content} isUser={isUser} />
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

// Renders assistant/user message content as rich Markdown.
// isUser flips text color so tables/code stay readable on the primary bg.
function MarkdownContent({ content, isUser }: { content: string; isUser: boolean }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]} // enables tables, strikethrough, task lists
      components={{
        // --- block elements ---
        p: ({ children }) => (
          <p className="mb-1 last:mb-0 whitespace-pre-wrap wrap-break-word">{children}</p>
        ),
        // tables: full-width, bordered, zebra rows
        table: ({ children }) => (
          <div className="my-2 overflow-x-auto rounded-md">
            <table className={cn(
              "w-full border-collapse text-xs",
              isUser ? "text-primary-foreground" : "text-card-foreground",
            )}>
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className={cn(
            "font-semibold",
            isUser ? "bg-primary/30" : "bg-muted",
          )}>
            {children}
          </thead>
        ),
        tbody: ({ children }) => (
          // odd/even handled via CSS child selector — no Tailwind class for nth-child
          <tbody className="divide-y divide-border/40">{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-muted/30 transition-colors">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-3 py-1.5 text-left font-semibold border border-border/30">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-1.5 border border-border/20">{children}</td>
        ),
        // inline code
        code: ({ children }) => (
          <code className={cn(
            "rounded px-1 py-0.5 text-[11px] font-mono",
            isUser ? "bg-primary/20" : "bg-muted",
          )}>
            {children}
          </code>
        ),
        // fenced code block
        pre: ({ children }) => (
          <pre className={cn(
            "my-2 overflow-x-auto rounded-md p-3 text-[11px] font-mono leading-relaxed",
            isUser ? "bg-primary/20" : "bg-muted",
          )}>
            {children}
          </pre>
        ),
        // lists
        ul: ({ children }) => <ul className="my-1 ml-4 list-disc space-y-0.5">{children}</ul>,
        ol: ({ children }) => <ol className="my-1 ml-4 list-decimal space-y-0.5">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        // headings (rare in chat but handled)
        h1: ({ children }) => <h1 className="mt-2 mb-1 text-base font-bold">{children}</h1>,
        h2: ({ children }) => <h2 className="mt-2 mb-1 text-sm font-bold">{children}</h2>,
        h3: ({ children }) => <h3 className="mt-1 mb-0.5 text-sm font-semibold">{children}</h3>,
        // blockquote
        blockquote: ({ children }) => (
          <blockquote className={cn(
            "my-1 border-l-2 pl-3 italic",
            isUser ? "border-primary-foreground/40" : "border-border",
          )}>
            {children}
          </blockquote>
        ),
        // horizontal rule
        hr: () => <hr className="my-2 border-border/40" />,
        // bold / italic — let browser defaults handle, just pass through
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
      }}
    >
      {content}
    </ReactMarkdown>
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
