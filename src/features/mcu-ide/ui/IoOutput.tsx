/* ═══ MCU I/O Output Log ═══ */

import type { EmulatorState } from "@/features/mcu-ide/model/types";

type IoOutputProps = {
  emu: EmulatorState;
};

export const IoOutput = ({ emu }: IoOutputProps) => {
  return (
    <div className="mcu-viz">
      <div className="mcu-output" style={{ maxHeight: "none" }}>
        {emu.output.length > 0 ? (
          emu.output.map((line, i) => (
            <div key={i} className="out-line">
              {line}
            </div>
          ))
        ) : (
          <div style={{ color: "var(--t3)", fontStyle: "italic" }}>
            No I/O output yet. Run code with OUT instructions.
          </div>
        )}
      </div>
    </div>
  );
};
