import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";

import clsx from "clsx";
import type { editor } from "monaco-editor";

import { useVfs, type VfsFileMap } from "@/shared/lib/vfs";
import { IdeShell, type TabItem } from "@/shared/ui/ide-shell/IdeShell";
import { FileExplorer } from "@/shared/ui/ide-shell/ui/FileExplorer";
import { MonacoEditor } from "@/shared/ui/ide-shell/ui/MonacoEditor";
import { ContextMenu, type ContextMenuItem } from "@/shared/ui/ide-shell/ui/ContextMenu";
import { useConfirm } from "@/shared/ui/ide-shell/ui/ConfirmModal";
import { downloadFlowSpecPDF } from "@/shared/lib/pdfGenerator";

import { parseFlowSpec } from "@/features/flowspec-ide/lib/parser";
import { useFlowSpec } from "@/features/flowspec-ide/model/useFlowSpec";
import { processFlowSpecCommand } from "@/features/flowspec-ide/lib/terminalCommands";

import { ChatPreview } from "./ChatPreview";
import { DesignerPropertyPanel } from "./designer/DesignerPropertyPanel";
import styles from "./FlowSpecIde.module.css";

const Designer = lazy(() =>
  import("./designer/Designer").then((m) => ({ default: m.Designer })),
);

const DEFAULT_VFS_FILES: VfsFileMap = {
  "src/flowspec.flow": `bot "SciBot" {
  page start {
    image "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='160'%3E%3Crect fill='%230a1628' width='320' height='160'/%3E%3Ctext x='160' y='85' fill='%2316e0bd' font-family='sans-serif' font-size='20' text-anchor='middle'%3ESCI-LAB%3C/text%3E%3C/svg%3E" "SCI-LAB Platform"
    text "Welcome to SCI-LAB"
    text "Choose a system to explore:"
    button "FlowSpec Engine" -> flowspec
    button "MCU Emulator" -> mcu
    button "Workspace" -> workspace
    button "Media Demo" -> media
  }

  page flowspec {
    text "FlowSpec v3.2.1"
    text "DSL-driven bot infrastructure"
    text "Compiler + Runtime + Hot-reload"
    document "docs/flowspec-api.pdf" "FlowSpec API Reference"
    button "Deploy Now" -> deploy
    button "Back" -> start
  }

  page mcu {
    text "MCU Emulator Core"
    text "Cycle-accurate register simulation"
    image "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='140'%3E%3Crect fill='%230a1628' width='280' height='140'/%3E%3Ctext x='140' y='75' fill='%23c586c0' font-family='sans-serif' font-size='16' text-anchor='middle'%3EMCU Diagram%3C/text%3E%3C/svg%3E" "Architecture overview"
    button "Run Emulator" -> deploy
    button "Back" -> start
  }

  page workspace {
    text "Distributed Workspace v2.0"
    text "CRDT sync + Event sourcing"
    button "Open Workspace" -> deploy
    button "Back" -> start
  }

  page media {
    sticker "🤖"
    text "Media capabilities demo:"
    image "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='180'%3E%3Crect fill='%230a1628' width='280' height='180'/%3E%3Ctext x='140' y='95' fill='%23569cd6' font-family='sans-serif' font-size='16' text-anchor='middle'%3EPhoto%3C/text%3E%3C/svg%3E" "Bot-generated image"
    audio "notification.mp3"
    video "demo.mp4" "Tutorial video"
    location "40.7128,-74.0060" "SCI-LAB HQ, New York"
    document "report.pdf" "Monthly Analytics Report"
    button "Back" -> start
  }

  page deploy {
    text "Deploying to staging..."
    text "Worker pool: 4 instances"
    text "Status: healthy"
    sticker "✅"
    button "Restart" -> start
  }
}`,
  "src/hooks.ts": `// FlowSpec lifecycle hooks
export const beforeRoute = (ctx) => {
  console.log('Route:', ctx.page);
  return true;
};

export const afterRender = (ctx) => {
  // Track analytics
};

export const onError = (err, ctx) => {
  console.error('FlowSpec error:', err);
};`,
  "config/deploy.yaml": `# Deploy configuration
name: scibot-flowspec
target: staging
replicas: 2
health_check: /health
rollback: true`,
  "config/hooks.config.ts": `export default {
  beforeRoute: './src/hooks#beforeRoute',
  afterRender: './src/hooks#afterRender',
  onError: './src/hooks#onError',
};`,
  "package.json": `{
  "name": "scibot-flowspec",
  "version": "0.3.1",
  "private": true,
  "scripts": {
    "dev": "scilab dev",
    "build": "scilab flow compile src/flowspec.flow",
    "deploy": "scilab deploy --env staging"
  },
  "dependencies": {
    "@scilab/cli": "^2.4.1",
    "@scilab/runtime": "^3.2.0"
  }
}`,
  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true
  },
  "include": ["src/**/*"]
}`,
  "README.md": `# SciBot FlowSpec Project
