import { useMemo } from "react";

import type { FlowPages } from "@/features/flowspec-ide/lib/parser";

type FlowGraphProps = {
  pages: FlowPages;
};

type NodePosition = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export const FlowGraph = ({ pages }: FlowGraphProps) => {
  const svg = useMemo(() => buildFlowGraphSvg(pages), [pages]);

  if (!svg) {
    return (
      <svg className="flow-graph">
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          fill="var(--t3)"
          fontSize="12"
        >
          No pages defined
        </text>
      </svg>
    );
  }

  return (
    <svg
      className="flow-graph"
      viewBox={svg.viewBox}
      dangerouslySetInnerHTML={{ __html: svg.html }}
    />
  );
};

const buildFlowGraphSvg = (
  pages: FlowPages,
): { viewBox: string; html: string } | null => {
  const names = Object.keys(pages);
  if (names.length === 0) return null;

  const nodeW = 110;
  const nodeH = 40;
  const gapX = 50;
  const gapY = 70;
  const pad = 30;

  /* Build adjacency + assign layers via BFS from entry */
  const adj: Record<string, string[]> = {};
  const layers: Record<string, number> = {};
  const visited = new Set<string>();

  names.forEach((n) => {
    adj[n] = [];
  });
  names.forEach((n) => {
    const p = pages[n];
    p.buttons.forEach((b) => {
      if (pages[b.target]) adj[n].push(b.target);
    });
  });

  const entry = names.includes("start") ? "start" : names[0];
  const queue: [string, number][] = [[entry, 0]];
  visited.add(entry);
  layers[entry] = 0;

  while (queue.length) {
    const [node, layer] = queue.shift()!;
    adj[node].forEach((t) => {
      if (!visited.has(t)) {
        visited.add(t);
        layers[t] = layer + 1;
        queue.push([t, layer + 1]);
      }
    });
  }

  /* Assign unvisited nodes to last layer + 1 */
  const maxLayer = Math.max(0, ...Object.values(layers));
  names.forEach((n) => {
    if (layers[n] === undefined) layers[n] = maxLayer + 1;
  });

  /* Group nodes by layer */
  const layerGroups: Record<number, string[]> = {};
  names.forEach((n) => {
    const l = layers[n];
    if (!layerGroups[l]) layerGroups[l] = [];
    layerGroups[l].push(n);
  });
  const numLayers =
    Math.max(...Object.keys(layerGroups).map(Number)) + 1;

  /* Position nodes */
  const positions: Record<string, NodePosition> = {};
  for (let l = 0; l < numLayers; l++) {
    const group = layerGroups[l] || [];
    const startX = pad;
    group.forEach((n, i) => {
      positions[n] = {
        x:
          startX +
          i * (nodeW + gapX) +
          (group.length === 1
            ? (names.length > 2 ? 1 : 0) * ((nodeW + gapX) / 2)
            : 0),
        y: pad + l * (nodeH + gapY),
        w: nodeW,
        h: nodeH,
      };
    });
  }

  /* Calculate viewBox */
  let maxX = 0;
  let maxY = 0;
  Object.values(positions).forEach((p) => {
    maxX = Math.max(maxX, p.x + p.w);
    maxY = Math.max(maxY, p.y + p.h);
  });

  const viewBox = `0 0 ${maxX + pad} ${maxY + pad}`;
  let html = "<defs>";
  html +=
    '<marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">' +
    '<polygon points="0 0.5, 7 3, 0 5.5" fill="var(--ac)"/></marker>';
  html +=
    '<marker id="arrowhead-dim" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">' +
    '<polygon points="0 0.5, 7 3, 0 5.5" fill="var(--t3)"/></marker>';
  html += "</defs>";

  /* Draw edges */
  for (const name of names) {
    const page = pages[name];
    const from = positions[name];
    if (!from) continue;

    page.buttons.forEach((btn, bi) => {
      const to = positions[btn.target];
      if (!to) return;
      const isBack = to.y <= from.y;
      const x1 =
        from.x +
        from.w / 2 +
        (bi - (page.buttons.length - 1) / 2) * 12;
      const y1 = from.y + from.h;
      const x2 = to.x + to.w / 2;
      const y2 = to.y;

      let path: string;
      if (!isBack) {
        const midY = y1 + gapY / 2;
        path = `M${x1} ${y1} V${midY} H${x2} V${y2}`;
      } else {
        const routeX =
          Math.max(from.x + from.w, to.x + to.w) + 25;
        const dy1 = y1 + 15;
        const dy2 = y2 - 15;
        path = `M${x1} ${y1} V${dy1} H${routeX} V${dy2} H${x2} V${y2}`;
      }

      const marker = isBack
        ? "url(#arrowhead-dim)"
        : "url(#arrowhead)";
      const stroke = isBack ? "var(--t3)" : "var(--ac)";
      const opacity = isBack ? "0.5" : "0.7";

      html += `<path d="${path}" fill="none" stroke="${stroke}" stroke-width="1.2" stroke-opacity="${opacity}" marker-end="${marker}" class="fg-edge"/>`;

      /* Edge label */
      const lx = isBack
        ? Math.max(from.x + from.w, to.x + to.w) + 28
        : (x1 + x2) / 2;
      const ly = isBack ? (y1 + y2) / 2 : y1 + gapY / 2 - 4;
      html += `<text x="${lx}" y="${ly}" text-anchor="middle" fill="var(--t3)" font-size="7" font-family="JetBrains Mono,monospace" opacity="0.7">${btn.label}</text>`;
    });
  }

  /* Draw nodes */
  for (const name of names) {
    const p = positions[name];
    if (!p) continue;
    const isEntry = name === entry;
    const btnCount = pages[name].buttons.length;
    const textCount = pages[name].texts.length;

    html += `<g class="fg-node" transform="translate(${p.x},${p.y})">`;
    html += `<rect width="${p.w}" height="${p.h}" rx="8" ry="8" fill="${isEntry ? "rgba(22,224,189,0.1)" : "rgba(255,255,255,0.025)"}" stroke="${isEntry ? "var(--ac)" : "var(--border-h)"}" stroke-width="${isEntry ? "2" : "1"}"/>`;
    html += `<text x="${p.w / 2}" y="15" text-anchor="middle" fill="${isEntry ? "var(--ac)" : "var(--t1)"}" font-family="JetBrains Mono,monospace" font-size="10" font-weight="600">${name}</text>`;
    html += `<text x="${p.w / 2}" y="28" text-anchor="middle" fill="var(--t3)" font-family="JetBrains Mono,monospace" font-size="7">${textCount} msg · ${btnCount} btn</text>`;
    if (isEntry) {
      html += `<circle cx="-6" cy="${p.h / 2}" r="3" fill="var(--ac)" stroke="var(--ac)" stroke-width="1"/>`;
    }
    html += "</g>";
  }

  /* Minimap border */
  html += `<rect x="0" y="0" width="${maxX + pad}" height="${maxY + pad}" fill="none" stroke="var(--border)" stroke-width="0.5" rx="4"/>`;

  return { viewBox, html };
};
