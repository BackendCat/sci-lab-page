import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import clsx from "clsx";
import type { editor } from "monaco-editor";

import { useVfs, type VfsFileMap } from "@/shared/lib/vfs";
import { IdeShell, type TabItem } from "@/shared/ui/ide-shell/IdeShell";
import { FileExplorer } from "@/shared/ui/ide-shell/ui/FileExplorer";
import { MonacoEditor } from "@/shared/ui/ide-shell/ui/MonacoEditor";
import { ContextMenu, type ContextMenuItem } from "@/shared/ui/ide-shell/ui/ContextMenu";
import { useConfirm } from "@/shared/ui/ide-shell/ui/ConfirmModal";
import { downloadMCURefPDF } from "@/shared/lib/pdfGenerator";

import {
  DEFAULT_MCU_SPEC_CODE,
  DEFAULT_MCU_ASM_CODE,
  DEFAULT_MCU_MEM_CODE,
} from "@/shared/config/constants";
import { useEmulator } from "@/features/mcu-ide/model/useEmulator";
import { processMcuCommand } from "@/features/mcu-ide/lib/terminalCommands";

import { IoOutput } from "./IoOutput";
import { MemoryView } from "./MemoryView";
import { RegisterView } from "./RegisterView";
import styles from "./McuIde.module.css";

import type { McuPreviewTab } from "@/features/mcu-ide/model/types";

/* ── Default VFS files ── */

const DEFAULT_VFS_FILES: VfsFileMap = {
  "mcu_spec.mcuconf": DEFAULT_MCU_SPEC_CODE,
  "code.asm": DEFAULT_MCU_ASM_CODE,
  "memory.map": DEFAULT_MCU_MEM_CODE,
  "include/registers.h": `// SCI-MCU-32 Register Definitions
#ifndef REGISTERS_H
#define REGISTERS_H

#define PORTB  0x25
#define DDRC   0x27
#define TCCR0  0x2A
#define ADMUX  0x2D
#define SREG   0x30

// PORTB bits
#define LED    5
#define BUZZER 4
#define BTN_A  3
#define BTN_B  2
#define TX     1
#define RX     0

#endif`,
  "include/interrupts.h": `// SCI-MCU-32 Interrupt Vectors
#ifndef INTERRUPTS_H
#define INTERRUPTS_H

#define INT_RESET   0x00
#define INT_EXT0    0x02
#define INT_EXT1    0x04
#define INT_TIMER0  0x06
#define INT_TIMER1  0x08
#define INT_ADC     0x0A
#define INT_UART_RX 0x0C
#define INT_UART_TX 0x0E

#endif`,
  "Makefile": `# SCI-MCU-32 Build System
TARGET = firmware
MCU = sci-mcu-32
FREQ = 16000000

CC = avr-gcc
OBJCOPY = avr-objcopy

CFLAGS = -mmcu=$(MCU) -DF_CPU=$(FREQ) -Os

all: $(TARGET).hex

$(TARGET).elf: code.asm
\t$(CC) $(CFLAGS) -o $@ $<

$(TARGET).hex: $(TARGET).elf
\t$(OBJCOPY) -O ihex $< $@

flash: $(TARGET).hex
\tavrdude -p m328p -c usbasp -U flash:w:$<

clean:
\trm -f $(TARGET).elf $(TARGET).hex`,
  "README.md": `# MCU Emulator Project
8-bit microcontroller emulation.

## Quick Start
\`\`\`
make && make flash
\`\`\``,
  "package.json": `{
  "name": "mcu-project",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "compile": "scilab mcu compile",
    "flash": "scilab mcu flash",
    "status": "scilab mcu status"
  }
}`,
};

/* ── File constants ── */
const SPEC_FILE = "mcu_spec.mcuconf";
const CODE_FILE = "code.asm";
const MEM_FILE = "memory.map";
const PROTECTED_FILES = new Set([SPEC_FILE, CODE_FILE, MEM_FILE]);

