import type { TerminalLine } from "@/features/cli-terminal/model/types";
import { dispatchCommand } from "@/shared/lib/terminalDispatch";

type CommandHandler = () => TerminalLine[];

const SDK_COMMANDS: Record<string, CommandHandler> = {
  help: () => [
    { type: "info", text: "Framework SDK CLI — Available commands:" },
    { type: "", text: "  scilab sdk init           Initialize SDK project" },
    { type: "", text: "  scilab sdk generate       Generate adapters" },
    { type: "", text: "  scilab sdk build          Build project" },
    { type: "", text: "  scilab sdk deploy         Deploy to staging" },
    { type: "", text: "  npm install               Install dependencies" },
    { type: "", text: "  npm test                  Run tests" },
    { type: "", text: "  npm run dev               Start dev server" },
    { type: "", text: "  scilab version            Show version" },
    { type: "", text: "  clear                     Clear terminal" },
  ],
  "scilab help": () => SDK_COMMANDS["help"](),
  "scilab sdk init": () => [
    { type: "success", text: "Creating new SDK project..." },
    { type: "", text: "  ├─ src/app.ts" },
    { type: "", text: "  ├─ src/hooks.ts" },
    { type: "", text: "  ├─ src/types.d.ts" },
    { type: "", text: "  ├─ adapters/telegram.ts" },
    { type: "", text: "  ├─ adapters/mock.ts" },
    { type: "", text: "  ├─ package.json" },
    { type: "", text: "  └─ README.md" },
    { type: "success", text: "SDK project initialized." },
  ],
  "scilab sdk generate": () => [
    { type: "info", text: "Generating adapter bindings..." },
    { type: "", text: "  Telegram adapter:  OK  (12 methods)" },
    { type: "", text: "  Mock adapter:      OK  (8 methods)" },
    { type: "success", text: "Generated 2 adapters in 84ms" },
  ],
  "scilab sdk build": () => [
    { type: "info", text: "Building SDK project..." },
    { type: "", text: "  TypeScript:  0 errors" },
    { type: "", text: "  Bundle:      12.4KB (gzip: 3.8KB)" },
    { type: "success", text: "Build complete in 320ms" },
  ],
  "scilab sdk deploy": () => [
    { type: "info", text: "Deploying SDK bot..." },
    { type: "", text: "  Image: scilab/sdk-bot:1.0.0" },
    { type: "", text: "  Push:  done (1.8s)" },
    { type: "", text: "  Health: 200 OK" },
    { type: "success", text: "Deployed to staging (2 replicas)" },
  ],
  "npm install": () => [
    { type: "", text: "added 42 packages in 3.2s" },
    { type: "", text: "" },
    { type: "", text: "3 packages are looking for funding" },
    { type: "", text: "  run `npm fund` for details" },
  ],
  "npm test": () => [
    { type: "", text: "> scibot-sdk@1.0.0 test" },
    { type: "", text: "> vitest run" },
    { type: "", text: "" },
    { type: "success", text: " PASS  src/app.test.ts (4 tests)" },
    { type: "success", text: " PASS  adapters/mock.test.ts (6 tests)" },
    { type: "", text: "" },
    { type: "success", text: "Test Files  2 passed (2)" },
    { type: "success", text: "Tests       10 passed (10)" },
  ],
  "npm run dev": () => [
    { type: "", text: "> scibot-sdk@1.0.0 dev" },
    { type: "", text: "> tsx watch src/app.ts" },
    { type: "success", text: "Bot started (mock adapter)" },
    { type: "", text: "  Listening for updates..." },
  ],
  "scilab version": () => [
    { type: "", text: "scilab-cli v2.4.1 (build 20260128)" },
  ],
  ls: () => [
    { type: "", text: "src/  adapters/  node_modules/  package.json  README.md" },
  ],
  "ls src": () => [{ type: "", text: "app.ts  hooks.ts  types.d.ts" }],
  pwd: () => [{ type: "", text: "/home/dev/scibot-sdk" }],
  clear: () => [],
};

export const processSdkCommand = (
  raw: string,
): TerminalLine[] | "clear" => dispatchCommand(raw, SDK_COMMANDS);
