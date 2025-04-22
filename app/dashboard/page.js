'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import Sidebar from '../../components/Sidebar';
import ReactFlowWrapper from '../../components/ReactFlowWrapper';
import { debounce } from 'lodash';

// Import GmailAuthPanel dynamically to avoid hydration issues
const GmailAuthPanel = dynamic(() => import('../../components/GmailAuthPanel'), {
  ssr: false
});

// Import WorkflowBuilder dynamically
const WorkflowBuilder = dynamic(() => import('../../components/WorkflowBuilder'), {
  ssr: false
});

// Create a client-side only input component
const ClientOnlyInput = dynamic(() => Promise.resolve(({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    className="text-xl font-semibold bg-transparent border-none focus:outline-none"
    placeholder={placeholder}
  />
)), { ssr: false });

// Utility function to get node label based on type and config
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

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [workflow, setWorkflow] = useState({
    name: 'Untitled Workflow',
    nodes: [],
    edges: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle initial mount and workflow loading
  useEffect(() => {
    setMounted(true);
    loadWorkflowFromStorage();
  }, []);

  // Load workflow when auth status changes
  useEffect(() => {
    if (status === 'authenticated') {
      loadWorkflowFromStorage();
    }
  }, [status]);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce((workflowToSave) => {
      if (mounted && workflowToSave) {
        const hasNodes = Array.isArray(workflowToSave.nodes) && workflowToSave.nodes.length > 0;
        const hasEdges = Array.isArray(workflowToSave.edges) && workflowToSave.edges.length > 0;
        const hasCustomName = workflowToSave.name !== 'Untitled Workflow';

        if (hasNodes || hasEdges || hasCustomName) {
          localStorage.setItem('currentWorkflow', JSON.stringify(workflowToSave));
        }
      }
    }, 1000),
    [mounted]
  );

  // Save workflow to localStorage whenever it changes
  useEffect(() => {
    debouncedSave(workflow);
    return () => debouncedSave.cancel();
  }, [workflow, debouncedSave]);

  const loadWorkflowFromStorage = () => {
    try {
      const saved = localStorage.getItem('currentWorkflow');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure the parsed data has the required structure
        setWorkflow({
          name: parsed.name || 'Untitled Workflow',
          nodes: Array.isArray(parsed.nodes) ? parsed.nodes : [],
          edges: Array.isArray(parsed.edges) ? parsed.edges : []
        });

        // Restore selected node if there was one
        const lastActiveNodeId = sessionStorage.getItem('lastActiveNodeId');
        if (lastActiveNodeId) {
          const node = parsed.nodes?.find(n => n.id === lastActiveNodeId);
          if (node) {
            setSelectedNode(node);
            sessionStorage.removeItem('lastActiveNodeId');
          }
        }
      }
    } catch (e) {
      console.error('Error loading workflow:', e);
      // Reset to initial state if there's an error
      setWorkflow({
        name: 'Untitled Workflow',
        nodes: [],
        edges: []
      });
    }
  };

  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node);
    // Save selected node ID for restoration after auth
    if (node) {
      sessionStorage.setItem('lastActiveNodeId', node.id);
    }
  }, []);

  const handleSaveWorkflow = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      localStorage.setItem('currentWorkflow', JSON.stringify(workflow));
      console.log('Saving workflow:', workflow);
      alert('Workflow saved successfully!');
    } catch (error) {
      console.error('Error saving workflow:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [workflow]);

  const handleWorkflowChange = useCallback(({ nodes, edges }) => {
    setWorkflow(prev => {
      // Only update if there are actual changes
      const prevNodes = prev.nodes || [];
      const prevEdges = prev.edges || [];
      const newNodes = nodes || [];
      const newEdges = edges || [];
      
      if (JSON.stringify(prevNodes) === JSON.stringify(newNodes) && 
          JSON.stringify(prevEdges) === JSON.stringify(newEdges)) {
        return prev;
      }
      
      return {
        ...prev,
        nodes: newNodes,
        edges: newEdges
      };
    });
  }, []);

  const handleGmailAuth = useCallback(({ email, isAuthenticated, nodeType, accessToken }) => {
    if (!selectedNode) return;

    setWorkflow(prev => {
      const updatedNodes = prev.nodes.map(node => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              config: {
                ...node.data.config,
                gmailAuth: {
                  email,
                  isAuthenticated,
                  accessToken
                }
              }
            }
          };
        }
        return node;
      });

      return {
        ...prev,
        nodes: updatedNodes
      };
    });
  }, [selectedNode]);

  const handleUpdateNodeConfig = useCallback((updates) => {
    if (!selectedNode) return;

    // Update the node in the workflow state
    setWorkflow(prev => {
      const updatedNodes = prev.nodes.map(node => {
        if (node.id === selectedNode.id) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              config: {
                ...node.data.config,
                ...updates
              },
              label: getNodeLabel(node.type, {
                ...node.data.config,
                ...updates
              })
            }
          };
          // Update the selected node to reflect changes immediately
          setSelectedNode(updatedNode);
          return updatedNode;
        }
        return node;
      });

      return {
        ...prev,
        nodes: updatedNodes
      };
    });

    // Update the node in ReactFlow using the global updateNodeConfig function
    if (typeof window !== 'undefined' && window.updateNodeConfig) {
      window.updateNodeConfig(selectedNode.id, updates);
    }
  }, [selectedNode]);

  // Don't render anything until after mount
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <div className="h-14 border-b border-gray-200 flex items-center px-4 bg-white">
            <ClientOnlyInput
              value={workflow.name}
              onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
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
            <ReactFlowWrapper>
              <WorkflowBuilder 
                onNodeSelect={handleNodeSelect} 
                onSave={handleWorkflowChange}
                initialNodes={workflow.nodes}
                initialEdges={workflow.edges}
              />
            </ReactFlowWrapper>
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
              
              {selectedNode && (selectedNode.type === 'trigger' || selectedNode.type === 'action') && (
                <div className="border-t border-gray-200 pt-4">
                  <GmailAuthPanel 
                    onAuth={handleGmailAuth}
                    nodeType={selectedNode.type}
                    initialEmail={selectedNode.data?.config?.gmailAuth?.email || ''}
                  />
                </div>
              )}
              
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
                    <option value="move_to_folder">Move to Folder</option>
                    <option value="mark_as_read">Mark as Read</option>
                    <option value="mark_as_unread">Mark as Unread</option>
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