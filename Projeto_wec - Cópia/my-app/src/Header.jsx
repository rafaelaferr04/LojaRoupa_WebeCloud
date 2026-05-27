import './Header.css'
import CategoryNavigation from './components/header/CategoryNavigation.jsx'
import MainNav from './components/header/MainNav.jsx'
import TopBar from './components/header/TopBar.jsx'

function Header() {
  return (
    <header className="rl-header">
      <TopBar />
      <MainNav />
      <CategoryNavigation />
    </header>
  )
}

export default Header
