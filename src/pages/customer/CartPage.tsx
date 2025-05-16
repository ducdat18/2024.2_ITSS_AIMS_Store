import React, { useState, useEffect } from 'react';
import { Button, Grid2 } from '@mui/material';
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
import { useNotification } from '../../components/customer/common/Notification';
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
} from '../../services/cart';

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [insufficientItems, setInsufficientItems] = useState<{
    [key: string]: number;
  }>({});
  const navigate = useNavigate();
  const { showSuccess, showError, NotificationComponent } = useNotification();

  useEffect(() => {
    const loadCartFromLocalStorage = () => {
      try {
        setLoading(true);
        const cart = getCart();
        const cartItemsData: CartItemType[] = cart.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.product.price,
        }));
        setCartItems(cartItemsData);
        const insufficientStock: { [key: string]: number } = {};
        cartItemsData.forEach((item) => {
          if (item.quantity > item.product.quantity) {
            insufficientStock[item.product.id] = item.product.quantity;
          }
        });
        setInsufficientItems(insufficientStock);

        setLoading(false);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        showError('Error loading your cart. Please try refreshing the page.');
        setLoading(false);
      }
    };

    loadCartFromLocalStorage();
  }, []);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      try {
        updateCartItemQuantity(productId, newQuantity);
        setCartItems(
          cartItems.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
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
        showSuccess('Cart updated successfully');
      } catch (error) {
        console.error('Error updating cart:', error);
        showError('Failed to update cart. Please try again.');
      }
    }
  };

  const handleRemoveItem = (productId: string) => {
    try {
      removeFromCart(productId);
      setCartItems(cartItems.filter((item) => item.product.id !== productId));
      const updatedInsufficient = { ...insufficientItems };
      delete updatedInsufficient[productId];
      setInsufficientItems(updatedInsufficient);

      showSuccess('Item removed from cart');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      showError('Failed to remove item. Please try again.');
    }
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
      showError(
        'Please update quantities for items with insufficient inventory before proceeding.'
      );
      return;
    }
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
      <NotificationComponent />
    </PageContainer>
  );
};

export default CartPage;
