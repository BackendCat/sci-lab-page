export type TerminalLineType = "success" | "warn" | "error" | "info" | "";

export type TerminalLine = { type: TerminalLineType; text: string };

export type TerminalHistoryEntry = { command: string; output: TerminalLine[] };
