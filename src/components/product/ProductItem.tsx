// src/components/products/ProductItem.tsx
import React from 'react';
import {
  Card,
  Box,
  CardContent,
  Typography,
  CardActions,
  Button,
  Rating,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Book as BookIcon,
  Album as CDIcon,
  Radio as LPIcon,
  MovieCreation as DVDIcon,
} from '@mui/icons-material';
import { ProductCategory, Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ProductItemProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const getCategoryIcon = () => {
    switch (product.category) {
      case ProductCategory.BOOK:
        return <BookIcon sx={{ fontSize: 60 }} />;
      case ProductCategory.CD:
        return <CDIcon sx={{ fontSize: 60 }} />;
      case ProductCategory.LP:
        return <LPIcon sx={{ fontSize: 60 }} />;
      case ProductCategory.DVD:
        return <DVDIcon sx={{ fontSize: 60 }} />;
      default:
        return <BookIcon sx={{ fontSize: 60 }} />;
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transform: 'translateY(0)',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          '& .hover-content': {
            opacity: 1,
            bottom: 30,
          },
        },
      }}
    >
      <Box
        className="thumb"
        sx={{
          position: 'relative',
          textAlign: 'center',
          p: 3,
          backgroundColor: '#f8f8f8',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 200,
          }}
        >
          {getCategoryIcon()}
        </Box>

        <Box
          className="hover-content"
          sx={{
            position: 'absolute',
            bottom: -60,
            left: 0,
            width: '100%',
            textAlign: 'center',
            opacity: 0,
            transition: 'all 0.5s',
            zIndex: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                minWidth: 'auto',
                width: 50,
                height: 50,
                p: 0,
                borderRadius: '50%',
              }}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                👁️
              </Box>
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{
                minWidth: 'auto',
                width: 50,
                height: 50,
                p: 0,
                borderRadius: '50%',
              }}
              onClick={() => onAddToCart(product)}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                🛒
              </Box>
            </Button>
          </Box>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 3 }}>
        <Typography
          variant="h5"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            fontSize: 18,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            height: 48,
            lineHeight: 1.3,
          }}
        >
          {product.title}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 500, color: 'text.secondary' }}
          >
            {formatCurrency(product.price)}
          </Typography>

          <Rating value={5} readOnly size="small" />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductItem;
