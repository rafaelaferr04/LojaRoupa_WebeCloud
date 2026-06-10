import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../Footer.jsx'
import Header from '../Header.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { buildCategoryPages, getTopWeeklyProducts } from '../data/storeData.js'

function getFeaturedLimit() {
  return window.innerWidth > 1080 ? 8 : 6
}

function HomePage() {
  const { products, withSalesData } = useStore()
  const categoryPages = buildCategoryPages(products)
  const [featuredLimit, setFeaturedLimit] = useState(() => getFeaturedLimit())

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    function handleResize() {
      setFeaturedLimit(getFeaturedLimit())
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function getSection(categoryKey, sectionTitle) {
    return categoryPages[categoryKey].sections.find((section) => section.title === sectionTitle)
  }

  const summerCollections = [
    {
      label: 'Homem',
      title: 'Mocassins de verão',
      text: 'Pele, camurça e tons leves para coordenados de dias quentes.',
      section: getSection('homem', 'Mocassins'),
    },
    {
      label: 'Mulher',
      title: 'Vestidos fluídos',
      text: 'Silhuetas frescas para férias, cidade e finais de tarde.',
      section: getSection('mulher', 'Vestidos'),
    },
    {
      label: 'Criança',
      title: 'T-shirts coloridas',
      text: 'Algodão confortável para brincar, viajar e usar todos os dias.',
      section: getSection('crianca', 'T-shirts'),
    },
  ].filter((collection) => collection.section)

  const fallbackFeaturedProducts = [
    ...(categoryPages.mulher?.sections[0]?.products ?? []).slice(0, 3),
    ...(categoryPages.homem?.sections[0]?.products ?? []).slice(3, 6),
    ...(categoryPages.casa?.sections[0]?.products ?? []).slice(0, 2),
  ]
  const featuredProducts = getTopWeeklyProducts(
    featuredLimit,
    withSalesData(products),
    fallbackFeaturedProducts,
  )

  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="home-hero">
          <div className="home-hero-content">
            <p>Nova seleção 2026</p>
            <h1>Essenciais premium para vestir e viver melhor</h1>
            <span>
              Moda para mulher, homem e criança, decoração para casa e saldos
              reunidos numa experiência simples de loja online.
            </span>
            <div className="hero-actions">
              <Link to="/mulher" aria-label="Comprar artigos de mulher">
                Comprar mulher
              </Link>
              <Link to="/homem" aria-label="Comprar artigos de homem">
                Comprar homem
              </Link>
            </div>
          </div>
        </section>

        <section className="collection-section summer-collections" aria-label="Colecoes de verao">
          <div className="section-heading">
            <p>Coleções de verão</p>
            <h2>Peças leves para a estação</h2>
          </div>
          <div className="summer-grid">
            {summerCollections.map((collection) => (
              <Link
                to={collection.section.path}
                className="summer-card"
                key={collection.section.path}
                style={{ backgroundImage: `url(${collection.section.products[0]?.image})` }}
              >
                <span>{collection.label}</span>
                <h3>{collection.title}</h3>
                <p>{collection.text}</p>
              </Link>
            ))}
          </div>
        </section>

        <ProductGrid products={featuredProducts} title="Destaques da semana" />
      </main>
      <Footer />
    </>
  )
}

export default HomePage
