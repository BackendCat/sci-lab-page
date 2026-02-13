import clsx from "clsx";

export type ActivityId = "explorer" | "search" | "git" | "extensions";

type ActivityBarProps = {
  active: ActivityId | null;
  onChange: (id: ActivityId | null) => void;
};

const activities: { id: ActivityId; label: string; icon: JSX.Element }[] = [
  {
    id: "explorer",
    label: "Explorer",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 7V5a2 2 0 012-2h4l2 2h8a2 2 0 012 2v2" />
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 12h8M8 16h5" />
      </svg>
    ),
  },
  {
    id: "search",
    label: "Search",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    id: "git",
    label: "Source Control",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="5" r="2" />
        <circle cx="12" cy="19" r="2" />
        <circle cx="18" cy="12" r="2" />
        <path d="M12 7v4M12 15v2" />
        <path d="M14 12h2" />
      </svg>
    ),
  },
  {
    id: "extensions",
    label: "Extensions",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
      </svg>
    ),
  },
];

export const ActivityBar = ({ active, onChange }: ActivityBarProps) => {
  return (
    <div className="ide-activity-bar">
      <div className="activity-icons">
        {activities.map((a) => (
          <button
            key={a.id}
            className={clsx("activity-icon", { active: active === a.id })}
            onClick={() => onChange(active === a.id ? null : a.id)}
            title={a.label}
          >
            {a.icon}
          </button>
        ))}
      </div>
      <div className="activity-bottom">
        <button className="activity-icon" title="Settings">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
