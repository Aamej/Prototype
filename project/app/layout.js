import './globals.css';

export const metadata = {
  title: 'Workflow Builder',
  description: 'Build automated workflows with ease',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-gray-50">{children}</main>
      </body>
    </html>
  );
}