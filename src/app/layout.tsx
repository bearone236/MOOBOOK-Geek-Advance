import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from './components/header';
import { PoseProvider } from './function/postcontext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MOOBOOK',
  description: 'MOVE & BOOK',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <PoseProvider>
        <body className={inter.className}>
          <Header />
          {children}
        </body>
      </PoseProvider>
    </html>
  );
}
