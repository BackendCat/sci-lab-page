import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "@/app/store";
import { delaunay } from "@/features/particle-network/lib/delaunay";
import {
  CFG,
  NetNode,
  Star,
  TapNode,
  rr,
  ri,
} from "@/features/particle-network/lib/physics";
import type { Point } from "@/features/particle-network/lib/physics";

import styles from "./ParticleCanvas.module.css";

const INTERACTIVE_SELECTOR =
  "button,a,textarea,input,.playground,.sys-card,nav";

export const ParticleCanvas = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeMode = useSelector((s: RootState) => s.theme.mode);
  const themeModeRef = useRef(themeMode);

  useEffect(() => {
    themeModeRef.current = themeMode;
  }, [themeMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let mx = -1e4;
    let my = -1e4;
    let cursorActive = false;
    let edgeTimer = 0;
    let rafId = 0;
    let edges: number[][] = [];

    const stars = Array.from({ length: CFG.starCount }, () => new Star(W, H));
    const nodes = Array.from(
      { length: CFG.nodeCount },
      () => new NetNode(W, H),
    );
    const tapNodes: TapNode[] = [];

    /* ═══ Resize ═══ */
    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    /* ═══ Mouse ═══ */
    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cursorActive = true;
    };
    const onMouseLeave = () => {
      cursorActive = false;
    };

    /* ═══ Click ═══ */
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest(INTERACTIVE_SELECTOR)) return;
      const count = ri(CFG.tapMin, CFG.tapMax);
      for (let i = 0; i < count; i++) {
        tapNodes.push(
          new TapNode(W, H, e.clientX + rr(-25, 25), e.clientY + rr(-25, 25)),
        );
      }
    };

    /* ═══ Ambient spawn ═══ */
    const ambientId = window.setInterval(() => {
      if (tapNodes.length < CFG.ambientMax) {
        const n = new TapNode(W, H, rr(50, W - 50), rr(50, H - 50));
        n.life = rr(CFG.ambientLife[0], CFG.ambientLife[1]);
        tapNodes.push(n);
      }
    }, CFG.ambientInterval);

    /* ═══ Edge computation ═══ */
    const recomputeEdges = () => {
      const pts: Point[] = nodes
        .concat(tapNodes.filter((t) => t.alive))
        .map((n) => ({ x: n.x, y: n.y }));
      if (pts.length < 3) {
        edges = [];
        return;
      }
      const tris = delaunay(pts);
      const edgeSet = new Set<string>();
      edges = [];
      for (const t of tris) {
        for (let j = 0; j < 3; j++) {
          const a = t[j];
          const b = t[(j + 1) % 3];
          const key = Math.min(a, b) + "-" + Math.max(a, b);
          if (!edgeSet.has(key)) {
            edgeSet.add(key);
            edges.push([a, b]);
          }
        }
      }
    };

    /* ═══ Render loop ═══ */
    const animate = (rawT: number) => {
      const t = rawT / 1000;
      const lt = themeModeRef.current === "light";

      ctx.clearRect(0, 0, W, H);

      for (const s of stars) {
        s.update(t, cursorActive, mx, my);
        s.draw(ctx, lt);
      }

      const allNodes: NetNode[] = nodes.concat(
        tapNodes.filter((n) => n.alive),
      );
      for (const n of allNodes) {
        n.update(t, W, H, cursorActive, mx, my);
      }

      edgeTimer++;
      if (edgeTimer % 8 === 0) recomputeEdges();

      for (let i = tapNodes.length - 1; i >= 0; i--) {
        if (!tapNodes[i].alive) tapNodes.splice(i, 1);
      }

      ctx.lineWidth = lt ? 0.8 : 0.6;
      for (const [a, b] of edges) {
        if (a >= allNodes.length || b >= allNodes.length) continue;
        const na = allNodes[a];
        const nb = allNodes[b];
        const d = Math.hypot(na.x - nb.x, na.y - nb.y);
        if (d > CFG.maxEdgeDist) continue;
        let op = CFG.edgeOp * (1 - d / CFG.maxEdgeDist);
        if (cursorActive) {
          const midX = (na.x + nb.x) / 2;
          const midY = (na.y + nb.y) / 2;
          const dm = Math.hypot(midX - mx, midY - my);
          if (dm < CFG.brightRadius) {
            op = Math.min(0.5, op + 0.2 * (1 - dm / CFG.brightRadius));
          }
        }
        if (lt) op *= 0.75;
        ctx.globalAlpha = op;
        ctx.strokeStyle = lt ? na.lightColor : na.color;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();
      }

      for (const n of allNodes) {
        n.draw(ctx, lt);
      }

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(animate);
    };

    /* ═══ Attach listeners ═══ */
    window.addEventListener("resize", onResize);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("click", onClick);
    rafId = requestAnimationFrame(animate);

    /* ═══ Cleanup ═══ */
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId);
      clearInterval(ambientId);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
});

ParticleCanvas.displayName = "ParticleCanvas";
