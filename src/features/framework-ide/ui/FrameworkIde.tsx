import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { editor } from "monaco-editor";

import { useVfs, type VfsFileMap } from "@/shared/lib/vfs";
import { IdeShell, type TabItem } from "@/shared/ui/ide-shell/IdeShell";
import { FileExplorer } from "@/shared/ui/ide-shell/ui/FileExplorer";
import { MonacoEditor } from "@/shared/ui/ide-shell/ui/MonacoEditor";
import { ContextMenu, type ContextMenuItem } from "@/shared/ui/ide-shell/ui/ContextMenu";
import { useConfirm } from "@/shared/ui/ide-shell/ui/ConfirmModal";
import { downloadSDKRefPDF } from "@/shared/lib/pdfGenerator";

import { useFrameworkSdk } from "@/features/framework-ide/model/useFrameworkSdk";
import { processSdkCommand } from "@/features/framework-ide/lib/terminalCommands";

import { ChatPreview } from "./ChatPreview";

/* ── SDK type definitions for Monaco IntelliSense ── */
const SCIBOT_SDK_TYPES = `declare module '@scibot/sdk' {
  export class Bot {
    constructor(opts?: { token?: string });
    command(name: string, handler: (ctx: Context) => void): this;
    action(name: string, handler: (ctx: Context) => void): this;
    on(event: string, handler: (ctx: Context) => void): this;
    hears(pattern: string | RegExp, handler: (ctx: Context) => void): this;
    launch(): void;
    start(): void;
  }
  export class InlineKeyboard {
    text(label: string, data?: string): this;
    url(label: string, href: string): this;
    row(): this;
  }
  export class Keyboard {
    text(label: string): this;
    row(): this;
    oneTime(): this;
    resized(): this;
  }
  export class Context {
    message: { text: string };
    from: { first_name: string; username: string };
    match: string | null;
    reply(text: string, extra?: { reply_markup?: InlineKeyboard | Keyboard }): void;
    answerCbQuery(): void;
  }
}`;

const DEFAULT_VFS_FILES: VfsFileMap = {
  "src/app.ts": `import { Bot, InlineKeyboard } from '@scibot/sdk';

const bot = new Bot({ token: process.env.BOT_TOKEN });

bot.command('start', (ctx) => {
  ctx.reply('Welcome to SCI-LAB!\\nChoose a module to explore:', {
    reply_markup: new InlineKeyboard()
      .text('FlowSpec Engine', 'flowspec')
      .text('MCU Emulator', 'mcu')
      .row()
      .text('Workspace', 'workspace')
      .text('Stats', 'stats')
  });
});

bot.action('flowspec', (ctx) => {
  ctx.reply('FlowSpec v3.2.1\\nDSL-driven bot infrastructure\\nCompiler + Runtime + Hot-reload', {
    reply_markup: new InlineKeyboard()
      .text('Deploy Now', 'deploy')
      .row()
      .text('Back', 'start')
  });
});

bot.action('mcu', (ctx) => {
  ctx.reply('MCU Emulator Core\\nCycle-accurate simulation\\n8-bit arch, 256B RAM', {
    reply_markup: new InlineKeyboard()
      .text('Run Emulator', 'deploy')
      .row()
      .text('Back', 'start')
  });
});

bot.action('workspace', (ctx) => {
  ctx.reply('Distributed Workspace v2.0\\nCRDT sync + Event sourcing', {
    reply_markup: new InlineKeyboard()
      .text('Open Workspace', 'deploy')
      .row()
      .text('Back', 'start')
  });
});

bot.action('stats', (ctx) => {
  ctx.reply('Platform Stats:\\n\\nActive sessions: 42\\nDeployed bots: 128\\nUptime: 99.9%', {
    reply_markup: new InlineKeyboard()
      .text('Refresh', 'stats')
      .text('Back', 'start')
  });
});

bot.action('deploy', (ctx) => {
  ctx.reply('Deploying to staging...\\nWorker pool: 4 instances\\nStatus: healthy', {
    reply_markup: new InlineKeyboard()
      .text('Restart', 'start')
  });
});

bot.on('message', (ctx) => {
  ctx.reply('Echo: ' + ctx.message.text +
    '\\nType /start to return to menu.');
});

bot.launch();`,
  "src/hooks.ts": `// SDK lifecycle hooks
export const onStart = () => {
  console.log('Bot started');
};

export const onError = (err) => {
  console.error('SDK error:', err);
};`,
  "src/types.d.ts": SCIBOT_SDK_TYPES.replace("declare module '@scibot/sdk' {", "// Type declarations\ndeclare module '@scibot/sdk' {"),
  "adapters/telegram.ts": `// Telegram adapter
export class TelegramAdapter {
  constructor(private token: string) {}
  async sendMessage(chatId: number, text: string) {
    // API call to Telegram
  }
}`,
  "adapters/mock.ts": `// Mock adapter for testing
export class MockAdapter {
  private messages: string[] = [];
  send(text: string) { this.messages.push(text); }
  getMessages() { return this.messages; }
}`,
  "package.json": `{
  "name": "scibot-sdk",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/app.ts",
    "build": "scilab sdk build",
    "test": "vitest run"
  },
  "dependencies": {
    "@scibot/sdk": "^2.0.0"
  }
}`,
  "README.md": `# SciBot SDK Project
TypeScript SDK bot project.

## Quick Start
\`\`\`
npm run dev
\`\`\``,
};

