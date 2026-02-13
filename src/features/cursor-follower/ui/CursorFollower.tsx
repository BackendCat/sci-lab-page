import { useEffect, useRef } from "react";

import styles from "./CursorFollower.module.css";

const LERP = 0.08;

export const CursorFollower = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = -60;
    let mouseY = -60;
    let circleX = -60;
    let circleY = -60;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.top = `${mouseY}px`;
        dotRef.current.style.left = `${mouseX}px`;
      }
    };

    const animate = () => {
      circleX += (mouseX - circleX) * LERP;
      circleY += (mouseY - circleY) * LERP;

      if (circleRef.current) {
        circleRef.current.style.top = `${circleY}px`;
        circleRef.current.style.left = `${circleX}px`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={styles.cursorDot} />
      <div ref={circleRef} className={styles.cursorCircle} />
    </>
  );
};
