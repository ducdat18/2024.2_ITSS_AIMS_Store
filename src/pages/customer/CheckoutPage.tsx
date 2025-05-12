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
import { mockApiService } from '../../mock/mockApi';
import { formatCurrency } from '../../utils/formatters';

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
  const [activeStep, setActiveStep] = useState(0);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [deliveryInfo, setDeliveryInfo] = useState({
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
  // Import PaymentMethodType from the component
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>('creditCard');

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const products = await mockApiService.getProducts();
        const mockCart: CartItemType[] = [
          { product: products[0], quantity: 2, price: products[0].price },
          { product: products[1], quantity: 1, price: products[1].price },
        ];
        setCartItems(mockCart);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

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
    setIsHanoi(deliveryInfo.province === 'Hanoi');
    if (!isHanoi && deliveryInfo.isRushDelivery) {
      setDeliveryInfo((prev) => ({ ...prev, isRushDelivery: false }));
    }
  }, [deliveryInfo.province, isHanoi]);

  // Calculate delivery fee
  useEffect(() => {
    if (deliveryInfo.province) {
      calculateDeliveryFee();
    }
  }, [deliveryInfo.province, deliveryInfo.isRushDelivery, cartItems]);

  // Calculate delivery fee based on location and weight
  const calculateDeliveryFee = () => {
    const subtotal = calculateSubtotal();

    // Find the heaviest item weight
    const heaviestItemWeight = cartItems.reduce(
      (maxWeight, item) => Math.max(maxWeight, item.product.weight),
      0
    );

    let fee = 0;
    let rushFee = 0;

    // Calculate normal delivery fee
    if (subtotal >= 100000) {
      // Free shipping for orders over 100,000 VND (up to 25,000 VND)
      fee = 0;
    } else {
      const isHanoiOrHCMC =
        deliveryInfo.province === 'Hanoi' ||
        deliveryInfo.province === 'Ho Chi Minh City';

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

    // Calculate rush delivery fee if applicable
    if (deliveryInfo.isRushDelivery && isHanoi) {
      // Additional 10,000 VND per rush delivery item
      const rushItems = cartItems.filter((item) => item.product.weight < 3);
      rushFee = rushItems.length * 10000;
    }

    setDeliveryFee(fee);
    setRushDeliveryFee(rushFee);
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Calculate VAT (10%)
  const calculateVAT = () => {
    return calculateSubtotal() * 0.1;
  };

  // Validate form before proceeding
  const validateForm = () => {
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
          errors.rushDeliveryTime =
            'Delivery time must be at least 2 hours from now';
        } else if (!isBusinessHours) {
          errors.rushDeliveryTime =
            'Delivery time must be between 8 AM and 8 PM';
        }
      }
    }

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

  // Simulate payment process
  const handlePayment = async () => {
    try {
      setLoading(true);
      const totalAmount =
        calculateSubtotal() + calculateVAT() + deliveryFee + rushDeliveryFee;

      // Simulate payment with mock API
      const response = await mockApiService.processPayment(totalAmount);

      if (response.success) {
        // Generate order ID
        const orderId = `order-${Date.now()}`;
        navigate(`/order/confirmation/${orderId}`);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check if user can select rush delivery (Hanoi address and eligible products)
  const canUseRushDelivery =
    isHanoi && cartItems.some((item) => item.product.weight < 3);

  if (loading) {
    return <LoadingState message="Preparing your checkout experience..." />;
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
                  {formatCurrency(calculateSubtotal())}
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
                  {formatCurrency(calculateVAT())}
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
                    calculateSubtotal() +
                      calculateVAT() +
                      deliveryFee +
                      rushDeliveryFee
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
                subtotal={calculateSubtotal()}
                vat={calculateVAT()}
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
                  {formatCurrency(calculateSubtotal())}
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
                  {formatCurrency(calculateVAT())}
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
                    calculateSubtotal() +
                      calculateVAT() +
                      deliveryFee +
                      rushDeliveryFee
                  )}
                </Typography>
              </Box>
            </SectionContainer>
          </Grid2>
        </Grid2>
      )}
    </PageContainer>
  );
};

export default CheckoutPage;
