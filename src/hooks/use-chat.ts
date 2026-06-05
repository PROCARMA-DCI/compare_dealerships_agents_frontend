"use client";

import {
  createConversation,
  createMessage,
  deriveTitle,
  sendDatabaseChatMessage,
} from "@/lib/utils-chat";
import { Conversation, Message } from "@/types/chat";
import { useCallback, useRef, useState } from "react";

interface UseChatOptions {
  onError?: (err: Error) => void;
  authToken?: string;
}

export function useChat(options: UseChatOptions = {}) {
  const { onError, authToken } = options;

  const [conversations, setConversations] = useState<Conversation[]>(() => [
    createConversation("Dealership Assistant"),
  ]);
  const [activeId, setActiveId] = useState<string>(
    () => conversations[0]?.id ?? "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const activeConversation =
    conversations.find((c) => c.id === activeId) ?? conversations[0];

  const updateConversation = useCallback(
    (id: string, updater: (c: Conversation) => Conversation) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? updater(c) : c)),
      );
    },
    [],
  );

  const updateMessage = useCallback(
    (convId: string, msgId: string, updater: (m: Message) => Message) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === msgId ? updater(m) : m,
                ),
                updatedAt: new Date(),
              }
            : c,
        ),
      );
    },
    [],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      const message = content.trim();
      if (!message || isLoading) return;

      // Every UI conversation keeps one backend session id.
      // Sending the same session_id means "continue this chat".
      const convId = activeId;
      const conversation = conversations.find((c) => c.id === convId);
      if (!conversation) return;

      const backendSessionId = conversation.sessionId;

      // Add the user's message and an empty assistant bubble immediately.
      // The assistant bubble shows the loading dots until the API returns.
      const userMsg = createMessage("user", message);
      const assistantMsg: Message = {
        ...createMessage("assistant"),
        status: "streaming",
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
          const newMessages = [...c.messages, userMsg, assistantMsg];
          return {
            ...c,
            messages: newMessages,
            title: c.messages.length === 0 ? deriveTitle(message) : c.title,
            updatedAt: new Date(),
          };
        }),
      );

      setIsLoading(true);

      // Used by the stop button to cancel this request.
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        // Backend expects exactly these fields:
        // { message: string, session_id: string }
        const result = await sendDatabaseChatMessage({
          message,
          sessionId: backendSessionId,
          signal: controller.signal,
          authToken,
        });

        // Keep the backend session id returned by the API.
        // This makes the next message continue the same backend chat.
        updateConversation(convId, (c) => ({
          ...c,
          sessionId: result.session_id,
          updatedAt: new Date(),
        }));

        // Put data.result into the assistant bubble.
        updateMessage(convId, assistantMsg.id, (m) => ({
          ...m,
          content: result.result,
          status: "done",
        }));
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));

        // Stop button cancelled the request.
        if (error.name === "AbortError") {
          updateMessage(convId, assistantMsg.id, (m) => ({
            ...m,
            content: "Request stopped.",
            status: "done",
          }));
          return;
        }

        // API failed or returned an invalid response.
        updateMessage(convId, assistantMsg.id, (m) => ({
          ...m,
          content: "Something went wrong. Please try again.",
          status: "error",
        }));
        onError?.(error);
      } finally {
        abortRef.current = null;
        setIsLoading(false);
      }
    },
    [
      activeId,
      conversations,
      isLoading,
      updateConversation,
      updateMessage,
      onError,
      authToken,
    ],
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  const newConversation = useCallback(() => {
    const conv = createConversation("New Chat");
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (next.length === 0) {
          const fresh = createConversation("New Chat");
          setActiveId(fresh.id);
          return [fresh];
        }
        if (id === activeId) setActiveId(next[0].id);
        return next;
      });
    },
    [activeId],
  );

  const clearMessages = useCallback(() => {
    updateConversation(activeId, (c) => ({
      ...c,
      messages: [],
      title: "New Chat",
      updatedAt: new Date(),
    }));
  }, [activeId, updateConversation]);

  return {
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
  };
}
