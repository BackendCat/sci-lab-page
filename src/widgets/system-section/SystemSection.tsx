import type { ReactNode } from "react";

import clsx from "clsx";

import { useScrollAnimation } from "@/shared/lib/useScrollAnimation";

import styles from "./SystemSection.module.css";

type SystemSectionProps = {
  id?: string;
  label: string;
  title: string;
  children: ReactNode;
  visual?: ReactNode;
  reverse?: boolean;
};

export const SystemSection = ({ id, label, title, children, visual, reverse }: SystemSectionProps) => {
  const textRef = useScrollAnimation();
  const visualRef = useScrollAnimation();

  return (
    <section className={styles.section} id={id}>
      <div className={clsx(styles.sectionRow, reverse && styles.reverse)}>
        <div ref={textRef} className={clsx(styles.sectionText, reverse && styles.sectionTextReverse, reverse ? "slide-right" : "slide-left")}>
          <span className={styles.sectionLabel}>{label}</span>
          <h2 className={styles.sectionTitle}>{title}</h2>
          {children}
        </div>
        {visual && (
          <div ref={visualRef} className={clsx(styles.sectionVisual, reverse && styles.sectionVisualReverse, reverse ? "slide-left" : "slide-right")}>
            {visual}
          </div>
        )}
      </div>
    </section>
  );
};
