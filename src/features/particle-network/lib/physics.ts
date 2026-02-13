/* ═══ Particle Network Physics ═══ */

export const COLORS = ["#16e0bd", "#0ea5e9", "#14b8a6"];
export const COLORS_LIGHT = ["#0d9488", "#0369a1", "#0f766e"];

export const CFG = {
  nodeCount: 55,
  starCount: 110,
  clusterCount: 4,
  springK: 0.0006,
  springRest: 130,
  driftSpeed: 0.06,
  damping: 0.992,
  maxSpeed: 0.35,
  mouseRadius: 220,
  mousePull: 0.02,
  brightRadius: 200,
  maxEdgeDist: 160,
  tapMin: 8,
  tapMax: 14,
  tapLifeMin: 35000,
  tapLifeMax: 70000,
  ambientInterval: 3500,
  ambientMax: 12,
  ambientLife: [12000, 25000] as const,
  nodeRMin: 1.8,
  nodeRMax: 3.5,
  edgeOp: 0.2,
  nodeOp: 0.7,
} as const;

export type Point = { x: number; y: number };

const rr = (a: number, b: number): number => a + Math.random() * (b - a);
const ri = (a: number, b: number): number => Math.floor(rr(a, b));
const pick = <T>(arr: T[]): T => arr[ri(0, arr.length)];

export { rr, ri, pick };

export class Star {
  x: number;
  y: number;
  r: number;
  baseOp: number;
  op: number;
  phase: number;
  speed: number;
  flare: boolean;

  constructor(w: number, h: number) {
    this.x = rr(0, w);
    this.y = rr(0, h);
    this.r = rr(0.5, 1.8);
    this.baseOp = rr(0.25, 0.65);
    this.op = this.baseOp;
    this.phase = rr(0, Math.PI * 2);
    this.speed = rr(0.3, 1.2);
    this.flare = this.r > 1.3;
  }

  update(t: number, cursorActive: boolean, mx: number, my: number): void {
    this.op = this.baseOp + Math.sin(t * this.speed + this.phase) * 0.15;
    if (cursorActive) {
      const d = Math.hypot(this.x - mx, this.y - my);
      if (d < CFG.brightRadius) {
        this.op = Math.min(1, this.op + 0.3 * (1 - d / CFG.brightRadius));
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, isLight: boolean): void {
    ctx.globalAlpha = Math.max(0, isLight ? this.op * 0.85 : this.op);
    ctx.fillStyle = isLight ? "#475569" : "#e2e8f0";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    if (this.flare && this.op > 0.35) {
      ctx.globalAlpha = isLight ? this.op * 0.35 : this.op * 0.3;
      ctx.strokeStyle = isLight ? "#475569" : "#e2e8f0";
      ctx.lineWidth = 0.3;
      ctx.beginPath();
      ctx.moveTo(this.x - this.r * 2.5, this.y);
      ctx.lineTo(this.x + this.r * 2.5, this.y);
      ctx.moveTo(this.x, this.y - this.r * 2.5);
      ctx.lineTo(this.x, this.y + this.r * 2.5);
      ctx.stroke();
    }
  }
}

export class NetNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  lightColor: string;
  op: number;
  noiseOff: number;

  constructor(w: number, h: number, x?: number, y?: number) {
    this.x = x ?? rr(50, w - 50);
    this.y = y ?? rr(50, h - 50);
    this.vx = rr(-0.2, 0.2);
    this.vy = rr(-0.2, 0.2);
    this.r = rr(CFG.nodeRMin, CFG.nodeRMax);
    const idx = ri(0, COLORS.length);
    this.color = COLORS[idx];
    this.lightColor = COLORS_LIGHT[idx];
    this.op = CFG.nodeOp;
    this.noiseOff = rr(0, 1000);
  }

  update(
    t: number,
    w: number,
    h: number,
    cursorActive: boolean,
    mx: number,
    my: number,
  ): void {
    this.vx += Math.sin(t * CFG.driftSpeed + this.noiseOff) * 0.003;
    this.vy += Math.cos(t * CFG.driftSpeed + this.noiseOff * 0.7) * 0.003;
    if (cursorActive) {
      const ddx = mx - this.x;
      const ddy = my - this.y;
      const d = Math.hypot(ddx, ddy);
      if (d < CFG.mouseRadius && d > 1) {
        this.vx += (ddx / d) * CFG.mousePull * (1 - d / CFG.mouseRadius);
        this.vy += (ddy / d) * CFG.mousePull * (1 - d / CFG.mouseRadius);
      }
    }
    this.vx *= CFG.damping;
    this.vy *= CFG.damping;
    const spd = Math.hypot(this.vx, this.vy);
    if (spd > CFG.maxSpeed) {
      this.vx *= CFG.maxSpeed / spd;
      this.vy *= CFG.maxSpeed / spd;
    }
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -20) this.x = w + 20;
    if (this.x > w + 20) this.x = -20;
    if (this.y < -20) this.y = h + 20;
    if (this.y > h + 20) this.y = -20;
    this.op = CFG.nodeOp;
    if (cursorActive) {
      const d = Math.hypot(this.x - mx, this.y - my);
      if (d < CFG.brightRadius) {
        this.op = Math.min(1, this.op + 0.35 * (1 - d / CFG.brightRadius));
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, isLight: boolean): void {
    ctx.globalAlpha = isLight ? this.op * 0.8 : this.op;
    const drawColor = isLight ? this.lightColor : this.color;
    if (!isLight) {
      /* Dark mode: radial glow looks like light emission */
      const g = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.r * 3,
      );
      g.addColorStop(0, drawColor);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    /* Core dot — visible in both themes */
    ctx.fillStyle = drawColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export class TapNode extends NetNode {
  born: number;
  life: number;

  constructor(w: number, h: number, x: number, y: number) {
    super(w, h, x, y);
    this.born = performance.now();
    this.life = rr(CFG.tapLifeMin, CFG.tapLifeMax);
    const angle = rr(0, Math.PI * 2);
    const spd = rr(0.15, 0.5);
    this.vx = Math.cos(angle) * spd;
    this.vy = Math.sin(angle) * spd;
  }

  get alive(): boolean {
    return performance.now() - this.born < this.life;
  }

  update(
    t: number,
    w: number,
    h: number,
    cursorActive: boolean,
    mx: number,
    my: number,
  ): void {
    super.update(t, w, h, cursorActive, mx, my);
    const age = (performance.now() - this.born) / this.life;
    this.op *= Math.max(0, 1 - age * age);
  }
}
