import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import clsx from "clsx";

import { ARCHITECTURE_CARDS } from "./data";
import { CardItem } from "./ui/CardItem";
import styles from "./ArchitectureCards.module.css";

const DESKTOP_PER_PAGE = 4;
const TABLET_PER_PAGE = 2;
const MOBILE_PER_PAGE = 1;
const TABLET_BREAKPOINT = 1000;
const MOBILE_BREAKPOINT = 600;

const getPerPage = () => {
  const w = window.innerWidth;
  if (w <= MOBILE_BREAKPOINT) return MOBILE_PER_PAGE;
  if (w <= TABLET_BREAKPOINT) return TABLET_PER_PAGE;
  return DESKTOP_PER_PAGE;
};

export const ArchitectureCards = () => {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(DESKTOP_PER_PAGE);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = useMemo(() => Math.ceil(ARCHITECTURE_CARDS.length / perPage), [perPage]);

  const goTo = useCallback(
    (next: number) => {
      setPage(Math.max(0, Math.min(totalPages - 1, next)));
    },
    [totalPages],
  );

  const handleResize = useCallback(() => {
    const pp = getPerPage();
    setPerPage(pp);
    setPage((prev) => Math.min(prev, Math.ceil(ARCHITECTURE_CARDS.length / pp) - 1));
  }, []);

  /* Mouse wheel scroll through pages (debounced) */
  const lastScrollRef = useRef(0);
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (totalPages <= 1) return;
      const now = Date.now();
      if (now - lastScrollRef.current < 700) return;
      if (Math.abs(e.deltaY) < 100) return;
      e.preventDefault();
      lastScrollRef.current = now;
      if (e.deltaY > 0) setPage((p) => Math.min(totalPages - 1, p + 1));
      else setPage((p) => Math.max(0, p - 1));
    },
    [totalPages],
  );

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Group cards into pages
  const pages = useMemo(() => {
    const result: (typeof ARCHITECTURE_CARDS)[] = [];
    for (let i = 0; i < ARCHITECTURE_CARDS.length; i += perPage) {
      result.push(ARCHITECTURE_CARDS.slice(i, i + perPage));
    }
    return result;
  }, [perPage]);

  return (
    <>
    <div className="section-divider"><hr /></div>
    <section className={styles.cardsSection} id="architecture">
      <div className={styles.cardsHeader}>
        <span className={styles.cardsLabel}>Platform Internals</span>
        <h2>Architecture Overview</h2>
        <p>Core subsystems powering the SCI-LAB platform</p>
      </div>

      <div className={styles.cardsCarousel} ref={containerRef}>
        <button
          className={clsx(styles.cardsNav, styles.left, page <= 0 && styles.hidden)}
          onClick={() => goTo(page - 1)}
        >
          <svg viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className={styles.cardsViewport}>
          <div
            className={styles.cardsStrip}
            style={{ transform: `translateX(-${page * 100}%)` }}
          >
            {pages.map((group, gi) => (
              <div
                key={gi}
                className={styles.cardsPage}
                style={{ gridTemplateColumns: `repeat(${perPage}, 1fr)` }}
              >
                {group.map((card) => (
                  <CardItem key={card.title} card={card} />
                ))}
              </div>
            ))}
          </div>
        </div>

        <button
          className={clsx(styles.cardsNav, styles.right, page >= totalPages - 1 && styles.hidden)}
          onClick={() => goTo(page + 1)}
        >
          <svg viewBox="0 0 24 24">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>

        <div className={styles.cardsDots}>
          {Array.from({ length: totalPages }, (_, i) => (
            <span
              key={i}
              className={clsx(styles.cardsDot, i === page && styles.active)}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
    </>
  );
};
