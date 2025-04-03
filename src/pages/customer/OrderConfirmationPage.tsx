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
import { CheckCircleOutline as CheckCircleIcon } from '@mui/icons-material';
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
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          color="success.main"
        >
          Order Successfully Placed!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Thank you for your purchase. Your order has been successfully
          processed and is now in {OrderStatus.PENDING_PROCESSING} status.
        </Typography>
      </Box>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Order Information
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Order ID
            </Typography>
            <Typography variant="body1" gutterBottom>
              {orderId}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Order Date
            </Typography>
            <Typography variant="body1" gutterBottom>
              {new Date(currentTime).toLocaleString()}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Order Status
            </Typography>
            <Typography variant="body1" gutterBottom>
              {OrderStatus.PENDING_PROCESSING}
            </Typography>
          </Grid2>
        </Grid2>
      </Paper>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Transaction Information
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Transaction ID
            </Typography>
            <Typography variant="body1" gutterBottom>
              VNP{Date.now().toString().substring(0, 10)}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Transaction Date
            </Typography>
            <Typography variant="body1" gutterBottom>
              {new Date(currentTime).toLocaleString()}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Transaction Content
            </Typography>
            <Typography variant="body1" gutterBottom>
              Payment for order #{orderId}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Payment Method
            </Typography>
            <Typography variant="body1" gutterBottom>
              Credit Card (VNPay)
            </Typography>
          </Grid2>
        </Grid2>
      </Paper>

      <Paper sx={{ p: 4, mb: 4 }}>
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
              Nguyen Van A
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Phone Number
            </Typography>
            <Typography variant="body1" gutterBottom>
              0901234567
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1" gutterBottom>
              nguyenvana@example.com
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Province/City
            </Typography>
            <Typography variant="body1" gutterBottom>
              Hanoi
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Address
            </Typography>
            <Typography variant="body1" gutterBottom>
              123 Cau Giay Street, Cau Giay District
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Rush Delivery
            </Typography>
            <Typography variant="body1" gutterBottom>
              Yes - {new Date(tomorrowTime).toLocaleString()}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Delivery Instructions
            </Typography>
            <Typography variant="body1" gutterBottom>
              Please call before delivering
            </Typography>
          </Grid2>
        </Grid2>
      </Paper>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Order Summary
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Book item */}
        <Box sx={{ display: 'flex', mb: 2, py: 1 }}>
          <Box sx={{ mr: 2, textAlign: 'center', minWidth: 40 }}>
            <Typography variant="body2" color="text.secondary">
              2x
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2">The Great Gatsby</Typography>
            <Typography variant="body2" color="text.secondary">
              {ProductCategory.BOOK}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">
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
            <Typography variant="subtitle2">Thriller</Typography>
            <Typography variant="body2" color="text.secondary">
              {ProductCategory.CD}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">
              {formatCurrency(220000)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Subtotal (excl. VAT):</Typography>
          <Typography>{formatCurrency(580000)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>VAT (10%):</Typography>
          <Typography>{formatCurrency(58000)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Delivery Fee:</Typography>
          <Typography>{formatCurrency(22000)}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" color="primary.dark">
            Total:
          </Typography>
          <Typography variant="h6" color="primary.dark">
            {formatCurrency(660000)}
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            alert('Order cancellation would be implemented here');
          }}
        >
          Cancel Order
        </Button>
      </Box>
    </Container>
  );
};

export default OrderConfirmationPage;
