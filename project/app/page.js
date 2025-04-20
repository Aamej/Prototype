'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '../components/Sidebar';

const WorkflowBuilder = dynamic(() => import('../components/WorkflowBuilder'), {
  ssr: false
});

export default function Home() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [workflow, setWorkflow] = useState({ name: 'Untitled Workflow' });

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
  };

  const handleSaveWorkflow = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflow),
      });
      const data = await response.json();
      console.log('Workflow saved:', data);
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <div className="h-14 border-b border-gray-200 flex items-center px-4 bg-white">
            <input
              type="text"
              value={workflow.name}
              onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
              className="text-xl font-semibold bg-transparent border-none focus:outline-none"
            />
            <button
              onClick={handleSaveWorkflow}
              className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save Workflow
            </button>
          </div>
          <div className="flex-1">
            <WorkflowBuilder onNodeSelect={handleNodeSelect} />
          </div>
        </div>
        {selectedNode && (
          <div className="w-80 border-l border-gray-200 p-4 bg-white overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Node Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Node Type</label>
                <div className="mt-1 text-sm">{selectedNode.type}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Node ID</label>
                <div className="mt-1 text-sm">{selectedNode.id}</div>
              </div>
              {selectedNode.type === 'trigger' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trigger Event</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option>New Email</option>
                    <option>New Attachment</option>
                    <option>Email Matching Search</option>
                  </select>
                </div>
              )}
              {selectedNode.type === 'action' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Action Type</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option>Send Email</option>
                    <option>Create Draft</option>
                    <option>Add Label</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}