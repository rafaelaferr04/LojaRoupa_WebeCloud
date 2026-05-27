import { useEffect, useMemo, useState } from 'react'
import Footer from '../Footer.jsx'
import Header from '../Header.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import { products } from '../data/storeData.js'

function searchProducts(productsToSearch, query) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return productsToSearch
  }

  return productsToSearch.filter((product) =>
    [
      product.name,
      product.category,
      product.subcategory,
      product.subcategoryGroup,
      product.description,
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  )
}

function SearchPage() {
  const [query, setQuery] = useState('')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const filteredProducts = useMemo(() => {
    return searchProducts(products, query)
  }, [query])

  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="category-hero">
          <p>Pesquisar</p>
          <h1>Pesquisar produtos</h1>
          <span>Procure por nome, categoria, subcategoria ou descricao.</span>
        </section>

        <section className="search-page">
          <label>
            Pesquisa
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex: botas, vestido, casa, saldos..."
            />
          </label>
          <p>{filteredProducts.length} resultado(s)</p>
        </section>

        <ProductGrid products={filteredProducts} title="Resultados" />
      </main>
      <Footer />
    </>
  )
}

export default SearchPage
