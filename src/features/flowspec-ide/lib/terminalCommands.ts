import type { TerminalLine } from "@/features/cli-terminal/model/types";
import { dispatchCommand } from "@/shared/lib/terminalDispatch";

type CommandHandler = () => TerminalLine[];

const FLOWSPEC_COMMANDS: Record<string, CommandHandler> = {
  help: () => [
    { type: "info", text: "FlowSpec CLI — Available commands:" },
    { type: "", text: "  scilab flow validate      Validate DSL syntax" },
    { type: "", text: "  scilab flow compile       Compile to bundle" },
    { type: "", text: "  scilab flow visualize     Generate flow graph" },
    { type: "", text: "  scilab init               Initialize project" },
    { type: "", text: "  scilab dev                Start dev server" },
    { type: "", text: "  scilab deploy             Deploy to staging" },
    { type: "", text: "  scilab logs               Stream logs" },
    { type: "", text: "  scilab status             Project status" },
    { type: "", text: "  scilab version            Show version" },
    { type: "", text: "  clear                     Clear terminal" },
  ],
  "scilab help": () => FLOWSPEC_COMMANDS["help"](),
  "scilab flow validate": () => [
    { type: "info", text: "Validating src/flowspec.flow..." },
    { type: "", text: "  Parsing...         OK" },
    { type: "", text: "  Type checking...   OK" },
    { type: "", text: "  Flow analysis...   OK  (no dead pages, no orphan routes)" },
    { type: "", text: "  Hook resolution... OK  (3 hooks registered)" },
    { type: "success", text: "Validation passed. 0 errors, 0 warnings." },
  ],
  "scilab flow compile": () => [
    { type: "info", text: "Compiling src/flowspec.flow..." },
    { type: "", text: "  [1/4] Lexer:      27 tokens" },
    { type: "", text: "  [2/4] Parser:     AST built (5 pages, 12 transitions)" },
    { type: "", text: "  [3/4] Validator:  0 errors, 0 warnings" },
    { type: "", text: "  [4/4] Codegen:    Bundle 4.2KB (gzip: 1.1KB)" },
    { type: "success", text: "Compiled successfully in 142ms" },
    { type: "", text: "  Output: dist/bot.bundle.js + dist/bot.bundle.js.map" },
  ],
  "scilab flow visualize": () => [
    { type: "info", text: "Generating flow graph..." },
    { type: "", text: "  Pages:       5 (start, flowspec, mcu, workspace, deploy)" },
    { type: "", text: "  Transitions: 12" },
    { type: "", text: "  Orphans:     0" },
    { type: "success", text: "Graph written to dist/flow-graph.svg" },
  ],
  "scilab init": () => [
    { type: "success", text: "Creating new FlowSpec project..." },
    { type: "", text: "  Scaffolding project structure..." },
    { type: "", text: "  ├─ src/flowspec.flow" },
    { type: "", text: "  ├─ src/hooks.ts" },
    { type: "", text: "  ├─ config/deploy.yaml" },
    { type: "", text: "  ├─ package.json" },
    { type: "", text: "  └─ .gitignore" },
    { type: "success", text: "Project initialized. Run `scilab dev` to start." },
  ],
  "scilab dev": () => [
    { type: "info", text: "Starting dev server..." },
    { type: "", text: "  Hot-reload:  enabled" },
    { type: "", text: "  Port:        3000" },
    { type: "", text: "  Webhook:     https://tunnel.scilab.dev/abc123" },
    { type: "success", text: "Dev server running at http://localhost:3000" },
    { type: "warn", text: "Watching for changes in src/**/*.{flow,ts}" },
  ],
  "scilab deploy": () => [
    { type: "info", text: "Deploying to staging..." },
    { type: "", text: "  Building image... scilab/bot:0.3.1-rc.1" },
    { type: "", text: "  Pushing to registry... done (2.4s)" },
    { type: "", text: "  Rolling update: 0/2 → 1/2 → 2/2" },
    { type: "", text: "  Health check: 200 OK (p95: 12ms)" },
    { type: "success", text: "Deployed bot:0.3.1-rc.1 to staging (2 replicas)" },
  ],
  "scilab logs": () => [
    { type: "info", text: "Streaming logs from staging..." },
    { type: "", text: "  [pod-a] 12:04:01 INFO  FlowEngine: route /start (12ms)" },
    { type: "", text: "  [pod-b] 12:04:01 INFO  Session: new user_8f3a (cached)" },
    { type: "", text: "  [pod-a] 12:04:02 INFO  Hook: beforeRoute passed (3ms)" },
    { type: "warn", text: "Press Ctrl+C to stop streaming" },
  ],
  "scilab status": () => [
    { type: "info", text: "Project: scibot-flowspec" },
    { type: "", text: "  Version:    0.3.1-dev" },
    { type: "", text: "  Pages:      5 (start, flowspec, mcu, workspace, deploy)" },
    { type: "", text: "  Hooks:      3 (beforeRoute, afterRender, onError)" },
    { type: "", text: "  Last build: 2m ago" },
  ],
  "scilab version": () => [
    { type: "", text: "scilab-cli v2.4.1 (build 20260128)" },
  ],
  ls: () => [
    { type: "", text: "src/  config/  node_modules/  package.json  tsconfig.json  README.md" },
  ],
  "ls src": () => [{ type: "", text: "flowspec.flow  hooks.ts" }],
  pwd: () => [{ type: "", text: "/home/dev/scibot-project" }],
  clear: () => [],
};

export const processFlowSpecCommand = (
  raw: string,
): TerminalLine[] | "clear" => dispatchCommand(raw, FLOWSPEC_COMMANDS);
