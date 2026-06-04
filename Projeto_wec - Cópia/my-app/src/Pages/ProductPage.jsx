import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Footer from '../Footer.jsx'
import Header from '../Header.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { getProductById } from '../data/storeData.js'

const productReturnsText = 'No caso de encomenda sem registo, pode solicitar a devolução clicando em A Minha Conta, na secção Devoluções. A devolução ao domicílio tem um custo de 3,95€ que será deduzido do valor reembolsado. Dispõe de 30 dias para realizar a sua devolução a partir da data em que efetuou a sua compra. Informamos que os artigos personalizados não podem ser devolvidos ou trocados.'

function getProductReturnPosition() {
  const savedPosition = sessionStorage.getItem('productReturnPosition')
  sessionStorage.removeItem('productReturnPosition')

  if (!savedPosition) {
    return null
  }

  try {
    return JSON.parse(savedPosition)
  } catch {
    return null
  }
}

function ProductPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { addToCart, isFavorite, toggleFavorite } = useStore()
  const product = getProductById(productId)
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? '')
  const materialsTitle = product?.subcategory === 'Perfumes' ? 'Ingredientes' : 'Materiais'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [productId])

  if (!product) {
    return (
      <>
        <Header />
        <main className="page-shell">
          <section className="category-hero">
            <p>Produto</p>
            <h1>Produto não encontrado</h1>
            <span>Volte a uma categoria e escolha outro produto.</span>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  function handleAddToCart() {
    addToCart(product, selectedSize)
    navigate('/carrinho')
  }

  async function handleFavoriteClick() {
    const result = await toggleFavorite(product.id)

    if (result?.ok === false) {
      navigate('/conta', { state: { error: result.error } })
    }
  }

  function handleCloseProduct() {
    const returnPosition = getProductReturnPosition()
    const fallbackPath = product.subcategoryPath

    navigate(returnPosition?.path ?? fallbackPath, {
      replace: true,
      state: returnPosition
        ? { restoreScrollY: returnPosition.scrollY }
        : { scrollToProducts: true },
    })
  }

  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="product-detail">
          <button
            className="product-close-button"
            type="button"
            aria-label="Fechar produto"
            onClick={handleCloseProduct}
          >
            X
          </button>

          <div className="product-detail-media">
            <img
              src={product.image}
              alt={product.imageAlt}
            />
          </div>

          <div className="product-detail-info">
            <Link to={product.subcategoryPath} className="back-link">
              Voltar a {product.subcategory}
            </Link>
            <p className="product-category">
              {product.category} / {product.subcategory}
            </p>
            <h1>{product.name}</h1>
            <p className="product-detail-description">{product.description}</p>
            <p className="product-detail-price">
              {product.oldPrice && <span>{product.oldPrice}</span>}
              {product.price}
            </p>

            <div className="product-detail-accordions">
              <details>
                <summary>{materialsTitle}</summary>
                <p>{product.materials}</p>
              </details>
              <details>
                <summary>Devoluções</summary>
                <p>{productReturnsText}</p>
              </details>
            </div>

            <fieldset className="size-picker">
              <legend>Tamanho</legend>
              <div>
                {product.sizes.map((size) => (
                  <label key={size}>
                    <input
                      type="radio"
                      name="size"
                      value={size}
                      checked={selectedSize === size}
                      onChange={(event) => setSelectedSize(event.target.value)}
                    />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button className="add-cart-button" type="button" onClick={handleAddToCart}>
              Adicionar ao carrinho
            </button>
            <button
              className="secondary-action-button"
              type="button"
              onClick={handleFavoriteClick}
            >
              {isFavorite(product.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default ProductPage
