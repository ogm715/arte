'use client';
import { Product } from '@/lib/products';

const LS_KEY = 'cart';
const addToCart = (id: string) => {
  try {
    const raw = localStorage.getItem(LS_KEY) || '{}';
    const cart = JSON.parse(raw) as Record<string, number>;
    cart[id] = (cart[id] || 0) + 1;
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart:updated'));
  } catch {}
};

export default function ProductCard({ p }: { p: Product }) {
  return (
    <div className="gallery-item">
      <div className="frame">
        <div className="paspartu">
          <div className="art"><img src={p.image} alt={p.title} /></div>
        </div>
      </div>
      <div className="plaque">
        <div className="plaque-title">{p.title}</div>
        <div className="plaque-meta">{p.size} · {p.technique}</div>
        <div className="plaque-bottom">
          <span className="price">${p.price.toLocaleString('es-CO')} COP</span>
          <button className="btn" onClick={() => addToCart(p.id)}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
