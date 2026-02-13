import type { ReactNode } from "react";

import clsx from "clsx";

import { useScrollAnimation } from "@/shared/lib/useScrollAnimation";

import styles from "./ScrollSection.module.css";

type ScrollSectionProps = {
  children: ReactNode;
  className?: string;
  animation?: "fade-in" | "slide-left" | "slide-right";
};

export const ScrollSection = ({
  children,
  className,
  animation = "fade-in",
}: ScrollSectionProps) => {
  const ref = useScrollAnimation();

  return (
    <div ref={ref} className={clsx(styles.root, animation, className)}>
      {children}
    </div>
  );
};
