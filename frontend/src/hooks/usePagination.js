import { useState, useCallback, useMemo, useEffect } from 'react';

/**
 * Custom hook for paginated data management.
 * Provides state and handlers for pagination, sorting, searching, and filtering.
 * 
 * @param {Object} options
 * @param {number} options.initialPage - Starting page (default: 0)
 * @param {number} options.initialRowsPerPage - Rows per page (default: 10)
 * @param {string} options.initialSortBy - Field to sort by (default: 'id')
 * @param {string} options.initialSortOrder - Sort direction (default: 'asc')
 * @param {Function} options.onFetch - Function to fetch data (receives params)
 * @param {number} options.debounceMs - Search debounce in ms (default: 300)
 * @returns {Object} Pagination state and handlers
 */
export function usePagination({
  initialPage = 0,
  initialRowsPerPage = 10,
  initialSortBy = 'id',
  initialSortOrder = 'asc',
  deps = [],
} = {}) {
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  const [filters, setFilters] = useState({});

  // Reset to first page when search, filters, sort, or rowsPerPage change
  useEffect(() => {
    setPage(0);
  }, [search, filters, sortBy, sortOrder, rowsPerPage, ...deps]);

  const queryParams = useMemo(() => ({
    page: page + 1,
    limit: rowsPerPage,
    search,
    sortBy,
    sortOrder,
    ...filters,
  }), [page, rowsPerPage, search, sortBy, sortOrder, filters]);

  const handlePageChange = useCallback((_, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
  }, []);

  const handleSortChange = useCallback((column, order) => {
    setSortBy(column);
    setSortOrder(order);
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === '' || value === null || value === undefined
        ? undefined
        : value,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSearch('');
  }, []);

  const resetPagination = useCallback(() => {
    setPage(0);
    setRowsPerPage(initialRowsPerPage);
    setSearch('');
    setSortBy(initialSortBy);
    setSortOrder(initialSortOrder);
    setFilters({});
  }, [initialRowsPerPage, initialSortBy, initialSortOrder]);

  return {
    // State
    page,
    rowsPerPage,
    search,
    sortBy,
    sortOrder,
    filters,
    queryParams,

    // Setters
    setPage,
    setRowsPerPage,
    setSearch,
    setSortBy,
    setSortOrder,
    setFilters,

    // Handlers
    handlePageChange,
    handleRowsPerPageChange,
    handleSearchChange,
    handleSortChange,
    handleFilterChange,
    handleClearFilters,
    resetPagination,
  };
}

export default usePagination;
