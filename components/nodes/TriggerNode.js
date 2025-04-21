'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Zap } from 'lucide-react';

const TriggerNode = ({ data }) => {
  const triggerEvent = data.config?.event || 'Select a trigger';
  const description = data.config?.description || 'Start your workflow';

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-indigo-500 w-64">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-500">
          <Zap size={16} />
        </div>
        <div className="ml-2">
          <div className="text-sm font-medium">{triggerEvent}</div>
          <div className="text-xs text-gray-500">{description}</div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-indigo-500"
      />
    </div>
  );
};

export default memo(TriggerNode); 