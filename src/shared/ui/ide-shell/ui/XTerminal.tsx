/**
 * xterm.js terminal wrapper for IDE terminal panels.
 * Provides a real terminal UI with ANSI colors, command input, and history.
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";

import type { TerminalLine } from "@/features/cli-terminal/model/types";

export type XTerminalHandle = {
  /** Write a line to the terminal */
  writeln: (text: string) => void;
  /** Write text without newline */
  write: (text: string) => void;
  /** Clear the terminal */
  clear: () => void;
  /** Focus the terminal */
  focus: () => void;
};

type XTerminalProps = {
  /** Called when user submits a command (presses Enter) */
  onCommand: (cmd: string) => TerminalLine[] | "clear";
  /** Welcome message shown on init */
  welcomeMessage?: string;
  /** Prompt string (default "$ ") */
  prompt?: string;
};

/** Convert TerminalLine type to ANSI color code */
const lineToAnsi = (line: TerminalLine): string => {
  switch (line.type) {
    case "success":
      return `\x1b[32m${line.text}\x1b[0m`; // green
    case "error":
      return `\x1b[31m${line.text}\x1b[0m`; // red
    case "warn":
      return `\x1b[33m${line.text}\x1b[0m`; // yellow
    case "info":
      return `\x1b[36m${line.text}\x1b[0m`; // cyan
    default:
      return line.text;
  }
};

export const XTerminal = forwardRef<XTerminalHandle, XTerminalProps>(
  ({ onCommand, welcomeMessage, prompt = "$ " }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const termRef = useRef<Terminal | null>(null);
    const fitRef = useRef<FitAddon | null>(null);
    const inputBuf = useRef("");
    const historyRef = useRef<string[]>([]);
    const historyIdx = useRef(-1);
    const onCommandRef = useRef(onCommand);
    onCommandRef.current = onCommand;

    const writePrompt = useCallback(() => {
      termRef.current?.write(`\x1b[36m${prompt}\x1b[0m`);
    }, [prompt]);

    useImperativeHandle(ref, () => ({
      writeln: (text: string) => termRef.current?.writeln(text),
      write: (text: string) => termRef.current?.write(text),
      clear: () => {
        termRef.current?.clear();
        writePrompt();
      },
      focus: () => termRef.current?.focus(),
    }));

    useEffect(() => {
      if (!containerRef.current) return;

      const term = new Terminal({
        theme: {
          background: "#060918",
          foreground: "#8892B0",
          cursor: "#16E0BD",
          cursorAccent: "#060918",
          selectionBackground: "#16e0bd30",
          black: "#1a1f40",
          red: "#EF4444",
          green: "#16E0BD",
          yellow: "#EAB308",
          blue: "#569CD6",
          magenta: "#C586C0",
          cyan: "#16E0BD",
          white: "#E2E8F0",
          brightBlack: "#4a5280",
          brightRed: "#F87171",
          brightGreen: "#34D399",
          brightYellow: "#FDE047",
          brightBlue: "#7C5CFC",
          brightMagenta: "#F472B6",
          brightCyan: "#67E8F9",
          brightWhite: "#F8FAFC",
        },
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        fontSize: 13,
        lineHeight: 1.4,
        cursorBlink: true,
        cursorStyle: "bar",
        allowProposedApi: true,
        convertEol: true,
      });

      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();
      term.loadAddon(fitAddon);
      term.loadAddon(webLinksAddon);
      term.open(containerRef.current);

      // Initial fit
      try {
        fitAddon.fit();
      } catch {
        /* container not visible yet */
      }

      termRef.current = term;
      fitRef.current = fitAddon;

      // Welcome message
      if (welcomeMessage) {
        term.writeln(`\x1b[36m${welcomeMessage}\x1b[0m`);
      }
      term.write(`\x1b[36m${prompt}\x1b[0m`);

      // Handle input — data is a raw string (escape sequences for special keys)
      term.onData((data) => {
        switch (data) {
          case "\r": {
            // Enter
            const cmd = inputBuf.current.trim();
            term.writeln("");
            if (cmd) {
              historyRef.current.push(cmd);
              historyIdx.current = -1;

              const result = onCommandRef.current(cmd);
              if (result === "clear") {
                term.clear();
              } else {
                for (const line of result) {
                  term.writeln(lineToAnsi(line));
                }
              }
            }
            inputBuf.current = "";
            term.write(`\x1b[36m${prompt}\x1b[0m`);
            break;
          }
          case "\x7f": {
            // Backspace
            if (inputBuf.current.length > 0) {
              inputBuf.current = inputBuf.current.slice(0, -1);
              term.write("\b \b");
            }
            break;
          }
          case "\x1b[A": {
            // Up arrow — history
            if (historyRef.current.length === 0) break;
            if (historyIdx.current === -1) {
              historyIdx.current = historyRef.current.length - 1;
            } else if (historyIdx.current > 0) {
              historyIdx.current--;
            }
            // Clear current input
            const clearUp =
              "\b \b".repeat(inputBuf.current.length);
            term.write(clearUp);
            inputBuf.current = historyRef.current[historyIdx.current];
            term.write(inputBuf.current);
            break;
          }
          case "\x1b[B": {
            // Down arrow — history
            const clearDown =
              "\b \b".repeat(inputBuf.current.length);
            term.write(clearDown);
            if (
              historyIdx.current === -1 ||
              historyIdx.current >= historyRef.current.length - 1
            ) {
              historyIdx.current = -1;
              inputBuf.current = "";
            } else {
              historyIdx.current++;
              inputBuf.current = historyRef.current[historyIdx.current];
              term.write(inputBuf.current);
            }
            break;
          }
          case "\x03": {
            // Ctrl+C
            term.writeln("^C");
            inputBuf.current = "";
            term.write(`\x1b[36m${prompt}\x1b[0m`);
            break;
          }
          case "\x0c": {
            // Ctrl+L — clear
            term.clear();
            inputBuf.current = "";
            term.write(`\x1b[36m${prompt}\x1b[0m`);
            break;
          }
          default: {
            // Regular character input (filter out other escape sequences)
            if (data >= " " && !data.startsWith("\x1b")) {
              inputBuf.current += data;
              term.write(data);
            }
            break;
          }
        }
      });

      // Resize observer
      const observer = new ResizeObserver(() => {
        try {
          fitAddon.fit();
        } catch {
          /* ignore */
        }
      });
      observer.observe(containerRef.current);

      return () => {
        observer.disconnect();
        term.dispose();
        termRef.current = null;
        fitRef.current = null;
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          minHeight: 0,
        }}
      />
    );
  },
);

XTerminal.displayName = "XTerminal";
