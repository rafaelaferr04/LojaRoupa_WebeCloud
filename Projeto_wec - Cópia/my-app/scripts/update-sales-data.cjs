const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'src', 'data', 'storeData.js')
const source = fs.readFileSync(filePath, 'utf8')
const productsStart = source.indexOf('const produtos = [')
const adaptationStart = source.indexOf('// Adaptacao', productsStart)
const arrayStart = source.indexOf('[', productsStart)
const arrayEnd = source.lastIndexOf('\n]', adaptationStart) + 2

if (productsStart === -1 || adaptationStart === -1 || arrayStart === -1 || arrayEnd === 1) {
  throw new Error('Nao foi possivel encontrar o array de produtos.')
}

const produtos = eval(source.slice(arrayStart, arrayEnd))

const saleSetup = {
  3: { oldPrice: 109 },
  8: { oldPrice: 79, campaign: 'Até 30%' },
  17: { oldPrice: 179, campaign: 'Até 30%' },
  31: { oldPrice: 119 },
  48: { oldPrice: 229, campaign: 'Até 50%' },
  55: { oldPrice: 149 },
  61: { oldPrice: 119, campaign: 'Até 30%' },
  82: { oldPrice: 249, campaign: 'Até 50%' },
  98: { oldPrice: 129 },
  101: { oldPrice: 89, campaign: 'Até 30%' },
  104: { oldPrice: 189, campaign: 'Até 50%' },
  107: { oldPrice: 229 },
  118: { oldPrice: 149, campaign: 'Até 30%' },
  139: { oldPrice: 109 },
  143: { oldPrice: 219, campaign: 'Até 50%' },
  146: { oldPrice: 169 },
  151: { oldPrice: 129, campaign: 'Até 30%' },
  160: { oldPrice: 249, campaign: 'Até 50%' },
  171: { oldPrice: 109 },
  182: { oldPrice: 189, campaign: 'Até 30%' },
  203: { oldPrice: 129 },
  215: { oldPrice: 219, campaign: 'Até 50%' },
  229: { oldPrice: 89, campaign: 'Até 30%' },
  241: { oldPrice: 139 },
  253: { oldPrice: 179, campaign: 'Até 50%' },
  265: { oldPrice: 119 },
  277: { oldPrice: 159, campaign: 'Até 30%' },
  289: { oldPrice: 199 },
  301: { oldPrice: 149, campaign: 'Até 50%' },
  313: { oldPrice: 119 },
  325: { oldPrice: 179, campaign: 'Até 30%' },
  337: { oldPrice: 139, campaign: 'Até 50%' },
}

const withoutOldSaleProducts = produtos.filter((produto) => produto.categoriaKey !== 'saldos')
const updatedProducts = withoutOldSaleProducts.map((produto) => {
  const sale = saleSetup[produto.id]

  if (!sale) {
    return produto
  }

  return {
    ...produto,
    precoAntigo: sale.oldPrice,
    campanha: sale.campaign,
  }
})

function formatValue(value, indent) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => `'${item}'`).join(', ')}]`
  }

  if (typeof value === 'string') {
    return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  }

  if (typeof value === 'number') {
    return String(value)
  }

  if (typeof value === 'boolean') {
    return String(value)
  }

  if (value === undefined) {
    return undefined
  }

  return JSON.stringify(value, null, indent)
}

function formatProduct(product) {
  const order = [
    'id',
    'title',
    'preco',
    'precoAntigo',
    'categoriaKey',
    'categoria',
    'grupo',
    'subcategoria',
    'tipo',
    'cor',
    'tamanhosValidos',
    'imagem',
    'descricao',
    'campanha',
    'destaque',
  ]

  const lines = ['  {']

  for (const key of order) {
    if (!(key in product)) {
      continue
    }

    const value = formatValue(product[key], 4)

    if (value !== undefined) {
      lines.push(`    ${key}: ${value},`)
    }
  }

  lines.push('  }')

  return lines.join('\n')
}

const formattedArray = `const produtos = [\n${updatedProducts.map(formatProduct).join(',\n')}\n]`
const nextSource = `${source.slice(0, productsStart)}${formattedArray}${source.slice(arrayEnd)}`

fs.writeFileSync(filePath, nextSource, 'utf8')

console.log(`Produtos removidos de saldos: ${produtos.length - withoutOldSaleProducts.length}`)
console.log(`Produtos existentes marcados com desconto: ${updatedProducts.filter((produto) => produto.precoAntigo).length}`)
console.log(`Campanha Ate 30: ${updatedProducts.filter((produto) => produto.campanha === 'Até 30%').length}`)
console.log(`Campanha Ate 50: ${updatedProducts.filter((produto) => produto.campanha === 'Até 50%').length}`)
