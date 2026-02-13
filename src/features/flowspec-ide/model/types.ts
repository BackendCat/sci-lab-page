import type { FlowMedia } from "@/features/flowspec-ide/lib/parser";

export type PreviewTab = "chat" | "designer";

export type FlowSpecState = {
  code: string;
  currentPage: string;
  previewTab: PreviewTab;
};

export type PageElement =
  | { kind: "text"; content: string }
  | { kind: "button"; label: string; target: string }
  | { kind: "media"; mediaType: FlowMedia["type"]; url: string; caption?: string };
