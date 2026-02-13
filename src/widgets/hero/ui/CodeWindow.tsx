import { useCallback, useRef, useState, type ReactNode } from "react";

import clsx from "clsx";

import styles from "./CodeWindow.module.css";

type TabDef = {
  name: string;
  lang: string;
  highlight: number;
  lines: { content: ReactNode | null }[];
};

const TABS: TabDef[] = [
  {
    name: "flowspec.flow",
    lang: "FlowSpec",
    highlight: 5,
    lines: [
      { content: <><span className="cm">{"// FlowSpec Bot Infrastructure DSL"}</span></> },
      { content: <><span className="kw">bot</span> <span className="str">"SciBot"</span> <span className="tp">v3.2.1</span> {"{"}</> },
      { content: <><span className="kw">  entry</span>: <span className="fn">/start</span> -&gt; <span className="fn">welcome</span></> },
      { content: null },
      { content: <><span className="kw">  page</span> <span className="fn">welcome</span> {"{"}</> },
      { content: <><span className="fn">    text</span> <span className="str">"Welcome to SCI-LAB"</span></> },
      { content: <><span className="kw">    keyboard</span> {"{"}</> },
      { content: <><span className="fn">      row</span> [<span className="str">"Systems"</span>, <span className="str">"Architecture"</span>]</> },
      { content: <><span className="fn">      row</span> [<span className="str">"Playground"</span>, <span className="str">"Docs"</span>]</> },
      { content: <>{"    }"}</> },
      { content: <>{"  }"}</> },
      { content: null },
      { content: <><span className="kw">  hook</span> <span className="fn">beforeRoute</span>(ctx) {"{"}</> },
      { content: <><span className="tp">    auth</span>.<span className="fn">validate</span>(ctx.session)</> },
      { content: <><span className="tp">    metrics</span>.<span className="fn">track</span>(ctx.route)</> },
      { content: <>{"  }"}</> },
      { content: <>{"}"}</> },
      { content: null },
    ],
  },
  {
    name: "config.ts",
    lang: "TypeScript",
    highlight: 3,
    lines: [
      { content: <><span className="kw">import</span> {"{ "}<span className="fn">defineConfig</span>{" }"} <span className="kw">from</span> <span className="str">'@scilab/core'</span>;</> },
      { content: null },
      { content: <><span className="kw">export default</span> <span className="fn">defineConfig</span>({"{"}</> },
      { content: <><span className="fn">  name</span>: <span className="str">'scibot-platform'</span>,</> },
      { content: <><span className="fn">  version</span>: <span className="str">'3.2.1'</span>,</> },
      { content: <><span className="fn">  entry</span>: <span className="str">'src/flows/main.flow'</span>,</> },
      { content: null },
      { content: <><span className="fn">  deploy</span>: {"{"}</> },
      { content: <><span className="fn">    target</span>: <span className="str">'production'</span>,</> },
      { content: <><span className="fn">    replicas</span>: <span className="tp">3</span>,</> },
      { content: <><span className="fn">    healthCheck</span>: <span className="str">'/api/health'</span>,</> },
      { content: <>{"  },"}</> },
      { content: null },
      { content: <><span className="fn">  plugins</span>: [</> },
      { content: <><span className="str">    '@scilab/analytics'</span>,</> },
      { content: <><span className="str">    '@scilab/rate-limiter'</span>,</> },
      { content: <>{"  ],"}</> },
      { content: <>{"})"}</> },
    ],
  },
  {
    name: "hooks.ts",
    lang: "TypeScript",
    highlight: 6,
    lines: [
      { content: <><span className="kw">import</span> {"{ "}<span className="tp">Context</span>, <span className="fn">Hook</span>{" }"} <span className="kw">from</span> <span className="str">'@scilab/core'</span>;</> },
      { content: <><span className="kw">import</span> {"{ "}<span className="fn">logger</span>{" }"} <span className="kw">from</span> <span className="str">'./utils'</span>;</> },
      { content: null },
      { content: <><span className="kw">export const</span> <span className="fn">authGuard</span>: <span className="tp">Hook</span> = (ctx) =&gt; {"{"}</> },
      { content: <><span className="kw">  if</span> (!ctx.session.<span className="fn">isValid</span>()) {"{"}</> },
      { content: <><span className="kw">    return</span> ctx.<span className="fn">redirect</span>(<span className="str">'/login'</span>);</> },
      { content: <>{"  }"}</> },
      { content: <>{"  "}<span className="fn">logger</span>.<span className="fn">info</span>(<span className="str">`Auth passed: </span><span className="tp">$&#123;ctx.user.id&#125;</span><span className="str">`</span>);</> },
      { content: <>{"};"}</> },
      { content: null },
      { content: <><span className="kw">export const</span> <span className="fn">rateLimiter</span>: <span className="tp">Hook</span> = (ctx) =&gt; {"{"}</> },
      { content: <><span className="kw">  const</span> <span className="fn">key</span> = ctx.user.<span className="fn">id</span> ?? ctx.<span className="fn">ip</span>;</> },
      { content: <><span className="kw">  const</span> <span className="fn">count</span> = <span className="kw">await</span> <span className="fn">redis</span>.<span className="fn">incr</span>(<span className="fn">key</span>);</> },
      { content: <><span className="kw">  if</span> (<span className="fn">count</span> &gt; <span className="tp">100</span>) <span className="kw">throw</span> <span className="kw">new</span> <span className="fn">RateError</span>();</> },
      { content: <>{"};"}</> },
      { content: null },
      { content: <><span className="kw">export const</span> <span className="fn">analytics</span>: <span className="tp">Hook</span> = (ctx) =&gt; {"{"}</> },
      { content: <><span className="fn">  ctx</span>.<span className="fn">track</span>(<span className="str">'page_view'</span>, ctx.route);</> },
    ],
  },
];

export const CodeWindow = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tab = TABS[activeTab];
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    const angle = (Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2) * 180) / Math.PI;
    el.style.setProperty("--glow-x", `${x}%`);
    el.style.setProperty("--glow-y", `${y}%`);
    el.style.setProperty("--glow-angle", `${angle}deg`);
  }, []);

  return (
    <div className={styles.codeWindow} ref={ref} onMouseMove={handleMouseMove}>
      {/* Tab bar */}
      <div className={styles.codeTabs}>
        <div className={styles.codeDots}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.tabList}>
          {TABS.map((t, i) => (
            <span
              key={t.name}
              className={clsx(styles.tab, i === activeTab && styles.tabActive)}
              onClick={() => setActiveTab(i)}
            >
              {i === activeTab && (
                <svg viewBox="0 0 24 24" className={styles.tabIcon}>
                  <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                  <polyline points="13 2 13 9 20 9" />
                </svg>
              )}
              {t.name}
            </span>
          ))}
        </div>
      </div>

      {/* Code body with line numbers */}
      <div className={styles.codeBody} key={activeTab}>
        <div className={styles.lineNumbers}>
          {tab.lines.map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <div className={styles.codeContent}>
          {tab.lines.map((line, i) => (
            <div
              key={i}
              className={clsx(styles.codeLine, i === tab.highlight && styles.highlightLine)}
            >
              {line.content ?? "\u200B"}
            </div>
          ))}
          <span className={styles.typingCursor} />
        </div>
      </div>

      {/* Status bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <span className={styles.statusBranch}>
            <svg viewBox="0 0 24 24"><path d="M6 3v12M18 9a3 3 0 01-3 3H6M18 9a3 3 0 10-3-3" /></svg>
            main
          </span>
          <span className={styles.statusOk}>
            <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
            0 errors
          </span>
        </div>
        <div className={styles.statusRight}>
          <span>Ln {tab.highlight + 1}, Col 32</span>
          <span>{tab.lang}</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};
