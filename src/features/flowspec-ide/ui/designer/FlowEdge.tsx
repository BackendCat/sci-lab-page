import { memo } from "react";

import clsx from "clsx";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";

import styles from "./Designer.module.css";

export const FlowEdge = memo((props: EdgeProps) => {
  const {
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    label, markerEnd, style,
  } = props;

  const isBack = targetY <= sourceY;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    borderRadius: 8,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={style}
        className={clsx(isBack && styles.backEdge)}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            className={styles.edgeLabel}
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "none",
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});
