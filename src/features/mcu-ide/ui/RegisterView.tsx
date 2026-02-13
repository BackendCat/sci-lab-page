/* ═══ MCU Register Visualization ═══ */

import { useCallback, useMemo, useState } from "react";

import clsx from "clsx";

import { parseMCU } from "@/features/mcu-ide/lib/specParser";
import type { EmulatorState } from "@/features/mcu-ide/model/types";

type RegisterViewProps = {
  specCode: string;
  emu: EmulatorState;
};

export const RegisterView = ({ specCode, emu }: RegisterViewProps) => {
  const info = useMemo(() => parseMCU(specCode), [specCode]);
  const [bitState, setBitState] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {};
    for (const init of info.inits) {
      state[init.reg + "." + init.bit] = init.value === "high";
    }
    return state;
  });

  const toggleBit = useCallback((key: string) => {
    setBitState((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const outputBits: { reg: string; bit: string; label: string }[] = [];
  for (const reg of info.registers) {
    for (const bit of reg.bits) {
      if (bit.dir === "output" && bit.name !== "NC") {
        outputBits.push({ reg: reg.name, bit: bit.name, label: bit.name });
      }
    }
  }

  /* Check if emulator is running - use port LEDs from memory */
  const portB = emu.mem[0x25];
  const emuActive = emu.program.length > 0;

  return (
    <div className="mcu-viz">
      <div className="mcu-info">
        <span>{info.name}</span> @ <span>{info.freq}</span> | Flash:{" "}
        <span>{info.flash}</span> | SRAM: <span>{info.sram}</span>
      </div>

      {info.registers.map((reg) => (
        <div key={reg.name} className="mcu-reg">
          <div className="mcu-reg-name">
            {reg.name} <span className="mcu-reg-addr">{reg.addr}</span>
          </div>
          <div className="mcu-bits">
            {reg.bits.map((bit) => {
              const key = reg.name + "." + bit.name;
              const isHigh = bitState[key] || false;
              return (
                <div
                  key={key}
                  className={clsx("mcu-bit", isHigh ? "high" : "low")}
                  title={bit.name + " (" + bit.dir + ")"}
                  onClick={() => toggleBit(key)}
                >
                  {isHigh ? "1" : "0"}
                </div>
              );
            })}
          </div>
          <div className="mcu-bit-labels">
            {reg.bits.map((bit) => (
              <div key={bit.name + bit.bit} className="mcu-bit-label">
                {bit.name}
              </div>
            ))}
          </div>
        </div>
      ))}

      {(outputBits.length > 0 || emuActive) && (
        <div className="mcu-leds">
          {emuActive
            ? [
                { name: "LED", bit: 5 },
                { name: "BUZZER", bit: 4 },
                { name: "TX", bit: 1 },
              ].map((lb) => {
                const isOn = !!(portB & (1 << lb.bit));
                return (
                  <div key={lb.name} className="mcu-led">
                    <div className={clsx("mcu-led-dot", isOn ? "on" : "off")} />
                    <span>{lb.name}</span>
                  </div>
                );
              })
            : outputBits.map((ob) => {
                const isOn = bitState[ob.reg + "." + ob.bit] || false;
                return (
                  <div key={ob.reg + "." + ob.bit} className="mcu-led">
                    <div className={clsx("mcu-led-dot", isOn ? "on" : "off")} />
                    <span>{ob.label}</span>
                  </div>
                );
              })}
        </div>
      )}
    </div>
  );
};
