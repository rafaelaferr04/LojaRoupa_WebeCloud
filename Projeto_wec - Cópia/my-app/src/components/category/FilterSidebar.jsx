import { useState } from 'react'
import { priceRanges } from './categoryFilters.jsx'

function toggleFilter(value, selectedValues, setSelectedValues) {
  if (selectedValues.includes(value)) {
    setSelectedValues(selectedValues.filter((selectedValue) => selectedValue !== value))
    return
  }

  setSelectedValues([...selectedValues, value])
}

function FilterSidebar({
  isOpen,
  onClose,
  colors,
  selectedColors,
  setSelectedColors,
  selectedPriceRanges,
  setSelectedPriceRanges,
}) {
  const [expandedCategories, setExpandedCategories] = useState({
    colors: true,
    prices: true,
  })

  function toggleCategory(category) {
    setExpandedCategories((currentCategories) => ({
      ...currentCategories,
      [category]: !currentCategories[category],
    }))
  }

  function handleClearFilters() {
    setSelectedColors([])
    setSelectedPriceRanges([])
  }

  return (
    <>
      {isOpen && <div className="filter-overlay" onClick={onClose} />}
      <aside className={`filter-sidebar ${isOpen ? 'is-open' : ''}`}>
        <div className="filter-sidebar-header">
          <h2>Filtros</h2>
          <button
            className="filter-close-btn"
            onClick={onClose}
            type="button"
            aria-label="Fechar filtros"
          >
            X
          </button>
        </div>

        <div className="filter-sidebar-content">
          <div className="filter-category">
            <button
              className="filter-category-header"
              onClick={() => toggleCategory('colors')}
              type="button"
            >
              <span>Cor</span>
              <span className={`filter-toggle-icon ${expandedCategories.colors ? 'is-expanded' : ''}`}>
                v
              </span>
            </button>
            {expandedCategories.colors && (
              <div className="filter-category-options">
                {colors.map((color) => (
                  <label className="filter-checkbox-option" key={color}>
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={() => toggleFilter(color, selectedColors, setSelectedColors)}
                    />
                    <span>{color}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="filter-category">
            <button
              className="filter-category-header"
              onClick={() => toggleCategory('prices')}
              type="button"
            >
              <span>Preco</span>
              <span className={`filter-toggle-icon ${expandedCategories.prices ? 'is-expanded' : ''}`}>
                v
              </span>
            </button>
            {expandedCategories.prices && (
              <div className="filter-category-options">
                {priceRanges.map((priceRange) => (
                  <label className="filter-checkbox-option" key={priceRange.value}>
                    <input
                      type="checkbox"
                      checked={selectedPriceRanges.includes(priceRange.value)}
                      onChange={() =>
                        toggleFilter(
                          priceRange.value,
                          selectedPriceRanges,
                          setSelectedPriceRanges,
                        )
                      }
                    />
                    <span>{priceRange.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="filter-sidebar-footer">
          <button className="filter-clear-btn" onClick={handleClearFilters} type="button">
            Remover filtros
          </button>
        </div>
      </aside>
    </>
  )
}

export default FilterSidebar
