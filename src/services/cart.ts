import { Product, Cart, CartItem } from '../types';

export const getCart = (): Cart => {
  try {
    const cartData = localStorage.getItem('cart');
    
    if (cartData) {
      return JSON.parse(cartData);
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  
  return {
    items: [],
    totalPriceExcludingVAT: 0
  };
};

export const saveCart = (cart: Cart): void => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = (product: Product, quantity: number = 1): void => {
  try {
    const cart = getCart();
    const existingItemIndex = cart.items.findIndex(
      item => item.product.id === product.id
    );
    
    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      const newItem: CartItem = {
        product: product,
        quantity: quantity
      };
      cart.items.push(newItem);
    }
    
    cart.totalPriceExcludingVAT = calculateCartTotal(cart);
    saveCart(cart);
    
    console.log('Added to cart:', { product, quantity });
    console.log('Updated cart:', cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

export const updateCartItemQuantity = (productId: string, quantity: number): void => {
  try {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const cart = getCart();
    const itemIndex = cart.items.findIndex(item => item.product.id === productId);
    
    if (itemIndex !== -1) {
      cart.items[itemIndex].quantity = quantity;
      cart.totalPriceExcludingVAT = calculateCartTotal(cart);
      saveCart(cart);
    }
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
  }
};

export const removeFromCart = (productId: string): void => {
  try {
    const cart = getCart();
    cart.items = cart.items.filter(item => item.product.id !== productId);
    cart.totalPriceExcludingVAT = calculateCartTotal(cart);
    saveCart(cart);
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
};

export const clearCart = (): void => {
  try {
    const emptyCart: Cart = {
      items: [],
      totalPriceExcludingVAT: 0
    };
    saveCart(emptyCart);
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};

const calculateCartTotal = (cart: Cart): number => {
  return cart.items.reduce(
    (total, item) => total + (item.product.price * item.quantity), 
    0
  );
};

export const getCartItemCount = (): number => {
  const cart = getCart();
  return cart.items.reduce((count, item) => count + item.quantity, 0);
};

export const isInCart = (productId: string): boolean => {
  const cart = getCart();
  return cart.items.some(item => item.product.id === productId);
};