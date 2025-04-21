'use client';

import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom node types
import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import ConditionNode from './nodes/ConditionNode';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
};

const getNodeLabel = (type, config) => {
  switch (type) {
    case 'trigger':
      return config?.event || 'Select a trigger';
    case 'action':
      return config?.actionType || 'Select an action';
    case 'condition':
      return config?.conditionType || 'Select a condition';
    default:
      return `${type} node`;
  }
};

const WorkflowBuilder = ({ onNodeSelect, onSave, initialNodes = [], initialEdges = [] }) => {
  const [mounted, setMounted] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { project } = useReactFlow();

  // Only render on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize nodes and edges when they change
  useEffect(() => {
    if (mounted) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [initialNodes, initialEdges, mounted, setNodes, setEdges]);

  // Save changes to parent
  useEffect(() => {
    if (mounted && onSave) {
      onSave({ nodes, edges });
    }
  }, [nodes, edges, onSave, mounted]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const position = project({
        x: event.clientX - 200,
        y: event.clientY - 40,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          label: getNodeLabel(type),
          config: {
            actionType: type === 'action' ? '' : undefined,
            event: type === 'trigger' ? '' : undefined,
            conditionType: type === 'condition' ? '' : undefined,
          }
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project, setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback((_, node) => {
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  }, [onNodeSelect]);

  // Update node when configuration changes
  const updateNodeConfig = useCallback((nodeId, config) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              config: {
                ...node.data.config,
                ...config
              },
              label: getNodeLabel(node.type, {
                ...node.data.config,
                ...config
              })
            }
          };
          return updatedNode;
        }
        return node;
      })
    );
  }, [setNodes]);

  // Add updateNodeConfig to the parent component's scope
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.updateNodeConfig = updateNodeConfig;
    }
  }, [updateNodeConfig]);

  // Don't render anything on server-side
  if (!mounted) {
    return null;
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default WorkflowBuilder;


