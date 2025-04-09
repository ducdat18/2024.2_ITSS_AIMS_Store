import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Divider,
  Alert,
  CircularProgress,
  Grid2,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Warning as WarningIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Waves as WavesIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { mockApiService } from '../../mock/mockApi';

const CancelOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [selectedReasonOption, setSelectedReasonOption] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');

  // Fetch order details when component loads
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        if (!id) {
          setError('Order ID is missing');
          setLoading(false);
          return;
        }

        // Check if order exists and can be cancelled
        const order = await mockApiService.getOrderById('order-005');
        if (!order) {
          setError('Order not found');
          setLoading(false);
          return;
        }

        // Check if order is in a cancellable state
        if (order.status !== 'PENDING_PROCESSING') {
          setError(
            'This order cannot be cancelled as it is already being processed'
          );
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedReasonOption(event.target.value);

    if (event.target.value === 'other') {
      setCancellationReason('');
    } else {
      setCancellationReason(event.target.value);
    }
  };

  const handleCommentsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdditionalComments(event.target.value);

    if (selectedReasonOption === 'other') {
      setCancellationReason(event.target.value);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);
      setLoading(false);

      // After successful cancellation, redirect to confirmation after delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError('Failed to cancel order. Please try again later.');
      setLoading(false);
    }
  };

  if (loading && !success) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="h6" color="text.secondary">
          Processing your request...
        </Typography>
      </Box>
    );
  }

  if (success) {
    return (
      <Box
        sx={{
          py: { xs: 4, md: 5 },
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
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
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
          <Paper
            elevation={3}
            sx={{
              p: 5,
              textAlign: 'center',
              backgroundImage:
                'linear-gradient(135deg, rgba(0, 191, 165, 0.1) 0%, rgba(0, 142, 118, 0.1) 100%)',
              borderRadius: 2,
              border: '1px solid rgba(0, 191, 165, 0.2)',
            }}
          >
            <CheckCircleIcon
              color="success"
              sx={{
                fontSize: 80,
                mb: 2,
                filter: 'drop-shadow(0 0 8px rgba(0, 191, 165, 0.5))',
              }}
            />
            <Typography
              variant="h4"
              color="success.main"
              gutterBottom
              fontWeight="bold"
            >
              Order Cancelled Successfully
            </Typography>
            <Typography color="text.secondary">
              Your order #{id} has been cancelled. A refund will be initiated to
              your original payment method.
            </Typography>
            <Typography color="text.secondary">
              You will receive a confirmation email shortly.
            </Typography>
            <Typography color="text.secondary" variant="caption">
              Redirecting to home page...
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          py: { xs: 4, md: 5 },
          minHeight: '70vh',
          position: 'relative',
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
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
              borderRadius: 2,
              border: '1px solid rgba(100, 255, 218, 0.1)',
            }}
          >
            <Alert
              severity="error"
              icon={<WarningIcon />}
              sx={{
                mb: 3,
                backgroundColor: 'rgba(255, 82, 82, 0.1)',
                border: '1px solid rgba(255, 82, 82, 0.3)',
                '& .MuiAlert-icon': {
                  color: 'error.main',
                },
              }}
            >
              {error}
            </Alert>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(`/order/confirmation/${id}`)}
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
              Back to Order Details
            </Button>
          </Paper>
        </Container>
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
        maxWidth="md"
        sx={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            borderRadius: 2,
            border: '1px solid rgba(100, 255, 218, 0.1)',
          }}
        >
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <WavesIcon color="primary" />
            <Typography
              variant="h4"
              component="h1"
              color="primary.light"
              sx={{ fontWeight: 'bold' }}
            >
              Cancel Order
            </Typography>
          </Box>

          <Alert
            severity="warning"
            sx={{
              mb: 3,
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              border: '1px solid rgba(255, 152, 0, 0.3)',
              '& .MuiAlert-icon': {
                color: 'warning.main',
              },
            }}
          >
            You are about to cancel order #{id}. This action cannot be undone.
          </Alert>

          <Typography variant="h6" gutterBottom color="primary.light">
            Please select a reason for cancellation:
          </Typography>

          <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
            <RadioGroup
              value={selectedReasonOption}
              onChange={handleReasonChange}
            >
              <FormControlLabel
                value="Changed my mind"
                control={
                  <Radio
                    sx={{
                      color: 'rgba(100, 255, 218, 0.5)',
                      '&.Mui-checked': {
                        color: 'primary.light',
                      },
                    }}
                  />
                }
                label="Changed my mind"
              />
              <FormControlLabel
                value="Found a better price elsewhere"
                control={
                  <Radio
                    sx={{
                      color: 'rgba(100, 255, 218, 0.5)',
                      '&.Mui-checked': {
                        color: 'primary.light',
                      },
                    }}
                  />
                }
                label="Found a better price elsewhere"
              />
              <FormControlLabel
                value="Ordered by mistake"
                control={
                  <Radio
                    sx={{
                      color: 'rgba(100, 255, 218, 0.5)',
                      '&.Mui-checked': {
                        color: 'primary.light',
                      },
                    }}
                  />
                }
                label="Ordered by mistake"
              />
              <FormControlLabel
                value="Delivery time is too long"
                control={
                  <Radio
                    sx={{
                      color: 'rgba(100, 255, 218, 0.5)',
                      '&.Mui-checked': {
                        color: 'primary.light',
                      },
                    }}
                  />
                }
                label="Delivery time is too long"
              />
              <FormControlLabel
                value="other"
                control={
                  <Radio
                    sx={{
                      color: 'rgba(100, 255, 218, 0.5)',
                      '&.Mui-checked': {
                        color: 'primary.light',
                      },
                    }}
                  />
                }
                label="Other reason"
              />
            </RadioGroup>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Additional Comments"
            value={additionalComments}
            onChange={handleCommentsChange}
            placeholder={
              selectedReasonOption === 'other'
                ? 'Please specify your reason for cancellation'
                : 'Any additional comments (optional)'
            }
            required={selectedReasonOption === 'other'}
            sx={{
              mb: 3,
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

          <Typography variant="body2" color="text.secondary">
            After your order is cancelled, a full refund will be processed back
            to your original payment method. The refund may take 3-5 business
            days to appear in your account, depending on your payment provider.
          </Typography>

          <Divider sx={{ my: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

          <Grid2 container spacing={2} justifyContent="center">
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={() => navigate(`/order/confirmation/${id}`)}
                startIcon={<ArrowBackIcon />}
                sx={{
                  py: 1.2,
                  borderColor: 'rgba(100, 255, 218, 0.3)',
                  '&:hover': {
                    borderColor: 'rgba(100, 255, 218, 0.5)',
                    backgroundColor: 'rgba(100, 255, 218, 0.05)',
                  },
                }}
              >
                Go Back
              </Button>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={handleCancelOrder}
                disabled={
                  selectedReasonOption === 'other' && !cancellationReason
                }
                startIcon={<CancelIcon />}
                endIcon={<SendIcon />}
                sx={{
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
                Confirm Cancellation
              </Button>
            </Grid2>
          </Grid2>
        </Paper>
      </Container>
    </Box>
  );
};

export default CancelOrderPage;
