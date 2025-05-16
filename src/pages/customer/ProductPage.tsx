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
import { useNotification } from '../../components/customer/common/Notification';
import { addToCart } from '../../services/cart';

const ProductPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const { showSuccess, showError, NotificationComponent } = useNotification();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);

  const [filters, setFilters] = useState({
    category: queryParams.get('category') || '',
    search: queryParams.get('search') || '',
    priceRange: [0, 2000000] as [number, number],
    sortBy: 'popularity',
  });

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

  useEffect(() => {
    if (products.length > 0) {
      let result = [...products];

      if (filters.category) {
        result = result.filter(
          (product) => product.category === filters.category
        );
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(
          (product) =>
            product.title.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower)
        );
      }

      result = result.filter(
        (product) =>
          product.price >= filters.priceRange[0] &&
          product.price <= filters.priceRange[1]
      );

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
      }

      setFilteredProducts(result);
      setCurrentPage(1);
    }
  }, [filters, products]);

  const handleFilterChange = (
    name: string,
    value: string | number | [number, number]
  ) => {
    setFilters({
      ...filters,
      [name]: value,
    });
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
  const handleClearFilters = () => {
    setFilters({
      category: '',
      search: '',
      priceRange: [0, 2000000],
      sortBy: 'popularity',
    });
    navigate('/products');
  };
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product) => {
    try {
      addToCart(product, 1);
      showSuccess(`${product.title} added to your cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Failed to add product to cart. Please try again.');
    }
  };

  if (loading) {
    return <LoadingState message="Diving for products..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

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
        <Grid2 size={{ xs: 12, md: 3 }}>
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            activeFilters={activeFilters}
          />
        </Grid2>

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

      <NotificationComponent />
    </PageContainer>
  );
};

export default ProductPage;
