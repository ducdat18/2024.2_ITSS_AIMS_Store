import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Divider,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { mockApiService } from '../../mock/mockApi';

// Simplified cart item type
interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [insufficientItems, setInsufficientItems] = useState<{
    [key: string]: number;
  }>({});
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching cart from a service
    const fetchCart = async () => {
      try {
        const products = await mockApiService.getProducts();
        const mockCart: CartItem[] = [
          { product: products[0], quantity: 2, price: products[0].price },
          { product: products[1], quantity: 1, price: products[1].price },
        ];
        setCartItems(mockCart);

        const insufficientStock: { [key: string]: number } = {};
        mockCart.forEach((item) => {
          if (item.quantity > item.product.quantity) {
            insufficientStock[item.product.id] = item.product.quantity;
          }
        });
        setInsufficientItems(insufficientStock);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      setCartItems(
        cartItems.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

      // Update insufficient items notification
      const product = cartItems.find(
        (item) => item.product.id === productId
      )?.product;
      if (product && newQuantity > product.quantity) {
        setInsufficientItems({
          ...insufficientItems,
          [productId]: product.quantity,
        });
      } else {
        const updatedInsufficient = { ...insufficientItems };
        delete updatedInsufficient[productId];
        setInsufficientItems(updatedInsufficient);
      }
    }
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(cartItems.filter((item) => item.product.id !== productId));

    // Remove from insufficient items if present
    const updatedInsufficient = { ...insufficientItems };
    delete updatedInsufficient[productId];
    setInsufficientItems(updatedInsufficient);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateVAT = () => {
    // 10% VAT as per AIMS requirement
    return calculateSubtotal() * 0.1;
  };

  const handleProceedToCheckout = () => {
    if (Object.keys(insufficientItems).length > 0) {
      // Cannot proceed if inventory is insufficient
      alert('Please update quantities for items with insufficient inventory.');
      return;
    }

    // Proceed to checkout
    navigate('/checkout');
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
          Loading your cart items...
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
            mb: 3,
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
          <ShoppingCartIcon /> Shopping Cart
        </Typography>

        {cartItems.length === 0 ? (
          <Paper
            elevation={3}
            sx={{
              textAlign: 'center',
              py: 6,
              px: 3,
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
              borderRadius: 2,
              border: '1px solid rgba(100, 255, 218, 0.1)',
            }}
          >
            <WavesIcon
              sx={{
                fontSize: 60,
                color: 'primary.light',
                mb: 2,
                opacity: 0.7,
              }}
            />
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: 'primary.light' }}
            >
              Your cart is floating empty in the deep ocean
            </Typography>
            <Typography
              sx={{
                mb: 4,
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              It looks like you haven't added any items to your cart yet.
              Explore our collection and discover the perfect media products for
              your collection.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/products')}
              sx={{
                mt: 2,
                px: 4,
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
              startIcon={<WavesIcon />}
            >
              Dive Into Shopping
            </Button>
          </Paper>
        ) : (
          <>
            {Object.keys(insufficientItems).length > 0 && (
              <Alert
                severity="warning"
                icon={<WarningIcon />}
                sx={{
                  mb: 3,
                  backgroundColor: 'rgba(255, 152, 0, 0.1)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  '& .MuiAlert-icon': {
                    color: 'warning.main',
                  },
                }}
              >
                Some items in your cart have insufficient inventory. Please
                update quantities.
              </Alert>
            )}

            <TableContainer
              component={Paper}
              elevation={3}
              sx={{
                mb: 4,
                borderRadius: 2,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                overflow: 'hidden',
              }}
            >
              <Table>
                <TableHead
                  sx={{
                    bgcolor: 'rgba(2, 136, 209, 0.1)',
                    '& .MuiTableCell-root': {
                      borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
                      color: 'primary.light',
                      fontWeight: 'bold',
                    },
                  }}
                >
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow
                      key={item.product.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '& .MuiTableCell-root': {
                          borderBottom: '1px solid rgba(100, 255, 218, 0.05)',
                        },
                        transition: 'background-color 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(2, 136, 209, 0.05)',
                        },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              bgcolor: 'rgba(2, 136, 209, 0.1)',
                              color: 'primary.light',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2,
                              borderRadius: 1,
                              border: '1px solid rgba(100, 255, 218, 0.1)',
                            }}
                          >
                            <WavesIcon sx={{ fontSize: 24 }} />
                          </Box>
                          <Box>
                            <Typography
                              variant="subtitle1"
                              color="text.primary"
                            >
                              {item.product.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.product.category}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'primary.light' }}>
                        {formatCurrency(item.price)}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              handleQuantityChange(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                            sx={{
                              minWidth: 30,
                              p: 0,
                              borderColor: 'rgba(100, 255, 218, 0.3)',
                              color: 'primary.light',
                              '&:hover': {
                                borderColor: 'rgba(100, 255, 218, 0.5)',
                                backgroundColor: 'rgba(100, 255, 218, 0.05)',
                              },
                              '&.Mui-disabled': {
                                borderColor: 'rgba(100, 255, 218, 0.1)',
                              },
                            }}
                          >
                            <RemoveIcon fontSize="small" />
                          </Button>
                          <TextField
                            size="small"
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.product.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            slotProps={{
                              input: {
                                inputProps: {
                                  min: 1,
                                  style: { textAlign: 'center' },
                                },
                              },
                            }}
                            sx={{
                              width: 60,
                              mx: 1,
                              '& input': { p: '6px' },
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
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              handleQuantityChange(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                            sx={{
                              minWidth: 30,
                              p: 0,
                              borderColor: 'rgba(100, 255, 218, 0.3)',
                              color: 'primary.light',
                              '&:hover': {
                                borderColor: 'rgba(100, 255, 218, 0.5)',
                                backgroundColor: 'rgba(100, 255, 218, 0.05)',
                              },
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </Button>
                        </Box>
                        {insufficientItems[item.product.id] !== undefined && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ display: 'block', mt: 1 }}
                          >
                            Only {insufficientItems[item.product.id]} available
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 'bold',
                          color: 'primary.light',
                        }}
                      >
                        {formatCurrency(item.price * item.quantity)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(item.product.id)}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(255, 82, 82, 0.1)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 82, 82, 0.2)',
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/products')}
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    px: 3,
                    py: 1.2,
                    borderColor: 'rgba(100, 255, 218, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(100, 255, 218, 0.5)',
                      backgroundColor: 'rgba(100, 255, 218, 0.05)',
                    },
                  }}
                >
                  Continue Shopping
                </Button>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    bgcolor: 'rgba(13, 37, 56, 0.5)',
                    borderRadius: 2,
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
                        'radial-gradient(circle at 50% 50%, rgba(2, 136, 209, 0.08) 0%, transparent 70%)',
                      opacity: 0.8,
                      zIndex: 1,
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="primary.light"
                    sx={{
                      fontWeight: 'bold',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    Cart Summary
                  </Typography>
                  <Divider
                    sx={{ mb: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    <Typography color="text.secondary">
                      Subtotal (excl. VAT):
                    </Typography>
                    <Typography color="text.primary">
                      {formatCurrency(calculateSubtotal())}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    <Typography color="text.secondary">VAT (10%):</Typography>
                    <Typography color="text.primary">
                      {formatCurrency(calculateVAT())}
                    </Typography>
                  </Box>

                  <Divider
                    sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 3,
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="primary.light"
                      fontWeight="bold"
                    >
                      Total:
                    </Typography>
                    <Typography
                      variant="h6"
                      color="primary.light"
                      fontWeight="bold"
                    >
                      {formatCurrency(calculateSubtotal() + calculateVAT())}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handleProceedToCheckout}
                    disabled={Object.keys(insufficientItems).length > 0}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      px: 3,
                      py: 1.2,
                      position: 'relative',
                      zIndex: 2,
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
                    Proceed to Checkout
                  </Button>
                </Paper>
              </Grid2>
            </Grid2>
          </>
        )}
      </Container>
    </Box>
  );
};

export default CartPage;
