/* eslint-disable react-refresh/only-export-components */
import { NavLink } from 'react-router-dom'
import MegaMenu from './MegaMenu.jsx'

export const navigationItems = [
  {
    key: 'homem',
    label: 'Homem',
    path: '/homem',
    columns: [
      {
        title: 'Pronto a vestir',
        path: '/homem/pronto-a-vestir',
        links: [
          { label: 'Casacos', path: '/homem/casacos' },
          { label: 'Camisas', path: '/homem/camisas' },
          { label: 'T-shirts', path: '/homem/t-shirts' },
          { label: 'Sweatshirts e hoodies', path: '/homem/sweatshirts-e-hoodies' },
          { label: 'Polos', path: '/homem/polos' },
          { label: 'Calcas', path: '/homem/calcas' },
          { label: 'Calcoes', path: '/homem/calcoes' },
        ],
      },
      {
        title: 'Sapatos',
        path: '/homem/sapatos',
        links: [
          { label: 'Sapatos de cidade', path: '/homem/sapatos-de-cidade' },
          { label: 'Mocassins', path: '/homem/mocassins' },
          { label: 'Sapatilhas', path: '/homem/sapatilhas' },
          { label: 'Botas', path: '/homem/botas' },
        ],
      },
      {
        title: 'Acessorios',
        path: '/homem/acessorios',
        links: [
          { label: 'Malas de viagem', path: '/homem/malas-de-viagem' },
          { label: 'Carteiras', path: '/homem/carteiras' },
          { label: 'Cintos', path: '/homem/cintos' },
          { label: 'Relogios', path: '/homem/relogios' },
          { label: 'Oculos de sol', path: '/homem/oculos-de-sol' },
        ],
      },
    ],
  },
  {
    key: 'mulher',
    label: 'Mulher',
    path: '/mulher',
    columns: [
      {
        title: 'Pronto a vestir',
        path: '/mulher/pronto-a-vestir',
        links: [
          { label: 'Casacos', path: '/mulher/casacos' },
          { label: 'Camisas', path: '/mulher/camisas' },
          { label: 'Vestidos', path: '/mulher/vestidos' },
          { label: 'Saias', path: '/mulher/saias' },
          { label: 'Calcas', path: '/mulher/calcas' },
          { label: 'T-shirts', path: '/mulher/t-shirts' },
        ],
      },
      {
        title: 'Sapatos',
        path: '/mulher/sapatos',
        links: [
          { label: 'Sapatos de salto', path: '/mulher/sapatos-de-salto' },
          { label: 'Mocassins', path: '/mulher/mocassins' },
          { label: 'Sapatilhas', path: '/mulher/sapatilhas' },
          { label: 'Botas', path: '/mulher/botas' },
        ],
      },
      {
        title: 'Malas e beleza',
        path: '/mulher/malas-e-beleza',
        links: [
          { label: 'Malas de mao', path: '/mulher/malas-de-mao' },
          { label: 'Carteiras', path: '/mulher/carteiras' },
          { label: 'Joias', path: '/mulher/joias' },
          { label: 'Perfumes', path: '/mulher/perfumes' },
          { label: 'Lencos', path: '/mulher/lencos' },
        ],
      },
    ],
  },
  {
    key: 'crianca',
    label: 'Crianca',
    path: '/crianca',
    columns: [
      {
        title: 'Roupa',
        path: '/crianca/roupa',
        links: [
          { label: 'Casacos', path: '/crianca/casacos' },
          { label: 'T-shirts', path: '/crianca/t-shirts' },
          { label: 'Sweatshirts', path: '/crianca/sweatshirts' },
          { label: 'Vestidos', path: '/crianca/vestidos' },
          { label: 'Pijamas', path: '/crianca/pijamas' },
        ],
      },
      {
        title: 'Sapatos',
        path: '/crianca/sapatos',
        links: [
          { label: 'Tenis', path: '/crianca/tenis' },
          { label: 'Sabrinas', path: '/crianca/sabrinas' },
          { label: 'Botas', path: '/crianca/botas' },
          { label: 'Galochas', path: '/crianca/galochas' },
        ],
      },
      {
        title: 'Acessorios',
        path: '/crianca/acessorios',
        links: [
          { label: 'Mochilas', path: '/crianca/mochilas' },
          { label: 'Bones', path: '/crianca/bones' },
          { label: 'Brinquedos', path: '/crianca/brinquedos' },
          { label: 'Mantas de bebe', path: '/crianca/mantas-de-bebe' },
        ],
      },
    ],
  },
  {
    key: 'casa',
    label: 'Casa',
    path: '/casa',
    columns: [
      {
        title: 'Quarto e banho',
        path: '/casa/quarto-e-banho',
        links: [
          { label: 'Roupa de cama', path: '/casa/roupa-de-cama' },
          { label: 'Toalhas', path: '/casa/toalhas' },
          { label: 'Roupoes', path: '/casa/roupoes' },
          { label: 'Mantas', path: '/casa/mantas' },
        ],
      },
      {
        title: 'Decoracao',
        path: '/casa/decoracao',
        links: [
          { label: 'Velas', path: '/casa/velas' },
          { label: 'Molduras', path: '/casa/molduras' },
          { label: 'Almofadas', path: '/casa/almofadas' },
          { label: 'Objetos decorativos', path: '/casa/objetos-decorativos' },
        ],
      },
      {
        title: 'Mesa e bar',
        path: '/casa/mesa-e-bar',
        links: [
          { label: 'Servico de mesa', path: '/casa/servico-de-mesa' },
          { label: 'Copos', path: '/casa/copos' },
          { label: 'Acessorios de bar', path: '/casa/acessorios-de-bar' },
        ],
      },
    ],
  },
  {
    key: 'saldos',
    label: 'Saldos',
    path: '/saldos',
    destaque: true,
    columns: [
      {
        title: 'Saldos',
        path: '/saldos/saldos',
        links: [
          { label: 'Mulher', path: '/saldos/mulher' },
          { label: 'Homem', path: '/saldos/homem' },
          { label: 'Crianca', path: '/saldos/crianca' },
          { label: 'Casa', path: '/saldos/casa' },
        ],
      },
      {
        title: 'Campanhas',
        path: '/saldos/campanhas',
        links: [
          { label: 'Ultimas unidades', path: '/saldos/ultimas-unidades' },
          { label: 'Ate 30%', path: '/saldos/ate-30por-cento' },
          { label: 'Ate 50%', path: '/saldos/ate-50por-cento' },
          { label: 'Escolhas premium', path: '/saldos/escolhas-premium' },
        ],
      },
    ],
  },
]

function CategoryNavigation() {
  return (
    <nav className="categories-nav" aria-label="Categorias">
      <ul>
        {navigationItems.map((item) => (
          <li className="has-mega" key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `${isActive ? 'active ' : ''}${item.destaque ? 'destaque' : ''}`.trim()
              }
            >
              {item.label}
            </NavLink>
            <MegaMenu item={item} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default CategoryNavigation
