/* ═══ MCU Memory View (256-byte 16x16 grid) ═══ */

import clsx from "clsx";

import type { EmulatorState } from "@/features/mcu-ide/model/types";

type MemoryViewProps = {
  emu: EmulatorState;
};

export const MemoryView = ({ emu }: MemoryViewProps) => {
  const hex = (n: number, pad = 2) => n.toString(16).padStart(pad, "0").toUpperCase();

  return (
    <div className="mcu-viz">
      {/* Status bar */}
      <div className="mcu-status-bar">
        <span className="mcu-badge hl">PC: {hex(emu.pc)}</span>
        <span className={clsx("mcu-badge", emu.sp < 0xff && "hl")}>SP: {hex(emu.sp)}</span>
        <span className={clsx("mcu-badge", emu.flagZ && "hl")}>Z:{emu.flagZ ? "1" : "0"}</span>
        <span className={clsx("mcu-badge", emu.flagC && "hl")}>C:{emu.flagC ? "1" : "0"}</span>
      </div>

      {/* Column headers */}
      <div className="mcu-mem-grid">
        <div className="mcu-mem-row">
          <span className="mcu-mem-addr" />
          {Array.from({ length: 16 }, (_, c) => (
            <span
              key={c}
              className="mcu-mem-cell"
              style={{ fontWeight: 600, color: "var(--ac)" }}
            >
              {c.toString(16).toUpperCase()}
            </span>
          ))}
        </div>

        {/* 16 rows x 16 cols = 256 bytes */}
        {Array.from({ length: 16 }, (_, row) => (
          <div key={row} className="mcu-mem-row">
            <span className="mcu-mem-addr">
              {(row * 16).toString(16).padStart(2, "0").toUpperCase()}
            </span>
            {Array.from({ length: 16 }, (_, col) => {
              const idx = row * 16 + col;
              return (
                <span
                  key={col}
                  className={clsx(
                    "mcu-mem-cell",
                    emu.mem[idx] !== 0 && "nz",
                    idx === emu.pc && emu.program.length > 0 && "pc-at",
                  )}
                  title={
                    "Addr 0x" + hex(idx) +
                    " = " + emu.mem[idx] +
                    " (0b" + emu.mem[idx].toString(2).padStart(8, "0") + ")"
                  }
                >
                  {emu.mem[idx].toString(16).padStart(2, "0")}
                </span>
              );
            })}
            {/* ASCII column */}
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: ".46rem",
                color: "var(--t3)",
                marginLeft: "4px",
              }}
            >
              {Array.from({ length: 16 }, (_, col) => {
                const v = emu.mem[row * 16 + col];
                return v >= 32 && v < 127 ? String.fromCharCode(v) : ".";
              }).join("")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
