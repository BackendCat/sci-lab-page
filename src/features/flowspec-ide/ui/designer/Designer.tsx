import { useCallback, useMemo } from "react";

import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { FlowPages } from "@/features/flowspec-ide/lib/parser";
import { useDesignerGraph, type FlowNodeData } from "../../model/useDesignerGraph";

import { FlowEdge } from "./FlowEdge";
import { FlowPageNode } from "./FlowPageNode";
import styles from "./Designer.module.css";

const nodeTypes = { flowPage: FlowPageNode };
const edgeTypes = { flowEdge: FlowEdge };

type DesignerProps = {
  pages: FlowPages;
  selectedNode: string | null;
  onNodeSelect: (nodeId: string | null) => void;
};

const DesignerInner = ({ pages, selectedNode, onNodeSelect }: DesignerProps) => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    resetLayout,
  } = useDesignerGraph(pages, selectedNode);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onNodeSelect(node.id);
    },
    [onNodeSelect],
  );

  const handlePaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  const miniNodeColor = useCallback(
    (node: Node) => {
      const data = node.data as FlowNodeData;
      return data.isEntry ? "var(--ac)" : "var(--t3)";
    },
    [],
  );

  const defaultEdgeOptions = useMemo(
    () => ({
      type: "flowEdge" as const,
      animated: false,
    }),
    [],
  );

  return (
    <div className={styles.designer}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        minZoom={0.15}
        maxZoom={3}
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
        className={styles.reactFlow}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={0.8}
          color="var(--t3)"
        />
        <Controls
          showInteractive={false}
          className={styles.controls}
        />
        <MiniMap
          nodeColor={miniNodeColor}
          maskColor="rgba(0,0,0,0.65)"
          pannable
          zoomable
        />
        <Panel position="top-right">
          <button
            className={styles.resetBtn}
            onClick={resetLayout}
            title="Auto-layout"
          >
            {"\u27f3"} Layout
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

/* Wrap in ReactFlowProvider (required for useReactFlow inside children) */
export const Designer = (props: DesignerProps) => (
  <ReactFlowProvider>
    <DesignerInner {...props} />
  </ReactFlowProvider>
);
