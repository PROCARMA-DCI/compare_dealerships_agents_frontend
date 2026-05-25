# Agent Chat — Next.js 15 + shadcn/ui

A beautiful, production-grade chat interface for your FastAPI AI agent backend.

## Stack

| Layer     | Tech                      |
| --------- | ------------------------- |
| Framework | Next.js 15.2 (App Router) |
| Language  | TypeScript (strict)       |
| UI        | shadcn/ui components      |
| Animation | Motion (motion/react)     |
| Icons     | Lucide React              |
| Styling   | Tailwind CSS v4           |

---

## Project Structure

```
agent-chat/
├── app/
│   ├── layout.tsx          # Root layout (fonts, dark theme)
│   ├── page.tsx            # Entry → <ChatWindow />
│   └── globals.css         # CSS variables + scrollbar styles
│
├── components/
│   ├── chat/
│   │   ├── index.ts        # Barrel exports
│   │   ├── ChatWindow.tsx  # ✅ Root composer — put this in your page
│   │   ├── ChatHeader.tsx  # Top bar: title, status, actions
│   │   ├── MessageList.tsx # Scrollable messages + empty state
│   │   ├── MessageBubble.tsx # Individual message with animations
│   │   ├── ChatInput.tsx   # Textarea, send/stop, attach, mic
│   │   └── Sidebar.tsx     # Conversation list, new/delete
│   └── ui/                 # shadcn primitives
│       ├── button.tsx
│       ├── scroll-area.tsx
│       ├── separator.tsx
│       └── tooltip.tsx
│
├── hooks/
│   └── use-chat.ts         # All chat state, streaming, conversations
│
├── types/
│   └── chat.ts             # Message, Conversation, ToolCall types
│
└── lib/
    ├── utils.ts            # cn() helper
    └── utils-chat.ts       # generateId, formatTime, deriveTitle…
```

---

## Quick Start

```bash
npm install
npm run dev
```

---

## Connecting to Your FastAPI Backend

In `hooks/use-chat.ts`, replace the `simulateStream` call with a real fetch:

```ts
// Replace the simulated section with:
const res = await fetch(apiUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  signal: abortRef.current?.signal,
  body: JSON.stringify({
    message: content,
    conversation_id: convId,
    history: activeConversation.messages,
  }),
});

// Streaming (SSE / chunked):
const reader = res.body!.getReader();
const decoder = new TextDecoder();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  updateMessage(convId, assistantMsg.id, (m) => ({
    ...m,
    content: m.content + chunk,
  }));
}
```

---

## Adding Tool Call Display

`MessageBubble.tsx` already supports a `toolCalls` field on `Message`. To render them, add a `<ToolCallBadge />` component inside the bubble after the content paragraph.

---

## Key Design Decisions

- **Dark-first**: `#0a0a0d` base, violet-600 accent — refined and focused
- **Component isolation**: each file has one responsibility; easy to swap/extend
- **Motion everywhere**: enter animations, status dots, streaming cursor, suggestion chips
- **Streaming cursor**: inline blinking bar while `status === "streaming"`
- **Auto-scroll**: `useEffect` watches `messages` and scrolls to bottom smoothly
- **Mobile sidebar**: slide-in drawer with backdrop; desktop always visible at `lg:`

---

## Shadcn Components Used

- `Button` — all interactive controls
- `ScrollArea` — message list scroll container
- `Separator` — sidebar dividers
- `Tooltip` — header action tooltips

Install additional shadcn components as needed:

```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add badge
```
