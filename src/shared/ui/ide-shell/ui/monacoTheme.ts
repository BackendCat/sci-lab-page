/**
 * Custom dark theme for Monaco Editor matching our IDE design.
 * Colors derived from globals.css: --code-bg, --ac, --t2, --t3, --border.
 */

import type { Monaco } from "@monaco-editor/react";

export const THEME_NAME = "scilab-dark";

export const defineScilabTheme = (monaco: Monaco) => {
  monaco.editor.defineTheme(THEME_NAME, {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6A9955", fontStyle: "italic" },
      { token: "keyword", foreground: "569CD6" },
      { token: "string", foreground: "CE9178" },
      { token: "number", foreground: "B5CEA8" },
      { token: "number.hex", foreground: "B5CEA8" },
      { token: "type", foreground: "4EC9B0" },
      { token: "function", foreground: "DCDCAA" },
      { token: "variable", foreground: "9CDCFE" },
      { token: "constant", foreground: "4FC1FF" },
      { token: "operator", foreground: "D4D4D4" },
      { token: "delimiter", foreground: "D4D4D4" },
      { token: "delimiter.bracket", foreground: "FFD700" },
      { token: "tag", foreground: "569CD6" },
      // ASM-specific
      { token: "directive", foreground: "C586C0", fontStyle: "bold" },
      { token: "register", foreground: "4EC9B0", fontStyle: "bold" },
      { token: "label", foreground: "DCDCAA", fontStyle: "bold" },
    ],
    colors: {
      "editor.background": "#080c1c",
      "editor.foreground": "#94a0be",
      "editor.lineHighlightBackground": "#0e122880",
      "editor.selectionBackground": "#16e0bd30",
      "editor.inactiveSelectionBackground": "#16e0bd15",
      "editorCursor.foreground": "#16E0BD",
      "editorWhitespace.foreground": "#1c2148",
      "editorIndentGuide.background": "#1c2148",
      "editorIndentGuide.activeBackground": "#2e3468",
      "editorLineNumber.foreground": "#56609880",
      "editorLineNumber.activeForeground": "#94a0be",
      "editorBracketMatch.background": "#16e0bd20",
      "editorBracketMatch.border": "#16e0bd60",
      "editorGutter.background": "#080c1c00",
      "editorWidget.background": "#0e1228",
      "editorWidget.border": "#ffffff0f",
      "editorSuggestWidget.background": "#0e1228",
      "editorSuggestWidget.border": "#ffffff0f",
      "editorSuggestWidget.selectedBackground": "#16e0bd20",
      "editorSuggestWidget.highlightForeground": "#16E0BD",
      "input.background": "#131736",
      "dropdown.background": "#0e1228",
      "list.hoverBackground": "#ffffff08",
      "list.activeSelectionBackground": "#16e0bd20",
      "scrollbarSlider.background": "#ffffff10",
      "scrollbarSlider.hoverBackground": "#ffffff20",
      "scrollbarSlider.activeBackground": "#ffffff30",
      "minimap.background": "#080c1c",
    },
  });
};
