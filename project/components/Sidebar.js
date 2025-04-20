'use client';

import { Mail, Zap } from 'lucide-react';

const nodeTypes = [
  { 
    type: 'trigger',
    icon: Zap,
    label: 'Gmail Trigger',
    description: 'Start workflow on Gmail events'
  },
  { 
    type: 'action',
    icon: Mail,
    label: 'Gmail Action',
    description: 'Perform Gmail actions'
  }
];

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 border-r border-gray-200 bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Gmail Nodes</h2>
        <p className="text-sm text-gray-500 mt-1">Drag nodes to the canvas</p>
      </div>
      <div className="p-4 space-y-3">
        {nodeTypes.map(({ type, icon: Icon, label, description }) => (
          <div
            key={type}
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
  );
};

export default Sidebar;