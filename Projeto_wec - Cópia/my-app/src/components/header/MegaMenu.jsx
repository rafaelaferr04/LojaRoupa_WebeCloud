import { Link } from 'react-router-dom'

function MegaMenu({ item }) {
  return (
    <div className="mega-menu">
      <div className="mega-content">
        {item.columns.map((column) => (
          <div className="mega-column" key={column.title}>
            <h4>
              <Link to={column.path}>{column.title}</Link>
            </h4>
            {column.links.map((link) => (
              <Link to={link.path} key={link.path}>
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
