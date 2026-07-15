import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EDOS MVP',
  description: 'TYT Fonksiyonlar MVP',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <body>{children}</body>
    </html>
  );
}
