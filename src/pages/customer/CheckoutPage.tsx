import React, { useState, useEffect } from 'react';
import { Box, Grid2, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { CartItemType } from '../../components/cart/CardItem';
import CheckoutStepper from '../../components/checkout/CheckoutStepper';
import AddressInfo from '../../components/checkout/DeliveryForm/AddressInfo';
import RecipientInfo from '../../components/checkout/DeliveryForm/RecipentInfo';
import RushDeliveryOptions from '../../components/checkout/DeliveryForm/RushDeliveryOptions';
import OrderReview from '../../components/checkout/OrderReview';
import PaymentMethod, {
  PaymentMethodType,
} from '../../components/checkout/PaymentMethod';
import LoadingState from '../../components/customer/common/LoadingState';
import PageContainer from '../../components/customer/common/PageContainer';
import PageTitle from '../../components/customer/common/PageTitle';
import SectionContainer from '../../components/customer/common/SectionContainer';
import { formatCurrency } from '../../utils/formatters';
import { useNotification } from '../../components/customer/common/Notification';
import { getCart } from '../../services/cart';
import {
  calculateDeliveryFee,
  calculateRushDeliveryFee,
  validateDeliveryForm,
  processOrder,
  calculateSubtotal,
  calculateVAT,
  calculateTotal,
} from '../../services/checkout';
import { DeliveryInfo } from '../../types';

// Constants
const vietnamProvinces = [
  'Hanoi',
  'Ho Chi Minh City',
  'Da Nang',
  'Hai Phong',
  'Can Tho',
  // More provinces would be included here
];

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, NotificationComponent } = useNotification();

  const [activeStep, setActiveStep] = useState(0);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    recipientName: '',
    email: '',
    phone: '',
    province: '',
    address: '',
    isRushDelivery: false,
    rushDeliveryTime: '',
    rushDeliveryInstructions: '',
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [rushDeliveryFee, setRushDeliveryFee] = useState(0);
  const [isHanoi, setIsHanoi] = useState(false);
  const [canUseRushDelivery, setCanUseRushDelivery] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>('creditCard');

  // Load cart items from localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        setLoading(true);
        const cart = getCart();

        if (cart.items.length === 0) {
          // Redirect to cart page if cart is empty
          showError('Your cart is empty. Please add items before checkout.');
          navigate('/cart');
          return;
        }

        // Convert from Cart structure to CartItemType[]
        const cartItemsData: CartItemType[] = cart.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.product.price,
        }));

        setCartItems(cartItemsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading cart:', error);
        showError('Failed to load your cart. Please try again later.');
        setLoading(false);
      }
    };

    loadCart();
  }, [navigate, showError]);

  // Handle delivery info changes
  const handleRecipientInfoChange = (
    field: keyof typeof deliveryInfo,
    value: string | boolean
  ) => {
    setDeliveryInfo((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field if it exists
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Check if province is Hanoi for rush delivery option
  useEffect(() => {
    const isHanoiProvince = deliveryInfo.province === 'Hanoi';
    setIsHanoi(isHanoiProvince);

    if (!isHanoiProvince && deliveryInfo.isRushDelivery) {
      setDeliveryInfo((prev) => ({ ...prev, isRushDelivery: false }));
    }
  }, [deliveryInfo.province]);

  // Calculate delivery fee
  useEffect(() => {
    if (deliveryInfo.province && cartItems.length > 0) {
      // Calculate delivery fee and rush delivery eligibility
      const { deliveryFee: fee, canUseRushDelivery: canUseRush } =
        calculateDeliveryFee(cartItems, deliveryInfo.province);

      setDeliveryFee(fee);
      setCanUseRushDelivery(canUseRush);

      // Calculate rush delivery fee if applicable
      const rushFee = calculateRushDeliveryFee(
        cartItems,
        deliveryInfo.isRushDelivery,
        isHanoi
      );

      setRushDeliveryFee(rushFee);
    }
  }, [deliveryInfo.province, deliveryInfo.isRushDelivery, cartItems, isHanoi]);

  // Validate form before proceeding
  const validateForm = () => {
    const errors = validateDeliveryForm(deliveryInfo);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle next step in checkout process
  const handleNext = () => {
    if (activeStep === 0) {
      if (validateForm()) {
        setActiveStep(1);
      }
    } else if (activeStep === 1) {
      // Process payment
      handlePayment();
    }
  };

  // Handle back button click
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Process payment and create order
  const handlePayment = async () => {
    try {
      setProcessingPayment(true);

      const order = await processOrder(
        cartItems,
        deliveryInfo,
        deliveryFee,
        rushDeliveryFee,
        paymentMethod
      );

      // Navigate to order confirmation page with order data
      navigate(`/order/confirmation/${order.id}`, { state: { order } });
    } catch (error) {
      console.error('Payment failed:', error);
      showError(
        'Payment processing failed. Please try again or use a different payment method.'
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading || processingPayment) {
    return (
      <LoadingState
        message={
          processingPayment
            ? 'Processing your payment...'
            : 'Preparing your checkout experience...'
        }
      />
    );
  }

  return (
    <PageContainer>
      <PageTitle title="Checkout" icon={<PaymentIcon />} />

      <CheckoutStepper activeStep={activeStep} />

      {activeStep === 0 && (
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <SectionContainer title="Delivery Information">
              {/* Recipient Info Form */}
              <RecipientInfo
                data={{
                  recipientName: deliveryInfo.recipientName,
                  email: deliveryInfo.email,
                  phone: deliveryInfo.phone,
                }}
                onChange={handleRecipientInfoChange}
                errors={formErrors}
              />

              {/* Address Info Form */}
              <Box sx={{ mt: 4 }}>
                <AddressInfo
                  data={{
                    province: deliveryInfo.province,
                    address: deliveryInfo.address,
                  }}
                  onChange={handleRecipientInfoChange}
                  errors={formErrors}
                  provinces={vietnamProvinces}
                />
              </Box>

              {/* Rush Delivery Options */}
              <Box sx={{ mt: 4 }}>
                <RushDeliveryOptions
                  data={{
                    isRushDelivery: deliveryInfo.isRushDelivery,
                    rushDeliveryTime: deliveryInfo.rushDeliveryTime,
                    rushDeliveryInstructions:
                      deliveryInfo.rushDeliveryInstructions,
                  }}
                  onChange={handleRecipientInfoChange}
                  errors={formErrors}
                  isEnabled={isHanoi}
                  canUseRushDelivery={canUseRushDelivery}
                />
              </Box>
            </SectionContainer>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/cart')}
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
                Back to Cart
              </Button>
              <Button
                variant="contained"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                onClick={handleNext}
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
                Continue to Payment
              </Button>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 5 }}>
            <SectionContainer title="Order Summary">
              {cartItems.map((item) => (
                <Box
                  key={item.product.id}
                  sx={{ display: 'flex', mb: 2, py: 1 }}
                >
                  <Box sx={{ mr: 2, textAlign: 'center', minWidth: 40 }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.quantity}x
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" color="text.primary">
                      {item.product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.product.category}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary.light">
                      {formatCurrency(item.price * item.quantity)}
                    </Typography>
                  </Box>
                </Box>
              ))}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                  mt: 3,
                }}
              >
                <Typography color="text.secondary">
                  Subtotal (excl. VAT):
                </Typography>
                <Typography color="text.primary">
                  {formatCurrency(calculateSubtotal(cartItems))}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Typography color="text.secondary">VAT (10%):</Typography>
                <Typography color="text.primary">
                  {formatCurrency(calculateVAT(cartItems))}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Typography color="text.secondary">Delivery Fee:</Typography>
                <Typography color="text.primary">
                  {formatCurrency(deliveryFee)}
                </Typography>
              </Box>

              {deliveryInfo.isRushDelivery && rushDeliveryFee > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography color="text.secondary">
                    Rush Delivery Fee:
                  </Typography>
                  <Typography color="text.primary">
                    {formatCurrency(rushDeliveryFee)}
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 3,
                  mt: 2,
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
                  {formatCurrency(
                    calculateTotal(cartItems, deliveryFee, rushDeliveryFee)
                  )}
                </Typography>
              </Box>
            </SectionContainer>
          </Grid2>
        </Grid2>
      )}

      {activeStep === 1 && (
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <SectionContainer title="Review Order">
              <OrderReview
                deliveryInfo={deliveryInfo}
                items={cartItems}
                subtotal={calculateSubtotal(cartItems)}
                vat={calculateVAT(cartItems)}
                deliveryFee={deliveryFee}
                rushDeliveryFee={rushDeliveryFee}
              />

              <Box sx={{ mt: 4 }}>
                <PaymentMethod
                  value={paymentMethod}
                  onChange={(value) => setPaymentMethod(value)}
                />
              </Box>
            </SectionContainer>

            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleBack}
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
                Back to Delivery Info
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                startIcon={<PaymentIcon />}
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
                Complete Payment
              </Button>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 5 }}>
            <SectionContainer title="Order Summary">
              {cartItems.map((item) => (
                <Box
                  key={item.product.id}
                  sx={{ display: 'flex', mb: 2, py: 1 }}
                >
                  <Box sx={{ mr: 2, textAlign: 'center', minWidth: 40 }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.quantity}x
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" color="text.primary">
                      {item.product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.product.category}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary.light">
                      {formatCurrency(item.price * item.quantity)}
                    </Typography>
                  </Box>
                </Box>
              ))}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                  mt: 3,
                }}
              >
                <Typography color="text.secondary">
                  Subtotal (excl. VAT):
                </Typography>
                <Typography color="text.primary">
                  {formatCurrency(calculateSubtotal(cartItems))}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Typography color="text.secondary">VAT (10%):</Typography>
                <Typography color="text.primary">
                  {formatCurrency(calculateVAT(cartItems))}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Typography color="text.secondary">Delivery Fee:</Typography>
                <Typography color="text.primary">
                  {formatCurrency(deliveryFee)}
                </Typography>
              </Box>

              {deliveryInfo.isRushDelivery && rushDeliveryFee > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography color="text.secondary">
                    Rush Delivery Fee:
                  </Typography>
                  <Typography color="text.primary">
                    {formatCurrency(rushDeliveryFee)}
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 3,
                  mt: 2,
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
                  {formatCurrency(
                    calculateTotal(cartItems, deliveryFee, rushDeliveryFee)
                  )}
                </Typography>
              </Box>
            </SectionContainer>
          </Grid2>
        </Grid2>
      )}
      <NotificationComponent />
    </PageContainer>
  );
};

export default CheckoutPage;
