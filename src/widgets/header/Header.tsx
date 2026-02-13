import { useEffect, useState } from "react";

import clsx from "clsx";

import { ThemeToggle } from "@/features/theme/ui/ThemeToggle";
import { GITHUB_URL } from "@/shared/config/constants";

import styles from "./Header.module.css";

const NAV_LINKS = [
  { href: "#systems", label: "Systems" },
  { href: "#cli", label: "CLI" },
  { href: "#architecture", label: "Architecture" },
  { href: "#playground", label: "Playground" },
] as const;

const SCROLL_THRESHOLD = 30;

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={clsx(styles.nav, scrolled && styles.scrolled)}>
      <div className={styles.navLeft}>
        <a className={styles.navLogo} href="#">
          <LogoSvg />
          <span>
            <span className={styles.sci}>SCI</span>
            <span className={styles.lab}>-LAB</span>
          </span>
        </a>
      </div>

      <ul className={styles.navCenter}>
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>

      <div className={styles.navRight}>
        <ThemeToggle />
        <a className={styles.ghBtn} href={GITHUB_URL} target="_blank">
          <GithubIcon />
          GitHub
        </a>
      </div>
    </nav>
  );
};

const LogoSvg = () => (
  <svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="17" cy="17" r="3.5" fill="#16e0bd" opacity="0.9" />
    <circle cx="17" cy="5" r="2" fill="#16e0bd" opacity="0.65" />
    <circle cx="27.4" cy="11" r="2" fill="#16e0bd" opacity="0.65" />
    <circle cx="27.4" cy="23" r="2" fill="#16e0bd" opacity="0.65" />
    <circle cx="17" cy="29" r="2" fill="#16e0bd" opacity="0.65" />
    <circle cx="6.6" cy="23" r="2" fill="#16e0bd" opacity="0.65" />
    <circle cx="6.6" cy="11" r="2" fill="#16e0bd" opacity="0.65" />
    <line x1="17" y1="17" x2="17" y2="5" stroke="#16e0bd" strokeWidth=".8" opacity="0.35" />
    <line x1="17" y1="17" x2="27.4" y2="11" stroke="#16e0bd" strokeWidth=".8" opacity="0.35" />
    <line x1="17" y1="17" x2="27.4" y2="23" stroke="#16e0bd" strokeWidth=".8" opacity="0.35" />
    <line x1="17" y1="17" x2="17" y2="29" stroke="#16e0bd" strokeWidth=".8" opacity="0.35" />
    <line x1="17" y1="17" x2="6.6" y2="23" stroke="#16e0bd" strokeWidth=".8" opacity="0.35" />
    <line x1="17" y1="17" x2="6.6" y2="11" stroke="#16e0bd" strokeWidth=".8" opacity="0.35" />
    <line x1="17" y1="5" x2="27.4" y2="11" stroke="#16e0bd" strokeWidth=".6" opacity="0.2" />
    <line x1="27.4" y1="11" x2="27.4" y2="23" stroke="#16e0bd" strokeWidth=".6" opacity="0.2" />
    <line x1="27.4" y1="23" x2="17" y2="29" stroke="#16e0bd" strokeWidth=".6" opacity="0.2" />
    <line x1="17" y1="29" x2="6.6" y2="23" stroke="#16e0bd" strokeWidth=".6" opacity="0.2" />
    <line x1="6.6" y1="23" x2="6.6" y2="11" stroke="#16e0bd" strokeWidth=".6" opacity="0.2" />
    <line x1="6.6" y1="11" x2="17" y2="5" stroke="#16e0bd" strokeWidth=".6" opacity="0.2" />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);
