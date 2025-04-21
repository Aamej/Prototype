import './globals.css';
import { Inter } from 'next/font/google';
import Providers from '../components/Providers';
import 'reactflow/dist/style.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Prototypr - Visual Workflow Builder',
  description: 'A visual workflow builder application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}