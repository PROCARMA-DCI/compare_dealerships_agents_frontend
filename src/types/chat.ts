export type MessageRole = "user" | "assistant" | "system";

export type MessageStatus = "sending" | "streaming" | "done" | "error";

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  result?: string;
  status: "pending" | "running" | "done" | "error";
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  timestamp: Date;
  toolCalls?: ToolCall[];
  tokens?: number;
  model?: string;
}

export interface Conversation {
  id: string;
  sessionId: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  model?: string;
}

export interface AgentConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  tools?: string[];
}

export interface ChatSettings {
  agent: AgentConfig;
  streamingEnabled: boolean;
  soundEnabled: boolean;
  compactMode: boolean;
}
