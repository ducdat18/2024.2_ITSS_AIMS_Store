import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import ProductCategoryIcon, { getCategoryColor } from './ProductCategoryIcon';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <Card
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundImage: 'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
        borderRadius: 2,
        border: '1px solid rgba(100, 255, 218, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 20px -10px rgba(0, 0, 0, 0.3)',
          '& .product-wave': {
            opacity: 0.7,
          },
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(2, 136, 209, 0.08) 0%, transparent 70%)',
          opacity: 0.4,
          zIndex: 1,
        },
      }}
    >
      {(product.discount ?? 0) > 0 && (
        <Chip
          label={`${product.discount}% OFF`}
          color="error"
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            fontWeight: 'bold',
            zIndex: 10,
          }}
        />
      )}

      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
          minHeight: 140,
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={handleProductClick}
      >
        <WavesIcon
          className="product-wave"
          sx={{
            fontSize: 70,
            color: 'primary.light',
            opacity: 0.3,
            transition: 'opacity 0.3s ease',
            position: 'absolute',
          }}
        />
        <ProductCategoryIcon category={product.category} />
        <Chip
          label={product.category}
          color={getCategoryColor(product.category)}
          size="small"
          sx={{ mt: 1 }}
        />
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          position: 'relative',
          zIndex: 2,
          cursor: 'pointer',
        }}
        onClick={handleProductClick}
      >
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            fontWeight: 'medium',
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            height: 56,
          }}
        >
          {product.title}
        </Typography>

        <Box sx={{ textAlign: 'center', mb: 1 }}>
          {(product.discount ?? 0) > 0 ? (
            <>
              <Typography variant="body1" color="error.main" fontWeight="bold">
                {formatCurrency(
                  Math.round(
                    product.price * (1 - (product.discount ?? 0) / 100)
                  )
                )}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                {formatCurrency(product.price)}
              </Typography>
            </>
          ) : (
            <Typography variant="body1" color="primary.light" fontWeight="bold">
              {formatCurrency(product.price)}
            </Typography>
          )}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            height: 60,
          }}
        >
          {product.description}
        </Typography>
      </CardContent>

      <CardActions sx={{ position: 'relative', zIndex: 2, p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          size="small"
          startIcon={<CartIcon />}
          onClick={handleAddToCart}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              transition: 'all 0.6s',
            },
            '&:hover::after': {
              left: '100%',
            },
          }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
