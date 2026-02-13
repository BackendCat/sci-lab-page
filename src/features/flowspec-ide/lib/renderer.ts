import type { FlowMedia, FlowPages } from "./parser";

export type ChatMessage = {
  id: string;
  type: "bot" | "user" | "error";
  texts?: string[];
  content?: string;
  buttons?: { label: string; target: string }[];
  media?: FlowMedia[];
};

let msgCounter = 0;

const nextId = (): string => {
  msgCounter += 1;
  return `msg-${msgCounter}`;
};

export const renderPage = (
  pages: FlowPages,
  pageName: string,
): ChatMessage => {
  const page = pages[pageName];

  if (!page) {
    return {
      id: nextId(),
      type: "error",
      content: `Page "${pageName}" not found`,
    };
  }

  return {
    id: nextId(),
    type: "bot",
    texts: page.texts,
    buttons: page.buttons,
    media: page.media.length > 0 ? page.media : undefined,
  };
};

export const createUserMessage = (text: string): ChatMessage => ({
  id: nextId(),
  type: "user",
  content: text,
});

export const createBotReply = (text: string): ChatMessage => ({
  id: nextId(),
  type: "bot",
  content: text,
});

export const resetCounter = (): void => {
  msgCounter = 0;
};
