import { useCallback, useMemo, useState } from "react";

import clsx from "clsx";

import type { FlowMedia, FlowPages } from "@/features/flowspec-ide/lib/parser";
import type { PageElement } from "@/features/flowspec-ide/model/types";
import { parsePageElements, elementsToPage, serializeElements } from "@/features/flowspec-ide/lib/elementAdapter";
import { extractBotName } from "@/features/flowspec-ide/lib/serializer";

import { IdeInput, IdeTextarea, IdeSelect } from "./IdeInput";
import styles from "./Designer.module.css";

type Props = {
  pageName: string;
  pages: FlowPages;
  code: string;
  onCodeChange: (code: string) => void;
  onClose: () => void;
};

const ICONS: Record<string, string> = {
  text: "\u2261", button: "\u25a2", image: "\u25a3", audio: "\u266b",
  video: "\u25b6", document: "\u2637", location: "\u2316", sticker: "\u263a",
};

const ADD_TYPES = [
  { kind: "text", label: "Txt", icon: "\u2261" },
  { kind: "button", label: "Btn", icon: "\u25a2" },
  { kind: "image", label: "Img", icon: "\u25a3" },
  { kind: "audio", label: "Aud", icon: "\u266b" },
  { kind: "video", label: "Vid", icon: "\u25b6" },
  { kind: "document", label: "Doc", icon: "\u2637" },
  { kind: "location", label: "Loc", icon: "\u2316" },
  { kind: "sticker", label: "Stk", icon: "\u263a" },
] as const;

const MEDIA_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "image", label: "image" },
  { value: "audio", label: "audio" },
  { value: "video", label: "video" },
  { value: "document", label: "document" },
  { value: "location", label: "location" },
  { value: "sticker", label: "sticker" },
];

const createDefault = (kind: string): PageElement => {
  switch (kind) {
    case "text": return { kind: "text", content: "New text" };
    case "button": return { kind: "button", label: "Button", target: "start" };
    case "image": return { kind: "media", mediaType: "image", url: "https://placehold.co/280x140", caption: "Image" };
    case "audio": return { kind: "media", mediaType: "audio", url: "audio.mp3" };
    case "video": return { kind: "media", mediaType: "video", url: "video.mp4", caption: "Video" };
    case "document": return { kind: "media", mediaType: "document", url: "doc.pdf", caption: "Document" };
    case "location": return { kind: "media", mediaType: "location", url: "0,0", caption: "Location" };
    case "sticker": return { kind: "media", mediaType: "sticker", url: "\u2b50" };
    default: return { kind: "text", content: "New text" };
  }
};

const getIcon = (el: PageElement) =>
  el.kind === "media" ? ICONS[el.mediaType] ?? "\u25cf" : ICONS[el.kind] ?? "\u25cf";

const getLabel = (el: PageElement) => {
  switch (el.kind) {
    case "text": return el.content;
    case "button": return el.label;
    case "media": return el.mediaType === "sticker" ? el.url : (el.caption ?? el.url);
  }
};

