'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { GitBranch } from 'lucide-react';

const ConditionNode = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-yellow-500 w-64">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-yellow-100 text-yellow-500">
          <GitBranch size={16} />
        </div>
        <div className="ml-2">
          <div className="text-sm font-medium">{data.label || 'Condition'}</div>
          <div className="text-xs text-gray-500">{data.description || 'Branch your workflow'}</div>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-yellow-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="w-3 h-3 bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className="w-3 h-3 bg-red-500"
      />
    </div>
  );
};

export default memo(ConditionNode); 