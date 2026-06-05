import { Link } from 'react-router-dom'

function FooterBottom() {
  return (
    <div className="footer-bottom">
      <p>(c) 2026 Atelier WEC. Todos os direitos reservados.</p>
      <div className="legal-links">
        <Link to="/privacidade">Privacidade</Link>
        <Link to="/termos">Termos</Link>
        <Link to="/cookies">Cookies</Link>
      </div>
    </div>
  )
}

export default FooterBottom
