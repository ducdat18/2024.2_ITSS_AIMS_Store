import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid2,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Tooltip,
  Snackbar,
} from '@mui/material';
import {
  FavoriteBorder as FavoriteIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  Visibility as VisibilityIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { mockApiService } from '../../mock/mockApi';
import { formatCurrency } from '../../utils/formatters';
import { Product, ProductCategory, WishlistItem } from '../../types';

const AccountWishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);
  const [removeItemSuccess, setRemoveItemSuccess] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        // In a real app, we would fetch from an API
        // Here we'll use mock data
        const products = await mockApiService.getProducts();

        // Create mock wishlist with 5 random products
        const randomProducts = [...products]
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);

        const mockWishlist: WishlistItem[] = randomProducts.map((product) => ({
          product,
          addedAt: new Date(
            Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
          ).toISOString(),
        }));

        setWishlistItems(mockWishlist);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setError('Failed to load wishlist. Please try again later.');
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistItems((prev) =>
      prev.filter((item) => item.product.id !== productId)
    );
    setRemoveItemSuccess(true);
  };

  const handleAddToCart = (product: Product) => {
    // In a real app, we would add to the cart via a cart service
    console.log('Added to cart:', product);
    setAddToCartSuccess(true);
  };

  const handleCloseAddToCartSnackbar = () => {
    setAddToCartSuccess(false);
  };

  const handleCloseRemoveItemSnackbar = () => {
    setRemoveItemSuccess(false);
  };

  // Get category icon for wishlist item
  const getCategoryIcon = (category: ProductCategory) => {
    switch (category) {
      case ProductCategory.BOOK:
        return <Typography>📚</Typography>;
      case ProductCategory.CD:
        return <Typography>💿</Typography>;
      case ProductCategory.LP:
        return <Typography>🎵</Typography>;
      case ProductCategory.DVD:
        return <Typography>🎬</Typography>;
      default:
        return <Typography>📦</Typography>;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
          Loading your wishlist...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 4, md: 5 },
        position: 'relative',
        overflow: 'hidden',
        minHeight: '70vh',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(2, 136, 209, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(100, 255, 218, 0.05) 0%, transparent 50%)',
          zIndex: 1,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 4,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: 60,
              height: 3,
              background:
                'linear-gradient(90deg, rgba(100, 255, 218, 0.7), rgba(100, 255, 218, 0.1))',
              borderRadius: 2,
            },
          }}
        >
          <FavoriteIcon /> My Wishlist
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {wishlistItems.length === 0 ? (
          <Paper
            elevation={3}
            sx={{
              p: 5,
              textAlign: 'center',
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
              borderRadius: 2,
              border: '1px solid rgba(100, 255, 218, 0.1)',
            }}
          >
            <FavoriteIcon
              sx={{
                fontSize: 60,
                color: 'primary.light',
                mb: 2,
                opacity: 0.5,
              }}
            />
            <Typography variant="h5" color="primary.light" gutterBottom>
              Your wishlist is empty
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}
            >
              Save items you're interested in by clicking the heart icon on any
              product. View them anytime and easily add them to your cart later.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/products')}
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
              Explore Products
            </Button>
          </Paper>
        ) : (
          <Grid2 container spacing={3}>
            {wishlistItems.map((item) => (
              <Grid2 key={item.product.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundImage:
                      'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                    border: '1px solid rgba(100, 255, 218, 0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.5)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <FavoriteIcon
                        fontSize="small"
                        sx={{ color: 'primary.light' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Added on {formatDate(item.addedAt)}
                      </Typography>
                    </Box>
                    <Tooltip title="Remove from wishlist">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleRemoveFromWishlist(item.product.id)
                        }
                        sx={{
                          color: 'error.light',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 82, 82, 0.1)',
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(2, 136, 209, 0.1)',
                          borderRadius: '50%',
                          fontSize: '1.5rem',
                        }}
                      >
                        {getCategoryIcon(item.product.category)}
                      </Box>
                      <Typography
                        variant="subtitle1"
                        color="primary.light"
                        fontWeight="medium"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {item.product.title}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 2,
                        height: 40,
                      }}
                    >
                      {item.product.description}
                    </Typography>

                    <Divider
                      sx={{
                        mb: 2,
                        borderColor: 'rgba(100, 255, 218, 0.1)',
                      }}
                    />

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        {item.product.discount ? (
                          <Box>
                            <Typography
                              variant="body1"
                              color="error.main"
                              fontWeight="bold"
                            >
                              {formatCurrency(
                                Math.round(
                                  item.product.price *
                                    (1 - item.product.discount / 100)
                                )
                              )}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ textDecoration: 'line-through' }}
                            >
                              {formatCurrency(item.product.price)}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography
                            variant="body1"
                            color="primary.light"
                            fontWeight="bold"
                          >
                            {formatCurrency(item.product.price)}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          color={
                            item.product.quantity > 0
                              ? 'success.main'
                              : 'error.main'
                          }
                          fontWeight="medium"
                        >
                          {item.product.quantity > 0
                            ? `In Stock (${item.product.quantity})`
                            : 'Out of Stock'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions
                    sx={{
                      p: 2,
                      pt: 0,
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => navigate(`/product/${item.product.id}`)}
                      sx={{
                        borderColor: 'rgba(100, 255, 218, 0.3)',
                        color: 'primary.light',
                        '&:hover': {
                          borderColor: 'rgba(100, 255, 218, 0.5)',
                          backgroundColor: 'rgba(100, 255, 218, 0.05)',
                        },
                      }}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      startIcon={<CartIcon />}
                      disabled={item.product.quantity === 0}
                      onClick={() => handleAddToCart(item.product)}
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
              </Grid2>
            ))}
          </Grid2>
        )}

        {/* Snackbars for feedback */}
        <Snackbar
          open={addToCartSuccess}
          autoHideDuration={3000}
          onClose={handleCloseAddToCartSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseAddToCartSnackbar}
            severity="success"
            sx={{ width: '100%' }}
          >
            Product added to cart successfully!
          </Alert>
        </Snackbar>

        <Snackbar
          open={removeItemSuccess}
          autoHideDuration={3000}
          onClose={handleCloseRemoveItemSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseRemoveItemSnackbar}
            severity="success"
            sx={{ width: '100%' }}
          >
            Product removed from wishlist.
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AccountWishlistPage;
