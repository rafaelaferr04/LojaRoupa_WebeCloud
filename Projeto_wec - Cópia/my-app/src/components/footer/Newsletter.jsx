import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../context/StoreContext.jsx'

function Newsletter() {
  const navigate = useNavigate()
  const { currentUser, subscribeNewsletter } = useStore()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const newsletterEmail = currentUser?.email ?? email

  useEffect(() => {
    if (!status) {
      return undefined
    }

    const timer = setTimeout(() => {
      setStatus('')
      setIsHidden(true)
    }, 3600)

    return () => clearTimeout(timer)
  }, [status])

  if (isHidden || currentUser?.newsletterSubscribed) {
    return null
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!currentUser) {
      navigate('/conta', {
        state: {
          error: 'Para subscrever a newsletter, inicie sessão na sua conta.',
        },
      })
      return
    }

    setStatus('')
    setIsSubmitting(true)

    const result = await subscribeNewsletter()

    if (result.ok) {
      setEmail('')
      setStatus(
        result.emailSent
          ? 'Subscrição registada. Enviámos a confirmação para o seu email.'
          : 'Subscrição registada. O email será enviado quando o serviço estiver configurado.',
      )
    } else {
      setStatus(result.error)
    }

    setIsSubmitting(false)
  }

  return (
    <section className="footer-newsletter" aria-labelledby="newsletter-title">
      <h3 id="newsletter-title">Seja o primeiro a saber</h3>
      <p>Receba novidades, lançamentos, campanhas e sugestões escolhidas pela loja.</p>
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Endereço de email"
          value={newsletterEmail}
          onChange={(event) => setEmail(event.target.value)}
          readOnly={Boolean(currentUser)}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'A enviar' : 'Inscrever'}
        </button>
      </form>
      {status && <p className="newsletter-status">{status}</p>}
    </section>
  )
}

export default Newsletter
