import { Link } from 'react-router-dom'

function scrollToPageTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function FooterBottom() {
  function handleFooterLinkClick() {
    requestAnimationFrame(() => scrollToPageTop())
  }

  return (
    <div className="footer-bottom">
      <p>(c) 2026 Atelier WEC. Todos os direitos reservados.</p>
      <div className="legal-links">
        <Link to="/privacidade" onClick={handleFooterLinkClick}>Privacidade</Link>
        <Link to="/termos" onClick={handleFooterLinkClick}>Termos</Link>
        <Link to="/cookies" onClick={handleFooterLinkClick}>Cookies</Link>
      </div>
    </div>
  )
}

export default FooterBottom
