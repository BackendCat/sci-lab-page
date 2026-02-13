import { useCallback, useRef, useState } from "react";

import { parseFlowSpec } from "@/features/flowspec-ide/lib/parser";
import type { FlowPages } from "@/features/flowspec-ide/lib/parser";
import {
  type ChatMessage,
  createBotReply,
  createUserMessage,
  renderPage,
  resetCounter,
} from "@/features/flowspec-ide/lib/renderer";
import type { PreviewTab } from "@/features/flowspec-ide/model/types";

import { DEFAULT_CODE } from "./defaults";

export const useFlowSpec = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPage, setCurrentPage] = useState("start");
  const [previewTab, setPreviewTab] = useState<PreviewTab>("chat");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = useCallback(
    (source?: string) => {
      const src = source ?? code;
      const pages = parseFlowSpec(src);
      const pageNames = Object.keys(pages);

      resetCounter();

      if (pageNames.length === 0) {
        setMessages([
          {
            id: "err-0",
            type: "error",
            content: "No pages found. Define: page name { ... }",
          },
        ]);
        return;
      }

      const entry = pageNames.includes("start") ? "start" : pageNames[0];
      setCurrentPage(entry);
      setMessages([renderPage(pages, entry)]);
    },
    [code],
  );

  const navigateTo = useCallback(
    (target: string) => {
      const pages = getPages();
      setCurrentPage(target);
      setMessages((prev) => [...prev, renderPage(pages, target)]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [code],
  );

  const sendMessage = useCallback(
    (text: string) => {
      const pages = getPages();
      const trimmed = text.trim();
      if (!trimmed) return;

      setMessages((prev) => [...prev, createUserMessage(trimmed)]);

      const currentP = pages[currentPage];
      if (currentP) {
        for (const btn of currentP.buttons) {
          if (btn.label.toLowerCase() === trimmed.toLowerCase()) {
            setCurrentPage(btn.target);
            setTimeout(() => {
              setMessages((prev) => [...prev, renderPage(pages, btn.target)]);
            }, 300);
            return;
          }
        }
      }

      if (trimmed.startsWith("/")) {
        const pg = trimmed.slice(1);
        if (pages[pg]) {
          setCurrentPage(pg);
          setTimeout(() => {
            setMessages((prev) => [...prev, renderPage(pages, pg)]);
          }, 300);
          return;
        }
      }

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          createBotReply(
            "Use the buttons above or type /start, /flowspec, etc.",
          ),
        ]);
      }, 300);
    },
    [code, currentPage],
  );

  const handleCodeChange = useCallback(
    (value: string) => {
      setCode(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => run(value), 500);
    },
    [run],
  );

  const getPages = useCallback((): FlowPages => parseFlowSpec(code), [code]);

  return {
    code,
    messages,
    currentPage,
    previewTab,
    setPreviewTab,
    setCode: handleCodeChange,
    run,
    navigateTo,
    sendMessage,
    getPages,
  };
};
