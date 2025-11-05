import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ClariFi - Loan Origination System',
  description: 'Modern loan origination and CRM system powered by AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
