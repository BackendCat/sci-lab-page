import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import dagre from "@dagrejs/dagre";
import {
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
  MarkerType,
} from "@xyflow/react";

import type { FlowPage, FlowPages } from "@/features/flowspec-ide/lib/parser";

/* ── Types ── */
export type FlowNodeData = {
  pageName: string;
  page: FlowPage;
  isEntry: boolean;
};

type PositionMap = Record<string, { x: number; y: number }>;

/* ── Constants ── */
const STORAGE_KEY = "flowspec-graph-positions";
const NODE_W = 200;
const NODE_H = 100;

/* ── localStorage helpers ── */
const loadPositions = (): PositionMap => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PositionMap) : {};
  } catch {
    return {};
  }
};

/* ── Dagre auto-layout ── */
const autoLayout = (pages: FlowPages, existing: PositionMap): PositionMap => {
  const names = Object.keys(pages);
  if (names.length === 0) return {};

  /* If all nodes already have positions, skip layout */
  const allExist = names.every((n) => existing[n]);
  if (allExist) return existing;

  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: "TB",
    nodesep: 60,
    ranksep: 100,
    marginx: 40,
    marginy: 40,
  });
  g.setDefaultEdgeLabel(() => ({}));

  for (const name of names) {
    const page = pages[name];
    const elemCount = page.texts.length + page.buttons.length + page.media.length;
    const h = Math.max(NODE_H, 60 + Math.min(elemCount, 6) * 14);
    g.setNode(name, { width: NODE_W, height: h });
  }

  for (const name of names) {
    for (const btn of pages[name].buttons) {
      if (pages[btn.target]) {
        g.setEdge(name, btn.target);
      }
    }
  }

  dagre.layout(g);

  const result: PositionMap = {};
  for (const name of names) {
    if (existing[name]) {
      result[name] = existing[name];
    } else {
      const node = g.node(name);
      result[name] = {
        x: node.x - NODE_W / 2,
        y: node.y - (node.height ?? NODE_H) / 2,
      };
    }
  }

  return result;
};

/* ── Hook ── */
export const useDesignerGraph = (pages: FlowPages, selectedNode: string | null = null) => {
  const [posMap, setPosMap] = useState<PositionMap>(() =>
    autoLayout(pages, loadPositions()),
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Re-layout when pages change */
  useEffect(() => {
    setPosMap((prev) => {
      const names = new Set(Object.keys(pages));
      const filtered: PositionMap = {};
      for (const [k, v] of Object.entries(prev)) {
        if (names.has(k)) filtered[k] = v;
      }
      return autoLayout(pages, filtered);
    });
  }, [pages]);

  /* Debounced persist */
  const persist = useCallback((pos: PositionMap) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
    }, 300);
  }, []);

  /* Convert FlowPages → React Flow nodes */
  const names = Object.keys(pages);
  const entry = names.includes("start") ? "start" : names[0];

  const nodes: Node[] = useMemo(
    () =>
      names.map((name) => ({
        id: name,
        type: "flowPage",
        position: posMap[name] ?? { x: 0, y: 0 },
        selected: selectedNode === name,
        data: {
          pageName: name,
          page: pages[name],
          isEntry: name === entry,
        } satisfies FlowNodeData,
      })),
    [names, pages, posMap, entry, selectedNode],
  );

  /* Convert buttons → React Flow edges */
  const edges: Edge[] = useMemo(() => {
    const result: Edge[] = [];
    for (const name of names) {
      const page = pages[name];
      page.buttons.forEach((btn, i) => {
        if (pages[btn.target]) {
          result.push({
            id: `${name}-btn-${i}`,
            source: name,
            sourceHandle: `btn-${i}`,
            target: btn.target,
            targetHandle: "input",
            type: "flowEdge",
            label: btn.label,
            markerEnd: { type: MarkerType.ArrowClosed, color: "var(--ac)" },
          });
        }
      });
    }
    return result;
  }, [names, pages]);

  /* Handle React Flow node changes (drag) */
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      let posChanged = false;
      const newPosMap = { ...posMap };

      for (const change of changes) {
        if (change.type === "position" && change.position) {
          newPosMap[change.id] = { x: change.position.x, y: change.position.y };
          posChanged = true;
        }
      }

      if (posChanged) {
        setPosMap(newPosMap);
        persist(newPosMap);
      }
    },
    [posMap, persist],
  );

  const onEdgesChange = useCallback((_changes: EdgeChange[]) => {
    /* Edges are derived from DSL — no direct edge manipulation */
  }, []);

  const resetLayout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPosMap(autoLayout(pages, {}));
  }, [pages]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    resetLayout,
  };
};
