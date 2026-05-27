import { useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductCard from './ProductCard.jsx'
import Pagination from './Pagination.jsx'

function scrollToProductsStart() {
  document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const productsPerPage = 32

function getPageItems(items, currentPage, itemsPerPage) {
  const startIndex = (currentPage - 1) * itemsPerPage

  return items.slice(startIndex, startIndex + itemsPerPage)
}

function ProductGrid({ products, title = 'Comprar por destaque', path }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const shouldScrollToProducts = useRef(false)
  const pageParam = Number(searchParams.get('page'))
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1
  const totalPages = Math.max(1, Math.ceil(products.length / productsPerPage))
  const pageToShow = Math.min(currentPage, totalPages)

  const visibleProducts = useMemo(() => {
    return getPageItems(products, pageToShow, productsPerPage)
  }, [pageToShow, products])

  function goToPage(page) {
    const nextPage = Math.min(Math.max(page, 1), totalPages)

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)

      if (nextPage === 1) {
        next.delete('page')
      } else {
        next.set('page', String(nextPage))
      }

      return next
    })

    shouldScrollToProducts.current = true
  }

  useEffect(() => {
    if (!shouldScrollToProducts.current) {
      return
    }

    shouldScrollToProducts.current = false
    scrollToProductsStart()
  }, [pageToShow])

  return (
    <section className="product-section" id="produtos" aria-label="Produtos">
      <div className="section-heading">
        <p>Produtos selecionados</p>
        <div className="section-title-row">
          <h2>{title}</h2>
          {path && <Link to={path}>Ver subcategoria</Link>}
        </div>
      </div>
      <div className="product-grid">
        {visibleProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      <Pagination
        currentPage={pageToShow}
        totalPages={totalPages}
        onPreviousPage={() => goToPage(pageToShow - 1)}
        onNextPage={() => goToPage(pageToShow + 1)}
      />
    </section>
  )
}

export default ProductGrid
