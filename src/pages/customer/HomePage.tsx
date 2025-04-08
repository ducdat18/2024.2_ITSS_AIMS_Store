// src/pages/customer/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import { Product } from '../../types';
import Newsletter from '../../components/common/Newsletter';
import { mockApiService } from '../../mock/mockApi';
import ProductGrid from '../../components/product/ProductGrid';
import CategoryBanner from '../../components/common/CategoryBanner';
import { Waves as WavesIcon } from '@mui/icons-material';
import Banner from '../../components/common/Banner';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 5,
          textAlign: 'center',
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
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
        <Typography
          variant="h5"
          sx={{
            color: 'text.secondary',
            fontWeight: 'medium',
          }}
        >
          Diving into our deep ocean collection...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Enhanced Hero Banner */}
      <Banner />

      {/* Category Banners */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
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
              'radial-gradient(circle at 20% 50%, rgba(2, 136, 209, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(100, 255, 218, 0.05) 0%, transparent 50%)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <CategoryBanner />
        </Container>
      </Box>

      <Divider
        sx={{
          borderColor: 'rgba(100, 255, 218, 0.1)',
          width: '80%',
          mx: 'auto',
        }}
      />

      {/* Featured Products */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
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
              'linear-gradient(135deg, rgba(1, 22, 39, 0.6) 0%, rgba(4, 28, 44, 0.4) 100%)',
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'radial-gradient(circle at 30% 20%, rgba(100, 255, 218, 0.05) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(2, 136, 209, 0.05) 0%, transparent 50%)',
            zIndex: 2,
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 3,
          }}
        >
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
