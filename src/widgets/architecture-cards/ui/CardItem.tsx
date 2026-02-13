import { useCallback, useRef } from "react";

import clsx from "clsx";

import type { ArchitectureCard } from "../data";

import styles from "./CardItem.module.css";

type CardItemProps = {
  card: ArchitectureCard;
};

const hexToRgba = (hex: string, a: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};

export const CardItem = ({ card }: CardItemProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = cardRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      const angle =
        (Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2) * 180) /
        Math.PI;
      el.style.setProperty("--card-gx", `${x}%`);
      el.style.setProperty("--card-gy", `${y}%`);
      el.style.setProperty("--card-angle", `${angle}deg`);
      el.style.setProperty("--card-c1", card.color);
    },
    [card.color],
  );

  const tagStyle = card.tagClass
    ? undefined
    : {
        color: card.color,
        background: hexToRgba(card.color, 0.08),
        borderColor: hexToRgba(card.color, 0.15),
      };

  return (
    <div className={styles.sysCard} ref={cardRef} onMouseMove={handleMouseMove}>
      <div className={styles.cardVisual}>
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {card.svg}
        </svg>
      </div>
      <div className={styles.cardBody}>
        <span className={clsx("tag", card.tagClass)} style={tagStyle}>
          {card.tag}
        </span>
        <h3>{card.title}</h3>
        <p>{card.desc}</p>
        <a href={card.link} className={styles.cardLink}>
          {card.linkText} <span>&rarr;</span>
        </a>
      </div>
    </div>
  );
};
