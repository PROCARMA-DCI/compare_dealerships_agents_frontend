"use client";

import { useChat } from "@/hooks/use-chat";
import { useState } from "react";

import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";

export function ChatWindow() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    conversations,
    activeConversation,
    activeId,
    setActiveId,
    isLoading,
    sendMessage,
    stopStreaming,
    newConversation,
    deleteConversation,
    clearMessages,
  } = useChat();

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      {/* <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={newConversation}
        onDelete={deleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      /> */}

      {/* Chat panel */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <ChatHeader
          conversation={activeConversation}
          isLoading={isLoading}
          onMenuToggle={() => setSidebarOpen((o) => !o)}
          onClear={clearMessages}
        />

        <MessageList messages={activeConversation.messages} />

        <ChatInput
          onSend={sendMessage}
          onStop={stopStreaming}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
