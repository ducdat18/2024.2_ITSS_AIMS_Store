// src/pages/customer/CartPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
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
import { Delete as DeleteIcon } from '@mui/icons-material';
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
        // Mock data - in a real app this would come from a cart service
        const products = await mockApiService.getProducts();
        const mockCart: CartItem[] = [
          { product: products[0], quantity: 2, price: products[0].price },
          { product: products[1], quantity: 1, price: products[1].price },
        ];
        setCartItems(mockCart);

        // Simulate checking inventory (as per AIMS requirements)
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
    return <Box sx={{ p: 5, textAlign: 'center' }}>Loading cart...</Box>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        color="secondary.main"
      >
        Shopping Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <>
          {Object.keys(insufficientItems).length > 0 && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Some items in your cart have insufficient inventory. Please update
              quantities.
            </Alert>
          )}

          <TableContainer
            component={Paper}
            elevation={1}
            sx={{ mb: 4, borderRadius: 2 }}
          >
            <Table>
              <TableHead sx={{ bgcolor: 'rgba(25, 118, 210, 0.05)' }}>
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
                  <TableRow key={item.product.id}>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            bgcolor: 'primary.light',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            borderRadius: 1,
                          }}
                        >
                          {item.product.category}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1">
                            {item.product.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.product.category}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
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
                          color="primary"
                          onClick={() =>
                            handleQuantityChange(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                          sx={{ minWidth: 30, p: 0 }}
                        >
                          -
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
                          inputProps={{
                            min: 1,
                            style: { textAlign: 'center' },
                          }}
                          sx={{
                            width: 60,
                            mx: 1,
                            '& input': { p: '6px' },
                          }}
                        />
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() =>
                            handleQuantityChange(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          sx={{ minWidth: 30, p: 0 }}
                        >
                          +
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
                    <TableCell align="right">
                      {formatCurrency(item.price * item.quantity)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="secondary"
                        onClick={() => handleRemoveItem(item.product.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={1}
                sx={{ p: 3, bgcolor: '#f8f9ff', borderRadius: 2 }}
              >
                <Typography variant="h6" gutterBottom color="secondary.main">
                  Cart Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography>Subtotal (excl. VAT):</Typography>
                  <Typography>{formatCurrency(calculateSubtotal())}</Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography>VAT (10%):</Typography>
                  <Typography>{formatCurrency(calculateVAT())}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" color="primary.dark">
                    Total:
                  </Typography>
                  <Typography variant="h6" color="primary.dark">
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
                >
                  Proceed to Checkout
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default CartPage;
