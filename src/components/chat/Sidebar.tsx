"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatRelativeTime, truncate } from "@/lib/utils-chat";
import { Conversation } from "@/types/chat";
import { MessageSquare, Plus, Sparkles, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className={cn(
          "fixed left-0 top-0 z-30 flex h-full w-72 flex-col",
          "border-r border-white/8 bg-[#0d0d10]/95 backdrop-blur-xl",
          "lg:relative lg:translate-x-0 lg:z-auto",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 ring-1 ring-violet-500/30">
              <Sparkles className="h-4 w-4 text-violet-400" />
            </div>
            <span className="font-semibold tracking-tight text-white">
              Agent
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNew}
              className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/8"
              title="New chat"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/8 lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="bg-white/6" />

        {/* Conversation list */}
        <ScrollArea className="flex-1 px-2 py-3">
          <AnimatePresence initial={false}>
            {conversations.map((conv, i) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === activeId}
                index={i}
                onSelect={() => {
                  onSelect(conv.id);
                  onClose();
                }}
                onDelete={() => onDelete(conv.id)}
              />
            ))}
          </AnimatePresence>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-white/6 px-4 py-4">
          <p className="text-xs text-zinc-600">
            {conversations.length} conversation
            {conversations.length !== 1 ? "s" : ""}
          </p>
        </div>
      </motion.aside>
    </>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  index: number;
  onSelect: () => void;
  onDelete: (id: string | undefined) => void;
}

function ConversationItem({
  conversation,
  isActive,
  index,
  onSelect,
  onDelete,
}: ConversationItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16, height: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="group relative mb-0.5"
    >
      <button
        onClick={onSelect}
        className={cn(
          "w-full rounded-lg px-3 py-2.5 text-left transition-all duration-150",
          "flex items-start gap-3",
          isActive
            ? "bg-violet-500/15 text-white ring-1 ring-violet-500/20"
            : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200",
        )}
      >
        <MessageSquare
          className={cn(
            "mt-0.5 h-3.5 w-3.5 shrink-0",
            isActive ? "text-violet-400" : "text-zinc-600",
          )}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-snug">
            {truncate(conversation.title, 28)}
          </p>
          <p className="mt-0.5 text-xs text-zinc-600">
            {formatRelativeTime(conversation.updatedAt)}
            {conversation.messages.length > 0 &&
              ` · ${conversation.messages.length} msg`}
          </p>
        </div>
      </button>

      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(conversation.id);
        }}
        className={cn(
          "absolute right-1.5 top-1/2 -translate-y-1/2",
          "h-6 w-6 opacity-0 group-hover:opacity-100",
          "text-zinc-600 hover:text-red-400 hover:bg-red-500/10",
          "transition-opacity duration-150",
        )}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </motion.div>
  );
}
