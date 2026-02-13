import type { ReactNode } from "react";

export type ArchitectureCard = {
  tag: string;
  tagClass: string;
  color: string;
  title: string;
  desc: string;
  link: string;
  linkText: string;
  svg: ReactNode;
};

export const ARCHITECTURE_CARDS: ArchitectureCard[] = [
  {
    tag: "Bot Infrastructure",
    tagClass: "tag-teal",
    color: "#16e0bd",
    title: "FlowSpec Engine",
    desc: "DSL compiler, AST validation, hot-reload deployment pipeline, worker pool orchestration with session state serialization.",
    link: "#flowspec",
    linkText: "Explore FlowSpec",
    svg: (
      <>
        <rect x="10" y="5" width="25" height="16" rx="3" stroke="#16e0bd" strokeWidth="1.2" fill="none" />
        <rect x="45" y="5" width="25" height="16" rx="3" stroke="#16e0bd" strokeWidth="1.2" fill="none" />
        <rect x="27" y="35" width="25" height="16" rx="3" stroke="#16e0bd" strokeWidth="1.2" fill="none" />
        <rect x="10" y="60" width="25" height="16" rx="3" stroke="#16e0bd" strokeWidth="1.2" fill="none" />
        <rect x="45" y="60" width="25" height="16" rx="3" stroke="#16e0bd" strokeWidth="1.2" fill="none" />
        <line x1="22" y1="21" x2="35" y2="35" stroke="#16e0bd" strokeWidth=".8" opacity=".5" />
        <line x1="57" y1="21" x2="45" y2="35" stroke="#16e0bd" strokeWidth=".8" opacity=".5" />
        <line x1="35" y1="51" x2="22" y2="60" stroke="#16e0bd" strokeWidth=".8" opacity=".5" />
        <line x1="45" y1="51" x2="57" y2="60" stroke="#16e0bd" strokeWidth=".8" opacity=".5" />
      </>
    ),
  },
  {
    tag: "Hardware Emulation",
    tagClass: "tag-purple",
    color: "#7c5cfc",
    title: "Emulator Core",
    desc: "Register mapping, cycle-accurate execution engine, interrupt simulation, memory visualization with pluggable decoder architecture.",
    link: "#mcu",
    linkText: "Explore Emulator",
    svg: (
      <>
        <rect x="20" y="20" width="40" height="40" rx="4" stroke="#7c5cfc" strokeWidth="1.2" fill="none" />
        <circle cx="40" cy="40" r="8" stroke="#7c5cfc" strokeWidth=".8" fill="none" />
        {[30, 40, 50].map((y) => (
          <g key={`l-${y}`}><line x1="20" y1={y} x2="10" y2={y} stroke="#7c5cfc" strokeWidth=".8" /><circle cx="8" cy={y} r="2" fill="#7c5cfc" opacity=".4" /></g>
        ))}
        {[30, 40, 50].map((y) => (
          <g key={`r-${y}`}><line x1="60" y1={y} x2="70" y2={y} stroke="#7c5cfc" strokeWidth=".8" /><circle cx="72" cy={y} r="2" fill="#7c5cfc" opacity=".4" /></g>
        ))}
        {[30, 40, 50].map((x) => (
          <g key={`t-${x}`}><line x1={x} y1="20" x2={x} y2="10" stroke="#7c5cfc" strokeWidth=".8" /><circle cx={x} cy="8" r="2" fill="#7c5cfc" opacity=".4" /></g>
        ))}
      </>
    ),
  },
  {
    tag: "Distributed Systems",
    tagClass: "tag-blue",
    color: "#3b82f6",
    title: "Workspace System",
    desc: "CRDT synchronization, event sourcing engine, plugin sandbox with capability security, multi-tenant cryptographic isolation.",
    link: "#workspace",
    linkText: "Explore Workspace",
    svg: (
      <>
        <circle cx="40" cy="20" r="6" stroke="#3b82f6" strokeWidth="1" fill="none" />
        <circle cx="15" cy="50" r="6" stroke="#3b82f6" strokeWidth="1" fill="none" />
        <circle cx="65" cy="50" r="6" stroke="#3b82f6" strokeWidth="1" fill="none" />
        <circle cx="25" cy="70" r="6" stroke="#3b82f6" strokeWidth="1" fill="none" />
        <circle cx="55" cy="70" r="6" stroke="#3b82f6" strokeWidth="1" fill="none" />
        <line x1="40" y1="26" x2="15" y2="44" stroke="#3b82f6" strokeWidth=".7" opacity=".4" />
        <line x1="40" y1="26" x2="65" y2="44" stroke="#3b82f6" strokeWidth=".7" opacity=".4" />
        <line x1="15" y1="56" x2="25" y2="64" stroke="#3b82f6" strokeWidth=".7" opacity=".4" />
        <line x1="65" y1="56" x2="55" y2="64" stroke="#3b82f6" strokeWidth=".7" opacity=".4" />
        <line x1="15" y1="50" x2="65" y2="50" stroke="#3b82f6" strokeWidth=".5" opacity=".25" strokeDasharray="3 3" />
        <line x1="25" y1="70" x2="55" y2="70" stroke="#3b82f6" strokeWidth=".5" opacity=".25" strokeDasharray="3 3" />
      </>
    ),
  },
  {
    tag: "Developer Tooling",
    tagClass: "",
    color: "#f59e0b",
    title: "CLI Toolchain",
    desc: "Project scaffolding, DSL compilation with source maps, zero-downtime deployments, log streaming, MCU firmware flash.",
    link: "#cli",
    linkText: "Explore CLI",
    svg: (
      <>
        <rect x="8" y="20" width="64" height="44" rx="5" stroke="#f59e0b" strokeWidth="1.2" fill="none" />
        <rect x="12" y="26" width="56" height="32" rx="2" fill="rgba(245,158,11,0.06)" />
        <text x="16" y="37" fill="#f59e0b" fontFamily="monospace" fontSize="6.5" fontWeight="600">$ scilab</text>
        <text x="16" y="47" fill="#f59e0b" fontFamily="monospace" fontSize="5.5" opacity=".6">  compile</text>
        <text x="16" y="55" fill="#22c55e" fontFamily="monospace" fontSize="5.5" opacity=".6">  OK 142ms</text>
        <rect x="12" y="60" width="8" height="2" rx="1" fill="#f59e0b" opacity=".5" />
      </>
    ),
  },
  {
    tag: "Framework SDK",
    tagClass: "tag-teal",
    color: "#16e0bd",
    title: "Plugin Framework",
    desc: "Middleware pipeline, adapter registry, lifecycle hooks, typed event bus with dead-letter queue and backpressure handling.",
    link: "#framework",
    linkText: "Explore SDK",
    svg: (
      <>
        <rect x="15" y="10" width="50" height="12" rx="3" stroke="#16e0bd" strokeWidth="1" fill="none" />
        <rect x="10" y="30" width="22" height="12" rx="3" stroke="#16e0bd" strokeWidth="1" fill="none" />
        <rect x="48" y="30" width="22" height="12" rx="3" stroke="#16e0bd" strokeWidth="1" fill="none" />
        <rect x="10" y="52" width="22" height="12" rx="3" stroke="#16e0bd" strokeWidth="1" fill="none" />
        <rect x="29" y="52" width="22" height="12" rx="3" stroke="#16e0bd" strokeWidth="1" fill="none" />
        <rect x="48" y="52" width="22" height="12" rx="3" stroke="#16e0bd" strokeWidth="1" fill="none" />
        <line x1="30" y1="22" x2="21" y2="30" stroke="#16e0bd" strokeWidth=".7" opacity=".4" />
        <line x1="50" y1="22" x2="59" y2="30" stroke="#16e0bd" strokeWidth=".7" opacity=".4" />
        <line x1="21" y1="42" x2="21" y2="52" stroke="#16e0bd" strokeWidth=".7" opacity=".4" />
        <line x1="59" y1="42" x2="59" y2="52" stroke="#16e0bd" strokeWidth=".7" opacity=".4" />
        <line x1="40" y1="22" x2="40" y2="52" stroke="#16e0bd" strokeWidth=".5" opacity=".25" strokeDasharray="2 2" />
      </>
    ),
  },
  {
    tag: "Security Layer",
    tagClass: "",
    color: "#f472b6",
    title: "Auth & Isolation",
    desc: "JWT token rotation, RBAC permission engine, encrypted secrets vault, sandboxed plugin execution with syscall filtering.",
    link: "#architecture",
    linkText: "Learn More",
    svg: (
      <>
        <circle cx="40" cy="35" r="18" stroke="#f472b6" strokeWidth="1.2" fill="none" />
        <rect x="32" y="28" width="16" height="14" rx="2" stroke="#f472b6" strokeWidth="1" fill="none" />
        <rect x="36" y="20" width="8" height="10" rx="4" stroke="#f472b6" strokeWidth="1" fill="none" />
        <circle cx="40" cy="34" r="2" fill="#f472b6" opacity=".6" />
        <line x1="40" y1="36" x2="40" y2="39" stroke="#f472b6" strokeWidth="1" opacity=".6" />
        <circle cx="40" cy="35" r="25" stroke="#f472b6" strokeWidth=".5" opacity=".15" strokeDasharray="3 3" fill="none" />
      </>
    ),
  },
  {
    tag: "Data Pipeline",
    tagClass: "tag-blue",
    color: "#3b82f6",
    title: "Stream Processor",
    desc: "Back-pressure aware message queues, exactly-once delivery guarantees, configurable windowing functions, real-time aggregation.",
    link: "#architecture",
    linkText: "Learn More",
    svg: (
      <>
        <rect x="5" y="32" width="14" height="14" rx="3" stroke="#3b82f6" strokeWidth="1" fill="none" />
        <rect x="33" y="15" width="14" height="14" rx="3" stroke="#3b82f6" strokeWidth="1" fill="none" />
        <rect x="33" y="50" width="14" height="14" rx="3" stroke="#3b82f6" strokeWidth="1" fill="none" />
        <rect x="61" y="32" width="14" height="14" rx="3" stroke="#3b82f6" strokeWidth="1" fill="none" />
        <path d="M19 36 L33 22" stroke="#3b82f6" strokeWidth=".8" opacity=".5" />
        <path d="M19 42 L33 56" stroke="#3b82f6" strokeWidth=".8" opacity=".5" />
        <path d="M47 22 L61 36" stroke="#3b82f6" strokeWidth=".8" opacity=".5" />
        <path d="M47 56 L61 42" stroke="#3b82f6" strokeWidth=".8" opacity=".5" />
        <circle cx="26" cy="29" r="1.5" fill="#3b82f6" opacity=".5" />
        <circle cx="26" cy="49" r="1.5" fill="#3b82f6" opacity=".5" />
        <circle cx="54" cy="29" r="1.5" fill="#3b82f6" opacity=".5" />
        <circle cx="54" cy="49" r="1.5" fill="#3b82f6" opacity=".5" />
      </>
    ),
  },
  {
    tag: "Deployment",
    tagClass: "tag-purple",
    color: "#7c5cfc",
    title: "CI/CD Pipeline",
    desc: "GitOps-driven releases, canary deployments with automatic rollback, artifact caching, parallel test orchestration across targets.",
    link: "#architecture",
    linkText: "Learn More",
    svg: (
      <>
        <circle cx="15" cy="40" r="8" stroke="#7c5cfc" strokeWidth="1" fill="none" />
        <text x="12" y="43" fill="#7c5cfc" fontFamily="monospace" fontSize="8" fontWeight="600">G</text>
        <rect x="30" y="15" width="20" height="10" rx="2" stroke="#7c5cfc" strokeWidth=".8" fill="none" />
        <text x="33" y="23" fill="#7c5cfc" fontFamily="monospace" fontSize="5.5">build</text>
        <rect x="30" y="35" width="20" height="10" rx="2" stroke="#7c5cfc" strokeWidth=".8" fill="none" />
        <text x="34" y="43" fill="#7c5cfc" fontFamily="monospace" fontSize="5.5">test</text>
        <rect x="30" y="55" width="20" height="10" rx="2" stroke="#7c5cfc" strokeWidth=".8" fill="none" />
        <text x="31" y="63" fill="#7c5cfc" fontFamily="monospace" fontSize="5.5">deploy</text>
        <line x1="23" y1="35" x2="30" y2="20" stroke="#7c5cfc" strokeWidth=".6" opacity=".4" />
        <line x1="23" y1="40" x2="30" y2="40" stroke="#7c5cfc" strokeWidth=".6" opacity=".4" />
        <line x1="23" y1="45" x2="30" y2="60" stroke="#7c5cfc" strokeWidth=".6" opacity=".4" />
        <rect x="58" y="30" width="16" height="20" rx="3" stroke="#7c5cfc" strokeWidth=".8" opacity=".6" fill="none" />
        <line x1="50" y1="40" x2="58" y2="40" stroke="#7c5cfc" strokeWidth=".6" opacity=".4" />
        <circle cx="62" cy="37" r="1.2" fill="#22c55e" opacity=".6" />
        <circle cx="66" cy="37" r="1.2" fill="#22c55e" opacity=".6" />
        <circle cx="70" cy="37" r="1.2" fill="#22c55e" opacity=".6" />
      </>
    ),
  },
];
