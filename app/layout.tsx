import { Outfit } from 'next/font/google';
import Providers from './providers';
import './globals.css';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants';

const outfit = Outfit({ subsets: ['latin'], weight: ['400', '500', '600'] });

export const metadata = {
  title: `${APP_NAME} - Premium Phones & Laptops`,
  description: APP_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased bg-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
