'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type CartMap = Record<string, number>;
const LS_KEY = 'cart';

export default function NavBar() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const refresh = () => {
      try {
        const cart = JSON.parse(localStorage.getItem(LS_KEY) || '{}') as CartMap;
        setCount(Object.values(cart).reduce((s, n) => s + (n || 0), 0));
      } catch { setCount(0); }
    };
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('cart:updated', refresh as any);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('cart:updated', refresh as any);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="brand">
          <img className="brand-logo" src="/logo.png" alt="Disiento" />
        </Link>
        <nav className="nav-links">
          <Link href="/encargos">Retratos personalizados</Link>
          <Link href="/#catalogo">Catálogo</Link>
          <Link href="/checkout" style={{ position:'relative', display:'inline-block' }}>
            Carrito
            {count > 0 && (
              <span style={{
                position:'absolute', top:-6, right:-18, background:'#e63946', color:'#fff',
                borderRadius:999, fontSize:'.72rem', lineHeight:1, padding:'3px 6px',
                minWidth:18, textAlign:'center', fontWeight:700
              }}>{count}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
