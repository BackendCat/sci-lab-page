import { useEffect, useRef } from "react";

import clsx from "clsx";

type ContextMenuItem = {
  label: string;
  icon?: string;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  separator?: boolean;
  action: () => void;
};

type ContextMenuProps = {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
};

export const ContextMenu = ({ x, y, items, onClose }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  /* Clamp to viewport */
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      menu.style.left = `${window.innerWidth - rect.width - 4}px`;
    }
    if (rect.bottom > window.innerHeight) {
      menu.style.top = `${window.innerHeight - rect.height - 4}px`;
    }
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="ctx-menu"
      style={{ left: x, top: y }}
      role="menu"
    >
      {items.map((item, i) => {
        if (item.separator) {
          return <div key={i} className="ctx-menu-sep" />;
        }
        return (
          <div
            key={i}
            className={clsx("ctx-menu-item", { danger: item.danger, disabled: item.disabled })}
            role="menuitem"
            tabIndex={0}
            onClick={() => {
              if (item.disabled) return;
              item.action();
              onClose();
            }}
            onKeyDown={(e) => {
              if (item.disabled) return;
              if (e.key === "Enter" || e.key === " ") {
                item.action();
                onClose();
              }
            }}
          >
            <span className="ctx-menu-label">
              {item.icon && <span className="ctx-menu-icon">{item.icon}</span>}
              <span>{item.label}</span>
            </span>
            {item.shortcut && <span className="ctx-menu-shortcut">{item.shortcut}</span>}
          </div>
        );
      })}
    </div>
  );
};

export type { ContextMenuItem, ContextMenuProps };
