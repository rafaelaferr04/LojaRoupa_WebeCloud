import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext.jsx'

function MainNav() {
  const { cartCount, favoriteCount } = useStore()

  return (
    <nav className="main-nav" aria-label="Navegacao principal">
      <div className="nav-left" />

      <div className="nav-center">
        <Link to="/" className="logo">
          ATELIER WEC
        </Link>
      </div>

      <div className="nav-right" aria-label="Acoes da loja">
        <Link to="/pesquisar" className="nav-icon" aria-label="Pesquisar">
          <ion-icon name="search-outline"></ion-icon>
        </Link>
        <Link to="/conta" className="nav-icon" aria-label="Conta">
          <ion-icon name="person-outline"></ion-icon>
        </Link>
        <Link to="/favoritos" className="nav-icon" aria-label="Favoritos">
          <ion-icon name="heart-outline"></ion-icon>
          <span>({favoriteCount})</span>
        </Link>
        <Link to="/carrinho" className="nav-icon" aria-label="Carrinho">
          <ion-icon name="bag-outline"></ion-icon>
          <span>({cartCount})</span>
        </Link>
      </div>
    </nav>
  )
}

export default MainNav
