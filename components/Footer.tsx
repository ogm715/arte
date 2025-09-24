export default function Footer() {
  return (
    <footer style={{ background: "#111", color: "#ddd", padding: "2rem 1rem", marginTop: "3rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2rem" }}>
        <div>
          <h3 style={{ marginBottom: "0.8rem", color: "#fff" }}>Disiento</h3>
          <p style={{ maxWidth: "300px", fontSize: "0.9rem" }}>
            Arte pensado para impactar. Cada obra busca transmitir fuerza visual y dejar huella en tus espacios.
          </p>
        </div>
        <div>
          <h4 style={{ marginBottom: "0.6rem", color: "#fff" }}>Enlaces</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: "1.8" }}>
            <li><a href="/politicas" style={{ color: "#ddd", textDecoration: "none" }}>Política de Privacidad</a></li>
            <li><a href="/terminos" style={{ color: "#ddd", textDecoration: "none" }}>Términos y Condiciones</a></li>
            <li><a href="/encargos" style={{ color: "#ddd", textDecoration: "none" }}>Retratos Personalizados</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: "0.6rem", color: "#fff" }}>Contacto</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: "1.8" }}>
            <li><a href="mailto:ogminver@gmail.com" style={{ color: "#ddd", textDecoration: "none" }}>ogminver@gmail.com</a></li>
            <li><a href="https://www.facebook.com/share/1GUJme8r7X/" target="_blank" rel="noopener noreferrer" style={{ color: "#ddd", textDecoration: "none" }}>Facebook</a></li>
          </ul>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.8rem", borderTop: "1px solid #333", paddingTop: "1rem" }}>
        © {new Date().getFullYear()} Disiento. Todos los derechos reservados.
      </div>
    </footer>
  );
}
