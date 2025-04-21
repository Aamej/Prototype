'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactFlowProvider } from 'reactflow';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ReactFlowProvider>
        {children}
      </ReactFlowProvider>
    </SessionProvider>
  );
} 