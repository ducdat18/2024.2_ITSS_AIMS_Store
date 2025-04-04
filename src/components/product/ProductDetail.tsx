// src/components/products/ProductDetail.tsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid2,
  Typography,
  Button,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { Product, ProductCategory } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.quantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  // Calculate final price based on discount
  const getActualPrice = () => {
    if (product.discount) {
      return Math.round(product.price * (1 - product.discount / 100));
    }
    return product.price;
  };

  // Generate additional info based on product type
  const renderAdditionalInfo = () => {
    switch (product.category) {
      case ProductCategory.BOOK:
        const bookProduct = product as any; // Type as BookProduct when typed properly
        return (
          <List>
            <ListItem divider>
              <ListItemText
                primary="Authors"
                secondary={bookProduct.authors?.join(', ')}
              />
            </ListItem>
            <ListItem divider>
              <ListItemText
                primary="Publisher"
                secondary={bookProduct.publisher}
              />
            </ListItem>
            <ListItem divider>
              <ListItemText
                primary="Cover Type"
                secondary={bookProduct.coverType}
              />
            </ListItem>
            <ListItem divider>
              <ListItemText
                primary="Publication Date"
                secondary={bookProduct.publicationDate}
              />
            </ListItem>
            {bookProduct.pages && (
              <ListItem divider>
                <ListItemText primary="Pages" secondary={bookProduct.pages} />
              </ListItem>
            )}
            {bookProduct.language && (
              <ListItem divider>
                <ListItemText
                  primary="Language"
                  secondary={bookProduct.language}
                />
              </ListItem>
            )}
            {bookProduct.genre && (
              <ListItem>
                <ListItemText primary="Genre" secondary={bookProduct.genre} />
              </ListItem>
            )}
          </List>
        );

      case ProductCategory.CD:
      case ProductCategory.LP:
        const musicProduct = product as any; // Type as CDProduct/LPProduct when typed properly
        return (
          <List>
            <ListItem divider>
              <ListItemText
                primary="Artists"
                secondary={musicProduct.artists?.join(', ')}
              />
            </ListItem>
            <ListItem divider>
              <ListItemText
                primary="Record Label"
                secondary={musicProduct.recordLabel}
              />
            </ListItem>
            <ListItem divider>
              <ListItemText primary="Genre" secondary={musicProduct.genre} />
            </ListItem>
            {musicProduct.releaseDate && (
              <ListItem>
                <ListItemText
                  primary="Release Date"
                  secondary={musicProduct.releaseDate}
                />
              </ListItem>
            )}
          </List>
        );

      case ProductCategory.DVD:
        const dvdProduct = product as any; // Type as DVDProduct when typed properly
        return (
          <List>
            <ListItem divider>
              <ListItemText
                primary="Director"
                secondary={dvdProduct.director}
              />
            </ListItem>
            <ListItem divider>
              <ListItemText primary="Studio" secondary={dvdProduct.studio} />
            </ListItem>
            <ListItem divider>
              <ListItemText
                primary="Runtime"
                secondary={`${dvdProduct.runtime} minutes`}
              />
            </ListItem>
            <ListItem divider>
              <ListItemText
                primary="Disc Type"
                secondary={dvdProduct.discType}
              />
            </ListItem>
            <ListItem divider>
              <ListItemText
                primary="Languages"
                secondary={dvdProduct.language?.join(', ')}
              />
            </ListItem>
            <ListItem divider>
              <ListItemText
                primary="Subtitles"
                secondary={dvdProduct.subtitles?.join(', ')}
              />
            </ListItem>
            {dvdProduct.genre && (
              <ListItem>
                <ListItemText primary="Genre" secondary={dvdProduct.genre} />
              </ListItem>
            )}
          </List>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid2 container spacing={5}>
        {/* Left Column - Images */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className="left-images" sx={{ mb: 2 }}>
            <Box
              sx={{
                backgroundColor: '#f8f8f8',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 400,
                mb: 2,
                position: 'relative',
              }}
            >
              {/* Discount Badge */}
              {product.discount && (
                <Chip
                  label={`${product.discount}% OFF`}
                  color="error"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    px: 1,
                  }}
                />
              )}

              {/* Product Placeholder - Replace with actual image */}
              <Typography variant="h1" sx={{ color: '#ddd' }}>
                {product.category}
              </Typography>
            </Box>

            <Box
              sx={{
                backgroundColor: '#f8f8f8',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 200,
              }}
            >
              {/* Secondary Image Placeholder */}
              <Typography variant="h3" sx={{ color: '#ddd' }}>
                Details
              </Typography>
            </Box>
          </Box>
        </Grid2>

        {/* Right Column - Product Details */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className="right-content">
            <Typography variant="h4" component="h1" gutterBottom>
              {product.title}
            </Typography>

            {/* Price Display */}
            {product.discount ? (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 'bold', color: 'error.main' }}
                  >
                    {formatCurrency(getActualPrice())}
                  </Typography>
                  <Chip
                    label={`-${product.discount}%`}
                    color="error"
                    size="small"
                    sx={{ ml: 1, fontWeight: 'bold' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Original price:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      ml: 1,
                      color: 'text.secondary',
                      textDecoration: 'line-through',
                    }}
                  >
                    {formatCurrency(product.price)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Price includes 10% VAT
                </Typography>
              </Box>
            ) : (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {formatCurrency(product.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price includes 10% VAT
                </Typography>
              </Box>
            )}

            <Typography variant="body1" sx={{ my: 3 }}>
              {product.description}
            </Typography>

            <Box
              sx={{
                p: 3,
                bgcolor: 'rgba(0,0,0,0.02)',
                borderRadius: 1,
                my: 3,
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                <Box
                  component="span"
                  sx={{ fontSize: 24, mr: 1, verticalAlign: 'middle' }}
                >
                  ❝
                </Box>
                High-quality {product.category.toLowerCase()} in excellent
                condition. Perfect addition to your collection.
                <Box
                  component="span"
                  sx={{ fontSize: 24, ml: 1, verticalAlign: 'middle' }}
                >
                  ❞
                </Box>
              </Typography>
            </Box>

            {/* Stock information */}
            <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
              In Stock: {product.quantity} items
            </Typography>

            {/* Quantity selector */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 3,
                borderTop: '1px solid #eee',
                borderBottom: '1px solid #eee',
                mb: 3,
              }}
            >
              <Typography variant="h6">Quantity</Typography>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                >
                  -
                </Button>
                <TextField
                  size="small"
                  value={quantity}
                  onChange={handleQuantityChange}
                  slotProps={{
                    input: {
                      inputProps: {
                        min: 1,
                        max: product.quantity,
                        style: { textAlign: 'center' },
                      },
                    },
                  }}
                  sx={{
                    width: 60,
                    mx: 1,
                    '& input': { p: 1 },
                  }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    quantity < product.quantity && setQuantity(quantity + 1)
                  }
                >
                  +
                </Button>
              </Box>
            </Box>

            {/* Total and Add to Cart */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
              }}
            >
              <Typography variant="h5">
                Total: {formatCurrency(getActualPrice() * quantity)}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleAddToCart}
              >
                Add To Cart
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Product specific details */}
            <Typography variant="h6" gutterBottom>
              Product Details
            </Typography>

            {renderAdditionalInfo()}

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Barcode: {product.barcode}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Weight: {product.weight} kg
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dimensions: {product.dimensions.width} ×{' '}
                {product.dimensions.height} × {product.dimensions.depth} cm
              </Typography>
            </Box>
          </Box>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default ProductDetail;
