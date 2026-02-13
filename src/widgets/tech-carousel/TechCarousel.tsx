import clsx from "clsx";

import { useScrollAnimation } from "@/shared/lib/useScrollAnimation";

import styles from "./TechCarousel.module.css";

const TECH_ITEMS = [
  { label: "TypeScript", svg: <rect width="20" height="20" rx="2" fill="#3178c6" />, text: <text x="10" y="14.5" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontSize="9" fontWeight="700">TS</text> },
  { label: "Rust", svg: <><circle cx="10" cy="10" r="8" fill="none" stroke="#f74c00" strokeWidth="1.3" /><circle cx="10" cy="10" r="3" fill="none" stroke="#f74c00" strokeWidth="1" /><line x1="10" y1="2" x2="10" y2="5.5" stroke="#f74c00" strokeWidth="1.5" /><line x1="10" y1="14.5" x2="10" y2="18" stroke="#f74c00" strokeWidth="1.5" /><line x1="2" y1="10" x2="5.5" y2="10" stroke="#f74c00" strokeWidth="1.5" /><line x1="14.5" y1="10" x2="18" y2="10" stroke="#f74c00" strokeWidth="1.5" /></> },
  { label: "Go", svg: <text x="10" y="14" textAnchor="middle" fill="#00ADD8" fontFamily="sans-serif" fontSize="11" fontWeight="800">Go</text> },
  { label: "PostgreSQL", svg: <><ellipse cx="10" cy="7.5" rx="7" ry="4.5" fill="none" stroke="#336791" strokeWidth="1.2" /><path d="M3 7.5v4c0 2.5 3.1 4.5 7 4.5s7-2 7-4.5v-4" fill="none" stroke="#336791" strokeWidth="1.2" /><line x1="14" y1="9" x2="17" y2="16" stroke="#336791" strokeWidth="1" /></> },
  { label: "Redis", svg: <><polygon points="10,2 18,10 10,18 2,10" fill="none" stroke="#DC382D" strokeWidth="1.2" /><line x1="2" y1="10" x2="18" y2="10" stroke="#DC382D" strokeWidth=".7" /><line x1="10" y1="2" x2="10" y2="18" stroke="#DC382D" strokeWidth=".7" /></> },
  { label: "Docker", svg: <><rect x="2" y="8" width="16" height="9" rx="2" fill="none" stroke="#2496ED" strokeWidth="1" /><rect x="4" y="10" width="3" height="2.5" rx=".5" fill="#2496ED" /><rect x="8.5" y="10" width="3" height="2.5" rx=".5" fill="#2496ED" /><rect x="13" y="10" width="3" height="2.5" rx=".5" fill="#2496ED" /><rect x="8.5" y="6" width="3" height="2.5" rx=".5" fill="#2496ED" /></> },
  { label: "Kubernetes", svg: <><circle cx="10" cy="10" r="8" fill="none" stroke="#326CE5" strokeWidth="1" /><path d="M10 2L10 18M2 10L18 10M4.3 4.3L15.7 15.7M15.7 4.3L4.3 15.7" stroke="#326CE5" strokeWidth=".5" /><circle cx="10" cy="10" r="2.5" fill="#326CE5" /></> },
  { label: "gRPC", svg: <><rect width="20" height="20" rx="2" fill="#244c5a" /><text x="10" y="13" textAnchor="middle" fill="#5AC4BE" fontFamily="monospace" fontSize="6" fontWeight="700">gRPC</text></> },
  { label: "Terraform", svg: <><polygon points="7,2 13,6 13,13 7,9" fill="#7B42BC" /><polygon points="14,6 20,10 20,17 14,13" fill="#7B42BC" opacity=".65" /><polygon points="0,6 6,10 6,17 0,13" fill="#7B42BC" opacity=".4" /></> },
  { label: "WebAssembly", svg: <><rect width="20" height="20" rx="2" fill="#654FF0" /><text x="10" y="14.5" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontSize="10" fontWeight="800">W</text></> },
  { label: "GraphQL", svg: <><polygon points="10,1 18.2,5.5 18.2,14.5 10,19 1.8,14.5 1.8,5.5" fill="none" stroke="#E10098" strokeWidth="1" /><circle cx="10" cy="1" r="1.3" fill="#E10098" /><circle cx="18.2" cy="5.5" r="1.3" fill="#E10098" /><circle cx="18.2" cy="14.5" r="1.3" fill="#E10098" /><circle cx="10" cy="19" r="1.3" fill="#E10098" /><circle cx="1.8" cy="14.5" r="1.3" fill="#E10098" /><circle cx="1.8" cy="5.5" r="1.3" fill="#E10098" /></> },
  { label: "NATS", svg: <><rect width="20" height="20" rx="2" fill="#27AAE1" /><text x="10" y="14.5" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontSize="10" fontWeight="800">N</text></> },
  { label: "Prometheus", svg: <><circle cx="10" cy="10" r="8" fill="none" stroke="#E6522C" strokeWidth="1" /><path d="M10 3L10 10L14.5 12.5" fill="none" stroke="#E6522C" strokeWidth="1.5" strokeLinecap="round" /></> },
  { label: "Zig", svg: <><rect width="20" height="20" rx="2" fill="#F7A41D" /><text x="10" y="15" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontSize="12" fontWeight="800">Z</text></> },
];

const TechItem = ({ label, svg, text }: { label: string; svg: React.ReactNode; text?: React.ReactNode }) => (
  <span className={styles.carouselItem}>
    <svg viewBox="0 0 20 20">
      {svg}
      {text}
    </svg>
    {label}
  </span>
);

export const TechCarousel = () => {
  const ref = useScrollAnimation();

  return (
    <div ref={ref} className={clsx(styles.techCarousel, "fade-in")}>
      <div className={styles.carouselLabel}>Built With</div>
      <div className={styles.carouselTrack}>
        {TECH_ITEMS.map((item, i) => (
          <TechItem key={`a-${i}`} {...item} />
        ))}
        {TECH_ITEMS.map((item, i) => (
          <TechItem key={`b-${i}`} {...item} />
        ))}
      </div>
    </div>
  );
};
