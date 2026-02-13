import clsx from "clsx";

import { CodeWindow } from "./ui/CodeWindow";
import { MicroConsole } from "./ui/MicroConsole";
import styles from "./Hero.module.css";

export const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroText}>
        <div className={clsx(styles.heroBadge, styles.animSlideLeft)} style={{ animationDelay: "0.1s" }}>
          <span className={styles.pulse} /> Open Source &middot; MIT Licensed
        </div>
        <h1 className={styles.animSlideLeft} style={{ animationDelay: "0.25s" }}>
          Open Tools for Engineers
          <br />
          <span className={styles.gradientText}>Who Build the Future</span>
        </h1>
        <p className={clsx(styles.heroSub, styles.animSlideLeft)} style={{ animationDelay: "0.4s" }}>
          <span>Create. Share. Inspire.</span>
        </p>
        <p className={clsx(styles.heroDesc, styles.animSlideLeft)} style={{ animationDelay: "0.55s" }}>
          We build open-source developer tools and experiment with ideas that push engineering
          forward &mdash; from compiler infrastructure and DSL engines to hardware emulation and
          real-time systems. Free for everyone, from developers to the community. Join us and let's
          make technology more accessible together.
        </p>
        <div className={clsx(styles.heroActions, styles.animFadeIn)} style={{ animationDelay: "1.2s" }}>
          <a href="#systems" className="btn btn-primary">
            Explore Projects
          </a>
          <a href="#architecture" className="btn btn-ghost">
            Get Involved &rarr;
          </a>
        </div>
      </div>

      <div className={styles.heroVisual}>
        <div className={styles.animFromTopRight}>
          <CodeWindow />
        </div>
        <div className={styles.animFromBottomLeft}>
          <MicroConsole />
        </div>
      </div>

      <a href="#systems" className={styles.scrollHint} aria-label="Scroll to content">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </a>
    </section>
  );
};
