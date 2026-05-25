"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mic, Send, Square } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { KeyboardEvent, useRef, useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({
  onSend,
  onStop,
  isLoading,
  disabled,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = value.trim().length > 0 && !disabled && !isLoading;

  const handleSend = () => {
    if (!canSend) return;
    onSend(value);
    setValue("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  };

  return (
    <div className="border-t border-border bg-card/80 px-4 py-4 text-card-foreground backdrop-blur-md">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={false}
          animate={{
            boxShadow: canSend
              ? "0 0 0 1px color-mix(in oklch, var(--ring) 70%, transparent), 0 4px 24px color-mix(in oklch, var(--primary) 12%, transparent)"
              : "0 0 0 1px color-mix(in oklch, var(--border) 80%, transparent)",
          }}
          transition={{ duration: 0.2 }}
          className="relative flex items-end gap-2 rounded-2xl bg-muted px-3 py-2.5"
        >
          {/* Attach button */}
          {/* <Button
            variant="ghost"
            size="icon"
            disabled={isLoading}
            className="mb-0.5 h-8 w-8 shrink-0 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Paperclip className="h-4 w-4" />
          </Button> */}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Message your agent…"
            rows={1}
            disabled={disabled || isLoading}
            className={cn(
              "flex-1 resize-none bg-transparent py-1 text-sm text-foreground",
              "placeholder:text-muted-foreground focus:outline-none",
              "max-h-[180px] min-h-[28px] leading-relaxed",
              "disabled:opacity-50",
            )}
          />

          {/* Action buttons */}
          <div className="mb-0.5 flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoading}
              className="h-8 w-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Mic className="h-4 w-4" />
            </Button>

            <AnimatePresence mode="wait" initial={false}>
              {isLoading ? (
                <motion.div
                  key="stop"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Button
                    size="icon"
                    onClick={onStop}
                    className="h-8 w-8 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    <Square className="h-3.5 w-3.5 fill-current" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!canSend}
                    className={cn(
                      "h-8 w-8 transition-all duration-200",
                      canSend
                        ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <p className="mt-2 text-center text-[0.9em] text-muted-foreground">
          Press
          <span className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em] text-muted-foreground">
            Enter
          </span>
          to send ·
          <span className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em] text-muted-foreground">
            Shift+Enter
          </span>
          for new line
        </p>
      </div>
    </div>
  );
}
