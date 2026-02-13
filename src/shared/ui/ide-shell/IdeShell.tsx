import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import clsx from "clsx";

import type { TerminalLine } from "@/features/cli-terminal/model/types";
import type { editor } from "monaco-editor";

import type { TabItem } from "./ui/TabBar";
import { ActivityBar, type ActivityId } from "./ui/ActivityBar";
import { Breadcrumbs } from "./ui/Breadcrumbs";
import { ExtensionsPanel } from "./ui/ExtensionsPanel";
import { GitPanel } from "./ui/GitPanel";
import { MenuBar, type MenuItemDef } from "./ui/MenuBar";
import { PaletteOverlay, type PaletteItem } from "./ui/PaletteOverlay";
import { SearchPanel } from "./ui/SearchPanel";
import { MobileViewToggle } from "./ui/MobileViewToggle";
import { StatusBar } from "./ui/StatusBar";
import { TabBar } from "./ui/TabBar";
import { TerminalPanel } from "./ui/TerminalPanel";

import styles from "./IdeShell.module.css";

type TerminalConfig = {
  onCommand?: (cmd: string) => TerminalLine[] | "clear";
  welcomeMessage?: string;
  debugContent?: ReactNode;
  consoleContent?: ReactNode;
  terminalTabLabels?: [string, string, string];
  badges?: Partial<Record<"terminal" | "debug" | "console", number>>;
};

type IdeShellProps = {
  id: string;
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onTabClose?: (id: string) => void;
  onRun: () => void;
  runLabel?: string;
  onStep?: () => void;
  stepLabel?: string;
  onReset?: () => void;
  resetLabel?: string;
  extraActions?: ReactNode;
  explorer: ReactNode;
  editor: ReactNode;
  preview: ReactNode;
  /** Optional right sidebar content (e.g. Designer property panel) */
  rightSidebar?: ReactNode;
  terminal?: TerminalConfig;
  statusLeft?: ReactNode;
  statusRight?: ReactNode;
  className?: string;
  children?: ReactNode;
  /** VFS file list for QuickOpen and SearchPanel */
  vfsFiles?: string[];
  /** VFS read function for search */
  vfsRead?: (path: string) => string | null;
  /** Open a file from QuickOpen/Search */
  onFileOpen?: (path: string) => void;
  /** Monaco editor ref for triggering commands from menus */
  editorRef?: React.RefObject<editor.IStandaloneCodeEditor | null>;
  /** Custom menu overrides per menu name */
  menuOverrides?: Partial<Record<string, MenuItemDef[]>>;
};

/* ── Default panel sizes ── */
const DEFAULT_SIDEBAR_W = 140;
const MIN_SIDEBAR_W = 100;
const MAX_SIDEBAR_W = 280;
const DEFAULT_PREVIEW_W = 280;
const MIN_PREVIEW_W = 160;
const DEFAULT_RIGHT_SIDEBAR_W = 220;
const MIN_RIGHT_SIDEBAR_W = 150;
const MAX_RIGHT_SIDEBAR_W = 320;
const MIN_EDITOR_W = 200;
const DEFAULT_TERMINAL_H = 160;
const MIN_TERMINAL_H = 60;


