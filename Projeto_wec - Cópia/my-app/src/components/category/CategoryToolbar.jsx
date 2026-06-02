function CategoryToolbar({
  productCount,
  sortOrder,
  onOpenFilters,
  onSortChange,
}) {
  return (
    <section className="filter-bar" aria-label="Filtros de produtos">
      <div className="filter-controls">
        <button className="filter-toggle" onClick={onOpenFilters} type="button">
          Filtros
        </button>
      </div>

      <div className="product-list-meta">
        <label className="sort-label">
          Ordenar por
          <select
            value={sortOrder}
            onChange={(event) => onSortChange(event.target.value)}
          >
            <option value="recommended">Recomendados</option>
            <option value="price-desc">Preço descendente</option>
            <option value="price-asc">Preço ascendente</option>
            <option value="name-asc">Ordem alfabética A-Z</option>
          </select>
        </label>
        <p>{productCount} produto(s)</p>
      </div>
    </section>
  )
}

export default CategoryToolbar
