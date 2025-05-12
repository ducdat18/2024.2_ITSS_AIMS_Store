import React, { useState, useEffect } from 'react';
import { Box, Button, Grid2 } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CartItemType } from '../../components/cart/CardItem';
import CartItemList from '../../components/cart/CardItemList';
import CartSummary from '../../components/cart/CartSummary';
import EmptyCart from '../../components/cart/EmptyCard';
import LoadingState from '../../components/customer/common/LoadingState';
import PageContainer from '../../components/customer/common/PageContainer';
import PageTitle from '../../components/customer/common/PageTitle';
import { mockApiService } from '../../mock/mockApi';

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [insufficientItems, setInsufficientItems] = useState<{
    [key: string]: number;
  }>({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch cart items from API
    const fetchCart = async () => {
      try {
        setLoading(true);
        const products = await mockApiService.getProducts();
        const mockCart: CartItemType[] = [
          { product: products[0], quantity: 2, price: products[0].price },
          { product: products[1], quantity: 1, price: products[1].price },
        ];
        setCartItems(mockCart);

        // Check for inventory issues
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
    // 10% VAT
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
    return <LoadingState message="Loading your cart items..." />;
  }

  return (
    <PageContainer>
      <PageTitle title="Shopping Cart" icon={<ShoppingCartIcon />} />

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <CartItemList
            items={cartItems}
            onQuantityChange={handleQuantityChange}
            onRemoveItem={handleRemoveItem}
            insufficientItems={insufficientItems}
          />

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
              <CartSummary
                items={cartItems}
                onCheckout={handleProceedToCheckout}
                disabled={Object.keys(insufficientItems).length > 0}
              />
            </Grid2>
          </Grid2>
        </>
      )}
    </PageContainer>
  );
};

export default CartPage;