A demo bot built with FlowSpec DSL.

## Quick Start
\`\`\`
scilab dev
\`\`\``,
};

const MAIN_FILE = "src/flowspec.flow";
const PROTECTED_FILES = new Set([MAIN_FILE]);

export const FlowSpecIde = () => {
  const vfsOps = useVfs("scibot-project", DEFAULT_VFS_FILES);
  const {
    messages,
    previewTab,
    setPreviewTab,
    run,
    navigateTo,
    sendMessage,
    setCode,
  } = useFlowSpec();

  /* ── Open tabs & active file ── */
  const [openFiles, setOpenFiles] = useState<string[]>([MAIN_FILE]);
  const [activeFile, setActiveFile] = useState(MAIN_FILE);
  const [dirtyFiles, setDirtyFiles] = useState<Set<string>>(new Set());

  /* ── Designer selected node (lifted from Designer for IDE right sidebar) ── */
  const [selectedDesignerNode, setSelectedDesignerNode] = useState<string | null>(null);

  /* ── Context menu ── */
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; path: string } | null>(null);
  const { confirm, modal: confirmModal } = useConfirm();

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const hasInitialized = useRef(false);

  /* ── Active file content ── */
  const currentCode = useMemo(
    () => vfsOps.read(activeFile) ?? "",
    [vfsOps, activeFile, vfsOps.revision],
  );

  const pages = useMemo(() => parseFlowSpec(currentCode), [currentCode]);

  /* ── Handle code edit ── */
  const handleInput = useCallback(
    (val: string) => {
      vfsOps.write(activeFile, val);
      setDirtyFiles((prev) => new Set(prev).add(activeFile));
      if (activeFile === MAIN_FILE) {
        setCode(val);
      }
    },
    [activeFile, vfsOps, setCode],
  );

  /* ── Visual editor code sync ── */
  const handleDesignerCodeChange = useCallback(
    (newCode: string) => {
      vfsOps.write(MAIN_FILE, newCode);
      setDirtyFiles((prev) => new Set(prev).add(MAIN_FILE));
      setCode(newCode);
      /* Update Monaco if it's showing the main file */
      if (activeFile === MAIN_FILE && editorRef.current) {
        const model = editorRef.current.getModel();
        if (model && model.getValue() !== newCode) {
          model.setValue(newCode);
        }
      }
    },
    [vfsOps, setCode, activeFile],
  );

  /* ── Run FlowSpec ── */
  const handleRun = useCallback(() => {
    const code = vfsOps.read(MAIN_FILE) ?? "";
    run(code);
  }, [vfsOps, run]);

  /* ── Initial run ── */
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      const code = vfsOps.read(MAIN_FILE) ?? "";
      setCode(code);
      setTimeout(() => run(code), 300);
    }
  }, [run, vfsOps, setCode]);

  /* ── File explorer actions ── */
  const handleFileSelect = useCallback(
    (path: string) => {
      setActiveFile(path);
      if (!openFiles.includes(path)) {
        setOpenFiles((prev) => [...prev, path]);
      }
    },
    [openFiles],
  );

  const handleTabClose = useCallback(
    (id: string) => {
      if (PROTECTED_FILES.has(id) && openFiles.length === 1) return;
      const next = openFiles.filter((f) => f !== id);
      setOpenFiles(next);
      if (activeFile === id) {
        setActiveFile(next[next.length - 1] ?? MAIN_FILE);
      }
      setDirtyFiles((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    },
    [openFiles, activeFile],
  );

  /* ── Context menu handlers ── */
  const handleContextMenu = useCallback((e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, path });
  }, []);

  const closeCtxMenu = useCallback(() => setCtxMenu(null), []);

  const doRename = useCallback((path: string) => {
    const parts = path.split("/");
    const oldName = parts.pop()!;
    const newName = prompt("New name:", oldName);
    if (newName && newName !== oldName) {
      const newPath = [...parts, newName].join("/");
      vfsOps.rename(path, newPath);
      setOpenFiles((prev) => prev.map((f) => (f === path ? newPath : f)));
      if (activeFile === path) setActiveFile(newPath);
    }
  }, [vfsOps, activeFile]);

  const ctxMenuItems = useMemo((): ContextMenuItem[] => {
    if (!ctxMenu) return [];
    const { path } = ctxMenu;
    const isProtected = PROTECTED_FILES.has(path);
    const isFolder = vfsOps.read(path) === null && vfsOps.listAll().some(f => f.startsWith(path + "/"));

    if (isFolder) {
      return [
        { label: "New File...", action: () => {
          const name = prompt("File name:");
          if (name) {
            const fullPath = path + "/" + name;
            vfsOps.write(fullPath, "");
            handleFileSelect(fullPath);
          }
        }},
        { label: "New Folder...", action: () => {
          const name = prompt("Folder name:");
          if (name) vfsOps.write(path + "/" + name + "/.keep", "");
        }},
        { label: "", separator: true, action: () => {} },
        { label: "Copy Path", action: () => navigator.clipboard.writeText(path) },
        { label: "", separator: true, action: () => {} },
        { label: "Rename Folder...", shortcut: "F2", action: () => doRename(path) },
        { label: "", separator: true, action: () => {} },
        { label: "Delete Folder", danger: true, action: async () => {
          if (await confirm("Delete Folder", `Delete "${path}" and all its contents?`)) vfsOps.del(path);
        }},
      ];
    }

    return [
      { label: "Open", action: () => handleFileSelect(path) },
      { label: "", separator: true, action: () => {} },
      { label: "Cut", shortcut: "Ctrl+X", action: () => navigator.clipboard.writeText(vfsOps.read(path) ?? "") },
      { label: "Copy", shortcut: "Ctrl+C", action: () => navigator.clipboard.writeText(vfsOps.read(path) ?? "") },
      { label: "Duplicate", action: () => {
        const parts = path.split("/");
        const name = parts.pop()!;
        const ext = name.includes(".") ? "." + name.split(".").pop() : "";
        const base = ext ? name.slice(0, -ext.length) : name;
        const newPath = [...parts, `${base} copy${ext}`].join("/");
        vfsOps.write(newPath, vfsOps.read(path) ?? "");
        handleFileSelect(newPath);
      }},
      { label: "", separator: true, action: () => {} },
      { label: "Copy Path", action: () => navigator.clipboard.writeText(path) },
      { label: "Copy Relative Path", action: () => navigator.clipboard.writeText(path) },
      { label: "", separator: true, action: () => {} },
      { label: "Rename...", shortcut: "F2", action: () => doRename(path) },
      ...(!isProtected
        ? [
            { label: "" as string, separator: true as const, action: () => {} },
            {
              label: "Delete",
              danger: true,
              shortcut: "Del",
              action: async () => {
                if (await confirm("Delete File", `Delete "${path.split("/").pop()}"?`)) {
                  vfsOps.del(path);
                  handleTabClose(path);
                }
              },
            },
          ]
        : []),
    ];
  }, [ctxMenu, vfsOps, activeFile, handleFileSelect, handleTabClose, confirm, doRename]);

  /* ── Build tabs from open files ── */
  const tabs: TabItem[] = useMemo(
    () =>
      openFiles.map((f) => ({
        id: f,
        label: f.split("/").pop() ?? f,
        dirty: dirtyFiles.has(f),
      })),
    [openFiles, dirtyFiles],
  );

  /* ── Editor pane — Monaco ── */
  const editorContent = (
    <MonacoEditor
      filePath={activeFile}
      value={currentCode}
      onChange={handleInput}
      editorRefOut={editorRef}
    />
  );

  /* ── Pages parsed from main file (for property panel) ── */
  const mainFileCode = useMemo(() => vfsOps.read(MAIN_FILE) ?? "", [vfsOps, vfsOps.revision]);
  const mainPages = useMemo(() => parseFlowSpec(mainFileCode), [mainFileCode]);

  /* ── Right sidebar (property panel for Designer) ── */
  const rightSidebarContent = useMemo(() => {
    if (previewTab !== "designer" || !selectedDesignerNode || !mainPages[selectedDesignerNode]) {
      return undefined;
    }
    return (
      <DesignerPropertyPanel
        pageName={selectedDesignerNode}
        pages={mainPages}
        code={mainFileCode}
        onCodeChange={handleDesignerCodeChange}
        onClose={() => setSelectedDesignerNode(null)}
      />
    );
  }, [previewTab, selectedDesignerNode, mainPages, mainFileCode, handleDesignerCodeChange]);

  /* ── Preview pane ── */
  const previewContent = (
    <>
      <div className="ide-preview-header">
        <div className="preview-tabs">
          <button
            className={clsx("ptab", { active: previewTab === "chat" })}
            onClick={() => setPreviewTab("chat")}
          >
            Chat
          </button>
          <button
            className={clsx("ptab", { active: previewTab === "designer" })}
            onClick={() => setPreviewTab("designer")}
          >
            Designer
          </button>
        </div>
      </div>
      <div className={clsx({ [styles.hidden]: previewTab !== "chat" })}>
        <ChatPreview
          messages={messages}
          onButtonClick={navigateTo}
          onSendMessage={sendMessage}
        />
      </div>
      <div
        className={clsx(styles.designerWrap, {
          [styles.hidden]: previewTab !== "designer",
        })}
      >
        <Suspense fallback={<div className={styles.loading}>Loading Designer...</div>}>
          <Designer
            pages={pages}
            selectedNode={selectedDesignerNode}
            onNodeSelect={setSelectedDesignerNode}
          />
        </Suspense>
      </div>
    </>
  );

  return (
    <IdeShell
      id="ide-flowspec"
      tabs={tabs}
      activeTab={activeFile}
      onTabChange={setActiveFile}
      onTabClose={handleTabClose}
      onRun={handleRun}
      runLabel="Run"
      vfsFiles={vfsOps.listAll()}
      vfsRead={vfsOps.read}
      onFileOpen={handleFileSelect}
      editorRef={editorRef}
      explorer={
        <FileExplorer
          files={vfsOps.fileTree}
          activeFile={activeFile}
          onFileSelect={handleFileSelect}
          onContextMenu={handleContextMenu}
        />
      }
      editor={editorContent}
      preview={previewContent}
      rightSidebar={rightSidebarContent}
      terminal={{
        onCommand: processFlowSpecCommand,
        welcomeMessage: "FlowSpec CLI v2.4.1 — Type help for commands",
        debugContent: <div className="out-dim" style={{ padding: ".3rem .6rem" }}>No debug output</div>,
        consoleContent: <div className="out-dim" style={{ padding: ".3rem .6rem" }}>No console output</div>,
      }}
      statusLeft={
        <>
          <span>FlowSpec DSL</span>
          <span>{Object.keys(pages).length} pages</span>
        </>
      }
      statusRight={
        <button onClick={downloadFlowSpecPDF} title="Download FlowSpec PDF">
          PDF
        </button>
      }
    >
      {ctxMenu && (
        <ContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          items={ctxMenuItems}
          onClose={closeCtxMenu}
        />
      )}
      {confirmModal}
    </IdeShell>
  );
};
