import { GITHUB_URL, CONTACT_EMAIL } from "@/shared/config/constants";

import styles from "./Footer.module.css";

const FOOTER_LINKS = [
  { label: "Docs", href: "#" },
  { label: "GitHub", href: GITHUB_URL },
  { label: "Blog", href: "#" },
  { label: "Contact", href: `mailto:${CONTACT_EMAIL}` },
];

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerLogo}>
          <span className={styles.sci}>SCI</span>
          <span className={styles.lab}>-LAB</span>
        </div>
        <ul className={styles.footerLinks}>
          {FOOTER_LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <span className={styles.footerCopy}>&copy; {new Date().getFullYear()} SCI-LAB Foundation</span>
      </div>
    </footer>
  );
};
