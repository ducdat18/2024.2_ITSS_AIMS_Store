import React, { useState, useEffect } from 'react';
import { Grid2, Box, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import EmptyCart from '../../components/cart/EmptyCard';
import ErrorState from '../../components/customer/common/ErrorState';
import LoadingState from '../../components/customer/common/LoadingState';
import PageContainer from '../../components/customer/common/PageContainer';
import PageTitle from '../../components/customer/common/PageTitle';
import FilterSidebar from '../../components/product/ProductFilter/FilterSidebar';
import ProductGrid from '../../components/product/ProductGrid';
import { mockApiService } from '../../mock/mockApi';
import { Product } from '../../types';

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
    priceRange: [0, 2000000] as [number, number], // VND
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
        // Default: popularity or any other case
        // Keeping original order or could implement popularity logic
      }

      setFilteredProducts(result);
      setCurrentPage(1); // Reset to first page when filters change
    }
  }, [filters, products]);

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

  // Add to cart handler
  const handleAddToCart = (product: Product) => {
    // This would be implemented with a cart context or similar
    console.log('Added to cart:', product);
  };

  if (loading) {
    return <LoadingState message="Diving for products..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  // Generate active filters for the sidebar
  const activeFilters = [
    ...(filters.category
      ? [
          {
            type: 'category',
            value: filters.category,
            label: `Category: ${filters.category}`,
          },
        ]
      : []),
    ...(filters.search
      ? [
          {
            type: 'search',
            value: filters.search,
            label: `Search: ${filters.search}`,
          },
        ]
      : []),
    ...(filters.priceRange[0] > 0 || filters.priceRange[1] < 2000000
      ? [{ type: 'priceRange', value: '', label: 'Custom Price Range' }]
      : []),
  ];

  return (
    <PageContainer>
      <PageTitle
        title="Explore Our Collection"
        subtitle="Discover our vast selection of high-quality media products. Use the filters to find exactly what you're looking for."
        align="center"
        gradient={true}
      />

      <Grid2 container spacing={4}>
        {/* Filters sidebar */}
        <Grid2 size={{ xs: 12, md: 3 }}>
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            activeFilters={activeFilters}
          />
        </Grid2>

        {/* Products grid */}
        <Grid2 size={{ xs: 12, md: 9 }}>
          {filteredProducts.length === 0 ? (
            <EmptyCart
              message="No products found"
              buttonText="Clear All Filters"
              buttonPath="/products"
            />
          ) : (
            <>
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
        </Grid2>
      </Grid2>
    </PageContainer>
  );
};

export default ProductPage;
