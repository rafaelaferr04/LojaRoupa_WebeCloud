import { useEffect } from 'react'
import Footer from '../Footer.jsx'
import Header from '../Header.jsx'

function InfoPage({ page }) {
  useEffect(() => {
    const scrollFrame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })

    return () => cancelAnimationFrame(scrollFrame)
  }, [page.path])

  return (
    <>
      <Header />
      <main className="page-shell info-page">
        <section className="info-hero">
          <p>{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <span>{page.description}</span>
        </section>

        <section className="info-content" aria-label={page.title}>
          {page.sections.map((section) => (
            <article className="info-card" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  )
}

export default InfoPage