export const IdeShell = ({
  id,
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  onRun,
  runLabel = "Run",
  onStep,
  stepLabel = "Step",
  onReset,
  resetLabel = "Reset",
  extraActions,
  explorer,
  editor,
  preview,
  rightSidebar,
  terminal,
  statusLeft,
  statusRight,
  className,
  children,
  vfsFiles,
  vfsRead,
  onFileOpen,
  editorRef,
  menuOverrides,
}: IdeShellProps) => {
  const shellRef = useRef<HTMLDivElement>(null);
  const mainAreaRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [activeActivity, setActiveActivity] = useState<ActivityId | null>("explorer");
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [quickOpenOpen, setQuickOpenOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"code" | "preview">("code");

  /* ---- Resizable panel widths ---- */
  const [sidebarW, setSidebarW] = useState(DEFAULT_SIDEBAR_W);
  const [previewW, setPreviewW] = useState(DEFAULT_PREVIEW_W);
  const [rightSidebarW, setRightSidebarW] = useState(DEFAULT_RIGHT_SIDEBAR_W);
  const [terminalH, setTerminalH] = useState(DEFAULT_TERMINAL_H);
  const [resizing, setResizing] = useState<string | null>(null);

  /* ---- Compute grid template columns ---- */
  const gridColumns = useMemo(() => {
    const sideW = activeActivity === null ? 0 : sidebarW;
    const parts = [`40px`, `${sideW}px`, `4px`, `1fr`, `4px`, `${previewW}px`];
    if (rightSidebar) {
      parts.push(`4px`, `${rightSidebarW}px`);
    }
    return parts.join(" ");
  }, [activeActivity, sidebarW, previewW, rightSidebar, rightSidebarW]);

  /* ---- Generic resize handler factory ---- */
  const startResize = useCallback(
    (
      handle: string,
      setter: React.Dispatch<React.SetStateAction<number>>,
      getConstraints: () => { min: number; max: number },
      direction: "left" | "right",
    ) =>
      (e: ReactMouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;
        const el = mainAreaRef.current;
        if (!el) return;

        /* Capture the current value at drag start */
        let startW = 0;
        setter((prev) => {
          startW = prev;
          return prev;
        });

        setResizing(handle);

        const onMove = (ev: PointerEvent) => {
          const { min, max } = getConstraints();
          const delta = direction === "left"
            ? ev.clientX - startX
            : startX - ev.clientX;
          const next = Math.max(min, Math.min(max, startW + delta));
          setter(next);
        };

        const onUp = () => {
          setResizing(null);
          document.removeEventListener("pointermove", onMove);
          document.removeEventListener("pointerup", onUp);
        };

        document.addEventListener("pointermove", onMove);
        document.addEventListener("pointerup", onUp);
      },
    [],
  );

  const handleSidebarResize = useMemo(
    () =>
      startResize(
        "sidebar",
        setSidebarW,
        () => ({ min: MIN_SIDEBAR_W, max: MAX_SIDEBAR_W }),
        "left",
      ),
    [startResize],
  );

  const handlePreviewResize = useMemo(
    () =>
      startResize(
        "preview",
        setPreviewW,
        () => {
          const totalW = mainAreaRef.current?.clientWidth ?? 1200;
          const usedW = 40 + (activeActivity === null ? 0 : sidebarW) + 4 + 4 + (rightSidebar ? rightSidebarW + 4 : 0);
          return { min: MIN_PREVIEW_W, max: totalW - usedW - MIN_EDITOR_W };
        },
        "right",
      ),
    [startResize, activeActivity, sidebarW, rightSidebar, rightSidebarW],
  );

  const handleRightSidebarResize = useMemo(
    () =>
      startResize(
        "right",
        setRightSidebarW,
        () => ({ min: MIN_RIGHT_SIDEBAR_W, max: MAX_RIGHT_SIDEBAR_W }),
        "right",
      ),
    [startResize],
  );

  /* ---- Vertical resize: terminal height ---- */
  const handleTerminalResize = useCallback(
    (e: ReactMouseEvent) => {
      e.preventDefault();
      const startY = e.clientY;
      const shell = shellRef.current;
      if (!shell) return;

      let startH = 0;
      setTerminalH((prev) => { startH = prev; return prev; });
      setResizing("terminal");

      const onMove = (ev: PointerEvent) => {
        const maxH = Math.floor(shell.clientHeight * 0.5);
        const delta = startY - ev.clientY; // dragging up = terminal grows
        const next = Math.max(MIN_TERMINAL_H, Math.min(maxH, startH + delta));
        setTerminalH(next);
      };

      const onUp = () => {
        setResizing(null);
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
      };

      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    },
    [],
  );

  /* ---- Glow border tracking ---- */
  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    const angle =
      (Math.atan2(
        e.clientY - r.top - r.height / 2,
        e.clientX - r.left - r.width / 2,
      ) *
        180) /
      Math.PI;
    el.style.setProperty("--glow-x", `${x}%`);
    el.style.setProperty("--glow-y", `${y}%`);
    el.style.setProperty("--glow-angle", `${angle}deg`);
  }, []);

  /* ---- Fullscreen toggle ---- */
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  /* ---- Terminal toggle ---- */
  const toggleTerminal = useCallback(() => {
    setTerminalOpen((prev) => !prev);
  }, []);

  const openTermTab = useCallback(() => {
    setTerminalOpen(true);
  }, []);

  /* ---- Trigger Monaco editor action ---- */
  const triggerEditor = useCallback(
    (actionId: string) => {
      const ed = editorRef?.current;
      if (ed) {
        ed.focus();
        ed.trigger("menu", actionId, null);
      }
    },
    [editorRef],
  );

  /* ---- Menu definitions ---- */
  const menus = useMemo((): Record<string, MenuItemDef[]> => {
    const base: Record<string, MenuItemDef[]> = {
      File: [
        { label: "New File", shortcut: "Ctrl+N", action: () => {
          const name = prompt("File name:");
          if (name && onFileOpen) onFileOpen(name);
        }},
        { label: "New Folder", action: () => {
          const name = prompt("Folder name:");
          if (name && onFileOpen) onFileOpen(name + "/.keep");
        }},
        { separator: true },
        { label: "Open File...", shortcut: "Ctrl+O", action: () => setQuickOpenOpen(true) },
        { label: "Save", shortcut: "Ctrl+S", action: () => { /* VFS auto-saves */ } },
        { label: "Save All", shortcut: "Ctrl+Shift+S", action: () => { /* VFS auto-saves */ } },
        { separator: true },
        { label: "Auto Save", action: () => { /* always on */ }, disabled: true },
        { separator: true },
        { label: "Close Tab", shortcut: "Ctrl+W", action: () => onTabClose?.(activeTab) },
        { label: "Close All Tabs", action: () => {
          for (const t of tabs) onTabClose?.(t.id);
        }},
      ],
      Edit: [
        { label: "Undo", shortcut: "Ctrl+Z", action: () => triggerEditor("undo") },
        { label: "Redo", shortcut: "Ctrl+Shift+Z", action: () => triggerEditor("redo") },
        { separator: true },
        { label: "Cut", shortcut: "Ctrl+X", action: () => triggerEditor("editor.action.clipboardCutAction") },
        { label: "Copy", shortcut: "Ctrl+C", action: () => triggerEditor("editor.action.clipboardCopyAction") },
        { label: "Paste", shortcut: "Ctrl+V", action: () => triggerEditor("editor.action.clipboardPasteAction") },
        { separator: true },
        { label: "Find", shortcut: "Ctrl+F", action: () => triggerEditor("actions.find") },
        { label: "Replace", shortcut: "Ctrl+H", action: () => triggerEditor("editor.action.startFindReplaceAction") },
        { label: "Find in Files", shortcut: "Ctrl+Shift+F", action: () => setActiveActivity("search") },
        { separator: true },
        { label: "Toggle Line Comment", shortcut: "Ctrl+/", action: () => triggerEditor("editor.action.commentLine") },
        { label: "Toggle Block Comment", shortcut: "Ctrl+Shift+A", action: () => triggerEditor("editor.action.blockComment") },
        { separator: true },
        { label: "Format Document", shortcut: "Shift+Alt+F", action: () => triggerEditor("editor.action.formatDocument") },
        { label: "Trim Trailing Whitespace", action: () => triggerEditor("editor.action.trimTrailingWhitespace") },
      ],
      Selection: [
        { label: "Select All", shortcut: "Ctrl+A", action: () => triggerEditor("editor.action.selectAll") },
        { label: "Expand Selection", shortcut: "Shift+Alt+→", action: () => triggerEditor("editor.action.smartSelect.expand") },
        { label: "Shrink Selection", shortcut: "Shift+Alt+←", action: () => triggerEditor("editor.action.smartSelect.shrink") },
        { separator: true },
        { label: "Copy Line Up", shortcut: "Shift+Alt+↑", action: () => triggerEditor("editor.action.copyLinesUpAction") },
        { label: "Copy Line Down", shortcut: "Shift+Alt+↓", action: () => triggerEditor("editor.action.copyLinesDownAction") },
        { label: "Move Line Up", shortcut: "Alt+↑", action: () => triggerEditor("editor.action.moveLinesUpAction") },
        { label: "Move Line Down", shortcut: "Alt+↓", action: () => triggerEditor("editor.action.moveLinesDownAction") },
        { separator: true },
        { label: "Add Cursor Above", shortcut: "Ctrl+Alt+↑", action: () => triggerEditor("editor.action.insertCursorAbove") },
        { label: "Add Cursor Below", shortcut: "Ctrl+Alt+↓", action: () => triggerEditor("editor.action.insertCursorBelow") },
        { label: "Select All Occurrences", shortcut: "Ctrl+Shift+L", action: () => triggerEditor("editor.action.selectHighlights") },
      ],
      View: [
        { label: "Command Palette...", shortcut: "Ctrl+Shift+P", action: () => setCommandPaletteOpen(true) },
        { separator: true },
        { label: "Explorer", shortcut: "Ctrl+Shift+E", action: () => setActiveActivity(activeActivity === "explorer" ? null : "explorer") },
        { label: "Search", shortcut: "Ctrl+Shift+F", action: () => setActiveActivity(activeActivity === "search" ? null : "search") },
        { label: "Source Control", shortcut: "Ctrl+Shift+G", action: () => setActiveActivity(activeActivity === "git" ? null : "git") },
        { label: "Extensions", shortcut: "Ctrl+Shift+X", action: () => setActiveActivity(activeActivity === "extensions" ? null : "extensions") },
        { separator: true },
        { label: "Toggle Terminal", shortcut: "Ctrl+`", action: toggleTerminal },
        { label: "Toggle Sidebar", shortcut: "Ctrl+B", action: () => setActiveActivity((prev) => prev === null ? "explorer" : null) },
        { separator: true },
        { label: "Toggle Minimap", action: () => triggerEditor("editor.action.toggleMinimap") },
        { label: "Toggle Word Wrap", shortcut: "Alt+Z", action: () => triggerEditor("editor.action.toggleWordWrap") },
        { label: "Toggle Sticky Scroll", action: () => triggerEditor("editor.action.toggleStickyScroll") },
        { separator: true },
        { label: "Zoom In", shortcut: "Ctrl+=", action: () => triggerEditor("editor.action.fontZoomIn") },
        { label: "Zoom Out", shortcut: "Ctrl+-", action: () => triggerEditor("editor.action.fontZoomOut") },
        { label: "Reset Zoom", shortcut: "Ctrl+0", action: () => triggerEditor("editor.action.fontZoomReset") },
      ],
      Go: [
        { label: "Go to File...", shortcut: "Ctrl+P", action: () => setQuickOpenOpen(true) },
        { label: "Go to Line...", shortcut: "Ctrl+G", action: () => triggerEditor("editor.action.gotoLine") },
        { label: "Go to Symbol...", shortcut: "Ctrl+Shift+O", action: () => triggerEditor("editor.action.quickOutline") },
        { separator: true },
        { label: "Go to Definition", shortcut: "F12", action: () => triggerEditor("editor.action.revealDefinition") },
        { label: "Peek Definition", shortcut: "Alt+F12", action: () => triggerEditor("editor.action.peekDefinition") },
        { label: "Go to References", shortcut: "Shift+F12", action: () => triggerEditor("editor.action.goToReferences") },
        { separator: true },
        { label: "Go to Bracket", shortcut: "Ctrl+Shift+\\", action: () => triggerEditor("editor.action.jumpToBracket") },
        { label: "Go Back", shortcut: "Alt+←", action: () => triggerEditor("workbench.action.navigateBack") },
        { label: "Go Forward", shortcut: "Alt+→", action: () => triggerEditor("workbench.action.navigateForward") },
      ],
      Run: [
        { label: runLabel, shortcut: "F5", action: onRun },
        ...(onStep ? [{ label: stepLabel, shortcut: "F10", action: onStep }] : []),
        ...(onReset ? [{ label: resetLabel, action: onReset }] : []),
      ],
      Terminal: [
        { label: "New Terminal", shortcut: "Ctrl+Shift+`", action: openTermTab },
        { label: "Clear Terminal", action: () => { /* xterm handles clear internally */ } },
        { separator: true },
        { label: "Toggle Terminal", shortcut: "Ctrl+`", action: toggleTerminal },
      ],
      Help: [
        { label: "Keyboard Shortcuts", shortcut: "Ctrl+K Ctrl+S", action: () => setCommandPaletteOpen(true) },
        { label: "Welcome", action: () => { /* placeholder */ } },
        { separator: true },
        { label: "About", action: () => {
          alert("SCI-LAB IDE v1.0\nPowered by Monaco Editor + xterm.js");
        }},
      ],
    };

    // Apply overrides
    if (menuOverrides) {
      for (const [key, items] of Object.entries(menuOverrides)) {
        if (items) base[key] = items;
      }
    }

    return base;
  }, [tabs, activeTab, activeActivity, onTabClose, onRun, onStep, onReset, runLabel, stepLabel, resetLabel, triggerEditor, toggleTerminal, openTermTab, onFileOpen, menuOverrides]);

  /* ---- Command palette items ---- */
  const commandItems = useMemo((): PaletteItem[] => {
    const items: PaletteItem[] = [];
    for (const [category, menuItems] of Object.entries(menus)) {
      for (const item of menuItems) {
        if (item.separator || !item.action) continue;
        items.push({
          id: `${category}:${item.label}`,
          label: item.label,
          detail: category,
          shortcut: item.shortcut,
        });
      }
    }
    return items;
  }, [menus]);

  const handleCommandSelect = useCallback(
    (cmdId: string) => {
      const [category, label] = cmdId.split(":");
      const items = menus[category];
      const item = items?.find((i) => i.label === label);
      item?.action?.();
    },
    [menus],
  );

  /* ---- Quick open items ---- */
  const quickOpenItems = useMemo((): PaletteItem[] => {
    return (vfsFiles ?? []).map((f) => ({
      id: f,
      label: f.split("/").pop() ?? f,
      detail: f,
    }));
  }, [vfsFiles]);

  const handleQuickOpenSelect = useCallback(
    (fileId: string) => {
      onFileOpen?.(fileId);
    },
    [onFileOpen],
  );

  /* ---- Keyboard shortcuts ---- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.shiftKey && e.key === "P") {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }
      if (ctrl && e.key === "p") {
        e.preventDefault();
        setQuickOpenOpen(true);
        return;
      }
      if (ctrl && e.key === "`") {
        e.preventDefault();
        toggleTerminal();
        return;
      }
      if (ctrl && e.key === "w") {
        e.preventDefault();
        onTabClose?.(activeTab);
        return;
      }
      if (ctrl && e.key === "s") {
        e.preventDefault();
        return;
      }
      if (e.key === "F5") {
        e.preventDefault();
        onRun();
        return;
      }
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
        return;
      }

      /* Alt+Arrow: prevent browser back/forward, trigger Monaco actions instead */
      if (
        e.altKey &&
        !e.ctrlKey && !e.shiftKey && !e.metaKey &&
        (e.key === "ArrowLeft" || e.key === "ArrowRight" ||
         e.key === "ArrowUp" || e.key === "ArrowDown")
      ) {
        const t = e.target as HTMLElement;
        if (t?.closest(".ide")) {
          e.preventDefault();
          e.stopPropagation();
          /* Inside Monaco: Alt+Left/Right = start/end of document, Alt+Up/Down = move lines */
          if (t?.closest(".monaco-editor")) {
            switch (e.key) {
              case "ArrowLeft":  triggerEditor("cursorTop"); break;
              case "ArrowRight": triggerEditor("cursorBottom"); break;
              case "ArrowUp":    triggerEditor("editor.action.moveLinesUpAction"); break;
              case "ArrowDown":  triggerEditor("editor.action.moveLinesDownAction"); break;
            }
          }
        }
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [activeTab, onTabClose, onRun, toggleTerminal, isFullscreen]);

  /* ---- Sidebar content ---- */
  const sidebarContent = useMemo(() => {
    switch (activeActivity) {
      case "explorer":
        return explorer;
      case "search":
        return (
          <SearchPanel
            vfsFiles={vfsFiles ?? []}
            vfsRead={vfsRead ?? (() => null)}
            onResultClick={onFileOpen ?? (() => {})}
          />
        );
      case "git":
        return <GitPanel />;
      case "extensions":
        return <ExtensionsPanel />;
      default:
        return null;
    }
  }, [activeActivity, explorer, vfsFiles, vfsRead, onFileOpen]);

  const shell = (
    <div
      ref={shellRef}
      id={id}
      className={clsx("ide", styles.shell, className, {
        fullscreen: isFullscreen,
      })}
      onMouseMove={handleMouseMove}
    >
      {/* ---- Menu bar ---- */}
      <MenuBar menus={menus} />

      {/* ---- Header with tabs & actions ---- */}
      <div className="ide-header">
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          onTabClose={onTabClose}
        />
        <MobileViewToggle onViewChange={setMobileView} />
        <div className="ide-actions">
          {extraActions}
          {onStep && (
            <button className="ide-btn step" onClick={onStep}>
              &#9655; {stepLabel}
            </button>
          )}
          {onReset && (
            <button className="ide-btn reset" onClick={onReset}>
              &#8634; {resetLabel}
            </button>
          )}
          <button className="ide-btn run" onClick={onRun}>
            &#9654; {runLabel}
          </button>
          <button
            className="ide-btn expand"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Expand"}
          >
            {isFullscreen ? "✖" : "⛶"}
          </button>
        </div>
      </div>

      {/* ---- Main area: ActivityBar + Sidebar + [handle] + Editor + [handle] + Preview + [handle + RightSidebar] ---- */}
      <div
        ref={mainAreaRef}
        className={clsx("ide-main-area", {
          "sidebar-collapsed": activeActivity === null,
          resizing: resizing !== null,
        })}
        style={{ gridTemplateColumns: gridColumns }}
      >
        <ActivityBar active={activeActivity} onChange={setActiveActivity} />
        <div className="ide-sidebar">
          {sidebarContent}
        </div>

        {/* Resize handle: sidebar ↔ editor */}
        <div
          className={clsx("ide-resize-handle", resizing === "sidebar" && "dragging")}
          onPointerDown={handleSidebarResize}
        />

        <div className={clsx("ide-editor-area", styles.editorPane, mobileView === "preview" && "mobile-hidden")}>
          <Breadcrumbs filePath={activeTab} />
          <div className="ide-editor">
            {editor}
          </div>
        </div>

        {/* Resize handle: editor ↔ preview */}
        <div
          className={clsx("ide-resize-handle", resizing === "preview" && "dragging")}
          onPointerDown={handlePreviewResize}
        />

        <div className={clsx("ide-preview", styles.previewPane, mobileView === "preview" && "mobile-active")}>
          {preview}
        </div>

        {/* Optional right sidebar with resize handle */}
        {rightSidebar && (
          <>
            <div
              className={clsx("ide-resize-handle", resizing === "right" && "dragging")}
              onPointerDown={handleRightSidebarResize}
            />
            <div className="ide-right-sidebar">
              {rightSidebar}
            </div>
          </>
        )}
      </div>

      {/* ---- Vertical resize handle: editor ↔ terminal ---- */}
      {terminal && terminalOpen && (
        <div
          className={clsx("ide-resize-handle--vertical", resizing === "terminal" && "dragging")}
          onPointerDown={handleTerminalResize}
        />
      )}

      {/* ---- Terminal panel ---- */}
      {terminal && (
        <TerminalPanel
          open={terminalOpen}
          onClose={toggleTerminal}
          onCommand={terminal.onCommand}
          welcomeMessage={terminal.welcomeMessage}
          debugContent={terminal.debugContent}
          consoleContent={terminal.consoleContent}
          tabLabels={terminal.terminalTabLabels}
          badges={terminal.badges}
          height={terminalH}
        />
      )}

      {/* ---- Status bar ---- */}
      <StatusBar
        left={statusLeft}
        right={statusRight}
        onToggleTerminal={terminal ? toggleTerminal : undefined}
        onOpenConsole={terminal ? openTermTab : undefined}
        onOpenDebug={terminal ? openTermTab : undefined}
      />

      {/* ---- Command Palette overlay ---- */}
      <PaletteOverlay
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        items={commandItems}
        onSelect={handleCommandSelect}
        placeholder="Type a command..."
        prefix=">"
      />

      {/* ---- Quick Open overlay ---- */}
      <PaletteOverlay
        open={quickOpenOpen}
        onClose={() => setQuickOpenOpen(false)}
        items={quickOpenItems}
        onSelect={handleQuickOpenSelect}
        placeholder="Search files by name..."
      />

      {/* Extra children (e.g. context menu, confirm modal) */}
      {children}
    </div>
  );

  /* Portal to document body when fullscreen */
  if (isFullscreen) {
    return createPortal(shell, document.body);
  }

  return shell;
};

export { IdeShell as default };
export type { IdeShellProps, TabItem, TerminalConfig };
