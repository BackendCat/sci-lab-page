/* ═══ MCU Tiny Emulator ═══ */

import type { EmulatorState, Instruction } from "@/features/mcu-ide/model/types";

const resolveVal = (s: string | undefined, labels: Record<string, number>): number | null => {
  if (!s) return 0;
  s = s.trim();
  if (/^R[0-7]$/i.test(s)) return null;
  if (labels && labels[s] !== undefined) return labels[s];
  if (s.startsWith("0x") || s.startsWith("0X")) return parseInt(s, 16) & 0xff;
  return parseInt(s, 10) & 0xff;
};

const regIdx = (s: string): number | null => {
  const m = s.match(/^R([0-7])$/i);
  return m ? parseInt(m[1]) : null;
};

export const parseAsm = (code: string): { program: Instruction[]; labels: Record<string, number> } => {
  const labels: Record<string, number> = {};
  const insts: { src: string; addr: number }[] = [];
  const lines = code.split("\n");
  let addr = 0;

  for (const raw of lines) {
    const line = raw.replace(/;.*$/, "").trim();
    if (!line) continue;
    const labelMatch = line.match(/^(\w+):$/);
    if (labelMatch) {
      labels[labelMatch[1]] = addr;
      continue;
    }
    insts.push({ src: line, addr });
    addr++;
  }

  const program: Instruction[] = [];
  for (const inst of insts) {
    const parts = inst.src.split(/[\s,]+/).filter(Boolean);
    const op = parts[0].toUpperCase();
    const args = parts.slice(1);
    program.push({ op, args, labels, addr: inst.addr });
  }

  return { program, labels };
};

/* ---- Instruction context passed to each handler ---- */
type InstrCtx = {
  s: EmulatorState;
  a: string[];
  L: Record<string, number>;
};

/* Returns false to suppress auto-advance of PC */
type InstrHandler = (ctx: InstrCtx) => boolean | void;

/* ---- Helpers shared by multiple handlers ---- */
const regOrVal = (
  arg: string,
  regs: Uint8Array,
  labels: Record<string, number>,
): number => {
  const r = regIdx(arg);
  return r !== null ? regs[r] : resolveVal(arg, labels) ?? 0;
};

const aluOp = (
  ctx: InstrCtx,
  fn: (a: number, b: number) => number,
  setCarry?: (result: number) => boolean,
): void => {
  const r = regIdx(ctx.a[0]);
  if (r === null) return;
  const v = regOrVal(ctx.a[1], ctx.s.regs, ctx.L);
  const result = fn(ctx.s.regs[r], v);
  if (setCarry) ctx.s.flagC = setCarry(result);
  ctx.s.regs[r] = result & 0xff;
  ctx.s.flagZ = ctx.s.regs[r] === 0;
};

const condJump = (ctx: InstrCtx, condition: boolean): boolean | void => {
  const target = resolveVal(ctx.a[0], ctx.L);
  if (condition && target !== null) {
    ctx.s.pc = target;
    return false;
  }
};

