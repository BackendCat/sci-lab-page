/**
 * Virtual File System — localStorage-backed flat key-value store.
 * Ported from original index.html (v4.8).
 */

const STORAGE_KEY = "scilab-vfs-v6";

const load = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const save = (data: Record<string, string>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* quota exceeded — silently ignore */ }
};

export const vfs = {
  read(path: string): string | null {
    return load()[path] ?? null;
  },

  write(path: string, content: string): void {
    const data = load();
    data[path] = content;
    save(data);
  },

  del(path: string): void {
    const data = load();
    // Delete exact match and any children (prefix-based)
    for (const key of Object.keys(data)) {
      if (key === path || key.startsWith(path + "/")) {
        delete data[key];
      }
    }
    save(data);
  },

  rename(oldPath: string, newPath: string): void {
    const data = load();
    for (const key of Object.keys(data)) {
      if (key === oldPath) {
        data[newPath] = data[key];
        delete data[key];
      } else if (key.startsWith(oldPath + "/")) {
        const suffix = key.slice(oldPath.length);
        data[newPath + suffix] = data[key];
        delete data[key];
      }
    }
    save(data);
  },

  list(prefix: string): string[] {
    const data = load();
    return Object.keys(data).filter((k) => k.startsWith(prefix));
  },

  exists(path: string): boolean {
    return load()[path] !== undefined;
  },

  allKeys(): string[] {
    return Object.keys(load());
  },
};

/* ── React hook: scoped VFS operations ── */

import { useCallback, useMemo, useRef, useState } from "react";
import type { FileNode } from "@/shared/ui/ide-shell/ui/FileExplorer";

export type VfsFileMap = Record<string, string>;

export const useVfs = (root: string, defaultFiles: VfsFileMap) => {
  // Initialize VFS with defaults if not already present
  const initialized = useRef(false);
  if (!initialized.current) {
    initialized.current = true;
    for (const [relativePath, content] of Object.entries(defaultFiles)) {
      const fullPath = root + "/" + relativePath;
      if (!vfs.exists(fullPath)) {
        vfs.write(fullPath, content);
      }
    }
  }

  const [revision, setRevision] = useState(0);
  const bump = useCallback(() => setRevision((r) => r + 1), []);

  const read = useCallback(
    (relativePath: string): string | null => {
      return vfs.read(root + "/" + relativePath);
    },
    [root],
  );

  const write = useCallback(
    (relativePath: string, content: string) => {
      vfs.write(root + "/" + relativePath, content);
      bump();
    },
    [root, bump],
  );

  const del = useCallback(
    (relativePath: string) => {
      vfs.del(root + "/" + relativePath);
      bump();
    },
    [root, bump],
  );

  const rename = useCallback(
    (oldRelative: string, newRelative: string) => {
      vfs.rename(root + "/" + oldRelative, root + "/" + newRelative);
      bump();
    },
    [root, bump],
  );

  const exists = useCallback(
    (relativePath: string): boolean => {
      return vfs.exists(root + "/" + relativePath);
    },
    [root],
  );

  const listAll = useCallback((): string[] => {
    const prefix = root + "/";
    return vfs.list(prefix).map((k) => k.slice(prefix.length));
  }, [root]);

  const resetToDefaults = useCallback(() => {
    // Delete all files under root
    vfs.del(root);
    // Re-create defaults
    for (const [relativePath, content] of Object.entries(defaultFiles)) {
      vfs.write(root + "/" + relativePath, content);
    }
    bump();
  }, [root, defaultFiles, bump]);

  /* Build a FileNode tree from flat VFS paths */
  const fileTree = useMemo((): FileNode[] => {
    void revision; // dependency
    const paths = listAll();
    const tree: FileNode[] = [];

    const ensureFolder = (parts: string[], nodes: FileNode[]): FileNode[] => {
      if (parts.length === 0) return nodes;
      const folderName = parts[0];
      let folder = nodes.find(
        (n) => n.name === folderName && n.type === "folder",
      );
      if (!folder) {
        folder = { name: folderName, type: "folder", children: [] };
        nodes.push(folder);
      }
      if (parts.length > 1) {
        folder.children = ensureFolder(parts.slice(1), folder.children ?? []);
      }
      return nodes;
    };

    for (const p of paths.sort()) {
      const parts = p.split("/");
      if (parts.length === 1) {
        tree.push({ name: parts[0], type: "file" });
      } else {
        const fileName = parts.pop()!;
        ensureFolder(parts, tree);
        // Navigate to the deepest folder
        let current = tree;
        for (const part of parts) {
          const folder = current.find(
            (n) => n.name === part && n.type === "folder",
          );
          if (folder) current = folder.children ?? [];
        }
        if (!current.find((n) => n.name === fileName && n.type === "file")) {
          current.push({ name: fileName, type: "file" });
        }
      }
    }

    // Sort: folders first, then files, alphabetically
    const sortNodes = (nodes: FileNode[]): FileNode[] => {
      nodes.sort((a, b) => {
        if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      for (const n of nodes) {
        if (n.children) sortNodes(n.children);
      }
      return nodes;
    };

    return sortNodes(tree);
  }, [revision, listAll]);

  return {
    read,
    write,
    del,
    rename,
    exists,
    listAll,
    fileTree,
    resetToDefaults,
    revision,
  };
};
