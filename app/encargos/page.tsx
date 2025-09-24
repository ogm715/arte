export default function Encargos() {
  return (
    <section className="section">
      <div className="container">
        <h1>Retratos personalizados</h1>
        <div className="encargos-card">
          <figure className="encargos-figure">
            <img src="/encargo.jpg" alt="Ejemplo de retrato personalizado" />
          </figure>
          <div className="encargos-text">
            <p>
              Convierte tu foto favorita en una obra única. Envíanos tu imagen por WhatsApp al <strong>3161342246</strong>,
              elige el tamaño y la técnica que prefieras. Para iniciar el proceso abonas el 50% y al finalizar pagas el resto.
              Cada cuadro se realiza con detalle para que hable por sí mismo.
            </p>
            <a className="btn" href="https://wa.me/573161342246" target="_blank" rel="noopener noreferrer">
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
