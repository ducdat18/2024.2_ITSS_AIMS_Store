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
import {
  LocalShipping as LocalShippingIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Today as TodayIcon,
  Notes as NotesIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CreditCard as CreditCardIcon,
  Waves as WavesIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
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

// Custom styled component for the Stepper
const OceanStepper = styled(Stepper)(({ theme }) => ({
  '& .MuiStepLabel-root .Mui-active': {
    color: theme.palette.primary.light,
  },
  '& .MuiStepLabel-root .Mui-completed': {
    color: theme.palette.primary.light,
  },
  '& .MuiStepLabel-label': {
    color: theme.palette.text.secondary,
  },
  '& .MuiStepLabel-label.Mui-active': {
    color: theme.palette.primary.light,
    fontWeight: 'bold',
  },
  '& .MuiStepConnector-line': {
    borderColor: 'rgba(100, 255, 218, 0.2)',
  },
  '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
    borderColor: theme.palette.primary.light,
  },
  '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
    borderColor: theme.palette.primary.light,
  },
}));

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
          Preparing your checkout experience...
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
        minHeight: '80vh',
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
          <PaymentIcon /> Checkout
        </Typography>

        <OceanStepper activeStep={activeStep} sx={{ mb: 5 }} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  icon: index === 0 ? <LocalShippingIcon /> : <PaymentIcon />,
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </OceanStepper>

        {activeStep === 0 && (
          <Grid2 container spacing={4}>
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Paper
                sx={{
                  p: 4,
                  mb: 3,
                  backgroundImage:
                    'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
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
                      'radial-gradient(circle at 50% 0%, rgba(2, 136, 209, 0.08) 0%, transparent 70%)',
                    opacity: 0.8,
                    zIndex: 1,
                  },
                }}
                elevation={3}
              >
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      color: 'primary.light',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <LocalShippingIcon fontSize="small" />
                    Delivery Information
                  </Typography>
                  <Divider
                    sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                  />

                  <Grid2 container spacing={3}>
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
                        InputProps={{
                          startAdornment: (
                            <PersonIcon
                              sx={{ mr: 1, color: 'rgba(100, 255, 218, 0.5)' }}
                            />
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(1, 22, 39, 0.3)',
                            '&:hover': {
                              backgroundColor: 'rgba(1, 22, 39, 0.5)',
                            },
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
                        InputProps={{
                          startAdornment: (
                            <EmailIcon
                              sx={{ mr: 1, color: 'rgba(100, 255, 218, 0.5)' }}
                            />
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(1, 22, 39, 0.3)',
                            '&:hover': {
                              backgroundColor: 'rgba(1, 22, 39, 0.5)',
                            },
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
                        InputProps={{
                          startAdornment: (
                            <PhoneIcon
                              sx={{ mr: 1, color: 'rgba(100, 255, 218, 0.5)' }}
                            />
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(1, 22, 39, 0.3)',
                            '&:hover': {
                              backgroundColor: 'rgba(1, 22, 39, 0.5)',
                            },
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
                        InputProps={{
                          startAdornment: (
                            <LocationIcon
                              sx={{ mr: 1, color: 'rgba(100, 255, 218, 0.5)' }}
                            />
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(1, 22, 39, 0.3)',
                            '&:hover': {
                              backgroundColor: 'rgba(1, 22, 39, 0.5)',
                            },
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
                          '& .MuiMenuItem-root:hover': {
                            backgroundColor: 'rgba(2, 136, 209, 0.1)',
                          },
                          '& .MuiMenuItem-root.Mui-selected': {
                            backgroundColor: 'rgba(2, 136, 209, 0.2)',
                          },
                        }}
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
                        InputProps={{
                          startAdornment: (
                            <LocationIcon
                              sx={{
                                mr: 1,
                                mt: 1.5,
                                alignSelf: 'flex-start',
                                color: 'rgba(100, 255, 218, 0.5)',
                              }}
                            />
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(1, 22, 39, 0.3)',
                            '&:hover': {
                              backgroundColor: 'rgba(1, 22, 39, 0.5)',
                            },
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
                    </Grid2>

                    {isHanoi && (
                      <Grid2 size={{ xs: 12 }}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            backgroundColor: 'rgba(2, 136, 209, 0.05)',
                            border: '1px solid rgba(100, 255, 218, 0.1)',
                            mb: 2,
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={deliveryInfo.isRushDelivery}
                                onChange={handleCheckboxChange}
                                disabled={!canUseRushDelivery}
                                color="primary"
                                sx={{
                                  color: 'rgba(100, 255, 218, 0.5)',
                                  '&.Mui-checked': {
                                    color: 'primary.light',
                                  },
                                }}
                              />
                            }
                            label={
                              <Typography color="text.primary">
                                Rush Delivery (2-hour delivery timeframe)
                              </Typography>
                            }
                          />
                          {!canUseRushDelivery && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{
                                mt: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              <InfoIcon fontSize="small" color="warning" />
                              Some items in your cart are not eligible for rush
                              delivery (items over 3kg).
                            </Typography>
                          )}
                          {deliveryInfo.isRushDelivery && (
                            <Typography
                              variant="caption"
                              color="primary.light"
                              display="block"
                              sx={{
                                mt: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              <InfoIcon fontSize="small" />
                              Rush delivery is only available in Hanoi districts
                              for eligible items. You must select a delivery
                              time at least 2 hours from now, between 8 AM and 8
                              PM. An additional fee of 10,000 VND per eligible
                              item will be applied.
                            </Typography>
                          )}
                        </Box>
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
                            InputProps={{
                              startAdornment: (
                                <TodayIcon
                                  sx={{
                                    mr: 1,
                                    color: 'rgba(100, 255, 218, 0.5)',
                                  }}
                                />
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(1, 22, 39, 0.3)',
                                '&:hover': {
                                  backgroundColor: 'rgba(1, 22, 39, 0.5)',
                                },
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
                            InputProps={{
                              startAdornment: (
                                <NotesIcon
                                  sx={{
                                    mr: 1,
                                    mt: 1.5,
                                    alignSelf: 'flex-start',
                                    color: 'rgba(100, 255, 218, 0.5)',
                                  }}
                                />
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(1, 22, 39, 0.3)',
                                '&:hover': {
                                  backgroundColor: 'rgba(1, 22, 39, 0.5)',
                                },
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
                        </Grid2>
                      </>
                    )}
                  </Grid2>
                </Box>
              </Paper>

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
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  backgroundImage:
                    'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
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
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      color: 'primary.light',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <WavesIcon fontSize="small" />
                    Order Summary
                  </Typography>
                  <Divider
                    sx={{ mb: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                  />

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

                  <Divider
                    sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
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
                    <Typography color="text.secondary">
                      Delivery Fee:
                    </Typography>
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

                  <Divider
                    sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2,
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
                </Box>
              </Paper>
            </Grid2>
          </Grid2>
        )}

        {activeStep === 1 && (
          <Grid2 container spacing={4}>
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  mb: 3,
                  backgroundImage:
                    'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
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
                      'radial-gradient(circle at 50% 0%, rgba(2, 136, 209, 0.08) 0%, transparent 70%)',
                    opacity: 0.8,
                    zIndex: 1,
                  },
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      color: 'primary.light',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <LocalShippingIcon fontSize="small" />
                    Delivery Information
                  </Typography>
                  <Divider
                    sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                  />

                  <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Recipient Name
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        color="text.primary"
                      >
                        {deliveryInfo.recipientName}
                      </Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        color="text.primary"
                      >
                        {deliveryInfo.email}
                      </Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Phone Number
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        color="text.primary"
                      >
                        {deliveryInfo.phone}
                      </Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Province/City
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        color="text.primary"
                      >
                        {deliveryInfo.province}
                      </Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 12 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Address
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        color="text.primary"
                      >
                        {deliveryInfo.address}
                      </Typography>
                    </Grid2>
                    {deliveryInfo.isRushDelivery && (
                      <>
                        <Grid2 size={{ xs: 12 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Rush Delivery
                          </Typography>
                          <Typography
                            variant="body1"
                            gutterBottom
                            sx={{
                              color: 'primary.light',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: 'primary.light',
                                display: 'inline-block',
                              }}
                            />
                            Yes -{' '}
                            {new Date(
                              deliveryInfo.rushDeliveryTime || ''
                            ).toLocaleString()}
                          </Typography>
                        </Grid2>
                        {deliveryInfo.rushDeliveryInstructions && (
                          <Grid2 size={{ xs: 12 }}>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Delivery Instructions
                            </Typography>
                            <Typography
                              variant="body1"
                              gutterBottom
                              color="text.primary"
                            >
                              {deliveryInfo.rushDeliveryInstructions}
                            </Typography>
                          </Grid2>
                        )}
                      </>
                    )}
                  </Grid2>

                  <Box sx={{ mt: 4 }}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{
                        color: 'primary.light',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <PaymentIcon fontSize="small" />
                      Payment Method
                    </Typography>
                    <Divider
                      sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                    />

                    <FormControl component="fieldset">
                      <RadioGroup defaultValue="creditCard">
                        <FormControlLabel
                          value="creditCard"
                          control={
                            <Radio
                              color="primary"
                              sx={{
                                color: 'rgba(100, 255, 218, 0.5)',
                                '&.Mui-checked': {
                                  color: 'primary.light',
                                },
                              }}
                            />
                          }
                          label={
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <CreditCardIcon sx={{ color: 'primary.light' }} />
                              <Typography color="text.primary">
                                Credit Card / Debit Card (VNPay)
                              </Typography>
                            </Box>
                          }
                        />
                      </RadioGroup>
                    </FormControl>

                    <Alert
                      severity="info"
                      sx={{
                        mt: 2,
                        backgroundColor: 'rgba(2, 136, 209, 0.1)',
                        border: '1px solid rgba(100, 255, 218, 0.2)',
                        '& .MuiAlert-icon': {
                          color: 'primary.light',
                        },
                      }}
                      icon={<InfoIcon />}
                    >
                      You will be redirected to VNPay to complete your payment
                      securely.
                    </Alert>
                  </Box>
                </Box>
              </Paper>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 5 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  backgroundImage:
                    'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
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
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      color: 'primary.light',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <WavesIcon fontSize="small" />
                    Order Summary
                  </Typography>
                  <Divider
                    sx={{ mb: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                  />

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

                  <Divider
                    sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
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
                    <Typography color="text.secondary">
                      Delivery Fee:
                    </Typography>
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

                  <Divider
                    sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 3,
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

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handlePayment}
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
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      mt: 2,
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
                </Box>
              </Paper>
            </Grid2>
          </Grid2>
        )}
      </Container>
    </Box>
  );
};

export default CheckoutPage;
