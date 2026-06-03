/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react'
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
          { label: 'Calças', path: '/homem/calcas' },
          { label: 'Calções', path: '/homem/calcoes' },
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
        title: 'Acessórios',
        path: '/homem/acessorios',
        links: [
          { label: 'Malas de viagem', path: '/homem/malas-de-viagem' },
          { label: 'Carteiras', path: '/homem/carteiras' },
          { label: 'Cintos', path: '/homem/cintos' },
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
          { label: 'Calças', path: '/mulher/calcas' },
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
          { label: 'Malas de mão', path: '/mulher/malas-de-mao' },
          { label: 'Carteiras', path: '/mulher/carteiras' },
          { label: 'Perfumes', path: '/mulher/perfumes' },
          { label: 'Lenços', path: '/mulher/lencos' },
        ],
      },
    ],
  },
  {
    key: 'crianca',
    label: 'Criança',
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
          { label: 'Ténis', path: '/crianca/tenis' },
          { label: 'Sabrinas', path: '/crianca/sabrinas' },
          { label: 'Botas', path: '/crianca/botas' },
        ],
      },
      {
        title: 'Acessórios',
        path: '/crianca/acessorios',
        links: [
          { label: 'Mochilas', path: '/crianca/mochilas' },
          { label: 'Bonés', path: '/crianca/bones' },
          { label: 'Mantas de bebé', path: '/crianca/mantas-de-bebe' },
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
          { label: 'Roupões', path: '/casa/roupoes' },
          { label: 'Mantas', path: '/casa/mantas' },
        ],
      },
      {
        title: 'Decoração',
        path: '/casa/decoracao',
        links: [
          { label: 'Molduras', path: '/casa/molduras' },
          { label: 'Almofadas', path: '/casa/almofadas' },
          { label: 'Objetos decorativos', path: '/casa/objetos-decorativos' },
        ],
      },
      {
        title: 'Mesa e bar',
        path: '/casa/mesa-e-bar',
        links: [
          { label: 'Serviço de mesa', path: '/casa/servico-de-mesa' },
          { label: 'Copos', path: '/casa/copos' },
          { label: 'Acessórios de bar', path: '/casa/acessorios-de-bar' },
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
          { label: 'Criança', path: '/saldos/crianca' },
          { label: 'Casa', path: '/saldos/casa' },
        ],
      },
      {
        title: 'Campanhas',
        path: '/saldos/campanhas',
        links: [
          { label: 'Até 30%', path: '/saldos/ate-30por-cento' },
          { label: 'Até 50%', path: '/saldos/ate-50por-cento' },
        ],
      },
    ],
  },
]

function CategoryNavigation() {
  const [activeKey, setActiveKey] = useState(null)
  const activeItem = navigationItems.find((item) => item.key === activeKey)

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setActiveKey(null)
    }
  }

  return (
    <nav
      className="categories-nav"
      aria-label="Categorias"
      onBlur={handleBlur}
      onMouseLeave={() => setActiveKey(null)}
    >
      <ul>
        {navigationItems.map((item) => (
          <li
            className="has-mega"
            key={item.path}
            onMouseEnter={() => setActiveKey(item.key)}
          >
            <NavLink
              to={item.path}
              onFocus={() => setActiveKey(item.key)}
              className={({ isActive }) =>
                `${isActive ? 'active ' : ''}${item.destaque ? 'destaque' : ''}`.trim()
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      {activeItem && <MegaMenu item={activeItem} isOpen onLinkClick={() => setActiveKey(null)} />}
    </nav>
  )
}

export default CategoryNavigation
