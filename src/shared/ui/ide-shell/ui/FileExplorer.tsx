import { useCallback, useState } from "react";

import clsx from "clsx";

export type FileNode = {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
};

type FileExplorerProps = {
  files: FileNode[];
  activeFile?: string;
  onFileSelect: (path: string) => void;
  onNewFile?: () => void;
  onNewFolder?: () => void;
  onContextMenu?: (e: React.MouseEvent, path: string) => void;
};

const CONFIG_PATTERNS = [
  /\.ya?ml$/,
  /\.json$/,
  /\.toml$/,
  /\.env/,
  /\.config\./,
  /tsconfig/,
  /vite\.config/,
  /eslint/,
  /prettier/,
];

const isConfigFile = (name: string): boolean =>
  CONFIG_PATTERNS.some((p) => p.test(name));

const getFileIcon = (name: string, type: "file" | "folder", open: boolean) => {
  if (type === "folder") return open ? "📂" : "📁";
  if (isConfigFile(name)) return "⚙️";
  return "📄";
};

type TreeNodeProps = {
  node: FileNode;
  depth: number;
  parentPath: string;
  activeFile?: string;
  collapsed: Set<string>;
  onToggle: (path: string) => void;
  onFileSelect: (path: string) => void;
  onContextMenu?: (e: React.MouseEvent, path: string) => void;
};

const TreeNode = ({
  node,
  depth,
  parentPath,
  activeFile,
  collapsed,
  onToggle,
  onFileSelect,
  onContextMenu,
}: TreeNodeProps) => {
  const path = parentPath ? `${parentPath}/${node.name}` : node.name;
  const isFolder = node.type === "folder";
  const isCollapsed = collapsed.has(path);
  const isOpen = isFolder && !isCollapsed;
  const depthClass = depth > 0 ? `indent-${Math.min(depth, 3)}` : "";

  const handleClick = () => {
    if (isFolder) {
      onToggle(path);
    } else {
      onFileSelect(path);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (onContextMenu) {
      e.preventDefault();
      onContextMenu(e, path);
    }
  };

  return (
    <>
      <div
        className={clsx("file-tree-item", depthClass, {
          folder: isFolder,
          collapsed: isCollapsed,
          active: !isFolder && activeFile === path,
        })}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        role="treeitem"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick();
        }}
      >
        {isFolder && <span className="chevron">&#9660;</span>}
        <span className="icon">
          {getFileIcon(node.name, node.type, isOpen)}
        </span>
        <span>{node.name}</span>
      </div>
      {isFolder && !isCollapsed && node.children?.map((child) => (
        <TreeNode
          key={`${path}/${child.name}`}
          node={child}
          depth={depth + 1}
          parentPath={path}
          activeFile={activeFile}
          collapsed={collapsed}
          onToggle={onToggle}
          onFileSelect={onFileSelect}
          onContextMenu={onContextMenu}
        />
      ))}
    </>
  );
};

export const FileExplorer = ({
  files,
  activeFile,
  onFileSelect,
  onNewFile,
  onNewFolder,
  onContextMenu,
}: FileExplorerProps) => {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const handleToggle = useCallback((path: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  return (
    <div className="ide-explorer">
      <div className="ide-explorer-header">
        <span>Explorer</span>
        <div style={{ display: "flex", gap: ".2rem" }}>
          {onNewFile && (
            <button title="New file" className="explorer-action" onClick={onNewFile}>
              +
            </button>
          )}
          {onNewFolder && (
            <button
              title="New folder"
              className="explorer-action"
              onClick={onNewFolder}
              style={{ fontSize: ".55rem" }}
            >
              📂
            </button>
          )}
        </div>
      </div>
      <div className="file-tree" role="tree">
        {files.map((node) => (
          <TreeNode
            key={node.name}
            node={node}
            depth={0}
            parentPath=""
            activeFile={activeFile}
            collapsed={collapsed}
            onToggle={handleToggle}
            onFileSelect={onFileSelect}
            onContextMenu={onContextMenu}
          />
        ))}
      </div>
    </div>
  );
};
