/* ═══ Shared IDE file operations hook ═══
 * Extracts common tab/file/context-menu logic from FlowSpecIde, FrameworkIde, McuIde.
 */

import React, { useCallback, useMemo, useRef, useState } from "react";

import type { editor } from "monaco-editor";

import type { TabItem } from "@/shared/ui/ide-shell/IdeShell";
import type { ContextMenuItem } from "@/shared/ui/ide-shell/ui/ContextMenu";
import { useConfirm } from "@/shared/ui/ide-shell/ui/ConfirmModal";
import type { useVfs } from "@/shared/lib/vfs";

type VfsOps = ReturnType<typeof useVfs>;

export type IdeFileOpsConfig = {
  /** The primary file (used as fallback when closing all tabs) */
  mainFile: string;
  /** Files that cannot be deleted */
  protectedFiles: Set<string>;
  /** Initial open tabs */
  initialOpenFiles: string[];
  /** VFS operations handle */
  vfsOps: VfsOps;
  /** Called when the main file content changes via the editor */
  onMainFileChange?: (value: string) => void;
};

export const useIdeFileOps = ({
  mainFile,
  protectedFiles,
  initialOpenFiles,
  vfsOps,
  onMainFileChange,
}: IdeFileOpsConfig) => {
  /* ── Open tabs & active file ── */
  const [openFiles, setOpenFiles] = useState<string[]>(initialOpenFiles);
  const [activeFile, setActiveFile] = useState(initialOpenFiles[0]);
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
      if (activeFile === mainFile && onMainFileChange) {
        onMainFileChange(val);
      }
    },
    [activeFile, vfsOps, mainFile, onMainFileChange],
  );

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
      if (protectedFiles.has(id) && openFiles.length <= initialOpenFiles.length) return;
      const next = openFiles.filter((f) => f !== id);
      setOpenFiles(next);
      if (activeFile === id) {
        setActiveFile(next[next.length - 1] ?? mainFile);
      }
      setDirtyFiles((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    },
    [openFiles, activeFile, protectedFiles, initialOpenFiles.length, mainFile],
  );

  /* ── Context menu handlers ── */
  const handleContextMenu = useCallback((e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, path });
  }, []);

  const closeCtxMenu = useCallback(() => setCtxMenu(null), []);

  const doRename = useCallback(
    (path: string) => {
      const parts = path.split("/");
      const oldName = parts.pop()!;
      const newName = prompt("New name:", oldName);
      if (newName && newName !== oldName) {
        const newPath = [...parts, newName].join("/");
        vfsOps.rename(path, newPath);
        setOpenFiles((prev) => prev.map((f) => (f === path ? newPath : f)));
        if (activeFile === path) setActiveFile(newPath);
      }
    },
    [vfsOps, activeFile],
  );

  /* ── Context menu items ── */
  const ctxMenuItems = useMemo((): ContextMenuItem[] => {
    if (!ctxMenu) return [];
    const { path } = ctxMenu;
    const isProtected = protectedFiles.has(path);
    const isFolder =
      vfsOps.read(path) === null &&
      vfsOps.listAll().some((f) => f.startsWith(path + "/"));

    if (isFolder) {
      return [
        {
          label: "New File...",
          action: () => {
            const name = prompt("File name:");
            if (name) {
              const fullPath = path + "/" + name;
              vfsOps.write(fullPath, "");
              handleFileSelect(fullPath);
            }
          },
        },
        {
          label: "New Folder...",
          action: () => {
            const name = prompt("Folder name:");
            if (name) vfsOps.write(path + "/" + name + "/.keep", "");
          },
        },
        { label: "", separator: true, action: () => {} },
        { label: "Copy Path", action: () => navigator.clipboard.writeText(path) },
        { label: "", separator: true, action: () => {} },
        { label: "Rename Folder...", shortcut: "F2", action: () => doRename(path) },
        { label: "", separator: true, action: () => {} },
        {
          label: "Delete Folder",
          danger: true,
          action: async () => {
            if (await confirm("Delete Folder", `Delete "${path}" and all its contents?`))
              vfsOps.del(path);
          },
        },
      ];
    }

    return [
      { label: "Open", action: () => handleFileSelect(path) },
      { label: "", separator: true, action: () => {} },
      {
        label: "Cut",
        shortcut: "Ctrl+X",
        action: () => navigator.clipboard.writeText(vfsOps.read(path) ?? ""),
      },
      {
        label: "Copy",
        shortcut: "Ctrl+C",
        action: () => navigator.clipboard.writeText(vfsOps.read(path) ?? ""),
      },
      {
        label: "Duplicate",
        action: () => {
          const parts = path.split("/");
          const name = parts.pop()!;
          const ext = name.includes(".") ? "." + name.split(".").pop() : "";
          const base = ext ? name.slice(0, -ext.length) : name;
          const newPath = [...parts, `${base} copy${ext}`].join("/");
          vfsOps.write(newPath, vfsOps.read(path) ?? "");
          handleFileSelect(newPath);
        },
      },
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
                if (
                  await confirm("Delete File", `Delete "${path.split("/").pop()}"?`)
                ) {
                  vfsOps.del(path);
                  handleTabClose(path);
                }
              },
            },
          ]
        : []),
    ];
  }, [ctxMenu, vfsOps, handleFileSelect, handleTabClose, confirm, doRename, protectedFiles]);

  /* ── Mark a specific file as dirty (for external writes like Designer) ── */
  const markDirty = useCallback((path: string) => {
    setDirtyFiles((prev) => new Set(prev).add(path));
  }, []);

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

  return {
    openFiles,
    activeFile,
    setActiveFile,
    dirtyFiles,
    markDirty,
    currentCode,
    handleInput,
    handleFileSelect,
    handleTabClose,
    handleContextMenu,
    closeCtxMenu,
    doRename,
    ctxMenu,
    ctxMenuItems,
    tabs,
    editorRef,
    hasInitialized,
    confirmModal,
  };
};
