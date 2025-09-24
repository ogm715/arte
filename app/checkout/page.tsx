'use client';

import { useEffect, useMemo, useState } from 'react';
import { products } from '@/lib/products';

type CartMap = Record<string, number>;
type Line = { id: string; title: string; price: number; qty: number; image: string; size: string; technique: string; lineTotal: number };

const LS_KEY = 'cart';
const load = (): CartMap => { try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; } };
const save = (c: CartMap) => { localStorage.setItem(LS_KEY, JSON.stringify(c)); window.dispatchEvent(new Event('cart:updated')); };

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [map, setMap] = useState<CartMap>({});
  useEffect(() => { if (mounted) setMap(load()); }, [mounted]);
  useEffect(() => { if (mounted) save(map); }, [map, mounted]);

  const lines: Line[] = useMemo(() => {
    return Object.entries(map).map(([id, qty]) => {
      const p = products.find(x => x.id === id);
      if (!p || qty <= 0) return null;
      return { id, title: p.title, price: p.price, qty, image: p.image, size: p.size, technique: p.technique, lineTotal: p.price * qty };
    }).filter(Boolean) as Line[];
  }, [map]);

  const total = lines.reduce((s, l) => s + l.lineTotal, 0);
  const inc = (id: string) => setMap(m => ({ ...m, [id]: (m[id] || 0) + 1 }));
  const dec = (id: string) => setMap(m => { const n = Math.max(0, (m[id] || 0) - 1); const next = { ...m }; if (!n) delete next[id]; else next[id] = n; return next; });
  const remove = (id: string) => setMap(m => { const n = { ...m }; delete n[id]; return n; });
  const clear = () => setMap({});

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [phone, setPhone] = useState('');
  const [city, setCity] = useState(''); const [address, setAddress] = useState(''); const [zip, setZip] = useState('');
  const formOK = name && email && phone && city && address;

  async function pay() {
    if (!formOK || lines.length === 0) return;
    const body = { items: lines.map(l => ({ id: l.id, title: l.title, price: l.price, qty: l.qty })), buyer: { name, email, phone, address: `${address}, ${city}`, zip } };
    const res = await fetch('/api/checkout', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok || !data?.init_point) { alert(`Error creando preferencia\n${data?.detail || data?.error || 'desconocido'}`); return; }
    window.location.href = data.init_point as string;
  }

  if (!mounted) return null;

  return (
    <section className="section">
      <div className="container">
        <h1>Finalizar compra</h1>

        <h2 className="small">1) Revisa tu carrito</h2>
        {lines.length === 0 ? (
          <p className="small">Tu carrito está vacío. <a href="/">Volver al catálogo</a></p>
        ) : (
          <>
            <div className="cart-list">
              {lines.map(l => (
                <div key={l.id} className="cart-item">
                  <div className="cart-thumb"><img src={l.image} alt={l.title} /></div>
                  <div className="cart-main">
                    <div className="cart-head"><strong>{l.title}</strong><span>${l.price.toLocaleString('es-CO')} COP</span></div>
                    <div className="small">{l.size} · {l.technique}</div>
                    <div className="cart-qty">
                      <button className="btn" onClick={() => dec(l.id)}>-</button>
                      <span>{l.qty}</span>
                      <button className="btn" onClick={() => inc(l.id)}>+</button>
                      <button className="btn" onClick={() => remove(l.id)}>Eliminar</button>
                    </div>
                  </div>
                  <div className="cart-total"><div className="cart-line-total">${l.lineTotal.toLocaleString('es-CO')}</div></div>
                </div>
              ))}
            </div>

            <div className="cart-actions">
              <button className="btn" onClick={clear}>Vaciar carrito</button>
              <div className="cart-summary">
                <div className="cart-grand-total">Total: ${total.toLocaleString('es-CO')} COP</div>
                <button className="btn" onClick={() => setShowForm(true)}>Continuar</button>
              </div>
            </div>
          </>
        )}

        {showForm && lines.length > 0 && (
          <>
            <h2 className="small">2) Datos del cliente</h2>
            <div className="checkout-form">
              <input placeholder="Nombre completo" value={name} onChange={e=>setName(e.target.value)} />
              <input placeholder="Correo electrónico" value={email} onChange={e=>setEmail(e.target.value)} />
              <input placeholder="Teléfono" value={phone} onChange={e=>setPhone(e.target.value)} />
              <input placeholder="Ciudad" value={city} onChange={e=>setCity(e.target.value)} />
              <input placeholder="Dirección" value={address} onChange={e=>setAddress(e.target.value)} />
              <input placeholder="Código postal (opcional)" value={zip} onChange={e=>setZip(e.target.value)} />
              <button className="btn" onClick={pay} disabled={lines.length===0 || !formOK}>Pagar con Mercado Pago</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
