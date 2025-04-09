import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2,
  Paper,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Slider,
  Divider,
  Chip,
  Button,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Book as BookIcon,
  Album as CDIcon,
  Radio as LPIcon,
  MovieCreation as DVDIcon,
  Clear as ClearIcon,
  SortByAlpha as SortIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductGrid from '../../components/product/ProductGrid';
import { mockApiService } from '../../mock/mockApi';
import { Product, ProductCategory } from '../../types';

const ProductPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);

  // Filter states
  const [filters, setFilters] = useState({
    category: queryParams.get('category') || '',
    search: queryParams.get('search') || '',
    priceRange: [0, 2000000], // VND
    sortBy: 'popularity', // popularity, priceAsc, priceDesc, newest
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await mockApiService.getProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    if (products.length > 0) {
      let result = [...products];

      // Category filter
      if (filters.category) {
        result = result.filter(
          (product) => product.category === filters.category
        );
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(
          (product) =>
            product.title.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower)
        );
      }

      // Price range filter
      result = result.filter(
        (product) =>
          product.price >= filters.priceRange[0] &&
          product.price <= filters.priceRange[1]
      );

      // Sorting
      switch (filters.sortBy) {
        case 'priceAsc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'priceDesc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          result.sort(
            (a, b) =>
              new Date(b.warehouseEntryDate).getTime() -
              new Date(a.warehouseEntryDate).getTime()
          );
          break;
        default:
          // By default: popularity or any other case
          // Keeping original order or could implement popularity logic
          break;
      }

      setFilteredProducts(result);
      setCurrentPage(1); // Reset to first page when filters change
    }
  }, [filters, products]);

  // Get current page products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Handle page change
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter changes
  const handleFilterChange = (
    name: string,
    value: string | number | [number, number]
  ) => {
    setFilters({
      ...filters,
      [name]: value,
    });

    // Update URL query params for certain filters
    if (name === 'category' || name === 'search') {
      const params = new URLSearchParams(location.search);

      if (value) {
        params.set(name, value.toString());
      } else {
        params.delete(name);
      }

      navigate({
        pathname: location.pathname,
        search: params.toString(),
      });
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      category: '',
      search: '',
      priceRange: [0, 2000000],
      sortBy: 'popularity',
    });
    navigate('/products');
  };

  // Add to cart handler
  const handleAddToCart = (product: Product) => {
    // This would be implemented with a cart context or similar
    console.log('Added to cart:', product);
  };

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          p: 5,
          textAlign: 'center',
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <WavesIcon
          sx={{
            fontSize: 60,
            color: 'primary.light',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(0.95)',
                opacity: 0.7,
              },
              '70%': {
                transform: 'scale(1.1)',
                opacity: 1,
              },
              '100%': {
                transform: 'scale(0.95)',
                opacity: 0.7,
              },
            },
          }}
        />
        <Typography variant="h5" color="text.secondary">
          Diving for products...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        py: 5,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(2, 136, 209, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(100, 255, 218, 0.05) 0%, transparent 50%)',
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Page header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              backgroundImage: 'linear-gradient(45deg, #64ffda, #0288d1)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 5px 25px rgba(100, 255, 218, 0.2)',
            }}
          >
            Explore Our Collection
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto' }}
          >
            Discover our vast selection of high-quality media products. Use the
            filters to find exactly what you're looking for.
          </Typography>
        </Box>

        <Grid2 container spacing={4}>
          {/* Filters sidebar */}
          <Grid2 size={{ xs: 12, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mb: { xs: 3, md: 0 },
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                borderRadius: 2,
                border: '1px solid rgba(100, 255, 218, 0.1)',
                position: 'sticky',
                top: 90,
                maxHeight: 'calc(100vh - 120px)',
                overflowY: 'auto',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <FilterListIcon fontSize="small" />
                  Filters
                </Typography>
                <Button
                  size="small"
                  onClick={handleClearFilters}
                  startIcon={<ClearIcon />}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.light',
                    },
                  }}
                >
                  Clear All
                </Button>
              </Box>

              <Divider
                sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }}
              />

              {/* Search filter */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Search products"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'primary.light' }} />
                      </InputAdornment>
                    ),
                    endAdornment: filters.search ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => handleFilterChange('search', '')}
                          sx={{ color: 'text.secondary' }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(1, 22, 39, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(1, 22, 39, 0.5)',
                      },
                      '& fieldset': {
                        borderColor: 'rgba(100, 255, 218, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(100, 255, 218, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(100, 255, 218, 0.7)',
                      },
                    },
                  }}
                />
              </Box>

              {/* Category filter */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1.5,
                    color: 'text.primary',
                    fontWeight: 'medium',
                  }}
                >
                  Category
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.values(ProductCategory).map((category) => {
                    const isSelected = filters.category === category;

                    // Get the appropriate icon
                    const getIconForCategory = () => {
                      switch (category) {
                        case ProductCategory.BOOK:
                          return <BookIcon fontSize="small" />;
                        case ProductCategory.CD:
                          return <CDIcon fontSize="small" />;
                        case ProductCategory.LP:
                          return <LPIcon fontSize="small" />;
                        case ProductCategory.DVD:
                          return <DVDIcon fontSize="small" />;
                        default:
                          return <FilterListIcon fontSize="small" />;
                      }
                    };

                    return (
                      <Chip
                        key={category}
                        label={category}
                        icon={getIconForCategory()}
                        onClick={() =>
                          handleFilterChange(
                            'category',
                            isSelected ? '' : category
                          )
                        }
                        color={isSelected ? 'primary' : 'default'}
                        variant={isSelected ? 'filled' : 'outlined'}
                        sx={{
                          backgroundColor: isSelected
                            ? 'rgba(2, 136, 209, 0.2)'
                            : 'transparent',
                          border: `1px solid ${
                            isSelected
                              ? 'rgba(100, 255, 218, 0.5)'
                              : 'rgba(100, 255, 218, 0.2)'
                          }`,
                          '&:hover': {
                            backgroundColor: isSelected
                              ? 'rgba(2, 136, 209, 0.3)'
                              : 'rgba(2, 136, 209, 0.1)',
                          },
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>

              {/* Price range filter */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{
                    mb: 1.5,
                    color: 'text.primary',
                    fontWeight: 'medium',
                  }}
                >
                  Price Range (VND)
                </Typography>
                <Box sx={{ px: 1 }}>
                  <Slider
                    value={filters.priceRange}
                    onChange={(_event, newValue) =>
                      handleFilterChange(
                        'priceRange',
                        newValue as [number, number]
                      )
                    }
                    min={0}
                    max={2000000}
                    step={50000}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) =>
                      new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        maximumFractionDigits: 0,
                      }).format(value)
                    }
                    sx={{
                      color: 'primary.light',
                      '& .MuiSlider-thumb': {
                        '&:hover, &.Mui-focusVisible': {
                          boxShadow: '0 0 0 8px rgba(2, 136, 209, 0.16)',
                        },
                      },
                      '& .MuiSlider-valueLabel': {
                        backgroundColor: 'primary.main',
                      },
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mt: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        maximumFractionDigits: 0,
                      }).format(filters.priceRange[0])}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        maximumFractionDigits: 0,
                      }).format(filters.priceRange[1])}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Sort by */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{
                    mb: 1.5,
                    color: 'text.primary',
                    fontWeight: 'medium',
                  }}
                >
                  Sort By
                </Typography>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(1, 22, 39, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(1, 22, 39, 0.5)',
                      },
                      '& fieldset': {
                        borderColor: 'rgba(100, 255, 218, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(100, 255, 218, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(100, 255, 218, 0.7)',
                      },
                    },
                  }}
                >
                  <Select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange('sortBy', e.target.value)
                    }
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start">
                        <SortIcon sx={{ color: 'primary.light' }} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="popularity">Popularity</MenuItem>
                    <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                    <MenuItem value="priceDesc">Price: High to Low</MenuItem>
                    <MenuItem value="newest">Newest First</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Show active filters */}
              {(filters.category ||
                filters.search ||
                filters.priceRange[0] > 0 ||
                filters.priceRange[1] < 2000000) && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1.5,
                      color: 'text.primary',
                      fontWeight: 'medium',
                    }}
                  >
                    Active Filters
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {filters.category && (
                      <Chip
                        label={`Category: ${filters.category}`}
                        onDelete={() => handleFilterChange('category', '')}
                        color="primary"
                        size="small"
                      />
                    )}
                    {filters.search && (
                      <Chip
                        label={`Search: ${filters.search}`}
                        onDelete={() => handleFilterChange('search', '')}
                        color="primary"
                        size="small"
                      />
                    )}
                    {(filters.priceRange[0] > 0 ||
                      filters.priceRange[1] < 2000000) && (
                      <Chip
                        label="Custom Price Range"
                        onDelete={() =>
                          handleFilterChange('priceRange', [0, 2000000])
                        }
                        color="primary"
                        size="small"
                      />
                    )}
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid2>

          {/* Products grid */}
          <Grid2 size={{ xs: 12, md: 9 }}>
            <Box>
              {/* Results summary */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography color="text.secondary">
                  Showing{' '}
                  {filteredProducts.length > 0
                    ? `${indexOfFirstProduct + 1}-${Math.min(
                        indexOfLastProduct,
                        filteredProducts.length
                      )}`
                    : '0'}{' '}
                  of {filteredProducts.length} products
                </Typography>
              </Box>

              {/* No results message */}
              {filteredProducts.length === 0 ? (
                <Paper
                  elevation={3}
                  sx={{
                    p: 5,
                    textAlign: 'center',
                    backgroundImage:
                      'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                    borderRadius: 2,
                    border: '1px solid rgba(100, 255, 218, 0.1)',
                  }}
                >
                  <WavesIcon
                    sx={{
                      fontSize: 60,
                      color: 'primary.light',
                      mb: 2,
                      opacity: 0.7,
                    }}
                  />
                  <Typography variant="h5" color="primary.light" gutterBottom>
                    No products found
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Try adjusting your filters or search term to find products
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleClearFilters}
                    sx={{
                      borderColor: 'rgba(100, 255, 218, 0.3)',
                      '&:hover': {
                        borderColor: 'rgba(100, 255, 218, 0.5)',
                        backgroundColor: 'rgba(100, 255, 218, 0.05)',
                      },
                    }}
                  >
                    Clear All Filters
                  </Button>
                </Paper>
              ) : (
                <>
                  {/* Products grid */}
                  <ProductGrid
                    products={currentProducts}
                    currentPage={currentPage}
                    totalPages={Math.ceil(
                      filteredProducts.length / productsPerPage
                    )}
                    onPageChange={handlePageChange}
                    onAddToCart={handleAddToCart}
                  />
                </>
              )}
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default ProductPage;
