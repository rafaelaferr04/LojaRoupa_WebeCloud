export function getProductColors(productsToRead) {
  return [...new Set(productsToRead.map((product) => product.color).filter(Boolean))]
}

export const priceRanges = [
  { label: 'Ate 50 EUR', value: 'ate-50' },
  { label: '50 EUR a 100 EUR', value: '50-100' },
  { label: '100 EUR a 150 EUR', value: '100-150' },
  { label: 'Mais de 150 EUR', value: '150-mais' },
]

function matchesPriceRange(productPrice, selectedRange) {
  return (
    (selectedRange === 'ate-50' && productPrice <= 50) ||
    (selectedRange === '50-100' && productPrice > 50 && productPrice <= 100) ||
    (selectedRange === '100-150' && productPrice > 100 && productPrice <= 150) ||
    (selectedRange === '150-mais' && productPrice > 150)
  )
}

export function filterProducts(productsToFilter, selectedColors, selectedPriceRanges) {
  return productsToFilter.filter((product) => {
    const price = product.priceValue
    const matchesColor =
      selectedColors.length === 0 || selectedColors.includes(product.color)
    const matchesPrice =
      selectedPriceRanges.length === 0 ||
      selectedPriceRanges.some((priceRange) => matchesPriceRange(price, priceRange))

    return matchesColor && matchesPrice
  })
}

export function sortProducts(productsToSort, sortOrder) {
  const sortedProducts = [...productsToSort]

  if (sortOrder === 'recommended') {
    return sortedProducts.sort(
      (firstProduct, secondProduct) =>
        (secondProduct.totalSales ?? 0) - (firstProduct.totalSales ?? 0) ||
        Number(firstProduct.id) - Number(secondProduct.id),
    )
  }

  if (sortOrder === 'price-desc') {
    return sortedProducts.sort(
      (firstProduct, secondProduct) =>
        secondProduct.priceValue - firstProduct.priceValue,
    )
  }

  if (sortOrder === 'price-asc') {
    return sortedProducts.sort(
      (firstProduct, secondProduct) =>
        firstProduct.priceValue - secondProduct.priceValue,
    )
  }

  if (sortOrder === 'name-asc') {
    return sortedProducts.sort((firstProduct, secondProduct) =>
      firstProduct.name.localeCompare(secondProduct.name),
    )
  }

  return sortedProducts
}