export const McuIde = () => {
  const vfsOps = useVfs("mcu-project", DEFAULT_VFS_FILES);
  const { emu, run, step, load } = useEmulator();

  /* ── Open tabs & active file ── */
  const [openFiles, setOpenFiles] = useState<string[]>([SPEC_FILE, CODE_FILE, MEM_FILE]);
  const [activeFile, setActiveFile] = useState(SPEC_FILE);
  const [dirtyFiles, setDirtyFiles] = useState<Set<string>>(new Set());
  const [previewTab, setPreviewTab] = useState<McuPreviewTab>("registers");

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

  /* ── Spec code for RegisterView (always read from VFS) ── */
  const specCode = useMemo(
    () => vfsOps.read(SPEC_FILE) ?? "",
    [vfsOps, vfsOps.revision],
  );

  /* ── Handle code edit ── */
  const handleInput = useCallback(
    (val: string) => {
      vfsOps.write(activeFile, val);
      setDirtyFiles((prev) => new Set(prev).add(activeFile));
    },
    [activeFile, vfsOps],
  );

  /* ── Run / Step / Reset ── */
  const handleRun = useCallback(() => {
    if (activeFile === CODE_FILE) {
      const code = vfsOps.read(CODE_FILE) ?? "";
      run(code);
    } else {
      const code = vfsOps.read(CODE_FILE) ?? "";
      load(code);
    }
  }, [activeFile, vfsOps, run, load]);

  const handleStep = useCallback(() => {
    const code = vfsOps.read(CODE_FILE) ?? "";
    if (emu.program.length === 0) load(code);
    step();
  }, [emu.program.length, load, vfsOps, step]);

  const handleReset = useCallback(() => {
    const code = vfsOps.read(CODE_FILE) ?? "";
    load(code);
  }, [load, vfsOps]);

  /* ── Initial load ── */
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      const code = vfsOps.read(CODE_FILE) ?? "";
      setTimeout(() => load(code), 600);
    }
  }, [load, vfsOps]);

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
      if (PROTECTED_FILES.has(id) && openFiles.length <= 3) return;
      const next = openFiles.filter((f) => f !== id);
      setOpenFiles(next);
      if (activeFile === id) setActiveFile(next[next.length - 1] ?? SPEC_FILE);
      setDirtyFiles((prev) => { const n = new Set(prev); n.delete(id); return n; });
    },
    [openFiles, activeFile],
  );

  /* ── Context menu ── */
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

  /* ── Determine run label & whether to show step/reset ── */
  const isCodeFile = activeFile === CODE_FILE;
  const runLabel = isCodeFile ? "Run" : "Load";

  /* ── Editor pane — Monaco ── */
  const editorContent = (
    <MonacoEditor
      filePath={activeFile}
      value={currentCode}
      onChange={handleInput}
      editorRefOut={editorRef}
    />
  );

  /* ── Preview pane ── */
  const previewContent = (
    <>
      <div className="ide-preview-header">
        <div className="preview-tabs">
          <button
            className={clsx("ptab", { active: previewTab === "registers" })}
            onClick={() => setPreviewTab("registers")}
          >
            Registers
          </button>
          <button
            className={clsx("ptab", { active: previewTab === "memory" })}
            onClick={() => setPreviewTab("memory")}
          >
            Full Memory
          </button>
          <button
            className={clsx("ptab", { active: previewTab === "output" })}
            onClick={() => setPreviewTab("output")}
          >
            I/O Output
          </button>
        </div>
      </div>
      <div className="ide-preview-body">
        {emu.program.length > 0 && previewTab !== "memory" && (
          <div className={styles.cpuStatus}>
            <div className="mcu-status-bar">
              <span className="mcu-badge hl">
                PC: {emu.pc.toString(16).padStart(2, "0").toUpperCase()}
              </span>
              <span className={clsx("mcu-badge", emu.sp < 0xff && "hl")}>
                SP: {emu.sp.toString(16).padStart(2, "0").toUpperCase()}
              </span>
              <span className={clsx("mcu-badge", emu.flagZ && "hl")}>
                Z:{emu.flagZ ? "1" : "0"}
              </span>
              <span className={clsx("mcu-badge", emu.flagC && "hl")}>
                C:{emu.flagC ? "1" : "0"}
              </span>
              <span className={clsx("mcu-badge", emu.halted && "hl")}>
                {emu.halted ? "HALTED" : "RUNNING"}
              </span>
            </div>
            <div className="mcu-regs-row">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="mcu-reg-box">
                  <span className="rn">R{i}</span>
                  <span className="rv">
                    0x{emu.regs[i].toString(16).padStart(2, "0").toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
            {emu.pc < emu.program.length && (
              <div className={styles.nextInst}>
                Next: <span>{emu.program[emu.pc].op} {emu.program[emu.pc].args.join(", ")}</span>
              </div>
            )}
          </div>
        )}

        {previewTab === "registers" && (
          <RegisterView specCode={specCode} emu={emu} />
        )}
        {previewTab === "memory" && <MemoryView emu={emu} />}
        {previewTab === "output" && <IoOutput emu={emu} />}
      </div>
    </>
  );

  return (
    <IdeShell
      id="ide-mcu"
      tabs={tabs}
      activeTab={activeFile}
      onTabChange={setActiveFile}
      onTabClose={handleTabClose}
      onRun={handleRun}
      runLabel={runLabel}
      onStep={isCodeFile ? handleStep : undefined}
      stepLabel="Step"
      onReset={isCodeFile ? handleReset : undefined}
      resetLabel="Reset"
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
        onCommand: processMcuCommand,
        welcomeMessage: "MCU Toolchain v2.4.1 — Type help for commands",
        debugContent: (
          <div className="out-dim" style={{ padding: ".3rem .6rem" }}>
            {emu.program.length > 0 ? (
              <>
                <div>PC: 0x{emu.pc.toString(16).padStart(2, "0").toUpperCase()}</div>
                <div>SP: 0x{emu.sp.toString(16).padStart(2, "0").toUpperCase()}</div>
                <div>Flags: Z={emu.flagZ ? "1" : "0"} C={emu.flagC ? "1" : "0"}</div>
                <div>Program: {emu.program.length} instructions</div>
                <div>Status: {emu.halted ? "HALTED" : "RUNNING"}</div>
              </>
            ) : (
              "No debug output"
            )}
          </div>
        ),
        consoleContent: (
          <div className="out-dim" style={{ padding: ".3rem .6rem" }}>
            {emu.output.length > 0 ? (
              emu.output.map((line, i) => <div key={i}>{line}</div>)
            ) : (
              "No serial output"
            )}
          </div>
        ),
        terminalTabLabels: ["Terminal", "Debug", "Serial"],
      }}
      statusLeft={
        <>
          <span>MCU ASM</span>
          <span>{emu.halted ? "Halted" : emu.program.length > 0 ? "Running" : "Idle"}</span>
        </>
      }
      statusRight={
        <button onClick={downloadMCURefPDF} title="Download MCU PDF">
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
