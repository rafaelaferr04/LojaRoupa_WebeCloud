import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../Footer.jsx'
import Header from '../Header.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import { useStore } from '../context/StoreContext.jsx'

function FavoritesPage() {
  const { clearFavorites, favoriteCount, favoriteProducts } = useStore()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="category-hero">
          <p>Favoritos</p>
          <h1>Os seus favoritos</h1>
          <span>{favoriteCount} produto(s) guardado(s).</span>
        </section>

        {favoriteProducts.length > 0 ? (
          <>
            <ProductGrid products={favoriteProducts} title="Produtos guardados" />
            <section className="utility-actions">
              <button type="button" onClick={clearFavorites}>
                Limpar favoritos
              </button>
            </section>
          </>
        ) : (
          <section className="empty-cart">
            <h2>Ainda não tem favoritos</h2>
            <Link to="/">Explorar produtos</Link>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

export default FavoritesPage
