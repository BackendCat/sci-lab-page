export const McuRegisterArch = () => (
  <g transform="translate(460,290)" opacity="0.09">
    <rect x="0" y="0" width="195" height="130" rx="3" stroke="#16e0bd" strokeWidth=".7" fill="none" />
    <line x1="0" y1="18" x2="195" y2="18" stroke="#16e0bd" strokeWidth=".5" />
    <line x1="0" y1="58" x2="195" y2="58" stroke="#16e0bd" strokeWidth=".3" />
    <text x="97" y="8" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="5" opacity=".7">«core» Emulator</text>
    <text x="97" y="15" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="8" fontWeight="700">CPU Pipeline</text>
    <text x="7" y="29" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">{"- pc: u16          // program counter"}</text>
    <text x="7" y="37" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">{"- sp: u8           // stack pointer"}</text>
    <text x="7" y="45" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">{"- regs: u8[8]      // R0..R7"}</text>
    <text x="7" y="53" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">{"- flags: {Z,C,N,V} // status register"}</text>
    <text x="7" y="68" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ fetch(): Instruction</text>
    <text x="7" y="76" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ decode(inst): DecodedOp</text>
    <text x="7" y="84" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ execute(op): CycleResult</text>
    <text x="7" y="92" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ writeback(result): void</text>
    <text x="7" y="100" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ checkInterrupts(): IntVec|null</text>
    <text x="7" y="108" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ readPort(addr: u8): u8</text>
    <text x="7" y="116" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ writePort(addr: u8, v: u8): void</text>
    <text x="7" y="124" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ dumpState(): SnapshotJSON</text>
    {/* Association to MemoryBus */}
    <line x1="195" y1="65" x2="230" y2="65" stroke="#16e0bd" strokeWidth=".5" />
    <polygon points="226,63 230,65 226,67" fill="#16e0bd" />
    <text x="213" y="60" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="4.5">uses</text>
    {/* MemoryBus */}
    <rect x="232" y="40" width="145" height="65" rx="3" stroke="#16e0bd" strokeWidth=".6" fill="none" />
    <line x1="232" y1="56" x2="377" y2="56" stroke="#16e0bd" strokeWidth=".4" />
    <text x="304" y="51" textAnchor="middle" fill="#16e0bd" fontFamily="monospace" fontSize="7" fontWeight="600">MemoryBus</text>
    <text x="239" y="66" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ read(addr: u16): u8</text>
    <text x="239" y="74" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ write(addr: u16, v: u8)</text>
    <text x="239" y="82" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ mapRegion(seg: Segment)</text>
    <text x="239" y="90" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ dump(start,len): u8[]</text>
    <text x="239" y="98" fill="#16e0bd" fontFamily="monospace" fontSize="5.5">+ getSegments(): SegInfo[]</text>
  </g>
);
