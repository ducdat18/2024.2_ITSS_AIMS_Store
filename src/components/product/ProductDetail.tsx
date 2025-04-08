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
  Paper,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  LocalOffer as DiscountIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
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
          <List
            sx={{
              '.MuiListItem-root': {
                borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
                py: 1.5,
              },
              '.MuiListItemText-primary': {
                color: 'text.secondary',
                fontSize: '0.9rem',
              },
              '.MuiListItemText-secondary': {
                color: 'text.primary',
                fontSize: '1rem',
                mt: 0.5,
              },
            }}
          >
            <ListItem>
              <ListItemText
                primary="Authors"
                secondary={bookProduct.authors?.join(', ')}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Publisher"
                secondary={bookProduct.publisher}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Cover Type"
                secondary={bookProduct.coverType}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Publication Date"
                secondary={bookProduct.publicationDate}
              />
            </ListItem>
            {bookProduct.pages && (
              <ListItem>
                <ListItemText primary="Pages" secondary={bookProduct.pages} />
              </ListItem>
            )}
            {bookProduct.language && (
              <ListItem>
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
          <List
            sx={{
              '.MuiListItem-root': {
                borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
                py: 1.5,
              },
              '.MuiListItemText-primary': {
                color: 'text.secondary',
                fontSize: '0.9rem',
              },
              '.MuiListItemText-secondary': {
                color: 'text.primary',
                fontSize: '1rem',
                mt: 0.5,
              },
            }}
          >
            <ListItem>
              <ListItemText
                primary="Artists"
                secondary={musicProduct.artists?.join(', ')}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Record Label"
                secondary={musicProduct.recordLabel}
              />
            </ListItem>
            <ListItem>
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
          <List
            sx={{
              '.MuiListItem-root': {
                borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
                py: 1.5,
              },
              '.MuiListItemText-primary': {
                color: 'text.secondary',
                fontSize: '0.9rem',
              },
              '.MuiListItemText-secondary': {
                color: 'text.primary',
                fontSize: '1rem',
                mt: 0.5,
              },
            }}
          >
            <ListItem>
              <ListItemText
                primary="Director"
                secondary={dvdProduct.director}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Studio" secondary={dvdProduct.studio} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Runtime"
                secondary={`${dvdProduct.runtime} minutes`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Disc Type"
                secondary={dvdProduct.discType}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Languages"
                secondary={dvdProduct.language?.join(', ')}
              />
            </ListItem>
            <ListItem>
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
            <Paper
              elevation={3}
              sx={{
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 400,
                mb: 2,
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage:
                    'radial-gradient(circle at 50% 50%, rgba(100, 255, 218, 0.1) 0%, transparent 70%)',
                  opacity: 0.6,
                },
              }}
            >
              {/* Discount Badge */}
              {product.discount && (
                <Chip
                  icon={<DiscountIcon />}
                  label={`${product.discount}% OFF`}
                  color="error"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    px: 1,
                    zIndex: 2,
                  }}
                />
              )}

              {/* Product Placeholder */}
              <Box
                sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}
              >
                <WavesIcon
                  sx={{
                    fontSize: 80,
                    color: 'primary.light',
                    mb: 2,
                  }}
                />
                <Typography variant="h4" sx={{ color: 'primary.light' }}>
                  {product.category}
                </Typography>
              </Box>
            </Paper>

            <Paper
              elevation={2}
              sx={{
                backgroundImage:
                  'linear-gradient(135deg, #041c2c 0%, #0d2538 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 200,
                borderRadius: 2,
              }}
            >
              {/* Secondary Image Placeholder */}
              <Typography variant="h6" sx={{ color: 'primary.light' }}>
                Product Details
              </Typography>
            </Paper>
          </Box>
        </Grid2>

        {/* Right Column - Product Details */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box className="right-content">
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
              }}
            >
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
                <Typography
                  variant="h5"
                  color="primary.light"
                  fontWeight="bold"
                >
                  {formatCurrency(product.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price includes 10% VAT
                </Typography>
              </Box>
            )}

            <Typography variant="body1" sx={{ my: 3, color: 'text.secondary' }}>
              {product.description}
            </Typography>

            <Paper
              elevation={2}
              sx={{
                p: 3,
                bgcolor: 'rgba(2, 136, 209, 0.05)',
                borderRadius: 2,
                my: 3,
                border: '1px solid rgba(100, 255, 218, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage:
                    'radial-gradient(circle at 50% 30%, rgba(100, 255, 218, 0.08) 0%, transparent 70%)',
                  opacity: 0.8,
                  zIndex: 1,
                },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontStyle: 'italic',
                  position: 'relative',
                  zIndex: 2,
                  color: 'primary.light',
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontSize: 24,
                    mr: 1,
                    verticalAlign: 'middle',
                    color: 'rgba(100, 255, 218, 0.5)',
                  }}
                >
                  ❝
                </Box>
                High-quality {product.category.toLowerCase()} in excellent
                condition. Perfect addition to your collection.
                <Box
                  component="span"
                  sx={{
                    fontSize: 24,
                    ml: 1,
                    verticalAlign: 'middle',
                    color: 'rgba(100, 255, 218, 0.5)',
                  }}
                >
                  ❞
                </Box>
              </Typography>
            </Paper>

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
                borderTop: '1px solid rgba(100, 255, 218, 0.1)',
                borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
                mb: 3,
              }}
            >
              <Typography variant="h6" color="text.primary">
                Quantity
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  sx={{
                    borderColor: 'rgba(100, 255, 218, 0.3)',
                    color: 'primary.light',
                    minWidth: 32,
                    height: 32,
                  }}
                >
                  <RemoveIcon fontSize="small" />
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
                    '& .MuiOutlinedInput-root': {
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
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    quantity < product.quantity && setQuantity(quantity + 1)
                  }
                  sx={{
                    borderColor: 'rgba(100, 255, 218, 0.3)',
                    color: 'primary.light',
                    minWidth: 32,
                    height: 32,
                  }}
                >
                  <AddIcon fontSize="small" />
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
              <Typography variant="h5" color="text.primary">
                Total: {formatCurrency(getActualPrice() * quantity)}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleAddToCart}
                startIcon={<CartIcon />}
                sx={{
                  px: 3,
                  py: 1.2,
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
                Add To Cart
              </Button>
            </Box>

            <Divider sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

            {/* Product specific details */}
            <Typography variant="h6" gutterBottom color="primary.light">
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
