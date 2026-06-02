import { Link } from 'react-router-dom'

function MegaMenu({ item, isOpen = false, onLinkClick }) {
  return (
    <div className={`mega-menu${isOpen ? ' is-open' : ''}`}>
      <div className="mega-content">
        {item.columns.map((column) => (
          <div className="mega-column" key={column.title}>
            <h4>
              <Link to={column.path} onClick={onLinkClick}>{column.title}</Link>
            </h4>
            {column.links.map((link) => (
              <Link to={link.path} key={link.path} onClick={onLinkClick}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MegaMenu
