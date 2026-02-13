import { useCallback, useEffect, useRef } from "react";

import clsx from "clsx";

import { useTerminal } from "@/features/cli-terminal/model/useTerminal";

import styles from "./CliTerminal.module.css";

const PROMPT_MARKER = "\x01PROMPT\x01";

export const CliTerminal = () => {
  const { output, input, setInput, handleKeyDown, historyLength } = useTerminal();
  const bodyRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll to bottom on new output */
  useEffect(() => {
    const el = bodyRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [output]);

  /* Glow border effect on mouse move */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = terminalRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    const angle =
      (Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2) * 180) /
      Math.PI;
    el.style.setProperty("--glow-x", `${x}%`);
    el.style.setProperty("--glow-y", `${y}%`);
    el.style.setProperty("--glow-angle", `${angle}deg`);
  }, []);

  const renderLine = (line: { type: string; text: string }, idx: number) => {
    /* Prompt lines are special: show $ ~/scilab-project <command> */
    if (line.text.startsWith(PROMPT_MARKER)) {
      const cmd = line.text.slice(PROMPT_MARKER.length);
      return (
        <div key={idx} className="term-line">
          <span className="prompt">$</span>{" "}
          <span className="path">~/scilab-project</span>{" "}
          <span className="cmd">{cmd}</span>
        </div>
      );
    }

    /* Linkify URLs in output */
    const urlRx = /(https?:\/\/[^\s]+)/g;
    const hasUrl = urlRx.test(line.text);

    if (hasUrl) {
      const parts = line.text.split(/(https?:\/\/[^\s]+)/g);
      return (
        <div key={idx} className={clsx("term-line", line.type)}>
          {parts.map((part, i) =>
            /^https?:\/\//.test(part) ? (
              <a
                key={i}
                href="#"
                style={{ color: "var(--ac3)", textDecoration: "underline", cursor: "pointer" }}
                onClick={(e) => e.preventDefault()}
              >
                {part}
              </a>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </div>
      );
    }

    return (
      <div key={idx} className={clsx("term-line", line.type)}>
        {line.text}
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div
        className="terminal"
        ref={terminalRef}
        onMouseMove={handleMouseMove}
      >
        {/* Header */}
        <div className="term-header">
          <div className="term-dots">
            <span />
            <span />
            <span />
          </div>
          <span style={{ fontSize: ".65rem", color: "var(--t3)", fontFamily: "'JetBrains Mono', monospace" }}>
            scilab-cli — zsh
          </span>
        </div>

        {/* Body */}
        <div className="term-body" ref={bodyRef}>
          {output.map((line, idx) => renderLine(line, idx))}

          {/* Input line */}
          <div className="term-input-line">
            <span className="prompt">$</span>{" "}
            <span className="path">~/scilab-project</span>
            <input
              className="term-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command..."
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>

        {/* Status bar */}
        <div className="term-status">
          <span>scilab-cli v2.4.1</span>
          <span>{historyLength} command{historyLength !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </div>
  );
};
