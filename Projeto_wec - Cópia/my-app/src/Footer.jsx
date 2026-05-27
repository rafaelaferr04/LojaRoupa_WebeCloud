import './Footer.css'
import FooterBottom from './components/footer/FooterBottom.jsx'
import { FooterColumns } from './components/footer/FooterColumns.jsx'
import Newsletter from './components/footer/Newsletter.jsx'

function Footer() {
  return (
    <footer className="rl-footer" id="footer">
      <Newsletter />
      <hr className="footer-divider" />
      <FooterColumns />
      <FooterBottom />
    </footer>
  )
}

export default Footer
