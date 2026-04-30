import React from 'react';

const Pagination = ({ 
  pagination, 
  currentPage, 
  onPageChange, 
  loading = false,
  itemsCount = 0,
  showResultsInfo = true 
}) => {
  // Don't render if loading, no items, or only one page
  if (loading || itemsCount === 0 || !pagination || pagination.totalPages <= 1) {
    return null;
  }

  const { totalPages, total, limit, currentPage: paginationCurrentPage } = pagination;
  const page = currentPage || paginationCurrentPage;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      onPageChange(newPage);
    }
  };

  // Calculate showing range
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="border-t border-gray-200 px-4 py-4 sm:px-6 bg-white rounded-b-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Showing results info */}
        {showResultsInfo && (
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{total}</span> results
          </div>
        )}

        {/* Pagination buttons */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          {/* Previous button */}
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={`
              relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg
              transition-all duration-200
              ${page === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300 shadow-sm'
              }
            `}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          {/* Page numbers - Desktop */}
          <div className="hidden sm:flex items-center gap-1">
            {pageNumbers[0] > 1 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className="w-9 h-9 flex items-center justify-center text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  1
                </button>
                {pageNumbers[0] > 2 && <span className="text-gray-500 px-1">...</span>}
              </>
            )}
            
            {pageNumbers.map(pageNum => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`
                  w-9 h-9 flex items-center justify-center text-sm font-medium rounded-lg
                  transition-all duration-200
                  ${pageNum === page
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {pageNum}
              </button>
            ))}
            
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                  <span className="text-gray-500 px-1">...</span>
                )}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="w-9 h-9 flex items-center justify-center text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          {/* Mobile: simple page indicator */}
          <div className="sm:hidden text-sm text-gray-700">
            Page {page} of {totalPages}
          </div>

          {/* Next button */}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className={`
              relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg
              transition-all duration-200
              ${page === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300 shadow-sm'
              }
            `}
          >
            Next
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;