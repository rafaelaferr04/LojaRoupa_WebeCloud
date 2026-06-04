import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Footer from '../Footer.jsx'
import Header from '../Header.jsx'
import { useStore } from '../context/StoreContext.jsx'

const returnWindowDays = 30

function isReturnEligible(orderDate) {
  const orderTime = new Date(orderDate).getTime()

  if (Number.isNaN(orderTime)) {
    return false
  }

  const elapsedDays = (Date.now() - orderTime) / (1000 * 60 * 60 * 24)

  return elapsedDays <= returnWindowDays
}

function formatOrderDate(date) {
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

function AccountPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, login, logout, orders, register, requestReturn } = useStore()
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(location.state?.error ?? '')
  const [returnMessage, setReturnMessage] = useState('')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (isRegister) {
      if (password.length < 6) {
        setError('A palavra-passe deve ter pelo menos 6 caracteres.')
        return
      }

      if (password !== confirmPassword) {
        setError('As palavras-passe não coincidem.')
        return
      }

      const result = await register({ name, email, password })

      if (!result.ok) {
        setError(result.error)
      }

      return
    }

    const result = await login(email, password)

    if (!result.ok) {
      setError(result.error)
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  async function handleReturnRequest(orderId, itemKey) {
    const result = await requestReturn({ orderId, itemKey })

    if (result.ok) {
      setReturnMessage(`Pedido de devolução registado. Enviámos as instruções para ${currentUser.email}.`)
    }
  }

  if (currentUser) {
    const returnProducts = orders
      .filter((order) => isReturnEligible(order.createdAt))
      .flatMap((order) =>
        order.items.map((item) => ({
          ...item,
          orderId: order.id,
          orderDate: order.createdAt,
        })),
      )

    return (
      <>
        <Header />
        <main className="page-shell">
          <section className="category-hero">
            <p>A minha conta</p>
            <h1>Olá, {currentUser.name}</h1>
            <span>Bem-vindo de volta ao Atelier WEC.</span>
          </section>
          <section className="account-page">
            <div className="account-card">
              <h2>Dados pessoais</h2>
              <div className="account-field-row">
                <span className="account-field-label">Nome</span>
                <span className="account-field-value">{currentUser.name}</span>
              </div>
              <div className="account-field-row">
                <span className="account-field-label">Email</span>
                <span className="account-field-value">{currentUser.email}</span>
              </div>
              <button type="button" className="account-logout-btn" onClick={handleLogout}>
                Terminar sessão
              </button>
            </div>
            <div className="account-card">
              <h2>A sua atividade</h2>
              <p>{currentUser.cart.length} artigo(s) no carrinho.</p>
              <p>{currentUser.favorites.length} produto(s) nos favoritos.</p>
              <p>{orders.length} compra(s) guardada(s).</p>
            </div>
          </section>

          <section className="account-history">
            <details className="account-card account-history-card">
              <summary className="account-section-heading">
                <h2>Compras Passadas</h2>
                <span>{orders.length} encomenda(s)</span>
              </summary>

              {orders.length === 0 ? (
                <p>Ainda não existem compras associadas a esta conta.</p>
              ) : (
                <div className="account-orders">
                  {orders.map((order) => (
                    <article className="account-order" key={order.id}>
                      <div className="account-order-header">
                        <span>{order.id}</span>
                        <span>{formatOrderDate(order.createdAt)}</span>
                      </div>
                      <div className="account-products-strip" aria-label={`Produtos da encomenda ${order.id}`}>
                        {order.items.map((item) => (
                          <div className="account-purchased-product" key={`${order.id}-${item.itemKey}`}>
                            <img src={item.image} alt={item.imageAlt ?? item.name} loading="lazy" />
                            <strong>{item.name}</strong>
                            <span>Tamanho: {item.size}</span>
                            <span>Qtd: {item.quantity}</span>
                            <em>{item.price}</em>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </details>

            <details className="account-card account-history-card">
              <summary className="account-section-heading">
                <h2>Devoluções</h2>
                <span>{returnProducts.length} artigo(s)</span>
              </summary>

              {returnMessage && (
                <div className="return-message">
                  <p>{returnMessage}</p>
                  <button
                    type="button"
                    onClick={() => setReturnMessage('')}
                    aria-label="Fechar mensagem de devolução"
                  >
                    X
                  </button>
                </div>
              )}

              {returnProducts.length === 0 ? (
                <p>Não existem produtos comprados há menos de 30 dias disponíveis para devolução.</p>
              ) : (
                <div className="account-products-strip account-products-strip--returns" aria-label="Produtos disponíveis para devolução">
                  {returnProducts.map((item) => (
                    <div className="account-purchased-product" key={`${item.orderId}-${item.itemKey}`}>
                      <img src={item.image} alt={item.imageAlt ?? item.name} loading="lazy" />
                      <strong>{item.name}</strong>
                      <span>{formatOrderDate(item.orderDate)}</span>
                      <span>Tamanho: {item.size}</span>
                      <em>{item.price}</em>
                      {item.returnRequestedAt ? (
                        <small>Instruções enviadas</small>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleReturnRequest(item.orderId, item.itemKey)}
                        >
                          Devolver
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </details>
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
          <p>Conta</p>
          <h1>A sua conta</h1>
          <span>Inicie sessão ou crie uma conta para guardar carrinho e favoritos.</span>
        </section>
        <section className="account-page">
          <div className="account-card account-auth">
            <div className="auth-tabs">
              <button
                type="button"
                className={!isRegister ? 'auth-tab is-active' : 'auth-tab'}
                onClick={() => {
                  setIsRegister(false)
                  setError('')
                }}
              >
                Entrar
              </button>
              <button
                type="button"
                className={isRegister ? 'auth-tab is-active' : 'auth-tab'}
                onClick={() => {
                  setIsRegister(true)
                  setError('')
                }}
              >
                Registar
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <h2>{isRegister ? 'Criar a sua conta' : 'Entrar na conta'}</h2>
              <p className="auth-intro">
                {isRegister
                  ? 'Guarde favoritos, carrinho e preferências numa conta pessoal.'
                  : 'Aceda aos seus favoritos e continue as compras onde ficou.'}
              </p>

              {isRegister && (
                <label>
                  Nome
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="O seu nome"
                    required
                  />
                </label>
              )}

              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="email@exemplo.com"
                  required
                />
              </label>

              <label>
                Palavra-passe
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="A sua palavra-passe"
                  required
                />
              </label>

              {isRegister && (
                <label>
                  Confirmar palavra-passe
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repita a palavra-passe"
                    required
                  />
                </label>
              )}

              {error && <p className="auth-error">{error}</p>}

              <button type="submit" className="auth-submit auth-submit--login">
                {isRegister ? 'Registar' : 'Entrar'}
              </button>
            </form>
          </div>

          <div className="account-card account-benefits-card">
            <h2>Benefícios da conta</h2>
            <ul className="account-benefits">
              <li>Carrinho guardado por conta</li>
              <li>Favoritos guardados por conta</li>
              <li>Acesso rápido em futuras visitas</li>
            </ul>
            <p className="account-note">
              Os seus dados ficam associados ao email usado no registo desta loja.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default AccountPage
