import type { ReactNode } from "react";

import clsx from "clsx";

export type TabItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  dirty?: boolean;
};

type TabBarProps = {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onTabClose?: (id: string) => void;
};

export const TabBar = ({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
}: TabBarProps) => {
  return (
    <div className="ide-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={clsx("ide-tab", {
            active: tab.id === activeTab,
            dirty: tab.dirty,
          })}
          onClick={() => onTabChange(tab.id)}
          title={tab.label}
        >
          {tab.icon && <span className="icon">{tab.icon}</span>}
          <span>{tab.label}</span>
          {onTabClose && (
            <span
              className="tab-close"
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }
              }}
            >
              &times;
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
