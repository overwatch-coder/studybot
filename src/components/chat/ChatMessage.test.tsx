import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ChatMessage from "./ChatMessage";

describe("ChatMessage", () => {
  it("renders AI markdown formatting instead of showing raw markdown characters", () => {
    const html = renderToStaticMarkup(
      <ChatMessage
        content={`# Study Notes\n\n- First point\n- **Important** detail`}
        sender="ai"
      />,
    );

    expect(html).toContain("<h1");
    expect(html).toContain("<ul");
    expect(html).toContain("<strong>Important</strong>");
    expect(html).not.toContain("**Important**");
  });

  it("renders fenced code blocks with syntax highlight classes", () => {
    const html = renderToStaticMarkup(
      <ChatMessage
        content={"```ts\nconst answer = 42;\n```"}
        sender="ai"
      />,
    );

    expect(html).toContain("<pre");
    expect(html).toContain("hljs");
    expect(html).toContain("language-ts");
    expect(html).not.toContain("```ts");
  });

  it("keeps AI messages inside a full-width lane", () => {
    const html = renderToStaticMarkup(
      <ChatMessage content="A long AI answer" sender="ai" />,
    );

    expect(html).toContain("w-full");
    expect(html).toContain("data-message-lane=\"ai\"");
  });

  it("uses a higher-contrast style for the system welcome message", () => {
    const html = renderToStaticMarkup(
      <ChatMessage content="Welcome to the chat" sender="system" />,
    );

    expect(html).toContain("data-message-lane=\"system\"");
    expect(html).toContain("text-foreground");
    expect(html).not.toContain("bg-muted/80 px-4 py-3 text-center text-sm text-muted-foreground");
  });
});