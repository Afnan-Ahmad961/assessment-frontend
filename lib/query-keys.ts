// TanStack Query keys, in one place so cache reads and invalidations always match.

export const queryKeys = {
  /** The conversation on screen: its session and messages. */
  currentChat: ["chat", "current"] as const,
  services: ["services"] as const,
  availability: (serviceId: string, date: string) => ["availability", serviceId, date] as const,
};

export const mutationKeys = {
  sendMessage: ["chat", "send-message"] as const,
};
