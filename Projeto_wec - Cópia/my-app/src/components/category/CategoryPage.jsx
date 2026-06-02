import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Footer from '../../Footer.jsx'
import Header from '../../Header.jsx'
import {
  filterProducts,
  getProductColors,
  sortProducts,
} from './categoryFilters.jsx'
import ProductGrid from '../ProductGrid.jsx'
import CategoryToolbar from './CategoryToolbar.jsx'
import FilterSidebar from './FilterSidebar.jsx'

function scrollToProductsStart() {
  document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function CategoryPage({ page }) {
  const location = useLocation()
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([])
  const [sortOrder, setSortOrder] = useState('recommended')
  const [showFilters, setShowFilters] = useState(false)

  const colors = useMemo(() => getProductColors(page.products), [page.products])
  const hasSpecialScroll = location.state?.scrollToProducts || typeof location.state?.restoreScrollY === 'number'

  useEffect(() => {
    if (!hasSpecialScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location.pathname, hasSpecialScroll])

  const visibleProducts = useMemo(() => {
    const filteredProducts = filterProducts(
      page.products,
      selectedColors,
      selectedPriceRanges,
    )

    return sortProducts(filteredProducts, sortOrder)
  }, [page.products, selectedColors, selectedPriceRanges, sortOrder])

  useEffect(() => {
    if (typeof location.state?.restoreScrollY === 'number') {
      requestAnimationFrame(() => {
        window.scrollTo({ top: location.state.restoreScrollY, behavior: 'smooth' })
      })
      return
    }

    if (location.state?.scrollToProducts) {
      requestAnimationFrame(() => scrollToProductsStart())
      return
    }
  }, [location.state])

  return (
    <>
      <Header />
      <main className="page-shell category-page-shell">
        <section className="category-hero">
          <p>{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <span>{page.description}</span>
        </section>

        <CategoryToolbar
          productCount={visibleProducts.length}
          sortOrder={sortOrder}
          onOpenFilters={() => setShowFilters(true)}
          onSortChange={setSortOrder}
        />

        <FilterSidebar
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          colors={colors}
          selectedColors={selectedColors}
          setSelectedColors={setSelectedColors}
          selectedPriceRanges={selectedPriceRanges}
          setSelectedPriceRanges={setSelectedPriceRanges}
        />

        <ProductGrid products={visibleProducts} title={`Todos os produtos de ${page.title}`} />
      </main>
      <Footer />
    </>
  )
}

export default CategoryPage
