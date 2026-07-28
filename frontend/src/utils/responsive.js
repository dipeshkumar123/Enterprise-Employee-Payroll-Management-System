/**
 * Responsive Design Utilities
 * 
 * Breakpoint reference:
 *   xs: 0px    - Mobile phones
 *   sm: 600px  - Tablets / Large phones
 *   md: 900px  - Laptops / Small desktops
 *   lg: 1200px - Desktops
 *   xl: 1536px - Large screens
 */

// Common responsive styles
export const responsive = {
  // Main content padding
  contentPadding: {
    xs: 1.5,
    sm: 2,
    md: 3,
    lg: 4,
  },

  // Card grid columns
  cardGrid: {
    xs: 12,
    sm: 6,
    md: 4,
    lg: 3,
  },

  // Two-column form layout
  formCol: {
    xs: 12,
    sm: 6,
  },

  // Full-width form layout
  formFull: {
    xs: 12,
  },

  // Sidebar width
  drawerWidth: {
    xs: '100%',
    sm: 260,
  },

  // Font sizes
  pageTitle: {
    xs: 'h5',
    sm: 'h4',
    md: 'h4',
  },

  cardTitle: {
    xs: 'body1',
    sm: 'h6',
  },

  // Table horizontal scroll container
  tableContainer: {
    '& .MuiTableContainer-root': {
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
    },
    '& .MuiTable-root': {
      minWidth: {
        xs: 650,
        sm: 750,
        md: 900,
      },
    },
  },

  // Hide on mobile
  hideOnMobile: {
    display: { xs: 'none', sm: 'table-cell' },
  },

  // Show only on mobile
  showOnMobile: {
    display: { xs: 'table-cell', sm: 'none' },
  },

  // Stack buttons vertically on mobile
  buttonStack: {
    flexDirection: { xs: 'column', sm: 'row' },
    '& .MuiButton-root': {
      width: { xs: '100%', sm: 'auto' },
    },
  },

  // Responsive image
  responsiveImg: {
    maxWidth: '100%',
    height: 'auto',
  },

  // Full-width on mobile, auto on desktop
  fullWidthMobile: {
    width: { xs: '100%', sm: 'auto' },
  },
};

/**
 * Helper to create responsive table columns
 * @param {Object} cols - Column definitions with breakpoints
 * @returns {Object} MUI sx props
 */
export const responsiveCol = (cols) => ({
  display: cols.xs !== false ? 'table-cell' : { xs: 'none', sm: 'table-cell' },
  ...(cols.hideMd && { md: { display: 'none' } }),
  ...(cols.hideLg && { lg: { display: 'none' } }),
});

/**
 * Responsive grid spacing
 */
export const gridSpacing = {
  xs: 1.5,
  sm: 2,
  md: 3,
};

/**
 * Responsive font sizes
 */
export const fontSizes = {
  xs: {
    h1: '1.5rem',
    h2: '1.3rem',
    h3: '1.15rem',
    h4: '1rem',
    h5: '0.9rem',
    h6: '0.8rem',
    body1: '0.8rem',
    body2: '0.75rem',
  },
  sm: {
    h1: '2rem',
    h2: '1.7rem',
    h3: '1.5rem',
    h4: '1.3rem',
    h5: '1.1rem',
    h6: '1rem',
    body1: '1rem',
    body2: '0.875rem',
  },
  md: {
    h1: '2.5rem',
    h2: '2rem',
    h3: '1.75rem',
    h4: '1.5rem',
    h5: '1.25rem',
    h6: '1.1rem',
  },
};

export default responsive;
