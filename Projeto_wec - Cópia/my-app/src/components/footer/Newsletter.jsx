function Newsletter() {
  return (
    <section className="footer-newsletter" aria-labelledby="newsletter-title">
      <h3 id="newsletter-title">Seja o primeiro a saber</h3>
      <p>Receba novidades, lancamentos, campanhas e sugestoes escolhidas pela loja.</p>
      <form className="newsletter-form">
        <input type="email" placeholder="Endereco de email" required />
        <button type="submit">Inscrever</button>
      </form>
    </section>
  )
}

export default Newsletter
