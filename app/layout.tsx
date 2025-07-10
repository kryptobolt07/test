import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Optimized font loading with next/font
const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Raindrop Replica - Next.js & Canvas',
  description: 'A recreation of the Raindrop landing page using Next.js and Canvas.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        {/* SVG Filter for the noise effect */}
        <svg style={{ display: 'none' }}>
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.25" numOctaves="1" stitchTiles="stitch" />
          </filter>
        </svg>

        {/* Global overlay effects */}
        <div className="scanline-overlay"></div>
        <div className="noise-overlay"></div>

        {children}
      </body>
    </html>
  );
}
