import { type ReactNode, useState } from "react";

import clsx from "clsx";

import type { TerminalLine } from "@/features/cli-terminal/model/types";

import { XTerminal } from "./XTerminal";

type TerminalTab = "terminal" | "debug" | "console";

type TerminalPanelProps = {
  open: boolean;
  onClose: () => void;
  /** xterm.js command handler for the Terminal tab */
  onCommand?: (cmd: string) => TerminalLine[] | "clear";
  /** Welcome message for xterm.js terminal */
  welcomeMessage?: string;
  /** Debug tab content (ReactNode — e.g. emulator state) */
  debugContent?: ReactNode;
  /** Console tab content (ReactNode — e.g. serial output) */
  consoleContent?: ReactNode;
  tabLabels?: [string, string, string];
  badges?: Partial<Record<TerminalTab, number>>;
  /** Controlled height from vertical resize */
  height?: number;
};

export const TerminalPanel = ({
  open,
  onClose,
  onCommand,
  welcomeMessage,
  debugContent,
  consoleContent,
  tabLabels,
  badges,
  height,
}: TerminalPanelProps) => {
  const [activeTab, setActiveTab] = useState<TerminalTab>("terminal");

  const tabs: { id: TerminalTab; label: string }[] = [
    { id: "terminal", label: tabLabels?.[0] ?? "Terminal" },
    { id: "debug", label: tabLabels?.[1] ?? "Debug" },
    { id: "console", label: tabLabels?.[2] ?? "Console" },
  ];

  return (
    <div className={clsx("ide-terminal-panel", { open })} style={open && height ? { height: `${height}px` } : undefined}>
      <div className="ide-terminal-header">
        <div className="ide-term-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={clsx("ide-term-tab", {
                active: activeTab === tab.id,
              })}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {badges?.[tab.id] != null && badges[tab.id]! > 0 && (
                <span className="tab-badge">{badges[tab.id]}</span>
              )}
            </button>
          ))}
        </div>
        <button className="term-close" onClick={onClose}>
          &times;
        </button>
      </div>

      {/* Terminal tab — xterm.js */}
      <div
        className={clsx("ide-terminal-body", {
          active: activeTab === "terminal",
        })}
        data-tab="terminal"
      >
        {open && activeTab === "terminal" && onCommand && (
          <XTerminal
            onCommand={onCommand}
            welcomeMessage={welcomeMessage}
          />
        )}
      </div>

      {/* Debug tab — ReactNode content */}
      <div
        className={clsx("ide-terminal-body", {
          active: activeTab === "debug",
        })}
        data-tab="debug"
      >
        {debugContent}
      </div>

      {/* Console tab — ReactNode content */}
      <div
        className={clsx("ide-terminal-body", {
          active: activeTab === "console",
        })}
        data-tab="console"
      >
        {consoleContent}
      </div>
    </div>
  );
};
