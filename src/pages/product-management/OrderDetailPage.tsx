// src/pages/product-manager/OrderDetailPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid2,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
  LocalShipping as ShippingIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApiService } from '../../mock/mockApi';
import { Order, OrderStatus, Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';

// Order status configuration (same as in OrderManagementPage)
const statusConfig = {
  [OrderStatus.PENDING_PROCESSING]: {
    color: 'warning',
    label: 'Pending',
    icon: <CircularProgress size={16} />,
  },
  [OrderStatus.APPROVED]: {
    color: 'success',
    label: 'Approved',
    icon: <CheckCircleIcon fontSize="small" />,
  },
  [OrderStatus.REJECTED]: {
    color: 'error',
    label: 'Rejected',
    icon: <CancelIcon fontSize="small" />,
  },
  [OrderStatus.CANCELLED]: {
    color: 'default',
    label: 'Cancelled',
    icon: <CancelIcon fontSize="small" />,
  },
};

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );
  const [inventoryCheck, setInventoryCheck] = useState<{
    passed: boolean;
    insufficientItems: Array<{
      product: Product;
      available: number;
      required: number;
    }>;
  }>({
    passed: true,
    insufficientItems: [],
  });

  // Fetch order on component mount
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        if (!id) {
          setError('Order ID is missing');
          setLoading(false);
          return;
        }

        const orderData = await mockApiService.getOrderById(id);
        if (!orderData) {
          setError('Order not found');
          setLoading(false);
          return;
        }

        setOrder(orderData);

        // Check inventory
        const insufficient: Array<{
          product: Product;
          available: number;
          required: number;
        }> = [];

        orderData.items.forEach((item) => {
          if (item.quantity > item.product.quantity) {
            insufficient.push({
              product: item.product,
              available: item.product.quantity,
              required: item.quantity,
            });
          }
        });

        setInventoryCheck({
          passed: insufficient.length === 0,
          insufficientItems: insufficient,
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Handle order approval
  const handleApproveOrder = () => {
    setOpenApproveDialog(true);
  };

  // Handle order rejection
  const handleRejectOrder = () => {
    setRejectionReason('');
    setOpenRejectDialog(true);
  };

  // Confirm order approval
  const confirmApproval = async () => {
    try {
      if (!order) return;

      if (!inventoryCheck.passed) {
        setSnackbarMessage(
          'Order cannot be approved due to insufficient inventory'
        );
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setOpenApproveDialog(false);
        return;
      }

      // Update order status (in a real app, this would call an API)
      const updatedOrder = { ...order, status: OrderStatus.APPROVED };
      setOrder(updatedOrder);

      setSnackbarMessage('Order approved successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setOpenApproveDialog(false);
    } catch (error) {
      console.error('Error approving order:', error);
      setSnackbarMessage('Error approving order');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Confirm order rejection
  const confirmRejection = async () => {
    try {
      if (!order) return;

      // Update order status (in a real app, this would call an API)
      const updatedOrder = { ...order, status: OrderStatus.REJECTED };
      setOrder(updatedOrder);

      setSnackbarMessage('Order rejected successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setOpenRejectDialog(false);
    } catch (error) {
      console.error('Error rejecting order:', error);
      setSnackbarMessage('Error rejecting order');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Order not found'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/product-management/orders')}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/product-management/orders')}
              sx={{
                borderColor: 'rgba(100, 255, 218, 0.3)',
                '&:hover': {
                  borderColor: 'rgba(100, 255, 218, 0.5)',
                  backgroundColor: 'rgba(100, 255, 218, 0.05)',
                },
              }}
            >
              Back
            </Button>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 'bold',
                color: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <ShippingIcon /> Order Details
            </Typography>
          </Box>

          <Chip
            size="medium"
            label={statusConfig[order.status].label}
            color={statusConfig[order.status].color as any}
            icon={statusConfig[order.status].icon}
          />
        </Box>

        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, md: 8 }}>
            {/* Order information */}
            <Paper
              elevation={3}
              sx={{
                p: 4,
                mb: 4,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 3,
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', color: 'primary.light' }}
                  >
                    Order #{order.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created at: {formatDate(order.createdAt)}
                  </Typography>
                </Box>
              </Box>

              <Divider
                sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }}
              />

              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: 'primary.light' }}
              >
                Order Items
              </Typography>

              <TableContainer sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item, index) => {
                      const isInsufficientStock =
                        inventoryCheck.insufficientItems.some(
                          (insufficientItem) =>
                            insufficientItem.product.id === item.product.id
                        );

                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Box
                              sx={{ display: 'flex', flexDirection: 'column' }}
                            >
                              <Typography variant="body2">
                                {item.product.title}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {item.product.category}
                              </Typography>
                              {isInsufficientStock && (
                                <Typography
                                  variant="caption"
                                  color="error"
                                  sx={{
                                    mt: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                  }}
                                >
                                  <WarningIcon fontSize="inherit" />
                                  Insufficient stock
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              color={isInsufficientStock ? 'error' : 'inherit'}
                            >
                              {item.quantity}
                            </Typography>
                            {isInsufficientStock && (
                              <Typography variant="caption" color="error">
                                Available:{' '}
                                {inventoryCheck.insufficientItems.find(
                                  (insufficientItem) =>
                                    insufficientItem.product.id ===
                                    item.product.id
                                )?.available || 0}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(item.price)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(item.price * item.quantity)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 1,
                  pt: 2,
                  borderTop: '1px solid rgba(100, 255, 218, 0.1)',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '200px',
                  }}
                >
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">
                    {formatCurrency(order.subtotal)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '200px',
                  }}
                >
                  <Typography variant="body2">VAT (10%):</Typography>
                  <Typography variant="body2">
                    {formatCurrency(order.vat)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '200px',
                  }}
                >
                  <Typography variant="body2">Delivery Fee:</Typography>
                  <Typography variant="body2">
                    {formatCurrency(order.deliveryFee)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '200px',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: 'primary.light' }}
                  >
                    Total:
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: 'primary.light' }}
                  >
                    {formatCurrency(order.totalAmount)}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Transaction information */}
            <Paper
              elevation={3}
              sx={{
                p: 4,
                mb: 4,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: 'primary.light', mb: 3 }}
              >
                Transaction Details
              </Typography>

              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Transaction ID
                  </Typography>
                  <Typography variant="body2">
                    {order.transactionId || 'N/A'}
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Transaction Date
                  </Typography>
                  <Typography variant="body2">
                    {order.transactionDatetime
                      ? formatDate(order.transactionDatetime)
                      : 'N/A'}
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Transaction Content
                  </Typography>
                  <Typography variant="body2">
                    {order.transactionContent || 'N/A'}
                  </Typography>
                </Grid2>
              </Grid2>
            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 4 }}>
            {/* Customer information */}
            <Paper
              elevation={3}
              sx={{
                p: 4,
                mb: 4,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: 'primary.light', mb: 3 }}
              >
                Customer Information
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1">
                  {order.deliveryInfo.recipientName}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {order.deliveryInfo.email}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">
                  {order.deliveryInfo.phone}
                </Typography>
              </Box>
            </Paper>

            {/* Delivery information */}
            <Paper
              elevation={3}
              sx={{
                p: 4,
                mb: 4,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: 'primary.light', mb: 3 }}
              >
                Delivery Information
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Province
                </Typography>
                <Typography variant="body1">
                  {order.deliveryInfo.province}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1">
                  {order.deliveryInfo.address}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Rush Delivery
                </Typography>
                <Typography variant="body1">
                  {order.deliveryInfo.isRushDelivery ? 'Yes' : 'No'}
                </Typography>
              </Box>

              {order.deliveryInfo.isRushDelivery && (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Delivery Time
                    </Typography>
                    <Typography variant="body1">
                      {order.deliveryInfo.rushDeliveryTime
                        ? formatDate(order.deliveryInfo.rushDeliveryTime)
                        : 'Not specified'}
                    </Typography>
                  </Box>

                  {order.deliveryInfo.rushDeliveryInstructions && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Delivery Instructions
                      </Typography>
                      <Typography variant="body1">
                        {order.deliveryInfo.rushDeliveryInstructions}
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Paper>

            {/* Action Buttons */}
            {order.status === OrderStatus.PENDING_PROCESSING && (
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  backgroundImage:
                    'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                  border: '1px solid rgba(100, 255, 218, 0.1)',
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold', color: 'primary.light', mb: 3 }}
                >
                  Actions
                </Typography>

                {!inventoryCheck.passed && (
                  <Alert
                    severity="warning"
                    sx={{
                      mb: 3,
                      backgroundColor: 'rgba(255, 152, 0, 0.1)',
                      border: '1px solid rgba(255, 152, 0, 0.3)',
                    }}
                  >
                    <Typography variant="body2">
                      This order has items with insufficient inventory. You
                      cannot approve it until inventory is updated.
                    </Typography>
                  </Alert>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<CheckCircleIcon />}
                    onClick={handleApproveOrder}
                    disabled={!inventoryCheck.passed}
                    fullWidth
                  >
                    Approve Order
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="large"
                    startIcon={<CancelIcon />}
                    onClick={handleRejectOrder}
                    fullWidth
                  >
                    Reject Order
                  </Button>
                </Box>
              </Paper>
            )}
          </Grid2>
        </Grid2>
      </Container>

      {/* Approve Order Dialog */}
      <Dialog
        open={openApproveDialog}
        onClose={() => setOpenApproveDialog(false)}
      >
        <DialogTitle>Approve Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve this order? This will update the
            order status to Approved.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApproveDialog(false)}>Cancel</Button>
          <Button
            onClick={confirmApproval}
            color="success"
            variant="contained"
            autoFocus
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Order Dialog */}
      <Dialog
        open={openRejectDialog}
        onClose={() => setOpenRejectDialog(false)}
      >
        <DialogTitle>Reject Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reject this order? This action cannot be
            undone.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Rejection (Optional)"
            fullWidth
            multiline
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
          <Button onClick={confirmRejection} color="error" variant="contained">
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderDetailPage;
