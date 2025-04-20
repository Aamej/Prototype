'use client';

import { Mail, Zap, GitBranch, FileText, Calendar, MessageSquare, Database, Settings } from 'lucide-react';

const nodeTypes = [
  { 
    type: 'trigger',
    icon: Zap,
    label: 'Gmail Trigger',
    description: 'Start workflow on Gmail events',
    category: 'Triggers'
  },
  { 
    type: 'trigger',
    icon: Calendar,
    label: 'Calendar Trigger',
    description: 'Start workflow on calendar events',
    category: 'Triggers'
  },
  { 
    type: 'action',
    icon: Mail,
    label: 'Send Email',
    description: 'Send an email to a recipient',
    category: 'Actions'
  },
  { 
    type: 'action',
    icon: MessageSquare,
    label: 'Send Message',
    description: 'Send a message to a channel',
    category: 'Actions'
  },
  { 
    type: 'action',
    icon: FileText,
    label: 'Create Document',
    description: 'Create a new document',
    category: 'Actions'
  },
  { 
    type: 'condition',
    icon: GitBranch,
    label: 'Condition',
    description: 'Branch your workflow based on conditions',
    category: 'Logic'
  },
  { 
    type: 'action',
    icon: Database,
    label: 'Database Operation',
    description: 'Perform database operations',
    category: 'Actions'
  },
  { 
    type: 'action',
    icon: Settings,
    label: 'Custom Action',
    description: 'Execute custom code or API calls',
    category: 'Actions'
  }
];

// Group nodes by category
const groupedNodes = nodeTypes.reduce((acc, node) => {
  if (!acc[node.category]) {
    acc[node.category] = [];
  }
  acc[node.category].push(node);
  return acc;
}, {});

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 border-r border-gray-200 bg-white overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Workflow Nodes</h2>
        <p className="text-sm text-gray-500 mt-1">Drag nodes to the canvas</p>
      </div>
      <div className="p-4">
        {Object.entries(groupedNodes).map(([category, nodes]) => (
          <div key={category} className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{category}</h3>
            <div className="space-y-2">
              {nodes.map(({ type, icon: Icon, label, description }) => (
                <div
                  key={`${type}-${label}`}
                  className="flex flex-col p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
                  draggable
                  onDragStart={(e) => onDragStart(e, type)}
                >
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-2" />
                    <span className="font-medium">{label}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;