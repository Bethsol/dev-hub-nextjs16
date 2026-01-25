import { Inter, Lusitana } from 'next/font/google';

// Variable font - no weight needed
export const inter = Inter({ subsets: ['latin'] });

// Non-variable font - weight is REQUIRED
export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});