export type FlowButton = {
  label: string;
  target: string;
};

export type FlowMedia = {
  type: "image" | "audio" | "video" | "document" | "location" | "sticker";
  url: string;
  caption?: string;
};

export type FlowPage = {
  texts: string[];
  buttons: FlowButton[];
  media: FlowMedia[];
};

export type FlowPages = Record<string, FlowPage>;

export const parseFlowSpec = (code: string): FlowPages => {
  const pages: FlowPages = {};
  const pageRegex = /page\s+(\w+)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
  let match: RegExpExecArray | null;

  while ((match = pageRegex.exec(code)) !== null) {
    const name = match[1];
    const body = match[2];
    const texts: string[] = [];
    const buttons: FlowButton[] = [];
    const media: FlowMedia[] = [];
    const lines = body.split("\n");

    for (const line of lines) {
      const textMatch = line.match(/text\s+"([^"]+)"/);
      if (textMatch) { texts.push(textMatch[1]); continue; }

      const btnMatch = line.match(/button\s+"([^"]+)"\s*->\s*(\w+)/);
      if (btnMatch) { buttons.push({ label: btnMatch[1], target: btnMatch[2] }); continue; }

      // image "url" "optional caption"
      const imgMatch = line.match(/image\s+"([^"]+)"(?:\s+"([^"]+)")?/);
      if (imgMatch) { media.push({ type: "image", url: imgMatch[1], caption: imgMatch[2] }); continue; }

      // audio "url"
      const audioMatch = line.match(/audio\s+"([^"]+)"/);
      if (audioMatch) { media.push({ type: "audio", url: audioMatch[1] }); continue; }

      // video "url" "optional caption"
      const videoMatch = line.match(/video\s+"([^"]+)"(?:\s+"([^"]+)")?/);
      if (videoMatch) { media.push({ type: "video", url: videoMatch[1], caption: videoMatch[2] }); continue; }

      // document "url" "label"
      const docMatch = line.match(/document\s+"([^"]+)"(?:\s+"([^"]+)")?/);
      if (docMatch) { media.push({ type: "document", url: docMatch[1], caption: docMatch[2] }); continue; }

      // location "lat,lng" "label"
      const locMatch = line.match(/location\s+"([^"]+)"(?:\s+"([^"]+)")?/);
      if (locMatch) { media.push({ type: "location", url: locMatch[1], caption: locMatch[2] }); continue; }

      // sticker "emoji or url"
      const stickerMatch = line.match(/sticker\s+"([^"]+)"/);
      if (stickerMatch) { media.push({ type: "sticker", url: stickerMatch[1] }); continue; }
    }

    pages[name] = { texts, buttons, media };
  }

  return pages;
};
