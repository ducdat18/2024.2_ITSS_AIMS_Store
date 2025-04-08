// src/pages/customer/OrderConfirmationPage.tsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Divider,
  Grid2,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircleOutline as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  Cancel as CancelIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/formatters';
import { OrderStatus, ProductCategory } from '../../types';

const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Current timestamp for dates
  const currentTime = new Date().toISOString();
  const tomorrowTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  // Use orderId from URL or default
  const orderId = id || 'order-123456789';

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
        <Box
          sx={{
            textAlign: 'center',
            mb: 4,
            p: 4,
            borderRadius: 2,
            backgroundImage:
              'linear-gradient(135deg, rgba(0, 191, 165, 0.1) 0%, rgba(0, 142, 118, 0.1) 100%)',
            border: '1px solid rgba(0, 191, 165, 0.2)',
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
                'radial-gradient(circle at 50% 50%, rgba(0, 191, 165, 0.15) 0%, transparent 70%)',
              opacity: 0.6,
              zIndex: 1,
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
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
              component="h1"
              gutterBottom
              color="success.main"
              sx={{ fontWeight: 'bold' }}
            >
              Order Successfully Placed!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Thank you for your purchase. Your order has been successfully
              processed and is now in {OrderStatus.PENDING_PROCESSING} status.
            </Typography>
          </Box>
        </Box>

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
            Order Information
          </Typography>
          <Divider sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Order ID
              </Typography>
              <Typography variant="body1" gutterBottom color="text.primary">
                {orderId}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Order Date
              </Typography>
              <Typography variant="body1" gutterBottom color="text.primary">
                {new Date(currentTime).toLocaleString()}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Order Status
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  color: 'success.main',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'success.main',
                    display: 'inline-block',
                  }}
                />
                {OrderStatus.PENDING_PROCESSING}
              </Typography>
            </Grid2>
          </Grid2>
        </Paper>

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
            Transaction Information
          </Typography>
          <Divider sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Transaction ID
              </Typography>
              <Typography variant="body1" gutterBottom color="text.primary">
                VNP{Date.now().toString().substring(0, 10)}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Transaction Date
              </Typography>
              <Typography variant="body1" gutterBottom color="text.primary">
                {new Date(currentTime).toLocaleString()}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Transaction Content
              </Typography>
              <Typography variant="body1" gutterBottom color="text.primary">
                Payment for order #{orderId}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Payment Method
              </Typography>
              <Typography variant="body1" gutterBottom color="text.primary">
                Credit Card (VNPay)
              </Typography>
            </Grid2>
          </Grid2>
        </Paper>

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
            Delivery Information
          </Typography>
          <Divider sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Recipient Name
              </Typography>
              <Typography variant="body1" gutterBottom color="text.primary">
                Nguyen Van A
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Phone Number
              </Typography>
              <Typography variant="body1" gutterBottom color="text.primary">
                0901234567
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" gutterBottom color="text.primary">
                nguyenvana@example.com
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Province/City
              </Typography>
              <Typography variant="body1" gutterBottom color="text.primary">
                Hanoi
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Address
              </Typography>
              <Typography variant="body1" gutterBottom color="text.primary">
                123 Cau Giay Street, Cau Giay District
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Rush Delivery
              </Typography>
              <Typography variant="body1" gutterBottom color="text.primary">
                Yes - {new Date(tomorrowTime).toLocaleString()}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Delivery Instructions
              </Typography>
              <Typography variant="body1" gutterBottom color="text.primary">
                Please call before delivering
              </Typography>
            </Grid2>
          </Grid2>
        </Paper>

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
          <Divider sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

          {/* Book item */}
          <Box sx={{ display: 'flex', mb: 2, py: 1 }}>
            <Box sx={{ mr: 2, textAlign: 'center', minWidth: 40 }}>
              <Typography variant="body2" color="text.secondary">
                2x
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" color="text.primary">
                The Great Gatsby
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ProductCategory.BOOK}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="primary.light">
                {formatCurrency(180000 * 2)}
              </Typography>
            </Box>
          </Box>

          {/* CD item */}
          <Box sx={{ display: 'flex', mb: 2, py: 1 }}>
            <Box sx={{ mr: 2, textAlign: 'center', minWidth: 40 }}>
              <Typography variant="body2" color="text.secondary">
                1x
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" color="text.primary">
                Thriller
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ProductCategory.CD}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="primary.light">
                {formatCurrency(220000)}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="text.secondary">
              Subtotal (excl. VAT):
            </Typography>
            <Typography color="text.primary">
              {formatCurrency(580000)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="text.secondary">VAT (10%):</Typography>
            <Typography color="text.primary">
              {formatCurrency(58000)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="text.secondary">Delivery Fee:</Typography>
            <Typography color="text.primary">
              {formatCurrency(22000)}
            </Typography>
          </Box>

          <Divider sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" color="primary.light" fontWeight="bold">
              Total:
            </Typography>
            <Typography variant="h6" color="primary.light" fontWeight="bold">
              {formatCurrency(660000)}
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            startIcon={<ArrowBackIcon />}
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
            Continue Shopping
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              alert('Order cancellation would be implemented here');
            }}
            startIcon={<CancelIcon />}
            sx={{
              px: 3,
              py: 1.2,
              borderColor: 'rgba(255, 82, 82, 0.3)',
              '&:hover': {
                borderColor: 'rgba(255, 82, 82, 0.5)',
                backgroundColor: 'rgba(255, 82, 82, 0.05)',
              },
            }}
          >
            Cancel Order
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default OrderConfirmationPage;
