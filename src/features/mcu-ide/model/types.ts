/* ═══ MCU IDE Types ═══ */

export type Instruction = {
  op: string;
  args: string[];
  labels: Record<string, number>;
  addr: number;
};

export type EmulatorState = {
  regs: Uint8Array;
  pc: number;
  sp: number;
  flagZ: boolean;
  flagC: boolean;
  mem: Uint8Array;
  halted: boolean;
  output: string[];
  program: Instruction[];
};

export type BitDef = {
  bit: number;
  name: string;
  dir: string;
};

export type RegisterDef = {
  name: string;
  addr: string;
  bits: BitDef[];
};

export type McuInfo = {
  name: string;
  freq: string;
  flash: string;
  sram: string;
  registers: RegisterDef[];
  inits: { reg: string; bit: string; value: string }[];
};

export type McuPreviewTab = "registers" | "memory" | "output";
