import type { FlowPage, FlowPages } from "./parser";

export const extractBotName = (code: string): string => {
  const m = code.match(/bot\s+"([^"]+)"/);
  return m?.[1] ?? "MyBot";
};

const serializePage = (name: string, page: FlowPage): string => {
  const lines: string[] = [];

  for (const m of page.media) {
    switch (m.type) {
      case "sticker":
        lines.push(`    sticker "${m.url}"`);
        break;
      case "image":
        lines.push(m.caption ? `    image "${m.url}" "${m.caption}"` : `    image "${m.url}"`);
        break;
      case "audio":
        lines.push(`    audio "${m.url}"`);
        break;
      case "video":
        lines.push(m.caption ? `    video "${m.url}" "${m.caption}"` : `    video "${m.url}"`);
        break;
      case "document":
        lines.push(m.caption ? `    document "${m.url}" "${m.caption}"` : `    document "${m.url}"`);
        break;
      case "location":
        lines.push(m.caption ? `    location "${m.url}" "${m.caption}"` : `    location "${m.url}"`);
        break;
    }
  }

  for (const text of page.texts) {
    lines.push(`    text "${text}"`);
  }

  for (const btn of page.buttons) {
    lines.push(`    button "${btn.label}" -> ${btn.target}`);
  }

  return `  page ${name} {\n${lines.join("\n")}\n  }`;
};

export const serializeFlowSpec = (
  pages: FlowPages,
  botName: string,
): string => {
  const pageNames = Object.keys(pages);
  if (pageNames.length === 0) return `bot "${botName}" {\n}`;

  const pageBlocks = pageNames.map((name) => serializePage(name, pages[name]));
  return `bot "${botName}" {\n${pageBlocks.join("\n\n")}\n}`;
};
