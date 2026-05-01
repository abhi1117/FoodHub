import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'FoodHub - Food Delivery',
  description: 'Order your favorite food online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <Navbar />
          <main className="min-h-screen pt-16 bg-background">
            {children}
          </main>
        </ErrorBoundary>
      </body>
    </html>
  );
}