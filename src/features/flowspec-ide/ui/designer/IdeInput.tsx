import { memo, useCallback, useEffect, useRef, useState } from "react";

import clsx from "clsx";

import styles from "./Designer.module.css";

/* ── Text Input ── */
type IdeInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const IdeInput = memo(({ value, onChange, placeholder }: IdeInputProps) => (
  <input
    className={styles.ideInput}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    spellCheck={false}
  />
));

/* ── Textarea ── */
type IdeTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const IdeTextarea = memo(({ value, onChange, placeholder }: IdeTextareaProps) => (
  <textarea
    className={styles.ideTextarea}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    spellCheck={false}
  />
));

/* ── Custom Select (no native <select>) ── */
type IdeSelectProps = {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

export const IdeSelect = memo(({ value, options, onChange }: IdeSelectProps) => {
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  const currentLabel = options.find((o) => o.value === value)?.label ?? value;

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as HTMLElement)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setOpen(true);
          setFocusIdx(options.findIndex((o) => o.value === value));
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusIdx((prev) => Math.min(prev + 1, options.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusIdx((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (focusIdx >= 0 && focusIdx < options.length) {
            onChange(options[focusIdx].value);
          }
          setOpen(false);
          break;
        case "Escape":
          e.preventDefault();
          setOpen(false);
          break;
      }
    },
    [open, focusIdx, options, value, onChange],
  );

  return (
    <div className={styles.ideSelectWrap} ref={wrapRef}>
      <button
        className={styles.ideSelectBtn}
        onClick={() => {
          setOpen(!open);
          if (!open) setFocusIdx(options.findIndex((o) => o.value === value));
        }}
        onKeyDown={handleKeyDown}
        type="button"
      >
        {currentLabel}
      </button>
      <span className={styles.ideSelectArrow}>{"\u25bc"}</span>

      {open && (
        <div className={styles.ideSelectDrop}>
          {options.map((opt, i) => (
            <div
              key={opt.value}
              className={clsx(
                styles.ideSelectOption,
                opt.value === value && styles.active,
                i === focusIdx && styles.focused,
              )}
              onMouseEnter={() => setFocusIdx(i)}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
