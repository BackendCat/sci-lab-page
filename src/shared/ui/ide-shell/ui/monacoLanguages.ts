/**
 * Custom Monaco language definitions for FlowSpec DSL, MCU Assembly, and MCU Spec.
 */

import type { Monaco } from "@monaco-editor/react";

export const registerCustomLanguages = (monaco: Monaco) => {
  /* ── FlowSpec DSL ── */
  if (!monaco.languages.getLanguages().some((l: { id: string }) => l.id === "flowspec")) {
    monaco.languages.register({ id: "flowspec", extensions: [".flow"] });
    monaco.languages.setMonarchTokensProvider("flowspec", {
      tokenizer: {
        root: [
          [/\/\/.*$/, "comment"],
          [/"[^"]*"/, "string"],
          [/'[^']*'/, "string"],
          [
            /\b(bot|page|button|text|keyboard|row|entry|hook|on|emit|state|let|if|else|for|return|import|export|from|deploy|config)\b/,
            "keyword",
          ],
          [
            /\b(beforeRoute|afterRender|onError|validate|track|compile|render|send|reply)\b/,
            "function",
          ],
          [/->/, "operator"],
          [/\b\d+(\.\d+)?\b/, "number"],
          [/[{}]/, "delimiter.bracket"],
          [/[[\]()]/, "delimiter"],
        ],
      },
    });
  }

  /* ── MCU Assembly ── */
  if (!monaco.languages.getLanguages().some((l: { id: string }) => l.id === "asm")) {
    monaco.languages.register({ id: "asm", extensions: [".asm", ".s"] });
    monaco.languages.setMonarchTokensProvider("asm", {
      tokenizer: {
        root: [
          [/;.*$/, "comment"],
          [
            /\b(LDI|ADD|SUB|AND|OR|XOR|CMP|JMP|JNZ|JZ|JC|CALL|RET|PUSH|POP|MOV|OUT|IN|NOP|HLT|SHL|SHR|INC|DEC|NOT|RJMP|BRNE|BREQ|SBI|CBI|HALT|LOAD|STORE)\b/,
            "keyword",
          ],
          [
            /\b(R[0-7]|SP|PC|SREG|PORTB|DDRB|PINB|TCCR0A|TCCR0B|TCNT0|OCR0A)\b/,
            "type",
          ],
          [/^\s*\w+:/, "tag"],
          [/\b0x[0-9A-Fa-f]+\b/, "number.hex"],
          [/\b\d+\b/, "number"],
          [/\.(org|byte|db|dw|def|equ|include|section|text|data|bss)\b/, "directive"],
        ],
      },
    });
  }

  /* ── MCU Spec (.mcuconf) ── */
  if (!monaco.languages.getLanguages().some((l: { id: string }) => l.id === "mcuconf")) {
    monaco.languages.register({ id: "mcuconf", extensions: [".mcuconf"] });
    monaco.languages.setMonarchTokensProvider("mcuconf", {
      tokenizer: {
        root: [
          [/;.*$/, "comment"],
          [/"[^"]*"/, "string"],
          [
            /\b(mcu|register|bit|flash|sram|init|set|high|low|output|input|bidir)\b/,
            "keyword",
          ],
          [/@\w+/, "tag"],
          [/\b0x[0-9A-Fa-f]+\b/, "number.hex"],
          [/\b\d+[KMG]?B?\b/, "number"],
          [/[{}[\]]/, "delimiter.bracket"],
        ],
      },
    });
  }

  /* ── Memory Map (.map) ── */
  if (!monaco.languages.getLanguages().some((l: { id: string }) => l.id === "memmap")) {
    monaco.languages.register({ id: "memmap", extensions: [".map"] });
    monaco.languages.setMonarchTokensProvider("memmap", {
      tokenizer: {
        root: [
          [/;.*$/, "comment"],
          [/\b0x[0-9A-Fa-f]+\b/, "number.hex"],
          [/\b\d+[KMG]?B?\b/, "number"],
          [/\|/, "delimiter"],
        ],
      },
    });
  }

  /* ── Makefile ── */
  if (!monaco.languages.getLanguages().some((l: { id: string }) => l.id === "makefile")) {
    monaco.languages.register({ id: "makefile", extensions: ["Makefile"] });
    monaco.languages.setMonarchTokensProvider("makefile", {
      tokenizer: {
        root: [
          [/#.*$/, "comment"],
          [/^\w+\s*[:+?]?=/, "variable"],
          [/^\w+:/, "tag"],
          [/\$\([^)]+\)/, "variable"],
          [/"[^"]*"/, "string"],
          [/'[^']*'/, "string"],
        ],
      },
    });
  }
};

/**
 * Detect Monaco language from file path.
 */
export const getLanguage = (path: string): string => {
  const name = path.split("/").pop() ?? path;

  // Exact filename matches
  if (name === "Makefile") return "makefile";

  // Extension-based
  if (name.endsWith(".ts") || name.endsWith(".tsx")) return "typescript";
  if (name.endsWith(".js") || name.endsWith(".jsx")) return "javascript";
  if (name.endsWith(".json")) return "json";
  if (name.endsWith(".yaml") || name.endsWith(".yml")) return "yaml";
  if (name.endsWith(".md")) return "markdown";
  if (name.endsWith(".css")) return "css";
  if (name.endsWith(".html")) return "html";
  if (name.endsWith(".asm") || name.endsWith(".s")) return "asm";
  if (name.endsWith(".flow")) return "flowspec";
  if (name.endsWith(".mcuconf")) return "mcuconf";
  if (name.endsWith(".map")) return "memmap";
  if (name.endsWith(".h") || name.endsWith(".c")) return "c";

  return "plaintext";
};
