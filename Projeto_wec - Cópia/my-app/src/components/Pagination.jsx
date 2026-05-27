function Pagination({ currentPage, totalPages, onPreviousPage, onNextPage }) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <nav className="pagination" aria-label="Paginacao de produtos">
      <button
        className="page-button"
        type="button"
        disabled={currentPage === 1}
        onClick={onPreviousPage}
      >
        {'<'}
      </button>
      <span className="page-indicator">
        Pagina {currentPage} de {totalPages}
      </span>
      <button
        className="page-button"
        type="button"
        disabled={currentPage === totalPages}
        onClick={onNextPage}
      >
        {'>'}
      </button>
    </nav>
  )
}

export default Pagination
