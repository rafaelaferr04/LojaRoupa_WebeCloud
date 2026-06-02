import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Footer from '../Footer.jsx'
import Header from '../Header.jsx'
import { useStore } from '../context/StoreContext.jsx'

function AccountPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, login, logout, register } = useStore()
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(location.state?.error ?? '')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  function handleSubmit(event) {
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

      const result = register({ name, email, password })

      if (!result.ok) {
        setError(result.error)
      }

      return
    }

    const result = login(email, password)

    if (!result.ok) {
      setError(result.error)
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  if (currentUser) {
    return (
      <>
        <Header />
        <main className="page-shell">
          <section className="category-hero">
            <p>A minha conta</p>
            <h1>Ola, {currentUser.name}</h1>
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
                Terminar sessao
              </button>
            </div>
            <div className="account-card">
              <h2>A sua atividade</h2>
              <p>{currentUser.cart.length} artigo(s) no carrinho.</p>
              <p>{currentUser.favorites.length} produto(s) nos favoritos.</p>
            </div>
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
                  ? 'Guarde favoritos, carrinho e preferencias numa conta pessoal.'
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