/* ---- Declarative instruction handler map ---- */
const INSTRUCTION_HANDLERS: Record<string, InstrHandler> = {
  NOP: () => {},
  HALT: ({ s }) => { s.halted = true; },

  LDI: ({ s, a, L }) => {
    const r = regIdx(a[0]);
    const v = resolveVal(a[1], L);
    if (r !== null && v !== null) s.regs[r] = v & 0xff;
  },
  MOV: ({ s, a }) => {
    const r1 = regIdx(a[0]);
    const r2 = regIdx(a[1]);
    if (r1 !== null && r2 !== null) s.regs[r1] = s.regs[r2];
  },

  ADD: (ctx) => aluOp(ctx, (a, b) => a + b, (r) => r > 255),
  SUB: (ctx) => aluOp(ctx, (a, b) => a - b, (r) => r < 0),
  AND: (ctx) => aluOp(ctx, (a, b) => a & b),
  OR:  (ctx) => aluOp(ctx, (a, b) => a | b),
  XOR: (ctx) => aluOp(ctx, (a, b) => a ^ b),

  NOT: ({ s, a }) => {
    const r = regIdx(a[0]);
    if (r === null) return;
    s.regs[r] = (~s.regs[r]) & 0xff;
    s.flagZ = s.regs[r] === 0;
  },
  SHL: ({ s, a }) => {
    const r = regIdx(a[0]);
    if (r === null) return;
    s.flagC = !!(s.regs[r] & 0x80);
    s.regs[r] = (s.regs[r] << 1) & 0xff;
    s.flagZ = s.regs[r] === 0;
  },
  SHR: ({ s, a }) => {
    const r = regIdx(a[0]);
    if (r === null) return;
    s.flagC = !!(s.regs[r] & 1);
    s.regs[r] >>= 1;
    s.flagZ = s.regs[r] === 0;
  },
  CMP: ({ s, a, L }) => {
    const r = regIdx(a[0]);
    if (r === null) return;
    const v = regOrVal(a[1], s.regs, L);
    const res = s.regs[r] - v;
    s.flagZ = (res & 0xff) === 0;
    s.flagC = res < 0;
  },

  JMP: (ctx) => condJump(ctx, true),
  JZ:  (ctx) => condJump(ctx, ctx.s.flagZ),
  JNZ: (ctx) => condJump(ctx, !ctx.s.flagZ),
  JC:  (ctx) => condJump(ctx, ctx.s.flagC),

  LOAD: ({ s, a, L }) => {
    const r = regIdx(a[0]);
    const addr = resolveVal(a[1], L) ?? 0;
    if (r !== null) s.regs[r] = s.mem[addr & 0xff];
  },
  STORE: ({ s, a, L }) => {
    const addr = resolveVal(a[0], L) ?? 0;
    const r = regIdx(a[1]);
    if (r !== null) s.mem[addr & 0xff] = s.regs[r];
  },
  PUSH: ({ s, a }) => {
    const r = regIdx(a[0]);
    if (r === null) return;
    s.mem[s.sp] = s.regs[r];
    s.sp = (s.sp - 1) & 0xff;
  },
  POP: ({ s, a }) => {
    const r = regIdx(a[0]);
    if (r === null) return;
    s.sp = (s.sp + 1) & 0xff;
    s.regs[r] = s.mem[s.sp];
  },
  OUT: ({ s, a, L }) => {
    const port = resolveVal(a[0], L) ?? 0;
    const r = regIdx(a[1]);
    if (r === null) return;
    const v = s.regs[r];
    const hex = (n: number) => n.toString(16).padStart(2, "0");
    s.output.push(`OUT 0x${hex(port)} = 0x${hex(v)} (${v.toString(2).padStart(8, "0")})`);
    s.mem[port & 0xff] = v;
  },
  IN: ({ s, a, L }) => {
    const r = regIdx(a[0]);
    const port = resolveVal(a[1], L) ?? 0;
    if (r !== null) s.regs[r] = s.mem[port & 0xff];
  },
};

export const emuStep = (state: EmulatorState): boolean => {
  if (state.halted || state.pc >= state.program.length) return false;
  const inst = state.program[state.pc];
  const ctx: InstrCtx = { s: state, a: inst.args, L: inst.labels };

  const handler = INSTRUCTION_HANDLERS[inst.op];
  if (handler) {
    const result = handler(ctx);
    if (result !== false) state.pc++;
  } else {
    state.output.push("Unknown: " + inst.op);
    state.pc++;
  }

  return !state.halted;
};

export const resetEmu = (state: EmulatorState): void => {
  state.regs.fill(0);
  state.pc = 0;
  state.sp = 0xff;
  state.flagZ = false;
  state.flagC = false;
  state.mem.fill(0);
  state.halted = false;
  state.output = [];
  state.program = [];
};

export const createEmulator = (): EmulatorState => ({
  regs: new Uint8Array(8),
  pc: 0,
  sp: 0xff,
  flagZ: false,
  flagC: false,
  mem: new Uint8Array(256),
  halted: false,
  output: [],
  program: [],
});
