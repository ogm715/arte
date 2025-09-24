'use client';

import { useEffect, useMemo, useState } from 'react';
import { products } from '@/lib/products';

type CartMap = Record<string, number>;
const load = (): CartMap => { try { return JSON.parse(localStorage.getItem('cart')||'{}'); } catch { return {}; } };
const save = (c: CartMap) => localStorage.setItem('cart', JSON.stringify(c));

export default function CartPage() {
  const [, setTick] = useState(0);
  const force = () => setTick(t => t + 1);
  useEffect(() => { force(); }, []);

  const entries = useMemo(() => {
    const c = load();
    return Object.keys(c).map(id => {
      const p = products.find(x => x.id === id);
      if (!p) return null;
      const qty = c[id] || 0;
      return { p, qty, lineTotal: p.price * qty };
    }).filter(Boolean) as { p: typeof products[number]; qty: number; lineTotal: number }[];
  }, [setTick]);

  const total = entries.reduce((s, e) => s + e.lineTotal, 0);

  const inc = (id: string) => { const c = load(); c[id]=(c[id]||0)+1; save(c); force(); };
  const dec = (id: string) => { const c = load(); c[id]=Math.max(0,(c[id]||0)-1); if(!c[id]) delete c[id]; save(c); force(); };
  const remove = (id: string) => { const c = load(); delete c[id]; save(c); force(); };
  const clear = () => { save({}); force(); };

  return (
    <section className="section">
      <div className="container">
        <h1>Carrito</h1>

        {entries.length === 0 ? (
          <p style={{opacity:.85}}>Tu carrito está vacío. <a href="/">Volver al catálogo</a></p>
        ) : (
          <>
            <div style={{display:'grid',gap:12}}>
              {entries.map(({ p, qty, lineTotal }) => (
                <div key={p.id} style={{display:'grid',gridTemplateColumns:'80px 1fr auto',gap:12,alignItems:'center',border:'1px solid rgba(0,0,0,.12)',padding:10,background:'#141416'}}>
                  <img src={p.image} alt={p.title} style={{width:80,height:80,objectFit:'cover',background:'#222'}} />
                  <div>
                    <div style={{display:'flex',justifyContent:'space-between',gap:8,flexWrap:'wrap'}}>
                      <strong>{p.title}</strong>
                      <span>${p.price.toLocaleString('es-CO')} COP</span>
                    </div>
                    <div className="small" style={{opacity:.85}}>{p.size} · {p.technique}</div>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginTop:8}}>
                      <button className="btn" onClick={() => dec(p.id)}>-</button>
                      <span>{qty}</span>
                      <button className="btn" onClick={() => inc(p.id)}>+</button>
                      <button className="btn" onClick={() => remove(p.id)} style={{marginLeft:12,background:'#444'}}>Eliminar</button>
                    </div>
                  </div>
                  <div style={{textAlign:'right',minWidth:110}}>
                    <div style={{fontWeight:700}}>${lineTotal.toLocaleString('es-CO')}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:16,flexWrap:'wrap',gap:12}}>
              <button className="btn" onClick={clear} style={{background:'#444'}}>Vaciar carrito</button>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{fontWeight:700}}>Total: ${total.toLocaleString('es-CO')} COP</div>
                <a className="btn" href="/">Seguir comprando</a>
                <a className="btn" href="/checkout">Finalizar compra</a>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
