import { useCallback, useEffect, useRef, useState } from "react";

import clsx from "clsx";

export type MenuItemDef =
  | {
      label: string;
      shortcut?: string;
      action?: () => void;
      separator?: false;
      disabled?: boolean;
    }
  | { separator: true; label?: string; shortcut?: string; action?: () => void; disabled?: boolean };

type MenuBarProps = {
  menus: Record<string, MenuItemDef[]>;
};

export const MenuBar = ({ menus }: MenuBarProps) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const handleLabelClick = useCallback((name: string) => {
    clearCloseTimer();
    setOpenMenu((prev) => (prev === name ? null : name));
  }, [clearCloseTimer]);

  const handleLabelHover = useCallback(
    (name: string) => {
      clearCloseTimer();
      if (openMenu !== null) setOpenMenu(name);
    },
    [openMenu, clearCloseTimer],
  );

  const handleItemClick = useCallback(
    (item: MenuItemDef) => {
      if (item.disabled || item.separator) return;
      setOpenMenu(null);
      item.action?.();
    },
    [],
  );

  const handleMenuLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 200);
  }, []);

  const handleDropdownEnter = useCallback(() => {
    clearCloseTimer();
  }, [clearCloseTimer]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!openMenu) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    const handleClick = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [openMenu]);

  return (
    <div className="ide-menubar" ref={barRef} onMouseLeave={handleMenuLeave}>
      {Object.entries(menus).map(([name, items]) => (
        <div key={name} className="menu-item-wrap">
          <button
            className={clsx("menu-label", { active: openMenu === name })}
            onClick={() => handleLabelClick(name)}
            onMouseEnter={() => handleLabelHover(name)}
          >
            {name}
          </button>
          {openMenu === name && (
            <div className="menu-dropdown" onMouseEnter={handleDropdownEnter} onMouseLeave={handleMenuLeave}>
              {items.map((item, i) =>
                item.separator ? (
                  <div key={i} className="menu-sep" />
                ) : (
                  <button
                    key={i}
                    className={clsx("menu-dropdown-item", { disabled: item.disabled })}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                  >
                    <span>{item.label}</span>
                    {item.shortcut && <span className="menu-shortcut">{item.shortcut}</span>}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
