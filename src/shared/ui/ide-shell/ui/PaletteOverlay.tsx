import { useCallback, useEffect, useRef, useState } from "react";

import clsx from "clsx";

export type PaletteItem = {
  id: string;
  label: string;
  detail?: string;
  shortcut?: string;
};

type PaletteOverlayProps = {
  open: boolean;
  onClose: () => void;
  items: PaletteItem[];
  onSelect: (id: string) => void;
  placeholder?: string;
  prefix?: string;
};

export const PaletteOverlay = ({
  open,
  onClose,
  items,
  onSelect,
  placeholder = "Type to search...",
  prefix,
}: PaletteOverlayProps) => {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query
    ? items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()))
    : items;

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset selection when filter changes
  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIdx((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filtered[selectedIdx]) {
            onSelect(filtered[selectedIdx].id);
            onClose();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [filtered, selectedIdx, onSelect, onClose],
  );

  if (!open) return null;

  return (
    <div className="palette-overlay" onClick={onClose}>
      <div className="palette-box" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="palette-input-row">
          {prefix && <span className="palette-prefix">{prefix}</span>}
          <input
            ref={inputRef}
            className="palette-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
          />
        </div>
        <div className="palette-list">
          {filtered.length === 0 && (
            <div className="palette-empty">No results</div>
          )}
          {filtered.slice(0, 15).map((item, i) => (
            <button
              key={item.id}
              className={clsx("palette-item", { selected: i === selectedIdx })}
              onMouseEnter={() => setSelectedIdx(i)}
              onClick={() => {
                onSelect(item.id);
                onClose();
              }}
            >
              <div className="palette-item-text">
                <span className="palette-item-label">{item.label}</span>
                {item.detail && <span className="palette-item-detail">{item.detail}</span>}
              </div>
              {item.shortcut && <span className="palette-item-shortcut">{item.shortcut}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
