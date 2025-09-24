'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <section className="section">
      <div className="container">
        <h1>Error inesperado</h1>
        <pre className="small" style={{whiteSpace:'pre-wrap',opacity:.8}}>{error?.message || 'Ocurrió un problema.'}</pre>
        <button className="btn" onClick={reset}>Reintentar</button>
      </div>
    </section>
  );
}
