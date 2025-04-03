// src/components/products/ProductGrid.tsx
import React from 'react';
import { Grid, Box, Typography, Pagination } from '@mui/material';
import ProductItem from './ProductItem';
import { Product } from '../../types';

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
  onAddToCart
}) => {
  return (
    <Box>
      {title && (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore our collection of high-quality media products.
          </Typography>
        </Box>
      )}
      
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductItem 
              product={product} 
              onAddToCart={onAddToCart} 
            />
          </Grid>
        ))}
      </Grid>
      
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Pagination 
            count={totalPages} 
            page={currentPage} 
            onChange={onPageChange} 
            color="primary" 
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
};

export default ProductGrid;