'use client';

import { useMemo, useState } from 'react';
import { products, Product, Category } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const [filter, setFilter] = useState<Category | 'all'>('all');

  const list = useMemo(() => (
    products.filter(p => (filter === 'all' ? true : p.category === filter))
  ), [filter]);

  return (
    <main className="wall">
      <section className="section">
        <div className="container">
          <h1>Arte es el quinto elemento</h1>
          <p className="lead">
            Aquí cada cuadro está pensado para impactar, no para pasar desapercibido. Lo que ofrecemos no es simple decoración:
            son piezas creadas para llenar espacios con fuerza visual y dejar una marca que se nota desde el primer vistazo.
          </p>

          <div className="filterBar">
            <button className={`chip ${filter==='all'?'chipActive':''}`} onClick={()=>setFilter('all')}>Todo</button>
            <button className={`chip ${filter==='carboncillo'?'chipActive':''}`} onClick={()=>setFilter('carboncillo')}>Carboncillo</button>
            <button className={`chip ${filter==='oleo-pastel'?'chipActive':''}`} onClick={()=>setFilter('oleo-pastel')}>Óleo pastel</button>
          </div>

          <div id="catalogo" className="center">
            <div className="grid">
              {list.map((p: Product) => (
                <div className="cardWrap" key={p.id}>
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
