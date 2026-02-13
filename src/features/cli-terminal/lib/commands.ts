import type { TerminalLine } from "@/features/cli-terminal/model/types";
import { dispatchCommand } from "@/shared/lib/terminalDispatch";

type CommandHandler = () => TerminalLine[];

export const CLI_COMMANDS: Record<string, CommandHandler> = {
  "help": () => [
    { type: "info", text: "Available commands:" },
    { type: "", text: "  scilab init <name>        Initialize a new project" },
    { type: "", text: "  scilab compile <file>     Compile DSL to deployable bundle" },
    { type: "", text: "  scilab validate <file>    Validate DSL syntax and types" },
    { type: "", text: "  scilab dev                Start dev server with hot-reload" },
    { type: "", text: "  scilab deploy             Deploy to staging or production" },
    { type: "", text: "  scilab rollback <id>      Rollback a deployment" },
    { type: "", text: "  scilab logs               Stream deployment logs" },
    { type: "", text: "  scilab health             Check service health" },
    { type: "", text: "  scilab mcu compile <f>    Compile MCU firmware" },
    { type: "", text: "  scilab mcu flash          Flash firmware to device" },
    { type: "", text: "  scilab status             Show project status" },
    { type: "", text: "  scilab version            Show CLI version" },
    { type: "", text: "  clear                     Clear terminal" },
  ],
  "scilab help": () => CLI_COMMANDS["help"](),
  "scilab version": () => [
    { type: "", text: "scilab-cli v2.4.1 (build 20260128, rust 1.78.0)" },
    { type: "", text: "Platform: linux-x64 | Node: v22.4.0 | Target: x86_64-unknown-linux-gnu" },
  ],
  "scilab init": () => [
    { type: "success", text: "Creating new SCI-LAB project..." },
    { type: "", text: "  Scaffolding project structure..." },
    { type: "", text: "  ├─ src/bot.flow" },
    { type: "", text: "  ├─ src/hooks.ts" },
    { type: "", text: "  ├─ scilab.config.ts" },
    { type: "", text: "  ├─ package.json" },
    { type: "", text: "  └─ .gitignore" },
    { type: "success", text: "Project initialized. Run `scilab dev` to start." },
  ],
  "scilab compile": () => [
    { type: "info", text: "Compiling src/bot.flow..." },
    { type: "", text: "  [1/4] Lexer:      27 tokens" },
    { type: "", text: "  [2/4] Parser:     AST built (5 pages, 12 transitions)" },
    { type: "", text: "  [3/4] Validator:  0 errors, 0 warnings" },
    { type: "", text: "  [4/4] Codegen:    Bundle 4.2KB (gzip: 1.1KB)" },
    { type: "success", text: "Compiled successfully in 142ms" },
    { type: "", text: "  Output: dist/bot.bundle.js + dist/bot.bundle.js.map" },
  ],
  "scilab validate": () => [
    { type: "info", text: "Validating src/bot.flow..." },
    { type: "", text: "  Parsing...         OK" },
    { type: "", text: "  Type checking...   OK" },
    { type: "", text: "  Flow analysis...   OK  (no dead pages, no orphan routes)" },
    { type: "", text: "  Hook resolution... OK  (3 hooks registered)" },
    { type: "success", text: "Validation passed. 0 errors, 0 warnings." },
  ],
  "scilab dev": () => [
    { type: "info", text: "Starting dev server..." },
    { type: "", text: "  Hot-reload:  enabled" },
    { type: "", text: "  Port:        3000" },
    { type: "", text: "  Webhook:     https://tunnel.scilab.dev/abc123" },
    { type: "success", text: "Dev server running at http://localhost:3000" },
    { type: "warn", text: "Watching for changes in src/**/*.{dsl,ts}" },
  ],
  "scilab deploy": () => [
    { type: "info", text: "Deploying to staging..." },
    { type: "", text: "  Building image... scilab/bot:0.3.1-rc.1" },
    { type: "", text: "  Pushing to registry... done (2.4s)" },
    { type: "", text: "  Rolling update: 0/2 → 1/2 → 2/2" },
    { type: "", text: "  Health check: 200 OK (p95: 12ms)" },
    { type: "success", text: "Deployed bot:0.3.1-rc.1 to staging (2 replicas)" },
    { type: "", text: "  Deployment ID: dep_8f3a91c2" },
  ],
  "scilab rollback": () => [
    { type: "warn", text: "Rolling back deployment dep_8f3a91c2..." },
    { type: "", text: "  Restoring image: scilab/bot:0.3.0" },
    { type: "", text: "  Rolling update: 0/2 → 1/2 → 2/2" },
    { type: "success", text: "Rollback complete. Active version: 0.3.0" },
  ],
  "scilab logs": () => [
    { type: "info", text: "Streaming logs from staging (2 pods)..." },
    { type: "", text: "  [pod-a] 12:04:01 INFO  FlowEngine: route /start (12ms)" },
    { type: "", text: "  [pod-b] 12:04:01 INFO  Session: new user_8f3a (cached)" },
    { type: "", text: "  [pod-a] 12:04:02 INFO  Hook: beforeRoute passed (3ms)" },
    { type: "", text: "  [pod-a] 12:04:02 INFO  FlowEngine: render welcome (8ms)" },
    { type: "", text: "  [pod-b] 12:04:03 WARN  RateLimit: user_c921 (42/min)" },
    { type: "", text: "  [pod-a] 12:04:03 INFO  Adapter: sent Telegram message (45ms)" },
    { type: "warn", text: "Press Ctrl+C to stop streaming" },
  ],
  "scilab health": () => [
    { type: "success", text: "All services healthy" },
    { type: "", text: "  API Gateway    ██████████  200 OK  (p99: 8ms)" },
    { type: "", text: "  FlowEngine     ██████████  200 OK  (p99: 14ms)" },
    { type: "", text: "  PostgreSQL     ██████████  200 OK  (pool: 8/20)" },
    { type: "", text: "  Redis          ██████████  200 OK  (mem: 42MB)" },
    { type: "", text: "  NATS           ██████████  200 OK  (msgs: 1.2K/s)" },
  ],
  "scilab status": () => [
    { type: "info", text: "Project: scilab-bot-demo" },
    { type: "", text: "  Version:    0.3.1-dev" },
    { type: "", text: "  Platform:   telegram" },
    { type: "", text: "  Pages:      5 (start, flowspec, mcu, workspace, deploy)" },
    { type: "", text: "  Hooks:      3 (beforeRoute, afterRender, onError)" },
    { type: "", text: "  Last build: 2m ago (dist/bot.bundle.js)" },
    { type: "", text: "  Staging:    dep_8f3a91c2 (2 replicas, healthy)" },
    { type: "", text: "  Production: dep_4e1b72a0 (4 replicas, healthy)" },
  ],
  "scilab mcu compile": () => [
    { type: "info", text: "Compiling firmware.asm (target: avr8)..." },
    { type: "", text: "  Assembler: 12 instructions, 0 errors" },
    { type: "", text: "  Memory:    24 bytes code, 0 bytes data" },
    { type: "", text: "  Output:    dist/firmware.hex (Intel HEX)" },
    { type: "success", text: "Firmware compiled in 28ms" },
  ],
  "scilab mcu flash": () => [
    { type: "info", text: "Flashing to /dev/ttyUSB0 @ 115200 baud..." },
    { type: "", text: "  Connecting...    OK (SCI-MCU-32 detected)" },
    { type: "", text: "  Erasing flash... OK" },
    { type: "", text: "  Writing:  ████████████████  24/24 bytes" },
    { type: "", text: "  Verifying... OK (checksum match)" },
    { type: "success", text: "Flash complete. Reset device to run." },
  ],
  /* Linux / shell commands */
  "ls": () => [
    { type: "", text: "src/  dist/  node_modules/  package.json  scilab.config.ts  .gitignore  README.md" },
  ],
  "ls -la": () => [
    { type: "", text: "total 42" },
    { type: "", text: "drwxr-xr-x  6 dev dev 4096 Feb 14 12:04 ." },
    { type: "", text: "drwxr-xr-x  3 dev dev 4096 Feb 14 10:30 .." },
    { type: "", text: "-rw-r--r--  1 dev dev   89 Feb 14 10:31 .gitignore" },
    { type: "", text: "drwxr-xr-x  2 dev dev 4096 Feb 14 12:04 dist" },
    { type: "", text: "drwxr-xr-x 48 dev dev 4096 Feb 14 10:32 node_modules" },
    { type: "", text: "-rw-r--r--  1 dev dev  482 Feb 14 10:32 package.json" },
    { type: "", text: "-rw-r--r--  1 dev dev  210 Feb 14 10:31 README.md" },
    { type: "", text: "-rw-r--r--  1 dev dev  145 Feb 14 10:31 scilab.config.ts" },
    { type: "", text: "drwxr-xr-x  3 dev dev 4096 Feb 14 11:55 src" },
  ],
  "ls -l": () => CLI_COMMANDS["ls -la"](),
  "ls src": () => [{ type: "", text: "bot.flow  hooks.ts  types.d.ts" }],
  "ls dist": () => [{ type: "", text: "bot.bundle.js  bot.bundle.js.map" }],
  "pwd": () => [{ type: "", text: "/home/dev/scilab-project" }],
  "whoami": () => [{ type: "", text: "dev" }],
  "echo": () => [{ type: "", text: "" }],
  "cat package.json": () => [
    { type: "", text: "{" },
    { type: "", text: '  "name": "scilab-bot-demo",' },
    { type: "", text: '  "version": "0.3.1",' },
    { type: "", text: '  "private": true,' },
    { type: "", text: '  "scripts": {' },
    { type: "", text: '    "dev": "scilab dev",' },
    { type: "", text: '    "build": "scilab compile src/bot.flow",' },
    { type: "", text: '    "deploy": "scilab deploy --env staging"' },
    { type: "", text: "  }," },
    { type: "", text: '  "dependencies": {' },
    { type: "", text: '    "@scilab/cli": "^2.4.1",' },
    { type: "", text: '    "@scilab/runtime": "^3.2.0"' },
    { type: "", text: "  }" },
    { type: "", text: "}" },
  ],
  "cat src/bot.flow": () => [
    { type: "", text: 'bot "SciBot" {' },
    { type: "", text: "  page start {" },
    { type: "", text: '    text "Welcome to SCI-LAB"' },
    { type: "", text: '    button "Explore" -> explore' },
    { type: "", text: "  }" },
    { type: "", text: "  page explore { ... }" },
    { type: "", text: "}" },
  ],
  "cat readme.md": () => [
    { type: "", text: "# scilab-bot-demo" },
    { type: "", text: "A demo bot project built with SCI-LAB CLI." },
  ],
  "date": () => [{ type: "", text: new Date().toUTCString() }],
  "uname": () => [{ type: "", text: "Linux scilab-dev 6.1.0 x86_64 GNU/Linux" }],
  "uname -a": () => [
    { type: "", text: "Linux scilab-dev 6.1.0-43-amd64 #1 SMP x86_64 GNU/Linux" },
  ],
  "env": () => [
    { type: "", text: "NODE_ENV=development" },
    { type: "", text: "SCILAB_VERSION=2.4.1" },
    { type: "", text: "HOME=/home/dev" },
    { type: "", text: "PWD=/home/dev/scilab-project" },
    { type: "", text: "SHELL=/bin/zsh" },
  ],
  "id": () => [{ type: "", text: "uid=1000(dev) gid=1000(dev) groups=1000(dev)" }],
  "df -h": () => [
    { type: "", text: "Filesystem  Size  Used  Avail  Use%  Mounted on" },
    { type: "", text: "overlay      20G  4.2G   15G   22%  /" },
    { type: "", text: "tmpfs        64M     0   64M    0%  /dev" },
  ],
  "free -h": () => [
    { type: "", text: "       total   used   free  shared  buff   available" },
    { type: "", text: "Mem:   4.0G   1.2G   2.1G    12M   680M   2.6G" },
  ],
  "uptime": () => [
    { type: "", text: " 12:04:01 up 2 days,  4:32,  1 user,  load average: 0.12, 0.08, 0.03" },
  ],
  "cd": () => [],
  "mkdir": () => [{ type: "error", text: "mkdir: permission denied" }],
  "rm": () => [{ type: "error", text: "rm: operation not permitted in sandbox" }],
  "ping": () => [{ type: "error", text: "ping: network is unreachable (sandbox mode)" }],
  "curl": () => [{ type: "error", text: "curl: (7) Failed to connect: network disabled in sandbox" }],
  "wget": () => [{ type: "error", text: "wget: unable to resolve host: network disabled in sandbox" }],
  "ssh": () => [{ type: "error", text: "ssh: network access denied in sandbox" }],
  "npm": () => [{ type: "info", text: 'npm 10.2.0 — use "scilab" commands for project management' }],
  "node": () => [
    { type: "", text: "Node.js v22.4.0 — press Ctrl+C to exit" },
    { type: "warn", text: "(interactive REPL not available in sandbox)" },
  ],
  "git status": () => [
    { type: "", text: "On branch main" },
    { type: "", text: "Changes not staged for commit:" },
    { type: "", text: "  modified:   src/bot.flow" },
    { type: "", text: "" },
    { type: "", text: "no changes added to commit" },
  ],
  "git log": () => [
    { type: "", text: "commit a3f8c21 (HEAD -> main)" },
    { type: "", text: "Author: dev <dev@scilab.dev>" },
    { type: "", text: "Date:   Fri Feb 14 10:31:00 2026" },
    { type: "", text: "    Initial project scaffold" },
  ],
};

export const processCommand = (raw: string): TerminalLine[] | "clear" => {
  const cmd = raw.trim().toLowerCase();

  /* Handle cat with arbitrary file (CLI-specific) */
  if (cmd.startsWith("cat ")) {
    const file = cmd.substring(4).trim();
    const key = "cat " + file;
    if (CLI_COMMANDS[key]) return CLI_COMMANDS[key]();
    return [{ type: "error", text: "cat: " + file + ": No such file or directory" }];
  }

  /* Handle cd with args (CLI-specific) */
  if (cmd.startsWith("cd ")) {
    return [{ type: "error", text: "cd: restricted in sandbox mode" }];
  }

  return dispatchCommand(raw, CLI_COMMANDS);
};
