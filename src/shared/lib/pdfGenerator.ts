/**
 * Raw PDF 1.4 generator — creates simple A4 PDFs with headers, code blocks,
 * and styled text. No external dependencies.
 */

type PdfSection = {
  title: string;
  body: string;
  type?: "text" | "code";
};

const PDF_FONT_SIZE = 11;
const PDF_CODE_SIZE = 9;
const PDF_LINE_HEIGHT = 14;
const PDF_CODE_LINE_HEIGHT = 12;
const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

const escPdf = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

export const generatePDF = (title: string, sections: PdfSection[]): Blob => {
  const objects: string[] = [];
  let objCount = 0;

  const addObj = (content: string): number => {
    objCount++;
    objects.push(`${objCount} 0 obj\n${content}\nendobj`);
    return objCount;
  };

  // Catalog, Pages, Font
  addObj("<< /Type /Catalog /Pages 2 0 R >>"); // 1
  const pagesRef = addObj("<< /Type /Pages /Kids [] /Count 0 >>"); // 2 (placeholder)
  addObj(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ); // 3
  addObj(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>",
  ); // 4

  // Build content lines
  const lines: { text: string; size: number; bold?: boolean; code?: boolean; y: number }[] = [];
  let y = PAGE_HEIGHT - MARGIN;

  const addLine = (text: string, size: number, bold?: boolean, code?: boolean) => {
    const lh = code ? PDF_CODE_LINE_HEIGHT : PDF_LINE_HEIGHT;
    if (y - lh < MARGIN) y = PAGE_HEIGHT - MARGIN; // new page (simplified)
    lines.push({ text, size, bold, code, y });
    y -= lh;
  };

  // Title
  addLine(title, 18, true);
  addLine("", PDF_FONT_SIZE);

  for (const section of sections) {
    addLine(section.title, 14, true);
    addLine("", 6);

    const sectionLines = section.body.split("\n");
    const isCode = section.type === "code";
    for (const line of sectionLines) {
      addLine(line, isCode ? PDF_CODE_SIZE : PDF_FONT_SIZE, false, isCode);
    }
    addLine("", PDF_FONT_SIZE);
  }

  // Build stream content
  let stream = "BT\n";
  for (const line of lines) {
    const font = line.code ? "/F2" : "/F1";
    stream += `${font} ${line.size} Tf\n`;
    stream += `${MARGIN} ${line.y} Td\n`;
    stream += `(${escPdf(line.text)}) Tj\n`;
  }
  stream += "ET\n";

  const streamObj = addObj(
    `<< /Length ${stream.length} >>\nstream\n${stream}endstream`,
  );

  // Page object
  const pageObj = addObj(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      `/Contents ${streamObj} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> >>`,
  );

  // Fix pages object
  objects[1] = `2 0 obj\n<< /Type /Pages /Kids [${pageObj} 0 R] /Count 1 >>\nendobj`;

  // Build PDF
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj + "\n";
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objCount + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (const off of offsets) {
    pdf += off.toString().padStart(10, "0") + " 00000 n \n";
  }
  pdf += `trailer\n<< /Size ${objCount + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const downloadFlowSpecPDF = () => {
  const blob = generatePDF("FlowSpec DSL Reference", [
    {
      title: "Overview",
      body: "FlowSpec is a declarative DSL for building conversational bot flows.\nIt compiles to JavaScript bundles with hot-reload support.",
    },
    {
      title: "Syntax",
      body: 'bot "name" {\n  page name {\n    text "message"\n    button "label" -> target\n  }\n}',
      type: "code",
    },
    {
      title: "Commands",
      body: "scilab flow validate  - Validate DSL syntax\nscilab flow compile  - Compile to bundle\nscilab dev           - Start dev server\nscilab deploy        - Deploy to staging",
      type: "code",
    },
  ]);
  downloadBlob(blob, "flowspec-reference.pdf");
};

export const downloadSDKRefPDF = () => {
  const blob = generatePDF("Framework SDK Reference", [
    {
      title: "Overview",
      body: "The SCI-LAB Framework SDK provides a TypeScript-first bot development\nexperience with middleware, adapters, and typed event bus.",
    },
    {
      title: "Quick Start",
      body: "import { Bot, InlineKeyboard } from '@scibot/sdk';\n\nconst bot = new Bot({ token: process.env.BOT_TOKEN });\nbot.command('start', (ctx) => ctx.reply('Hello!'));\nbot.launch();",
      type: "code",
    },
    {
      title: "API",
      body: "Bot          - Main bot class\nInlineKeyboard - Inline keyboard builder\nKeyboard     - Reply keyboard builder\nMockAdapter  - Testing adapter",
    },
  ]);
  downloadBlob(blob, "sdk-reference.pdf");
};

export const downloadCLIRefPDF = () => {
  const blob = generatePDF("CLI Toolchain Reference", [
    {
      title: "Overview",
      body: "The SCI-LAB CLI provides a unified command-line interface for project\nscaffolding, DSL compilation, deployment, and MCU firmware operations.\nInstall globally via npm install -g @scilab/cli.",
    },
    {
      title: "Core Commands",
      body: "scilab init [template]    - Scaffold new project\nscilab dev                - Start development server\nscilab build              - Build for production\nscilab deploy [env]       - Deploy to environment\nscilab flow validate      - Validate FlowSpec DSL\nscilab flow compile       - Compile DSL to bundle\nscilab mcu flash [file]   - Flash firmware to MCU\nscilab mcu monitor        - Open serial monitor\nscilab logs [service]     - Stream service logs\nscilab test               - Run test suite",
      type: "code",
    },
    {
      title: "Project Templates",
      body: "bot-basic       - Minimal bot with FlowSpec\nbot-advanced    - Full SDK with middleware pipeline\nmcu-bare        - Bare-metal MCU project\nmcu-rtos        - MCU with RTOS scheduler\nmonorepo        - Multi-package workspace",
      type: "code",
    },
    {
      title: "Configuration",
      body: "Projects are configured via scilab.config.ts in the root:\n\nexport default {\n  name: 'my-project',\n  type: 'bot',\n  deploy: { target: 'staging', replicas: 2 },\n  flow: { entry: 'src/flows/main.flow' },\n};",
      type: "code",
    },
  ]);
  downloadBlob(blob, "cli-reference.pdf");
};

export const downloadMCURefPDF = () => {
  const blob = generatePDF("MCU Emulator Reference", [
    {
      title: "Overview",
      body: "Cycle-accurate 8-bit microcontroller emulator with register mapping,\nmemory visualization, and I/O simulation.",
    },
    {
      title: "Instruction Set",
      body: "LDI Rx, imm   - Load immediate\nADD Rx, Ry    - Add registers\nSUB Rx, Ry    - Subtract\nCMP Rx, Ry    - Compare\nJMP label     - Jump\nJNZ label     - Jump if not zero\nOUT port, Rx  - Output to port\nHLT           - Halt execution",
      type: "code",
    },
    {
      title: "Memory Map",
      body: "0x0000-0x7FFF  Flash ROM  32KB\n0x8000-0x87FF  SRAM       2KB\n0x8800-0x88FF  I/O Regs   256B\n0x8900-0x89FF  EEPROM     256B",
      type: "code",
    },
  ]);
  downloadBlob(blob, "mcu-reference.pdf");
};
