import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../Footer.jsx'
import Header from '../Header.jsx'
import { useStore } from '../context/StoreContext.jsx'

function CartPage() {
  const { cart, cartCount, clearCart, removeFromCart, updateCartQuantity } = useStore()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  function decrement(itemKey, currentQuantity) {
    if (currentQuantity <= 1) {
      removeFromCart(itemKey)
      return
    }

    updateCartQuantity(itemKey, currentQuantity - 1)
  }

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      ((item.priceValue ??
        Number(String(item.price).replace(/[^\d.,]/g, '').replace(',', '.'))) ||
        0) *
        item.quantity,
    0,
  )
  const formattedSubtotal = `${subtotal.toFixed(2).replace('.', ',')} EUR`

  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="category-hero">
          <p>Carrinho</p>
          <h1>O seu carrinho</h1>
          <span>{cartCount} artigo(s) selecionado(s).</span>
        </section>

        <section className="cart-page">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <h2>O carrinho esta vazio</h2>
              <Link to="/">Continuar a comprar</Link>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <article className="cart-item" key={item.itemKey}>
                    <img src={item.image} alt={item.imageAlt} loading="lazy" />

                    <div className="cart-item-info">
                      <h2>{item.name}</h2>
                      <p>Tamanho: {item.size}</p>
                    </div>

                    <div className="quantity-control">
                      <button
                        type="button"
                        onClick={() => decrement(item.itemKey, item.quantity)}
                        aria-label="Diminuir quantidade"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.itemKey, item.quantity + 1)}
                        aria-label="Aumentar quantidade"
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-price">
                      <span>{item.price}</span>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeFromCart(item.itemKey)}
                      >
                        Remover
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="cart-summary">
                <h2>Resumo</h2>
                <p>
                  Subtotal <span>{formattedSubtotal}</span>
                </p>
                <p>
                  Entrega <span>{subtotal >= 150 ? 'Gratis' : 'Calculada no checkout'}</span>
                </p>
                <Link to="/checkout" className="checkout-link">Finalizar compra</Link>
                <button type="button" className="secondary-button" onClick={clearCart}>
                  Limpar carrinho
                </button>
              </aside>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}

export default CartPage
