import { memo } from "react";

import clsx from "clsx";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";

import type { FlowNodeData } from "../../model/useDesignerGraph";

import styles from "./Designer.module.css";

type FlowPageNodeType = Node<FlowNodeData, "flowPage">;

export const FlowPageNode = memo(({ data, selected }: NodeProps<FlowPageNodeType>) => {
  const { pageName, page, isEntry } = data;
  const textCount = page.texts.length;
  const btnCount = page.buttons.length;
  const mediaCount = page.media.length;

  return (
    <div className={clsx(styles.flowNode, isEntry && styles.entryNode, selected && styles.selectedNode)}>
      <Handle type="target" position={Position.Top} id="input" className={styles.handle} />

      {isEntry && <div className={styles.entryBadge} />}

      <div className={styles.nodeTitle}>{pageName}</div>

      <div className={styles.nodeSummary}>
        {textCount > 0 && <span>{textCount} msg</span>}
        {mediaCount > 0 && <span>{mediaCount} media</span>}
        {btnCount > 0 && <span>{btnCount} btn</span>}
      </div>

      <div className={styles.nodeElements}>
        {page.texts.slice(0, 2).map((t, i) => (
          <div key={`t-${i}`} className={styles.nodeElementRow}>
            <span className={styles.elIcon}>{"\u2261"}</span>
            <span className={styles.elText}>{t}</span>
          </div>
        ))}
        {page.texts.length > 2 && (
          <div className={styles.nodeElementRow}>
            <span className={styles.elIcon}>{"\u2026"}</span>
            <span className={styles.elText}>+{page.texts.length - 2} more</span>
          </div>
        )}
        {page.buttons.map((btn, i) => (
          <div key={`b-${i}`} className={styles.nodeElementRow}>
            <span className={styles.elIcon}>{"\u25a2"}</span>
            <span className={styles.elText}>{btn.label}</span>
            <span className={styles.elTarget}>{"\u2192"} {btn.target}</span>
          </div>
        ))}
      </div>

      {page.buttons.map((_, i) => (
        <Handle
          key={`btn-${i}`}
          type="source"
          position={Position.Bottom}
          id={`btn-${i}`}
          className={styles.handleOut}
          style={{
            left: `${((i + 1) / (btnCount + 1)) * 100}%`,
          }}
        />
      ))}
    </div>
  );
});
