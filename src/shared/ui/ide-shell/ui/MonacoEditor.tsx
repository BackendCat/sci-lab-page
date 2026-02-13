/**
 * Shared Monaco Editor wrapper for all IDE components.
 * Handles multi-file model management, view state preservation, custom themes, and language registration.
 */

import { useCallback, useEffect, useRef } from "react";

import Editor, { type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

import { defineScilabTheme, THEME_NAME } from "./monacoTheme";
import { getLanguage, registerCustomLanguages } from "./monacoLanguages";

type MonacoEditorProps = {
  /** Relative file path used as model URI (e.g. "src/app.ts") */
  filePath: string;
  /** Current file content from VFS */
  value: string;
  /** Called when user edits the file */
  onChange: (value: string) => void;
  /** Optional extra type definitions to inject (e.g. @scibot/sdk types) */
  extraLibs?: { content: string; filePath: string }[];
  /** Called when editor mounts */
  onMount?: (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => void;
  /** Whether to show the minimap (default: true) */
  minimap?: boolean;
  /** Expose editor instance to parent for command palette / menu actions */
  editorRefOut?: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
};

// Shared across all MonacoEditor instances — registered once
let languagesRegistered = false;

export const MonacoEditor = ({
  filePath,
  value,
  onChange,
  extraLibs,
  onMount,
  minimap = true,
  editorRefOut,
}: MonacoEditorProps) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const viewStatesRef = useRef<Map<string, editor.ICodeEditorViewState | null>>(
    new Map(),
  );
  const prevFileRef = useRef(filePath);
  const isInternalChange = useRef(false);

  const language = getLanguage(filePath);
  const modelUri = `file:///${filePath}`;

  /* ── Before Monaco mounts: register theme + custom languages ── */
  const handleBeforeMount = useCallback(
    (monaco: Monaco) => {
      defineScilabTheme(monaco);

      if (!languagesRegistered) {
        registerCustomLanguages(monaco);
        languagesRegistered = true;
      }

      // TypeScript compiler options
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        moduleResolution:
          monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
        allowJs: true,
        strict: true,
        esModuleInterop: true,
        allowNonTsExtensions: true,
      });

      // Inject extra type definitions
      if (extraLibs) {
        for (const lib of extraLibs) {
          monaco.languages.typescript.typescriptDefaults.addExtraLib(
            lib.content,
            lib.filePath,
          );
        }
      }
    },
    [extraLibs],
  );

  /* ── On mount: store refs + custom keybindings ── */
  const handleMount = useCallback(
    (ed: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      editorRef.current = ed;
      monacoRef.current = monaco;
      if (editorRefOut) editorRefOut.current = ed;

      // Alt+Left → cursor to line start (like Sublime / VS Code)
      ed.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.LeftArrow, () => {
        ed.trigger("keyboard", "cursorHome", null);
      });

      // Alt+Right → cursor to line end
      ed.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.RightArrow, () => {
        ed.trigger("keyboard", "cursorEnd", null);
      });

      // Alt+Shift+Left → select to line start
      ed.addCommand(monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.LeftArrow, () => {
        ed.trigger("keyboard", "cursorHomeSelect", null);
      });

      // Alt+Shift+Right → select to line end
      ed.addCommand(monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.RightArrow, () => {
        ed.trigger("keyboard", "cursorEndSelect", null);
      });

      onMount?.(ed, monaco);
    },
    [onMount, editorRefOut],
  );

  /* ── Switch models when filePath changes ── */
  useEffect(() => {
    const ed = editorRef.current;
    const monaco = monacoRef.current;
    if (!ed || !monaco) return;

    const prevFile = prevFileRef.current;
    if (prevFile === filePath) return;

    // Save view state for previous file
    viewStatesRef.current.set(prevFile, ed.saveViewState());

    // Get or create model for new file
    const uri = monaco.Uri.parse(`file:///${filePath}`);
    let model = monaco.editor.getModel(uri);
    if (!model) {
      model = monaco.editor.createModel(value, getLanguage(filePath), uri);
    } else if (model.getValue() !== value) {
      isInternalChange.current = true;
      model.setValue(value);
      isInternalChange.current = false;
    }

    ed.setModel(model);

    // Restore view state
    const savedState = viewStatesRef.current.get(filePath);
    if (savedState) ed.restoreViewState(savedState);

    ed.focus();
    prevFileRef.current = filePath;
  }, [filePath, value]);

  /* ── Sync external value changes (e.g., VFS reset) ── */
  useEffect(() => {
    const ed = editorRef.current;
    if (!ed) return;
    const model = ed.getModel();
    if (!model) return;

    if (model.getValue() !== value && !isInternalChange.current) {
      isInternalChange.current = true;
      model.setValue(value);
      isInternalChange.current = false;
    }
  }, [value]);

  /* ── Handle changes ── */
  const handleChange = useCallback(
    (val: string | undefined) => {
      if (isInternalChange.current) return;
      onChange(val ?? "");
    },
    [onChange],
  );

  return (
    <Editor
      height="100%"
      theme={THEME_NAME}
      language={language}
      path={modelUri}
      value={value}
      onChange={handleChange}
      beforeMount={handleBeforeMount}
      onMount={handleMount}
      loading={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "var(--t3)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: ".7rem",
          }}
        >
          Loading editor...
        </div>
      }
      options={{
        fontSize: 12,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        fontLigatures: true,
        lineHeight: 20,
        tabSize: 2,
        minimap: { enabled: minimap },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        renderLineHighlight: "line",
        occurrencesHighlight: "off",
        selectionHighlight: false,
        bracketPairColorization: { enabled: true, independentColorPoolPerBracketType: true },
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        formatOnPaste: true,
        wordWrap: "off",
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
        padding: { top: 8, bottom: 8 },
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        renderWhitespace: "none",
        glyphMargin: false,
        folding: true,
        lineNumbers: "on",
        lineDecorationsWidth: 8,
        lineNumbersMinChars: 3,
        stickyScroll: { enabled: true },
        parameterHints: { enabled: true },
        inlineSuggest: { enabled: true },
        guides: {
          bracketPairs: true,
          indentation: true,
          highlightActiveIndentation: true,
        },
        suggest: {
          preview: true,
          showMethods: true,
          showFunctions: true,
          showConstructors: true,
          showFields: true,
          showVariables: true,
          showClasses: true,
          showInterfaces: true,
          showModules: true,
          showProperties: true,
          showKeywords: true,
          showSnippets: true,
        },
      }}
    />
  );
};
