// src/pages/customer/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import Newsletter from '../../components/common/Newsletter';
import { mockApiService } from '../../mock/mockApi';
import ProductGrid from '../../components/product/ProductGrid';
import CategoryBanner from '../../components/common/CategoryBanner';

// Import the image directly
import heroImage from '../../assets/aim.jpg';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Get random 20 products for the homepage as per AIMS requirements
        const data = await mockApiService.getProducts();
        const randomProducts = [...data]
          .sort(() => 0.5 - Math.random())
          .slice(0, 20);
        setProducts(randomProducts);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    // Add to cart functionality
    console.log('Added to cart:', product);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <Box sx={{ p: 5, textAlign: 'center' }}>Loading...</Box>;
  }

  return (
    <Box>
      {/* Enhanced Hero Banner */}
      <Box
        sx={{
          height: { xs: '60vh', md: '70vh' },
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.6)',
            zIndex: -1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ mr: 1 }}>
          <Box
            sx={{
              maxWidth: 650,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              p: { xs: 4, md: 5 },
              borderRadius: 2,
              ml: { xs: 0, md: 4 },
              backdropFilter: 'blur(8px)',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                color: 'white',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2,
              }}
            >
              AIMS Media Store
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.6,
              }}
            >
              Discover our collection of high-quality books, CDs, LP records,
              and DVDs. Shop for the best physical media products.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/products')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                boxShadow: '0 4px 10px rgba(0, 82, 204, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 12px rgba(0, 82, 204, 0.4)',
                },
              }}
            >
              Shop Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Category Banners */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <CategoryBanner />
      </Container>

      {/* Featured Products */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <ProductGrid
            products={products}
            title="Featured Products"
            currentPage={currentPage}
            totalPages={1}
            onPageChange={handlePageChange}
            onAddToCart={handleAddToCart}
          />
        </Container>
      </Box>

      {/* Newsletter */}
      <Newsletter />
    </Box>
  );
};

export default HomePage;
