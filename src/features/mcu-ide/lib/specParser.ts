/* ═══ MCU Spec Parser ═══ */

import type { McuInfo } from "@/features/mcu-ide/model/types";

export const parseMCU = (code: string): McuInfo => {
  const info: McuInfo = {
    name: "Unknown",
    freq: "?",
    flash: "?",
    sram: "?",
    registers: [],
    inits: [],
  };

  const nameMatch = code.match(/mcu\s+"([^"]+)"\s*@(\w+)/);
  if (nameMatch) {
    info.name = nameMatch[1];
    info.freq = nameMatch[2];
  }

  const flashMatch = code.match(/flash\s+(\w+)/);
  if (flashMatch) info.flash = flashMatch[1];

  const sramMatch = code.match(/sram\s+(\w+)/);
  if (sramMatch) info.sram = sramMatch[1];

  const regRegex = /register\s+(\w+)\s+(0x[\da-fA-F]+)\s*\{([^}]+)\}/g;
  let m: RegExpExecArray | null;
  while ((m = regRegex.exec(code)) !== null) {
    const reg = { name: m[1], addr: m[2], bits: [] as McuInfo["registers"][0]["bits"] };
    const lines = m[3].split("\n");
    for (const line of lines) {
      const bitMatch = line.match(/bit\[(\d)\]\s+(\w+)\s*(output|input|bidir)?/);
      if (bitMatch) {
        reg.bits.push({
          bit: parseInt(bitMatch[1]),
          name: bitMatch[2],
          dir: bitMatch[3] || "nc",
        });
      }
    }
    reg.bits.sort((a, b) => b.bit - a.bit);
    info.registers.push(reg);
  }

  const initMatch = code.match(/init\s*\{([^}]+)\}/);
  if (initMatch) {
    const lines = initMatch[1].split("\n");
    for (const line of lines) {
      const setMatch = line.match(/set\s+(\w+)\.(\w+)\s+(high|low)/);
      if (setMatch) {
        info.inits.push({
          reg: setMatch[1],
          bit: setMatch[2],
          value: setMatch[3],
        });
      }
    }
  }

  return info;
};
