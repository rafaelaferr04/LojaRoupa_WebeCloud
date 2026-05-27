import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import CategoryPage from './components/category/CategoryPage.jsx'
import { footerPages } from './components/footer/FooterColumns.jsx'
import { StoreProvider } from './context/StoreContext.jsx'
import {
  categoryPages,
  groupPages,
  subcategoryPages,
} from './data/storeData.js'
import { navigationItems } from './components/header/CategoryNavigation.jsx'
import AccountPage from './Pages/AccountPage.jsx'
import CartPage from './Pages/CartPage.jsx'
import CheckoutPage from './Pages/CheckoutPage.jsx'
import FavoritesPage from './Pages/FavoritesPage.jsx'
import HomePage from './Pages/HomePage.jsx'
import InfoPage from './Pages/InfoPage.jsx'
import ProductPage from './Pages/ProductPage.jsx'
import SearchPage from './Pages/SearchPage.jsx'

function App() {
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
        element={<CategoryPage page={categoryPages[item.key]} />}
      />
    ))
  }

  function renderProductListRoutes(routes) {
    return routes.map(({ path, page }) => (
      <Route key={path} path={path} element={<CategoryPage page={page} />} />
    ))
  }

  return (
    <StoreProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
