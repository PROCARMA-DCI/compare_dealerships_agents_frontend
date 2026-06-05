import { fetchPost } from "@/action/function";
import { Conversation, Message } from "@/types/chat";

export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function createMessage(
  role: Message["role"],
  content: string = "",
): Message {
  return {
    id: generateId(),
    role,
    content,
    status: role === "user" ? "done" : "sending",
    timestamp: new Date(),
  };
}

export function createConversation(title = "New Chat"): Conversation {
  return {
    id: generateId(),
    sessionId: generateId(),
    title,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

interface DatabaseChatResponse {
  success: boolean;
  data?: {
    session_id: string;
    blocked: boolean;
    result: string;
  };
  message?: string;
  detail?: string;
}

export async function sendDatabaseChatMessage({
  message,
  sessionId,
  signal,
  authToken,
}: {
  message: string;
  sessionId: string;
  signal?: AbortSignal;
  authToken?: string;
}) {
  const response = await fetchPost<
    { message: string; session_id: string },
    DatabaseChatResponse
  >({
    api: "database/chat",
    body: { message, session_id: sessionId },
    signal,
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
  });

  if (!response.success || !response.data) {
    throw new Error(response.detail || response.message || "Chat request failed");
  }

  return response.data;
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function truncate(str: string, max = 40): string {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

export function deriveTitle(firstMessage: string): string {
  return truncate(firstMessage.trim(), 36) || "New Chat";
}
