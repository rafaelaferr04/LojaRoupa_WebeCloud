import { useMemo } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import CategoryPage from './components/category/CategoryPage.jsx'
import { footerPages } from './components/footer/FooterColumns.jsx'
import { StoreProvider } from './context/StoreContext.jsx'
import { buildCategoryPages, buildSubcategoryPages, buildGroupPages } from './data/storeData.js'
import { navigationItems } from './components/header/CategoryNavigation.jsx'
import { useStore } from './context/StoreContext.jsx'
import AccountPage from './Pages/AccountPage.jsx'
import CartPage from './Pages/CartPage.jsx'
import CheckoutPage from './Pages/CheckoutPage.jsx'
import FavoritesPage from './Pages/FavoritesPage.jsx'
import HomePage from './Pages/HomePage.jsx'
import InfoPage from './Pages/InfoPage.jsx'
import ProductPage from './Pages/ProductPage.jsx'
import SearchPage from './Pages/SearchPage.jsx'

const DEFAULT_PAGE = { title: '', eyebrow: '', description: '', products: [], sections: [] }

function AppRoutes() {
  const { products } = useStore()

  const categoryPages = useMemo(() => buildCategoryPages(products), [products])
  const subcategoryPages = useMemo(() => buildSubcategoryPages(products), [products])
  const groupPages = useMemo(() => buildGroupPages(products), [products])

  function renderFooterRoutes() {
    return footerPages.map((page) => (
      <Route key={page.path} path={page.path} element={<InfoPage page={page} />} />
    ))
  }

  function renderCategoryRoutes() {
    return navigationItems.map((item) => (
      <Route
        key={item.path}
        path={item.path}
        element={<CategoryPage page={categoryPages[item.key] ?? DEFAULT_PAGE} />}
      />
    ))
  }

  function renderProductListRoutes(routes) {
    return routes.map(({ path, page }) => (
      <Route key={path} path={path} element={<CategoryPage page={page} />} />
    ))
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/produto/:productId" element={<ProductPage />} />
      <Route path="/carrinho" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/conta" element={<AccountPage />} />
      <Route path="/favoritos" element={<FavoritesPage />} />
      <Route path="/pesquisar" element={<SearchPage />} />
      {renderFooterRoutes()}
      {renderCategoryRoutes()}
      {renderProductListRoutes(subcategoryPages)}
      {renderProductListRoutes(groupPages)}
      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
