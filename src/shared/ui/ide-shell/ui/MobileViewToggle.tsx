import { memo, useCallback, useEffect, useState } from "react";

type MobileViewToggleProps = {
  onViewChange: (view: "code" | "preview") => void;
};

export const MobileViewToggle = memo(({ onViewChange }: MobileViewToggleProps) => {
  const [activeView, setActiveView] = useState<"code" | "preview">("code");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = matchMedia("(max-width: 600px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleToggle = useCallback(
    (view: "code" | "preview") => {
      setActiveView(view);
      onViewChange(view);
    },
    [onViewChange],
  );

  if (!isMobile) return null;

  return (
    <div className="mobile-view-toggle">
      <button
        className={activeView === "code" ? "active" : ""}
        onClick={() => handleToggle("code")}
      >
        Code
      </button>
      <button
        className={activeView === "preview" ? "active" : ""}
        onClick={() => handleToggle("preview")}
      >
        Preview
      </button>
    </div>
  );
});
