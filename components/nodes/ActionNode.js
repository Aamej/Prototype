'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Mail } from 'lucide-react';

const ActionNode = ({ data }) => {
  const actionType = data.config?.actionType || 'Select an action';
  const description = data.config?.description || 'Perform an action';

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-500 w-64">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-green-100 text-green-500">
          <Mail size={16} />
        </div>
        <div className="ml-2">
          <div className="text-sm font-medium">{actionType}</div>
          <div className="text-xs text-gray-500">{description}</div>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  );
};

export default memo(ActionNode); 