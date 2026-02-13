import { useCallback, useRef, useState } from "react";

import {
  Bot,
  type ChatOutput,
  InlineKeyboard,
  Keyboard,
  type KeyboardButton,
  MockAdapter,
} from "@/features/framework-ide/lib/scibotSdk";

import { DEFAULT_CODE } from "./defaults";

export const useFrameworkSdk = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [outputs, setOutputs] = useState<ChatOutput[]>([]);
  const [status, setStatus] = useState("Ready");
  const adapterRef = useRef<MockAdapter | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = useCallback(
    (source?: string) => {
      const src = source ?? code;
      setOutputs([]);

      /* Strip import/export lines */
      let processed = src;
      processed = processed.replace(
        /^import\s+\{[^}]*\}\s+from\s+['"][^'"]*['"];?\s*$/gm,
        "",
      );
      processed = processed.replace(
        /^import\s+\w+\s+from\s+['"][^'"]*['"];?\s*$/gm,
        "",
      );
      processed = processed.replace(
        /^import\s+['"][^'"]*['"];?\s*$/gm,
        "",
      );
      processed = processed.replace(/^export\s+default\s+/gm, "");
      processed = processed.replace(/^export\s+/gm, "");
      /* Strip `import type { ... } from '...'` */
      processed = processed.replace(
        /^import\s+type\s+\{[^}]*\}\s+from\s+['"][^'"]*['"];?\s*$/gm,
        "",
      );
      /* Strip TS type annotations (simple and complex types) */
      processed = processed.replace(
        /:\s*[A-Za-z_]\w*(?:<[^>]*>)?(?:\[\])?(?=[\s,;)\]}=])/g,
        "",
      );

      const collected: ChatOutput[] = [];
      const adapter = new MockAdapter((output) => {
        collected.push(output);
        setOutputs([...collected]);
      });
      adapterRef.current = adapter;

      try {
        /* Create a patched Bot that auto-attaches the mock adapter */
        const PatchedBot = function (
          this: Bot,
          opts?: { token?: string },
        ) {
          Bot.call(this, opts);
          this._adapter = adapter;
        } as unknown as typeof Bot;
        PatchedBot.prototype = Object.create(Bot.prototype);
        PatchedBot.prototype.constructor = PatchedBot;

        const fn = new Function(
          "Bot",
          "Keyboard",
          "InlineKeyboard",
          "process",
          processed,
        );
        fn(PatchedBot, Keyboard, InlineKeyboard, {
          env: { BOT_TOKEN: "mock-token" },
        });

        setStatus("Running · Mock adapter");
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : String(e);
        collected.push({ type: "error", text: message });
        setOutputs([...collected]);
        setStatus("Error");
      }
    },
    [code],
  );

  const sendMessage = useCallback((text: string) => {
    const adapter = adapterRef.current;
    if (!adapter?.bot) return;

    setOutputs((prev) => [...prev, { type: "user", text }]);

    setTimeout(() => {
      adapter.dispatchText(text);
    }, 150);
  }, []);

  const clickButton = useCallback((btn: KeyboardButton) => {
    const adapter = adapterRef.current;
    if (!adapter) return;
    adapter.clickButton(btn);
  }, []);

  const handleCodeChange = useCallback(
    (value: string) => {
      setCode(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => run(value), 800);
    },
    [run],
  );

  return {
    code,
    outputs,
    status,
    setCode: handleCodeChange,
    run,
    sendMessage,
    clickButton,
  };
};
