import { CartItemType } from '../components/cart/CardItem';
import { DeliveryInfo, Order, OrderItem, OrderStatus } from '../types';
import { mockApiService } from '../mock/mockApi';

// Calculate delivery fee based on location, weight, and order value
export const calculateDeliveryFee = (
  cartItems: CartItemType[],
  province: string
): { deliveryFee: number; rushDeliveryFee: number; canUseRushDelivery: boolean } => {
  const subtotal = calculateSubtotal(cartItems);
  const isHanoi = province === 'Hanoi';
  const isHCMC = province === 'Ho Chi Minh City';

  // Find the heaviest item weight
  const heaviestItemWeight = cartItems.reduce(
    (maxWeight, item) => Math.max(maxWeight, item.product.weight),
    0
  );

  // Check if any items are eligible for rush delivery (< 3kg and in Hanoi)
  const rushEligibleItems = cartItems.filter(item => item.product.weight < 3);
  const canUseRushDelivery = isHanoi && rushEligibleItems.length > 0;
  
  let fee = 0;
  let rushFee = 0;

  // Calculate normal delivery fee
  if (subtotal >= 1000000) {
    // Free shipping for orders over 1,000,000 VND
    fee = 0;
  } else {
    const isHanoiOrHCMC = isHanoi || isHCMC;

    if (isHanoiOrHCMC) {
      // For Hanoi or HCM City: 22,000 VND for first 3kg
      if (heaviestItemWeight <= 3) {
        fee = 22000;
      } else {
        // Additional 2,500 VND for every 0.5kg over 3kg
        const additionalWeight = heaviestItemWeight - 3;
        const additionalFee = Math.ceil(additionalWeight / 0.5) * 2500;
        fee = 22000 + additionalFee;
      }
    } else {
      // For elsewhere: 30,000 VND for first 0.5kg
      if (heaviestItemWeight <= 0.5) {
        fee = 30000;
      } else {
        // Additional 2,500 VND for every 0.5kg over 0.5kg
        const additionalWeight = heaviestItemWeight - 0.5;
        const additionalFee = Math.ceil(additionalWeight / 0.5) * 2500;
        fee = 30000 + additionalFee;
      }
    }

    // Cap the fee at 25,000 VND for orders over 100,000 VND
    if (subtotal > 100000 && fee > 25000) {
      fee = 25000;
    }
  }
  
  return { deliveryFee: fee, rushDeliveryFee: rushFee, canUseRushDelivery };
};

// Calculate rush delivery fee
export const calculateRushDeliveryFee = (
  cartItems: CartItemType[],
  isRushDelivery: boolean,
  isHanoi: boolean
): number => {
  if (!isRushDelivery || !isHanoi) {
    return 0;
  }
  
  // Additional 10,000 VND per rush delivery item
  const rushItems = cartItems.filter(item => item.product.weight < 3);
  return rushItems.length * 10000;
};

// Calculate subtotal of all items
export const calculateSubtotal = (cartItems: CartItemType[]): number => {
  return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// Calculate VAT (10%)
export const calculateVAT = (cartItems: CartItemType[]): number => {
  return calculateSubtotal(cartItems) * 0.1;
};

// Calculate total amount
export const calculateTotal = (
  cartItems: CartItemType[],
  deliveryFee: number,
  rushDeliveryFee: number
): number => {
  return calculateSubtotal(cartItems) + calculateVAT(cartItems) + deliveryFee + rushDeliveryFee;
};

// Process the order and payment
export const processOrder = async (
  cartItems: CartItemType[],
  deliveryInfo: DeliveryInfo,
  deliveryFee: number, 
  rushDeliveryFee: number,
  paymentMethod: string
): Promise<Order> => {
  try {
    const subtotal = calculateSubtotal(cartItems);
    const vat = calculateVAT(cartItems);
    const totalAmount = subtotal + vat + deliveryFee + rushDeliveryFee;
    
    // Convert CartItemType to OrderItem
    const orderItems: OrderItem[] = cartItems.map(item => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price
    }));
    
    // Process payment
    const paymentResponse = await mockApiService.processPayment(totalAmount);
    
    if (!paymentResponse.success) {
      throw new Error('Payment failed');
    }
    
    // Create order object
    const order: Order = {
      id: `order-${Date.now()}`,
      items: orderItems,
      deliveryInfo: deliveryInfo,
      status: OrderStatus.PENDING_PROCESSING,
      subtotal: subtotal,
      vat: vat,
      deliveryFee: deliveryFee + rushDeliveryFee, // Combine delivery fees
      totalAmount: totalAmount,
      transactionId: paymentResponse.transactionId || `tr-${Date.now()}`,
      transactionContent: `Payment for order #${`order-${Date.now()}`} via ${paymentMethod}`,
      transactionDatetime: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    return order;
  } catch (error) {
    console.error('Order processing failed:', error);
    throw error;
  }
};

// Function to validate delivery form
export const validateDeliveryForm = (deliveryInfo: DeliveryInfo): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  if (!deliveryInfo.recipientName.trim()) {
    errors.recipientName = 'Recipient name is required';
  }

  if (!deliveryInfo.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(deliveryInfo.email)) {
    errors.email = 'Email is invalid';
  }

  if (!deliveryInfo.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^\d{10,11}$/.test(deliveryInfo.phone.replace(/\D/g, ''))) {
    errors.phone = 'Phone number is invalid';
  }

  if (!deliveryInfo.province) {
    errors.province = 'Province is required';
  }

  if (!deliveryInfo.address.trim()) {
    errors.address = 'Address is required';
  }

  if (deliveryInfo.isRushDelivery) {
    if (!deliveryInfo.rushDeliveryTime) {
      errors.rushDeliveryTime = 'Delivery time is required for rush delivery';
    } else {
      // Check if delivery time is valid
      const deliveryTime = new Date(deliveryInfo.rushDeliveryTime).getTime();
      const now = new Date().getTime();

      // Must be at least 2 hours in the future (2 hours = 7,200,000 milliseconds)
      const twoHoursInMs = 2 * 60 * 60 * 1000;
      const minAllowedTime = now + twoHoursInMs;

      // Check business hours (8am to 8pm)
      const deliveryDate = new Date(deliveryInfo.rushDeliveryTime);
      const hour = deliveryDate.getHours();
      const isBusinessHours = hour >= 8 && hour < 20;

      if (deliveryTime < minAllowedTime) {
        errors.rushDeliveryTime = 'Delivery time must be at least 2 hours from now';
      } else if (!isBusinessHours) {
        errors.rushDeliveryTime = 'Delivery time must be between 8 AM and 8 PM';
      }
    }
  }

  return errors;
};