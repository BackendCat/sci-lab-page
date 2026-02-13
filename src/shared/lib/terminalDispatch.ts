import type { TerminalLine } from "@/features/cli-terminal/model/types";

type CommandHandler = () => TerminalLine[];

/**
 * Shared terminal command dispatch logic.
 * Each feature provides its own command map; this function handles
 * the common dispatch pattern (clear, echo, longest-prefix match, not-found).
 */
export const dispatchCommand = (
  raw: string,
  commands: Record<string, CommandHandler>,
): TerminalLine[] | "clear" => {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return [];
  if (cmd === "clear") return "clear";

  if (cmd.startsWith("echo ")) {
    return [{ type: "", text: raw.trim().substring(5) }];
  }

  const keys = Object.keys(commands).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (cmd === key || cmd.startsWith(key + " ")) {
      return commands[key]();
    }
  }

  return [
    { type: "error", text: "zsh: command not found: " + raw.trim().split(" ")[0] },
    { type: "", text: 'Type "help" for available commands.' },
  ];
};
