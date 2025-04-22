'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '../../components/Sidebar';
import ReactFlowProviderWrapper from '../../components/ReactFlowProviderWrapper';

const WorkflowBuilder = dynamic(() => import('../../components/WorkflowBuilder'), {
  ssr: false
});

export default function Dashboard() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [workflow, setWorkflow] = useState({ 
    name: 'Untitled Workflow',
    nodes: [],
    edges: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node);
  }, []);

  const handleSaveWorkflow = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For now, just log the workflow
      console.log('Saving workflow:', workflow);
      
      // Show success message
      alert('Workflow saved successfully!');
    } catch (error) {
      console.error('Error saving workflow:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [workflow]);

  const handleWorkflowChange = useCallback(({ nodes, edges }) => {
    setWorkflow(prev => ({
      ...prev,
      nodes,
      edges
    }));
  }, []);

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
              placeholder="Untitled Workflow"
            />
            <div className="ml-auto flex items-center space-x-4">
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveWorkflow}
                  className="p-2 text-gray-600 hover:text-gray-900"
                  title="Save Workflow"
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h-2v5.586l-1.293-1.293z" />
                  </svg>
                </button>
                <button
                  className="p-2 text-gray-600 hover:text-gray-900"
                  title="Run Workflow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  className="p-2 text-gray-600 hover:text-red-600"
                  title="Delete Workflow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <ReactFlowProviderWrapper>
              <WorkflowBuilder 
                onNodeSelect={handleNodeSelect} 
                onSave={handleWorkflowChange}
              />
            </ReactFlowProviderWrapper>
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
                  <select 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={selectedNode.data?.config?.event || ''}
                    onChange={(e) => handleUpdateNodeConfig({ event: e.target.value })}
                  >
                    <option value="">Select an event</option>
                    <option value="new_email">New Email</option>
                    <option value="new_attachment">New Attachment</option>
                    <option value="email_matching_search">Email Matching Search</option>
                    <option value="calendar_event">Calendar Event</option>
                  </select>
                </div>
              )}
              
              {selectedNode.type === 'action' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Action Type</label>
                  <select 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={selectedNode.data?.config?.actionType || ''}
                    onChange={(e) => handleUpdateNodeConfig({ actionType: e.target.value })}
                  >
                    <option value="">Select an action</option>
                    <option value="send_email">Send Email</option>
                    <option value="create_draft">Create Draft</option>
                    <option value="add_label">Add Label</option>
                    <option value="send_message">Send Message</option>
                    <option value="create_document">Create Document</option>
                  </select>
                </div>
              )}
              
              {selectedNode.type === 'condition' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Condition Type</label>
                  <select 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={selectedNode.data?.config?.conditionType || ''}
                    onChange={(e) => handleUpdateNodeConfig({ conditionType: e.target.value })}
                  >
                    <option value="">Select a condition</option>
                    <option value="contains">Contains</option>
                    <option value="equals">Equals</option>
                    <option value="greater_than">Greater Than</option>
                    <option value="less_than">Less Than</option>
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