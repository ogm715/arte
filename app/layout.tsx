import './globals.css';
import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.disiento.com'),
  title: {
    default: 'Disiento | Tienda de Arte',
    template: '%s | Disiento',
  },
  description: 'Cuadros originales en carboncillo y óleo pastel. Retratos personalizados.',
  keywords: ['arte','cuadros','carboncillo','óleo pastel','retratos','disiento'],
  openGraph: {
    type: 'website',
    url: 'https://www.disiento.com',
    title: 'Disiento | Tienda de Arte',
    description: 'Cuadros y retratos personalizados con fuerza visual.',
    siteName: 'Disiento',
    images: [{ url: '/logo.png', width: 800, height: 418, alt: 'Disiento Arte' }],
    locale: 'es_CO'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Disiento | Tienda de Arte',
    description: 'Cuadros y retratos personalizados con fuerza visual.',
    images: ['/logo.png']
  },
  alternates: { canonical: 'https://www.disiento.com' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
