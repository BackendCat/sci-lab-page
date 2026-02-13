/* ═══ MCU Emulator Hook ═══ */

import { useCallback, useRef, useState } from "react";

import { createEmulator, emuStep, parseAsm, resetEmu } from "@/features/mcu-ide/lib/emulator";
import type { EmulatorState } from "@/features/mcu-ide/model/types";

export const useEmulator = () => {
  const stateRef = useRef<EmulatorState>(createEmulator());
  const [tick, setTick] = useState(0);

  const rerender = useCallback(() => setTick((t) => t + 1), []);

  const load = useCallback((code: string) => {
    const emu = stateRef.current;
    resetEmu(emu);
    const { program } = parseAsm(code);
    emu.program = program;
    for (let i = 0; i < program.length && i < 256; i++) {
      emu.mem[i] = i + 1;
    }
    rerender();
  }, [rerender]);

  const step = useCallback(() => {
    emuStep(stateRef.current);
    rerender();
  }, [rerender]);

  const run = useCallback((code: string, maxSteps = 500) => {
    load(code);
    const emu = stateRef.current;
    let steps = 0;
    while (emuStep(emu) && steps < maxSteps) steps++;
    rerender();
  }, [load, rerender]);

  const reset = useCallback(() => {
    resetEmu(stateRef.current);
    rerender();
  }, [rerender]);

  return {
    emu: stateRef.current,
    tick,
    load,
    step,
    run,
    reset,
  };
};
