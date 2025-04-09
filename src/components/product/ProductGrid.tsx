import React from 'react';
import { Grid2, Box, Typography, Pagination } from '@mui/material';
import ProductItem from './ProductItem';
import { Product } from '../../types';
import { Waves as WavesIcon } from '@mui/icons-material';

interface ProductGridProps {
  products: Product[];
  title?: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  currentPage,
  totalPages,
  onPageChange,
  onAddToCart,
}) => {
  return (
    <Box>
      {title && (
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              position: 'relative',
              display: 'inline-block',
              pb: 2,
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '80px',
                height: '4px',
                background:
                  'linear-gradient(90deg, rgba(100, 255, 218, 0.5), rgba(2, 136, 209, 0.7))',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                borderRadius: '2px',
              },
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 700,
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <WavesIcon
              sx={{
                color: 'primary.light',
                fontSize: 20,
              }}
            />
            Explore our collection of high-quality media products.
          </Typography>
        </Box>
      )}

      <Grid2 container spacing={3}>
        {products.map((product) => (
          <Grid2 key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <ProductItem product={product} onAddToCart={onAddToCart} />
          </Grid2>
        ))}
      </Grid2>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={onPageChange}
            color="primary"
            shape="rounded"
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'text.secondary',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(2, 136, 209, 0.2)',
                  color: 'primary.light',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(2, 136, 209, 0.3)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(2, 136, 209, 0.1)',
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ProductGrid;
