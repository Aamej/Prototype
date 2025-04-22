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

const WorkflowBuilder = ({ onNodeSelect, onSave }) => {
  const [mounted, setMounted] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const { project } = useReactFlow();

  // Only render on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

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
          label: `${type} node`,
          config: {}
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
    setSelectedNode(node);
    onNodeSelect(node);
  }, [onNodeSelect]);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave({ nodes, edges });
    }
  }, [nodes, edges, onSave]);

  const handleUndo = useCallback(() => {
    // Implement undo functionality
    console.log('Undo');
  }, []);

  const handleRedo = useCallback(() => {
    // Implement redo functionality
    console.log('Redo');
  }, []);

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
        <Panel position="top-right" className="flex gap-2">
          <button 
            onClick={handleUndo}
            className="px-3 py-1 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Undo
          </button>
          <button 
            onClick={handleRedo}
            className="px-3 py-1 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Redo
          </button>
          <button 
            onClick={handleSave}
            className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Save
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default WorkflowBuilder;


