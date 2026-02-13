import type { FlowPage, FlowMedia } from "./parser";
import type { PageElement } from "../model/types";

/**
 * Parse a page body string (the content inside `page name { ... }`)
 * into an ordered list of PageElements, preserving source order.
 */
export const parsePageElements = (body: string): PageElement[] => {
  const elements: PageElement[] = [];
  const lines = body.split("\n");

  for (const line of lines) {
    const textMatch = line.match(/text\s+"([^"]+)"/);
    if (textMatch) { elements.push({ kind: "text", content: textMatch[1] }); continue; }

    const btnMatch = line.match(/button\s+"([^"]+)"\s*->\s*(\w+)/);
    if (btnMatch) { elements.push({ kind: "button", label: btnMatch[1], target: btnMatch[2] }); continue; }

    const imgMatch = line.match(/image\s+"([^"]+)"(?:\s+"([^"]+)")?/);
    if (imgMatch) { elements.push({ kind: "media", mediaType: "image", url: imgMatch[1], caption: imgMatch[2] }); continue; }

    const audioMatch = line.match(/audio\s+"([^"]+)"/);
    if (audioMatch) { elements.push({ kind: "media", mediaType: "audio", url: audioMatch[1] }); continue; }

    const videoMatch = line.match(/video\s+"([^"]+)"(?:\s+"([^"]+)")?/);
    if (videoMatch) { elements.push({ kind: "media", mediaType: "video", url: videoMatch[1], caption: videoMatch[2] }); continue; }

    const docMatch = line.match(/document\s+"([^"]+)"(?:\s+"([^"]+)")?/);
    if (docMatch) { elements.push({ kind: "media", mediaType: "document", url: docMatch[1], caption: docMatch[2] }); continue; }

    const locMatch = line.match(/location\s+"([^"]+)"(?:\s+"([^"]+)")?/);
    if (locMatch) { elements.push({ kind: "media", mediaType: "location", url: locMatch[1], caption: locMatch[2] }); continue; }

    const stickerMatch = line.match(/sticker\s+"([^"]+)"/);
    if (stickerMatch) { elements.push({ kind: "media", mediaType: "sticker", url: stickerMatch[1] }); continue; }
  }

  return elements;
};

/** Convert an ordered element list back to FlowPage (separate arrays). */
export const elementsToPage = (elements: PageElement[]): FlowPage => {
  const texts: string[] = [];
  const buttons: FlowPage["buttons"] = [];
  const media: FlowMedia[] = [];

  for (const el of elements) {
    switch (el.kind) {
      case "text": texts.push(el.content); break;
      case "button": buttons.push({ label: el.label, target: el.target }); break;
      case "media": media.push({ type: el.mediaType, url: el.url, caption: el.caption }); break;
    }
  }

  return { texts, buttons, media };
};

/** Serialize an ordered element list into DSL lines (indented for page body). */
export const serializeElements = (elements: PageElement[]): string => {
  const lines: string[] = [];

  for (const el of elements) {
    switch (el.kind) {
      case "text":
        lines.push(`    text "${el.content}"`);
        break;
      case "button":
        lines.push(`    button "${el.label}" -> ${el.target}`);
        break;
      case "media":
        switch (el.mediaType) {
          case "sticker": lines.push(`    sticker "${el.url}"`); break;
          case "audio": lines.push(`    audio "${el.url}"`); break;
          default:
            lines.push(el.caption
              ? `    ${el.mediaType} "${el.url}" "${el.caption}"`
              : `    ${el.mediaType} "${el.url}"`);
        }
        break;
    }
  }

  return lines.join("\n");
};

/**
 * Extract the raw body text of a named page from the full DSL source.
 * Used by parsePageElements to get ordered elements for a specific page.
 */
export const extractPageBody = (code: string, pageName: string): string => {
  const regex = new RegExp(`page\\s+${pageName}\\s*\\{([^}]*(?:\\{[^}]*\\}[^}]*)*)\\}`, "g");
  const match = regex.exec(code);
  return match?.[1] ?? "";
};
