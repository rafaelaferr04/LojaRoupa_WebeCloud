import { navigationItems } from '../components/header/CategoryNavigation.jsx'
import produtos from './productsData.json'

function getNavigationSubcategoryPath(categoryKey, subcategory) {
  const category = navigationItems.find((item) => item.key === categoryKey)
  const links = category?.columns.flatMap((column) => column.links) ?? []
  const link = links.find((navigationLink) => navigationLink.label === subcategory)

  return link?.path ?? `/${categoryKey}`
}

// Para marcar um produto em saldos, basta escrever aqui:
// idDoProduto: percentagemDeDesconto
const campanhasSaldos = {
  2: 30,
  8: 50,
  15: 30,
  23: 50,
  35: 30,
  48: 50,
  62: 30,
  74: 50,
  91: 30,
  108: 50,
  126: 30,
  142: 50,
}

function getInfoSaldos(produto) {
  const desconto = campanhasSaldos[produto.id]

  if (!desconto) {
    return null
  }

  return {
    precoFinal: Math.round(produto.preco * (1 - desconto / 100)),
    precoAntigo: produto.preco,
    campanha: `Até ${desconto}%`,
  }
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

function getProductsByCategory(categoryKey) {
  if (categoryKey === 'saldos') {
    return getSaleProducts()
  }

  return products.filter((product) => product.categoryKey === categoryKey)
}

function getProductsBySubcategory(categoryKey, subcategory) {
  if (categoryKey === 'saldos') {
    const saleCategory = getSaleCategoryKey(subcategory)

    if (saleCategory) {
      return getSaleProducts().filter((product) => product.categoryKey === saleCategory)
    }

    return getSaleProducts().filter((product) => product.saleCampaign === subcategory)
  }

  return products.filter(
    (product) =>
      product.categoryKey === categoryKey &&
      product.subcategory === subcategory,
  )
}

function getProductsByGroup(categoryKey, groupTitle) {
  if (categoryKey === 'saldos') {
    if (groupTitle === 'Campanhas') {
      return getSaleProducts().filter((product) => product.saleCampaign)
    }

    return getSaleProducts()
  }

  return products.filter(
    (product) =>
      product.categoryKey === categoryKey && product.subcategoryGroup === groupTitle,
  )
}

function getSaleProducts() {
  return products.filter((product) => product.oldPrice)
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

export function getProductById(productId) {
  return products.find((product) => product.id === productId)
}

export const products = produtos.map((produto) => {
  const saldos = getInfoSaldos(produto)
  const precoFinal = saldos?.precoFinal ?? produto.preco

  return {
    id: String(produto.id),
    name: produto.title,
    categoryKey: produto.categoriaKey,
    category: produto.categoria,
    subcategoryGroup: produto.grupo,
    subcategory: produto.subcategoria,
    subcategoryPath: getNavigationSubcategoryPath(produto.categoriaKey, produto.subcategoria),
    type: produto.tipo,
    color: produto.cor,
    price: `${precoFinal} EUR`,
    priceValue: precoFinal,
    oldPrice: saldos ? `${saldos.precoAntigo} EUR` : undefined,
    saleCampaign: saldos?.campanha,
    description: produto.descricao,
    materials: produto.materiais,
    sizes: produto.tamanhosValidos,
    image: produto.imagem,
    imageAlt: produto.title,
    badge: saldos ? 'Saldos' : produto.destaque,
  }
})

export const categoryPages = Object.fromEntries(
  navigationItems.map((category) => [
    category.key,
    {
      ...pageInfo[category.key],
      products: getProductsByCategory(category.key),
      sections: category.columns.flatMap((group) =>
        group.links.map((subcategory) => ({
          title: subcategory.label,
          path: subcategory.path,
          products: getProductsBySubcategory(category.key, subcategory.label),
        })),
      ),
    },
  ]),
)

export const subcategoryPages = navigationItems.flatMap((category) =>
  category.columns.flatMap((group) =>
    group.links.map((subcategory) => ({
      path: subcategory.path,
      page: {
        title: subcategory.label,
        eyebrow: `${category.label} / ${group.title}`,
        description: `Selecao de ${subcategory.label.toLowerCase()} em ${category.label.toLowerCase()}.`,
        products: getProductsBySubcategory(category.key, subcategory.label),
      },
    })),
  ),
)

export const groupPages = navigationItems.flatMap((category) =>
  category.columns.map((group) => ({
    path: group.path,
    page: {
      title: group.title,
      eyebrow: category.label,
      description: `Todos os produtos de ${group.title.toLowerCase()} em ${category.label.toLowerCase()}.`,
      products: getProductsByGroup(category.key, group.title),
    },
  })),
)