const MAIN_FILE = "src/app.ts";
const PROTECTED_FILES = new Set([MAIN_FILE]);

const EXTRA_LIBS = [
  { content: SCIBOT_SDK_TYPES, filePath: "file:///node_modules/@scibot/sdk/index.d.ts" },
];

export const FrameworkIde = () => {
  const vfsOps = useVfs("scibot-sdk", DEFAULT_VFS_FILES);
  const {
    outputs,
    status,
    run,
    sendMessage,
    clickButton,
    setCode,
  } = useFrameworkSdk();

  /* ── Open tabs & active file ── */
  const [openFiles, setOpenFiles] = useState<string[]>([MAIN_FILE]);
  const [activeFile, setActiveFile] = useState(MAIN_FILE);
  const [dirtyFiles, setDirtyFiles] = useState<Set<string>>(new Set());

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

  const handleRun = useCallback(() => {
    const code = vfsOps.read(MAIN_FILE) ?? "";
    run(code);
  }, [vfsOps, run]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      const code = vfsOps.read(MAIN_FILE) ?? "";
      setCode(code);
      setTimeout(() => run(code), 600);
    }
  }, [run, vfsOps, setCode]);

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
      if (activeFile === id) setActiveFile(next[next.length - 1] ?? MAIN_FILE);
      setDirtyFiles((prev) => { const n = new Set(prev); n.delete(id); return n; });
    },
    [openFiles, activeFile],
  );

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
          if (name) { vfsOps.write(path + "/" + name, ""); handleFileSelect(path + "/" + name); }
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
          if (await confirm("Delete Folder", `Delete "${path}" and all contents?`)) vfsOps.del(path);
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
      ...(!isProtected ? [
        { label: "" as string, separator: true as const, action: () => {} },
        { label: "Delete", danger: true, shortcut: "Del", action: async () => {
          if (await confirm("Delete File", `Delete "${path.split("/").pop()}"?`)) {
            vfsOps.del(path); handleTabClose(path);
          }
        }},
      ] : []),
    ];
  }, [ctxMenu, vfsOps, activeFile, handleFileSelect, handleTabClose, confirm, doRename]);

  const tabs: TabItem[] = useMemo(
    () => openFiles.map((f) => ({
      id: f,
      label: f.split("/").pop() ?? f,
      dirty: dirtyFiles.has(f),
    })),
    [openFiles, dirtyFiles],
  );

  /* ── Editor pane — Monaco with SDK IntelliSense ── */
  const editorContent = (
    <MonacoEditor
      filePath={activeFile}
      value={currentCode}
      onChange={handleInput}
      extraLibs={EXTRA_LIBS}
      editorRefOut={editorRef}
    />
  );

  const previewContent = (
    <>
      <div className="ide-preview-header">
        <span>Telegram Preview</span>
      </div>
      <ChatPreview
        outputs={outputs}
        onButtonClick={clickButton}
        onSendMessage={sendMessage}
      />
    </>
  );

  return (
    <IdeShell
      id="ide-framework"
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
      terminal={{
        onCommand: processSdkCommand,
        welcomeMessage: "Framework SDK CLI — Type help for commands",
        debugContent: <div className="out-dim" style={{ padding: ".3rem .6rem" }}>No debug output</div>,
        consoleContent: <div className="out-dim" style={{ padding: ".3rem .6rem" }}>No console output</div>,
      }}
      statusLeft={
        <>
          <span>TypeScript</span>
          <span>{status}</span>
        </>
      }
      statusRight={
        <button onClick={downloadSDKRefPDF} title="Download SDK PDF">
          PDF
        </button>
      }
    >
      {ctxMenu && (
        <ContextMenu x={ctxMenu.x} y={ctxMenu.y} items={ctxMenuItems} onClose={closeCtxMenu} />
      )}
      {confirmModal}
    </IdeShell>
  );
};
