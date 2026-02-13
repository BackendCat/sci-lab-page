import { useCallback, useEffect, useRef, useState } from "react";

import clsx from "clsx";

import styles from "./MicroConsole.module.css";

const LOG_LINES = [
  { time: "12:04:01", type: "ok", text: "FlowSpec compiler ready" },
  { time: "12:04:01", type: "info", text: "Loaded 3 system modules" },
  { time: "12:04:02", type: "ok", text: "DSL validation passed" },
  { time: "12:04:02", type: "info", text: "Deploying to staging..." },
  { time: "12:04:03", type: "ok", text: "Worker pool: 4 instances" },
  { time: "12:04:03", type: "warn", text: "Hot-reload standby" },
  { time: "12:04:04", type: "ok", text: "Health check: all green" },
] as const;

const LINE_DELAY_MS = 400;

export const MicroConsole = () => {
  const [visibleCount, setVisibleCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    const angle = (Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2) * 180) / Math.PI;
    el.style.setProperty("--glow-x", `${x}%`);
    el.style.setProperty("--glow-y", `${y}%`);
    el.style.setProperty("--glow-angle", `${angle}deg`);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= LOG_LINES.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, LINE_DELAY_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.microConsole} ref={ref} onMouseMove={handleMouseMove}>
      <div className={styles.consoleTitle}>Runtime Log</div>
      {LOG_LINES.map((line, i) => (
        <div key={i} className={clsx(styles.logLine, i < visibleCount && styles.visible)}>
          <span className={styles.ts}>[{line.time}]</span>{" "}
          <span className={styles[line.type]}>{line.text}</span>
        </div>
      ))}
    </div>
  );
};
