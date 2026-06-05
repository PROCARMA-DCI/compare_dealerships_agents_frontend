"use client";

import { AuthData, clearAuth, getAuth } from "@/action/localStorage";
import { SignInModal } from "@/components/auth/SignInModal";
import { useChat } from "@/hooks/use-chat";
import { useEffect, useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";

export function ChatWindow() {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuth(getAuth());
    setAuthChecked(true);
  }, []);

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
  } = useChat({ authToken: auth?.token });

  if (!authChecked) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SignInModal open={!auth} onSuccess={(data) => setAuth(data)} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <ChatHeader
          conversation={activeConversation}
          isLoading={isLoading}
          onMenuToggle={() => {}}
          onClear={clearMessages}
          onLogout={() => { clearAuth(); setAuth(null); }}
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