export const DesignerPropertyPanel = ({ pageName, pages, code, onCodeChange, onClose }: Props) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const pageNames = useMemo(() => Object.keys(pages), [pages]);

  /* Parse ordered elements from DSL source */
  const elements = useMemo(() => {
    const regex = new RegExp(`page\\s+${pageName}\\s*\\{([^}]*(?:\\{[^}]*\\}[^}]*)*)\\}`);
    const match = regex.exec(code);
    if (match) return parsePageElements(match[1]);
    const page = pages[pageName];
    if (!page) return [];
    const fb: PageElement[] = [];
    for (const m of page.media) fb.push({ kind: "media", mediaType: m.type, url: m.url, caption: m.caption });
    for (const t of page.texts) fb.push({ kind: "text", content: t });
    for (const b of page.buttons) fb.push({ kind: "button", label: b.label, target: b.target });
    return fb;
  }, [pageName, code, pages]);

  /* Commit modified elements back to DSL */
  const commit = useCallback(
    (newElements: PageElement[]) => {
      const botName = extractBotName(code);
      const updatedPages = { ...pages };
      updatedPages[pageName] = elementsToPage(newElements);

      const pageBlocks = Object.keys(updatedPages).map((name) => {
        if (name === pageName) {
          return `  page ${name} {\n${serializeElements(newElements)}\n  }`;
        }
        const pg = updatedPages[name];
        const lines: string[] = [];
        for (const m of pg.media) {
          if (m.type === "sticker") lines.push(`    sticker "${m.url}"`);
          else if (m.type === "audio") lines.push(`    audio "${m.url}"`);
          else lines.push(m.caption ? `    ${m.type} "${m.url}" "${m.caption}"` : `    ${m.type} "${m.url}"`);
        }
        for (const t of pg.texts) lines.push(`    text "${t}"`);
        for (const b of pg.buttons) lines.push(`    button "${b.label}" -> ${b.target}`);
        return `  page ${name} {\n${lines.join("\n")}\n  }`;
      });

      onCodeChange(`bot "${botName}" {\n${pageBlocks.join("\n\n")}\n}`);
    },
    [pageName, code, pages, onCodeChange],
  );

  const handleAdd = useCallback(
    (kind: string) => {
      const next = [...elements, createDefault(kind)];
      commit(next);
      setSelectedIdx(next.length - 1);
    },
    [elements, commit],
  );

  const handleDelete = useCallback(
    (idx: number) => {
      const next = elements.filter((_, i) => i !== idx);
      commit(next);
      if (selectedIdx === idx) setSelectedIdx(null);
      else if (selectedIdx !== null && selectedIdx > idx) setSelectedIdx(selectedIdx - 1);
    },
    [elements, selectedIdx, commit],
  );

  const handleUpdate = useCallback(
    (idx: number, updated: PageElement) => {
      const next = [...elements];
      next[idx] = updated;
      commit(next);
    },
    [elements, commit],
  );

  const selectedEl = selectedIdx !== null ? elements[selectedIdx] : null;

  const targetOptions = useMemo(
    () => pageNames.map((n) => ({ value: n, label: n })),
    [pageNames],
  );

  return (
    <div className={styles.propertyPanel}>
      {/* Header */}
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>{pageName}</span>
        <button className={styles.panelClose} onClick={onClose}>{"\u00d7"}</button>
      </div>

      {/* Element list */}
      <div className={styles.elementList}>
        {elements.map((el, i) => (
          <div
            key={`${i}-${el.kind}`}
            className={clsx(styles.elementRow, selectedIdx === i && styles.selectedRow)}
            onClick={() => setSelectedIdx(i)}
          >
            <span className={styles.rowIcon}>{getIcon(el)}</span>
            <span className={styles.rowLabel}>{getLabel(el)}</span>
            {el.kind === "button" && (
              <span className={styles.rowTarget}>{"\u2192"} {el.target}</span>
            )}
            <button
              className={styles.rowDelete}
              onClick={(e) => { e.stopPropagation(); handleDelete(i); }}
              title="Delete"
            >
              {"\u00d7"}
            </button>
          </div>
        ))}
        {elements.length === 0 && (
          <div style={{ color: "var(--t3)", fontSize: 10, padding: "12px 8px", textAlign: "center" }}>
            No elements yet
          </div>
        )}
      </div>

      {/* Add element toolbar */}
      <div className={styles.addBar}>
        {ADD_TYPES.map((t) => (
          <button
            key={t.kind}
            className={styles.addBtn}
            onClick={() => handleAdd(t.kind)}
            title={`Add ${t.label}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Property editor */}
      {selectedEl && (
        <div className={styles.propFields}>
          <div className={styles.propTitle}>Properties</div>

          {selectedEl.kind === "text" && (
            <div className={styles.propRow}>
              <label>Text</label>
              <IdeTextarea
                value={selectedEl.content}
                onChange={(v) => handleUpdate(selectedIdx!, { ...selectedEl, content: v })}
              />
            </div>
          )}

          {selectedEl.kind === "button" && (
            <>
              <div className={styles.propRow}>
                <label>Label</label>
                <IdeInput
                  value={selectedEl.label}
                  onChange={(v) => handleUpdate(selectedIdx!, { ...selectedEl, label: v })}
                />
              </div>
              <div className={styles.propRow}>
                <label>Target</label>
                <IdeSelect
                  value={selectedEl.target}
                  options={targetOptions}
                  onChange={(v) => handleUpdate(selectedIdx!, { ...selectedEl, target: v })}
                />
              </div>
            </>
          )}

          {selectedEl.kind === "media" && (
            <>
              <div className={styles.propRow}>
                <label>Type</label>
                <IdeSelect
                  value={selectedEl.mediaType}
                  options={MEDIA_TYPE_OPTIONS}
                  onChange={(v) =>
                    handleUpdate(selectedIdx!, {
                      ...selectedEl,
                      mediaType: v as FlowMedia["type"],
                    })
                  }
                />
              </div>
              <div className={styles.propRow}>
                <label>{selectedEl.mediaType === "sticker" ? "Emoji" : "URL"}</label>
                <IdeInput
                  value={selectedEl.url}
                  onChange={(v) => handleUpdate(selectedIdx!, { ...selectedEl, url: v })}
                />
              </div>
              {selectedEl.mediaType !== "sticker" && selectedEl.mediaType !== "audio" && (
                <div className={styles.propRow}>
                  <label>Caption</label>
                  <IdeInput
                    value={selectedEl.caption ?? ""}
                    onChange={(v) =>
                      handleUpdate(selectedIdx!, {
                        ...selectedEl,
                        caption: v || undefined,
                      })
                    }
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
