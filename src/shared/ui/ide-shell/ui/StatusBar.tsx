import type { ReactNode } from "react";

type StatusBarProps = {
  left?: ReactNode;
  right?: ReactNode;
  onToggleTerminal?: () => void;
  onOpenConsole?: () => void;
  onOpenDebug?: () => void;
};

export const StatusBar = ({
  left,
  right,
  onToggleTerminal,
  onOpenConsole,
  onOpenDebug,
}: StatusBarProps) => {
  return (
    <div className="ide-status-bar">
      <div className="status-left">{left}</div>
      <div className="status-right">
        {right}
        {onOpenConsole && (
          <button onClick={onOpenConsole} title="Console">
            &#9655; Console
          </button>
        )}
        {onOpenDebug && (
          <button onClick={onOpenDebug} title="Debug">
            &#9881; Debug
          </button>
        )}
        {onToggleTerminal && (
          <button onClick={onToggleTerminal} title="Toggle Terminal">
            &#9638; Terminal
          </button>
        )}
      </div>
    </div>
  );
};
