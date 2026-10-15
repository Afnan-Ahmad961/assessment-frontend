// /chat: the booking conversation and the booking being built from it.
import type { Metadata } from "next";

import { ChatScreen } from "@/components/sections/chat/chat-screen";

export const metadata: Metadata = { title: "Chat" };

export default function ChatPage() {
  return <ChatScreen />;
}
