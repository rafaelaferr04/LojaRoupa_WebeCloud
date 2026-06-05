import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../Footer.jsx'
import Header from '../Header.jsx'
import { useStore } from '../context/StoreContext.jsx'

function CheckoutPage() {
  const { cart, cartCount, clearCart, currentUser, placeOrder } = useStore()
  const [orderFinished, setOrderFinished] = useState(false)
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        ((item.priceValue ??
          Number(String(item.price).replace(/[^\d.,]/g, '').replace(',', '.'))) ||
          0) *
          item.quantity,
      0,
    )
  }, [cart])

  const deliveryPrice = subtotal >= 150 || subtotal === 0 ? 0 : 4.95
  const total = subtotal + deliveryPrice
  const formattedSubtotal = `${subtotal.toFixed(2).replace('.', ',')} EUR`
  const formattedDelivery = `${deliveryPrice.toFixed(2).replace('.', ',')} EUR`
  const formattedTotal = `${total.toFixed(2).replace('.', ',')} EUR`

  async function handleSubmit(event) {
    event.preventDefault()

    if (currentUser) {
      const savedOrder = await placeOrder({ items: cart, total })
      setConfirmationEmailSent(Boolean(savedOrder?.emailSent))
    } else {
      clearCart()
      setConfirmationEmailSent(false)
    }

    setOrderFinished(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (orderFinished) {
    return (
      <>
        <Header />
        <main className="page-shell">
          <section className="category-hero">
            <p>Compra finalizada</p>
            <h1>Obrigado pela sua encomenda</h1>
            <span>
              {confirmationEmailSent
                ? 'Enviámos a confirmação e os detalhes da encomenda para o seu email.'
                : 'A encomenda foi registada, mas não foi possível enviar o email de confirmação.'}
            </span>
          </section>
          <section className="empty-cart checkout-confirmation">
            <h2>Encomenda recebida</h2>
            <p>A equipa vai preparar os artigos e confirmar o envio nos próximos dias uteis.</p>
            <Link to="/">Continuar a comprar</Link>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="category-hero">
          <p>Checkout</p>
          <h1>Finalizar compra</h1>
          <span>Confirme os seus dados, entrega e pagamento antes de concluir a encomenda.</span>
        </section>

        {cart.length === 0 ? (
          <section className="empty-cart">
            <h2>O carrinho está vazio</h2>
            <Link to="/">Continuar a comprar</Link>
          </section>
        ) : (
          <section className="checkout-page">
            <form id="checkout-form" className="checkout-form" onSubmit={handleSubmit}>
              <div className="checkout-panel">
                <h2>Dados de contacto</h2>
                <label>
                  Nome completo
                  <input type="text" required placeholder="O seu nome" />
                </label>
                <label>
                  Email
                  <input type="email" required placeholder="email@exemplo.com" />
                </label>
                <label>
                  Telefone
                  <input type="tel" required placeholder="912 345 678" />
                </label>
              </div>

              <div className="checkout-panel">
                <h2>Entrega</h2>
                <label>
                  Morada
                  <input type="text" required placeholder="Rua e numero" />
                </label>
                <label>
                  Código postal
                  <input type="text" required placeholder="0000-000" />
                </label>
                <label>
                  Localidade
                  <input type="text" required placeholder="Cidade" />
                </label>
              </div>

              <div className="checkout-panel">
                <h2>Pagamento</h2>
                <label>
                  Método
                  <select required defaultValue="cartao">
                    <option value="cartao">Cartão bancário</option>
                    <option value="mbway">MB Way</option>
                    <option value="referencia">Referência Multibanco</option>
                  </select>
                </label>
              </div>
            </form>

            <aside className="cart-summary checkout-summary">
              <h2>Resumo</h2>
              <p>
                Artigos <span>{cartCount}</span>
              </p>
              {cart.map((item) => (
                <p key={item.itemKey}>
                  {item.name} x {item.quantity} <span>{item.price}</span>
                </p>
              ))}
              <p>
                Subtotal <span>{formattedSubtotal}</span>
              </p>
              <p>
                Entrega <span>{deliveryPrice === 0 ? 'Gratis' : formattedDelivery}</span>
              </p>
              <p>
                Total <span>{formattedTotal}</span>
              </p>
              <button type="submit" form="checkout-form" className="checkout-submit">
                Confirmar encomenda
              </button>
            </aside>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

export default CheckoutPage
