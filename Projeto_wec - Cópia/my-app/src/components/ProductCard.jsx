import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

function saveProductReturnPosition(path) {
  sessionStorage.setItem(
    'productReturnPosition',
    JSON.stringify({ path, scrollY: window.scrollY }),
  )
}

function ProductCard({ product, index }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useStore()
  const favorite = isFavorite(product.id)

  function handleProductClick() {
    saveProductReturnPosition(`${location.pathname}${location.search}`)
  }

  function handleFavoriteClick() {
    const result = toggleFavorite(product.id)

    if (result?.ok === false) {
      navigate('/conta', { state: { error: result.error } })
    }
  }

  return (
    <article className="product-card">
      <Link
        to={`/produto/${product.id}`}
        className="product-card-link"
        onClick={handleProductClick}
      >
        <div className={`product-media product-media-${(index % 6) + 1}`}>
          {product.image && (
            <img
              src={product.image}
              alt={product.imageAlt ?? product.name}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          )}
          {product.badge && <span className="product-badge">{product.badge}</span>}
        </div>
        <div className="product-info">
          <p className="product-category">{product.category}</p>
          <h3>{product.name}</h3>
          <p className="product-color">Cor: {product.color}</p>
          <p className="product-price">
            {product.oldPrice && <span>{product.oldPrice}</span>}
            {product.price}
          </p>
        </div>
      </Link>
      <button
        className="favorite-button"
        type="button"
        onClick={handleFavoriteClick}
        aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <ion-icon name={favorite ? 'heart' : 'heart-outline'}></ion-icon>
      </button>
    </article>
  )
}

export default ProductCard
