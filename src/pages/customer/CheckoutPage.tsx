// src/pages/customer/CheckoutPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Paper,
  Divider,
  MenuItem,
  RadioGroup,
  Radio,
  FormControl,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Grid2,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { mockApiService } from '../../mock/mockApi';

// Define delivery information interface
interface DeliveryInfo {
  recipientName: string;
  email: string;
  phone: string;
  province: string;
  address: string;
  isRushDelivery: boolean;
  rushDeliveryTime?: string;
  rushDeliveryInstructions?: string;
}

// Interface for cart item
interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    recipientName: '',
    email: '',
    phone: '',
    province: '',
    address: '',
    isRushDelivery: false,
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [rushDeliveryFee, setRushDeliveryFee] = useState(0);
  const [isHanoi, setIsHanoi] = useState(false);

  // Fetch cart items from mock API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const products = await mockApiService.getProducts();
        const mockCart: CartItem[] = [
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

  // Calculate delivery fee whenever province or rush delivery changes
  useEffect(() => {
    if (deliveryInfo.province) {
      calculateDeliveryFee();
    }
  }, [deliveryInfo.province, deliveryInfo.isRushDelivery, cartItems]);

  // Check if province is Hanoi for rush delivery option
  useEffect(() => {
    setIsHanoi(deliveryInfo.province === 'Hanoi');
    if (!isHanoi && deliveryInfo.isRushDelivery) {
      setDeliveryInfo((prev) => ({ ...prev, isRushDelivery: false }));
    }
  }, [deliveryInfo.province, isHanoi]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle checkbox change for rush delivery
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryInfo((prev) => ({ ...prev, isRushDelivery: e.target.checked }));
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Calculate VAT (10%)
  const calculateVAT = () => {
    return calculateSubtotal() * 0.1;
  };

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

        console.log('Current time:', new Date().toLocaleString());
        console.log('Delivery time:', deliveryDate.toLocaleString());
        console.log(
          'Min allowed time:',
          new Date(minAllowedTime).toLocaleString()
        );
        console.log(
          'Is at least 2 hours ahead?',
          deliveryTime >= minAllowedTime
        );

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

  const steps = ['Delivery Information', 'Review & Payment'];

  if (loading) {
    return <Box sx={{ p: 5, textAlign: 'center' }}>Loading...</Box>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        color="secondary.main"
      >
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Delivery Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Recipient Name"
                    name="recipientName"
                    value={deliveryInfo.recipientName}
                    onChange={handleInputChange}
                    error={!!formErrors.recipientName}
                    helperText={formErrors.recipientName}
                    required
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={deliveryInfo.email}
                    onChange={handleInputChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    required
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={deliveryInfo.phone}
                    onChange={handleInputChange}
                    error={!!formErrors.phone}
                    helperText={formErrors.phone}
                    required
                  />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                  <TextField
                    select
                    fullWidth
                    label="Province/City"
                    name="province"
                    value={deliveryInfo.province}
                    onChange={handleInputChange}
                    error={!!formErrors.province}
                    helperText={formErrors.province}
                    required
                  >
                    {vietnamProvinces.map((province) => (
                      <MenuItem key={province} value={province}>
                        {province}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={deliveryInfo.address}
                    onChange={handleInputChange}
                    error={!!formErrors.address}
                    helperText={formErrors.address}
                    required
                    multiline
                    rows={2}
                  />
                </Grid2>

                {isHanoi && (
                  <Grid2 size={{ xs: 12 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={deliveryInfo.isRushDelivery}
                          onChange={handleCheckboxChange}
                          disabled={!canUseRushDelivery}
                          color="primary"
                        />
                      }
                      label="Rush Delivery (2-hour delivery timeframe)"
                    />
                    {!canUseRushDelivery && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Some items in your cart are not eligible for rush
                        delivery (items over 3kg).
                      </Typography>
                    )}
                    {deliveryInfo.isRushDelivery && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Rush delivery is only available in Hanoi districts for
                        eligible items. You must select a delivery time at least
                        2 hours from now, between 8 AM and 8 PM. An additional
                        fee of 10,000 VND per eligible item will be applied.
                      </Typography>
                    )}
                  </Grid2>
                )}

                {deliveryInfo.isRushDelivery && (
                  <>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Preferred Delivery Time"
                        name="rushDeliveryTime"
                        type="datetime-local"
                        value={deliveryInfo.rushDeliveryTime}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        error={!!formErrors.rushDeliveryTime}
                        helperText={
                          formErrors.rushDeliveryTime ||
                          'Select a time at least 2 hours from now (8 AM - 8 PM)'
                        }
                        required
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Delivery Instructions"
                        name="rushDeliveryInstructions"
                        value={deliveryInfo.rushDeliveryInstructions || ''}
                        onChange={handleInputChange}
                        placeholder="Special instructions for delivery"
                        multiline
                        rows={2}
                      />
                    </Grid2>
                  </>
                )}
              </Grid2>
            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 3, mb: 3, bgcolor: '#f8f9ff' }}>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

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
                    <Typography variant="subtitle2">
                      {item.product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.product.category}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">
                      {formatCurrency(item.price * item.quantity)}
                    </Typography>
                  </Box>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography>Subtotal (excl. VAT):</Typography>
                <Typography>{formatCurrency(calculateSubtotal())}</Typography>
              </Box>

              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography>VAT (10%):</Typography>
                <Typography>{formatCurrency(calculateVAT())}</Typography>
              </Box>

              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography>Delivery Fee:</Typography>
                <Typography>{formatCurrency(deliveryFee)}</Typography>
              </Box>

              {deliveryInfo.isRushDelivery && rushDeliveryFee > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography>Rush Delivery Fee:</Typography>
                  <Typography>{formatCurrency(rushDeliveryFee)}</Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}
              >
                <Typography variant="h6" color="primary.dark">
                  Total:
                </Typography>
                <Typography variant="h6" color="primary.dark">
                  {formatCurrency(
                    calculateSubtotal() +
                      calculateVAT() +
                      deliveryFee +
                      rushDeliveryFee
                  )}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleNext}
              >
                Continue to Payment
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                size="large"
                onClick={() => navigate('/cart')}
                sx={{ mt: 1 }}
              >
                Back to Cart
              </Button>
            </Paper>
          </Grid2>
        </Grid2>
      )}

      {activeStep === 1 && (
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Delivery Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Recipient Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {deliveryInfo.recipientName}
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {deliveryInfo.email}
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {deliveryInfo.phone}
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Province/City
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {deliveryInfo.province}
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {deliveryInfo.address}
                  </Typography>
                </Grid2>
                {deliveryInfo.isRushDelivery && (
                  <>
                    <Grid2 size={{ xs: 12 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Rush Delivery
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Yes -{' '}
                        {new Date(
                          deliveryInfo.rushDeliveryTime || ''
                        ).toLocaleString()}
                      </Typography>
                    </Grid2>
                    {deliveryInfo.rushDeliveryInstructions && (
                      <Grid2 size={{ xs: 12 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Delivery Instructions
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {deliveryInfo.rushDeliveryInstructions}
                        </Typography>
                      </Grid2>
                    )}
                  </>
                )}
              </Grid2>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Payment Method
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <FormControl component="fieldset">
                  <RadioGroup defaultValue="creditCard">
                    <FormControlLabel
                      value="creditCard"
                      control={<Radio color="primary" />}
                      label="Credit Card / Debit Card (VNPay)"
                    />
                  </RadioGroup>
                </FormControl>

                <Alert severity="info" sx={{ mt: 2 }}>
                  You will be redirected to VNPay to complete your payment
                  securely.
                </Alert>
              </Box>
            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 3, mb: 3, bgcolor: '#f8f9ff' }}>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

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
                    <Typography variant="subtitle2">
                      {item.product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.product.category}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">
                      {formatCurrency(item.price * item.quantity)}
                    </Typography>
                  </Box>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography>Subtotal (excl. VAT):</Typography>
                <Typography>{formatCurrency(calculateSubtotal())}</Typography>
              </Box>

              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography>VAT (10%):</Typography>
                <Typography>{formatCurrency(calculateVAT())}</Typography>
              </Box>

              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography>Delivery Fee:</Typography>
                <Typography>{formatCurrency(deliveryFee)}</Typography>
              </Box>

              {deliveryInfo.isRushDelivery && rushDeliveryFee > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography>Rush Delivery Fee:</Typography>
                  <Typography>{formatCurrency(rushDeliveryFee)}</Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}
              >
                <Typography variant="h6" color="primary.dark">
                  Total:
                </Typography>
                <Typography variant="h6" color="primary.dark">
                  {formatCurrency(
                    calculateSubtotal() +
                      calculateVAT() +
                      deliveryFee +
                      rushDeliveryFee
                  )}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handlePayment}
              >
                Complete Payment
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                size="large"
                onClick={handleBack}
                sx={{ mt: 1 }}
              >
                Back
              </Button>
            </Paper>
          </Grid2>
        </Grid2>
      )}
    </Container>
  );
};

export default CheckoutPage;
