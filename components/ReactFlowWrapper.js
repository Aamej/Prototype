'use client';

import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

export default function ReactFlowWrapper({ children }) {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
} 