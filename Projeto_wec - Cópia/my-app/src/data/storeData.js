import { navigationItems } from '../components/header/CategoryNavigation.jsx'

function getNavigationSubcategoryPath(categoryKey, subcategory) {
  const category = navigationItems.find((item) => item.key === categoryKey)
  const links = category?.columns.flatMap((column) => column.links) ?? []
  const link = links.find((navigationLink) => navigationLink.label === subcategory)

  return link?.path ?? `/${categoryKey}`
}

const pageInfo = {
  homem: {
    title: 'Homem',
    eyebrow: 'Coleção premium',
    description: 'Peças masculinas com cortes refinados, tecidos confortáveis e acabamento cuidado.',
  },
  mulher: {
    title: 'Mulher',
    eyebrow: 'Nova coleção 2026',
    description: 'Vestuário, malas, sapatos e acessórios para coordenados elegantes e modernos.',
  },
  crianca: {
    title: 'Criança',
    eyebrow: 'Conforto diário',
    description: 'Roupa resistente, suave e fácil de combinar para escola, festas e família.',
  },
  casa: {
    title: 'Casa',
    eyebrow: 'Detalhes para viver melhor',
    description: 'Têxtil, decoração e mesa com materiais agradáveis para todos os espaços.',
  },
  saldos: {
    title: 'Saldos',
    eyebrow: 'Últimas oportunidades',
    description: 'Seleção de peças com preço especial, disponível enquanto houver stock.',
  },
}

function getSaleCategoryKey(subcategory) {
  const saleCategories = {
    Mulher: 'mulher',
    Homem: 'homem',
    Criança: 'crianca',
    Casa: 'casa',
  }

  return saleCategories[subcategory]
}

function getProductsByCategory(products, categoryKey) {
  if (categoryKey === 'saldos') return products.filter((p) => p.oldPrice)
  return products.filter((p) => p.categoryKey === categoryKey)
}

function getProductsBySubcategory(products, categoryKey, subcategory) {
  if (categoryKey === 'saldos') {
    const saleCategory = getSaleCategoryKey(subcategory)
    if (saleCategory) return products.filter((p) => p.oldPrice && p.categoryKey === saleCategory)
    return products.filter((p) => p.oldPrice && p.saleCampaign === subcategory)
  }

  return products.filter(
    (p) => p.categoryKey === categoryKey && p.subcategory === subcategory,
  )
}

function getProductsByGroup(products, categoryKey, groupTitle) {
  if (categoryKey === 'saldos') {
    if (groupTitle === 'Campanhas') return products.filter((p) => p.oldPrice && p.saleCampaign)
    return products.filter((p) => p.oldPrice)
  }

  return products.filter(
    (p) => p.categoryKey === categoryKey && p.subcategoryGroup === groupTitle,
  )
}

export function normalizeApiProduct(product) {
  return {
    ...product,
    id: String(product.id),
    subcategoryPath: product.subcategoryPath || getNavigationSubcategoryPath(product.categoryKey, product.subcategory),
  }
}

export function getProductById(products, productId) {
  return products.find((p) => String(p.id) === String(productId))
}

export function getTopWeeklyProducts(limit, productsToRank = [], fallbackProducts = []) {
  const weeklyProducts = productsToRank
    .filter((product) => product.weeklySales > 0)
    .sort(
      (firstProduct, secondProduct) =>
        (secondProduct.weeklySales ?? 0) - (firstProduct.weeklySales ?? 0) ||
        (secondProduct.totalSales ?? 0) - (firstProduct.totalSales ?? 0),
    )

  if (weeklyProducts.length >= limit) {
    return weeklyProducts.slice(0, limit)
  }

  const selectedIds = new Set(weeklyProducts.map((product) => product.id))
  const fallback = fallbackProducts.filter((product) => !selectedIds.has(product.id))

  return [...weeklyProducts, ...fallback].slice(0, limit)
}

export function buildCategoryPages(products) {
  return Object.fromEntries(
    navigationItems.map((category) => [
      category.key,
      {
        ...pageInfo[category.key],
        products: getProductsByCategory(products, category.key),
        sections: category.columns.flatMap((group) =>
          group.links.map((subcategory) => ({
            title: subcategory.label,
            path: subcategory.path,
            products: getProductsBySubcategory(products, category.key, subcategory.label),
          })),
        ),
      },
    ]),
  )
}

export function buildSubcategoryPages(products) {
  return navigationItems.flatMap((category) =>
    category.columns.flatMap((group) =>
      group.links.map((subcategory) => ({
        path: subcategory.path,
        page: {
          title: subcategory.label,
          eyebrow: `${category.label} / ${group.title}`,
          description: `Selecao de ${subcategory.label.toLowerCase()} em ${category.label.toLowerCase()}.`,
          products: getProductsBySubcategory(products, category.key, subcategory.label),
        },
      })),
    ),
  )
}

export function buildGroupPages(products) {
  return navigationItems.flatMap((category) =>
    category.columns.map((group) => ({
      path: group.path,
      page: {
        title: group.title,
        eyebrow: category.label,
        description: `Todos os produtos de ${group.title.toLowerCase()} em ${category.label.toLowerCase()}.`,
        products: getProductsByGroup(products, category.key, group.title),
      },
    })),
  )
}
