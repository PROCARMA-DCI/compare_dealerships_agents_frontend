"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Conversation } from "@/types/chat";
import { Bot, Eraser, Moon, Settings, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

interface ChatHeaderProps {
  conversation: Conversation;
  isLoading: boolean;
  onMenuToggle: () => void;
  onClear: () => void;
}

export function ChatHeader({
  conversation,
  isLoading,
  onMenuToggle,
  onClear,
}: ChatHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const isDark = resolvedTheme === "dark";

  return (
    <TooltipProvider delayDuration={400}>
      <header className="flex h-14 items-center justify-between border-b border-border bg-card/80 px-4 text-card-foreground backdrop-blur-md">
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="h-8 w-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
          >
            <Menu className="h-8 w-8" />
          </Button> */}

          <div className="flex items-center gap-2.5">
            {/* Status dot */}
            <StatusIndicator isActive={isLoading} />

            <div>
              <p className="text-md font-medium leading-tight text-card-foreground">
                Dealership Assistant
              </p>
              <p className="text-[10px] leading-tight text-muted-foreground">
                {isLoading ? "Agent is thinking…" : "Ready"}
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="h-8 w-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                aria-label={
                  mounted
                    ? `Switch to ${isDark ? "light" : "dark"} theme`
                    : "Toggle theme"
                }
              >
                {mounted && isDark ? (
                  <Sun className="h-8 w-8" />
                ) : (
                  <Moon className="h-8 w-8" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="border-border bg-popover text-xs text-popover-foreground"
            >
              {mounted && isDark ? "Light theme" : "Dark theme"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClear}
                disabled={conversation.messages.length === 0}
                className="h-8 w-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-30"
              >
                <Eraser className="h-8 w-8" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="border-border bg-popover text-xs text-popover-foreground"
            >
              Clear chat
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Settings className="h-8 w-8" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="border-border bg-popover text-xs text-popover-foreground"
            >
              Settings
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  );
}

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function StatusIndicator({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-muted ring-1 ring-border">
      <Bot className="h-3.5 w-3.5 text-muted-foreground" />
      <motion.span
        animate={{ scale: isActive ? [1, 1.4, 1] : 1 }}
        transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
        className={cn(
          "absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-2 ring-card",
          isActive ? "bg-primary" : "bg-muted-foreground",
        )}
      />
    </div>
  );
}
