import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "/" has no page of its own: the chat is the home of the app. proxy.ts then sends signed-out
  // visitors on to /login.
  async redirects() {
    return [{ source: "/", destination: "/chat", permanent: false }];
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
