import { useCallback, useRef, useState } from "react";

import type { TerminalHistoryEntry, TerminalLine } from "@/features/cli-terminal/model/types";
import { processCommand } from "@/features/cli-terminal/lib/commands";

const INITIAL_OUTPUT: TerminalLine[] = [
  { type: "info", text: "SCI-LAB CLI v2.4.1 — Type help for available commands" },
];

export const useTerminal = () => {
  const [output, setOutput] = useState<TerminalLine[]>(INITIAL_OUTPUT);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TerminalHistoryEntry[]>([]);
  const historyIndexRef = useRef(-1);
  const commandCountRef = useRef(0);

  const executeCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      const commandLine: TerminalLine = {
        type: "",
        text: `\x01PROMPT\x01${trimmed}`,
      };

      const result = processCommand(raw);

      if (result === "clear") {
        setOutput([]);
      } else {
        setOutput((prev) => [...prev, commandLine, ...result]);
      }

      commandCountRef.current += 1;
      setHistory((prev) => [...prev, { command: trimmed, output: result === "clear" ? [] : result }]);
      historyIndexRef.current = -1;
      setInput("");
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        executeCommand(input);
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const hist = history;
        if (hist.length === 0) return;

        const newIdx =
          historyIndexRef.current === -1
            ? hist.length - 1
            : Math.max(0, historyIndexRef.current - 1);

        historyIndexRef.current = newIdx;
        setInput(hist[newIdx].command);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const hist = history;
        if (historyIndexRef.current === -1) return;

        const newIdx = historyIndexRef.current + 1;
        if (newIdx >= hist.length) {
          historyIndexRef.current = -1;
          setInput("");
        } else {
          historyIndexRef.current = newIdx;
          setInput(hist[newIdx].command);
        }
      }
    },
    [input, history, executeCommand],
  );

  return {
    output,
    input,
    setInput,
    handleKeyDown,
    commandCount: commandCountRef.current,
    historyLength: history.length,
  };
};
