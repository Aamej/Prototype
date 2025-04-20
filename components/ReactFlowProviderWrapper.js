'use client';

import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

export default function ReactFlowProviderWrapper({ children }) {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
} 