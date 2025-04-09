import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
  Grid2,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ReceiptLong as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as PendingIcon,
  LocalShipping as ShippingIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Event as EventIcon,
  Waves as WavesIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApiService } from '../../mock/mockApi';
import { formatCurrency } from '../../utils/formatters';
import { Order, OrderStatus } from '../../types';

const AccountOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    setCancellingOrder(true);

    try {
      // In a real app, we would call an API to cancel the order
      // Here, we'll simulate the cancellation with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // After successful cancellation, update the order status locally
      setOrder({
        ...order,
        status: OrderStatus.CANCELLED,
      });

      setCancelSuccess(true);
      setOpenCancelDialog(false);
    } catch (error) {
      console.error('Error cancelling order:', error);
      setCancelError('Failed to cancel order. Please try again later.');
    } finally {
      setCancellingOrder(false);
    }
  };

  const handleCloseSuccessSnackbar = () => {
    setCancelSuccess(false);
  };

  const handleCloseErrorSnackbar = () => {
    setCancelError(null);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status chip based on order status
  const getStatusChip = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_PROCESSING:
        return (
          <Chip
            icon={<PendingIcon />}
            label="Pending"
            color="warning"
            sx={{ fontWeight: 'medium' }}
          />
        );
      case OrderStatus.APPROVED:
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Approved"
            color="success"
            sx={{ fontWeight: 'medium' }}
          />
        );
      case OrderStatus.CANCELLED:
        return (
          <Chip
            icon={<CancelIcon />}
            label="Cancelled"
            color="error"
            sx={{ fontWeight: 'medium' }}
          />
        );
      case OrderStatus.REJECTED:
        return (
          <Chip
            icon={<CancelIcon />}
            label="Rejected"
            color="error"
            sx={{ fontWeight: 'medium' }}
          />
        );
      default:
        return null;
    }
  };

  // Check if order can be cancelled (only if it's in PENDING_PROCESSING status)
  const canCancelOrder = order?.status === OrderStatus.PENDING_PROCESSING;

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
          Loading order details...
        </Typography>
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate('/orders')}
          sx={{ mb: 3 }}
        >
          Back to Orders
        </Button>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Order not found'}
        </Alert>
      </Container>
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
            mb: 3,
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            color="primary"
            onClick={() => navigate('/orders')}
            sx={{
              borderColor: 'rgba(100, 255, 218, 0.3)',
              '&:hover': {
                borderColor: 'rgba(100, 255, 218, 0.5)',
                backgroundColor: 'rgba(100, 255, 218, 0.05)',
              },
            }}
          >
            Back to Orders
          </Button>

          {canCancelOrder && (
            <Button
              startIcon={<CancelIcon />}
              variant="outlined"
              color="error"
              onClick={handleOpenCancelDialog}
              sx={{
                borderColor: 'rgba(255, 82, 82, 0.3)',
                '&:hover': {
                  borderColor: 'rgba(255, 82, 82, 0.5)',
                  backgroundColor: 'rgba(255, 82, 82, 0.05)',
                },
              }}
            >
              Cancel Order
            </Button>
          )}
        </Box>

        {/* Order Header */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
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
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{
                    color: 'primary.light',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <ReceiptIcon /> Order #{order.id}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Placed on {formatDate(order.createdAt)}
                </Typography>
              </Box>
              <Box>{getStatusChip(order.status)}</Box>
            </Box>

            <Divider sx={{ my: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Transaction ID
                </Typography>
                <Typography variant="body1" gutterBottom color="text.primary">
                  {order.transactionId || 'N/A'}
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Transaction Date
                </Typography>
                <Typography variant="body1" gutterBottom color="text.primary">
                  {order.transactionDatetime
                    ? formatDate(order.transactionDatetime)
                    : 'N/A'}
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Payment Method
                </Typography>
                <Typography variant="body1" gutterBottom color="text.primary">
                  Credit Card (VNPay)
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Total Amount
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  color="primary.light"
                  fontWeight="bold"
                >
                  {formatCurrency(order.totalAmount)}
                </Typography>
              </Grid2>
            </Grid2>
          </Box>
        </Paper>

        {/* Order Items */}
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: 'primary.light',
            fontWeight: 'bold',
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <WavesIcon /> Order Items
        </Typography>

        <Paper
          elevation={3}
          sx={{
            mb: 4,
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            borderRadius: 2,
            border: '1px solid rgba(100, 255, 218, 0.1)',
            overflow: 'hidden',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.product.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            bgcolor: 'rgba(2, 136, 209, 0.1)',
                            color: 'primary.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            borderRadius: 1,
                            border: '1px solid rgba(100, 255, 218, 0.1)',
                          }}
                        >
                          <WavesIcon sx={{ fontSize: 24 }} />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" color="text.primary">
                            {item.product.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.product.category}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.price)}
                    </TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="right" sx={{ color: 'primary.light' }}>
                      {formatCurrency(item.price * item.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Order Summary and Delivery Information */}
        <Grid2 container spacing={4}>
          {/* Order Summary */}
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: 'primary.light',
                fontWeight: 'bold',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <ReceiptIcon /> Order Summary
            </Typography>

            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                borderRadius: 2,
                border: '1px solid rgba(100, 255, 218, 0.1)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Typography color="text.secondary">Subtotal:</Typography>
                <Typography color="text.primary">
                  {formatCurrency(order.subtotal)}
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
                  {formatCurrency(order.vat)}
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
                  {formatCurrency(order.deliveryFee)}
                </Typography>
              </Box>

              <Divider
                sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                  fontWeight: 'bold',
                }}
              >
                <Typography variant="h6" color="primary.light">
                  Total:
                </Typography>
                <Typography variant="h6" color="primary.light">
                  {formatCurrency(order.totalAmount)}
                </Typography>
              </Box>
            </Paper>
          </Grid2>

          {/* Delivery Information */}
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: 'primary.light',
                fontWeight: 'bold',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <ShippingIcon /> Delivery Information
            </Typography>

            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                borderRadius: 2,
                border: '1px solid rgba(100, 255, 218, 0.1)',
              }}
            >
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <PersonIcon
                      sx={{
                        color: 'primary.light',
                        mr: 1,
                        mt: 0.5,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Recipient
                      </Typography>
                      <Typography variant="body1" color="text.primary">
                        {order.deliveryInfo.recipientName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <PhoneIcon
                      sx={{
                        color: 'primary.light',
                        mr: 1,
                        mt: 0.5,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Phone
                      </Typography>
                      <Typography variant="body1" color="text.primary">
                        {order.deliveryInfo.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <EmailIcon
                      sx={{
                        color: 'primary.light',
                        mr: 1,
                        mt: 0.5,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Email
                      </Typography>
                      <Typography variant="body1" color="text.primary">
                        {order.deliveryInfo.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <LocationIcon
                      sx={{
                        color: 'primary.light',
                        mr: 1,
                        mt: 0.5,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Province
                      </Typography>
                      <Typography variant="body1" color="text.primary">
                        {order.deliveryInfo.province}
                      </Typography>
                    </Box>
                  </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <LocationIcon
                      sx={{
                        color: 'primary.light',
                        mr: 1,
                        mt: 0.5,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Delivery Address
                      </Typography>
                      <Typography variant="body1" color="text.primary">
                        {order.deliveryInfo.address}
                      </Typography>
                    </Box>
                  </Box>
                </Grid2>

                {order.deliveryInfo.isRushDelivery && (
                  <>
                    <Grid2 size={{ xs: 12 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Chip
                          label="Rush Delivery"
                          color="secondary"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                      </Box>
                    </Grid2>

                    {order.deliveryInfo.rushDeliveryTime && (
                      <Grid2 size={{ xs: 12 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            mb: 2,
                          }}
                        >
                          <EventIcon
                            sx={{
                              color: 'primary.light',
                              mr: 1,
                              mt: 0.5,
                            }}
                          />
                          <Box>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Rush Delivery Time
                            </Typography>
                            <Typography variant="body1" color="text.primary">
                              {formatDate(order.deliveryInfo.rushDeliveryTime)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid2>
                    )}

                    {order.deliveryInfo.rushDeliveryInstructions && (
                      <Grid2 size={{ xs: 12 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            mb: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Delivery Instructions
                            </Typography>
                            <Typography variant="body1" color="text.primary">
                              {order.deliveryInfo.rushDeliveryInstructions}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid2>
                    )}
                  </>
                )}
              </Grid2>
            </Paper>
          </Grid2>
        </Grid2>

        {/* Cancel order dialog */}
        <Dialog
          open={openCancelDialog}
          onClose={handleCloseCancelDialog}
          aria-labelledby="cancel-dialog-title"
          aria-describedby="cancel-dialog-description"
          PaperProps={{
            sx: {
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
              border: '1px solid rgba(255, 82, 82, 0.3)',
            },
          }}
        >
          <DialogTitle
            id="cancel-dialog-title"
            sx={{
              color: 'error.light',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <WarningIcon /> Cancel Order
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="cancel-dialog-description"
              color="text.secondary"
            >
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </DialogContentText>
            <Box sx={{ mt: 2 }}>
              <Alert
                severity="info"
                sx={{
                  backgroundColor: 'rgba(2, 136, 209, 0.1)',
                  border: '1px solid rgba(2, 136, 209, 0.3)',
                }}
              >
                Upon cancellation, a full refund will be processed according to
                your original payment method. The refund may take 3-5 business
                days to appear in your account.
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleCloseCancelDialog}
              color="primary"
              disabled={cancellingOrder}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCancelOrder}
              variant="contained"
              color="error"
              disabled={cancellingOrder}
              startIcon={
                cancellingOrder ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CancelIcon />
                )
              }
            >
              {cancellingOrder ? 'Processing...' : 'Yes, Cancel Order'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success and error snackbars */}
        <Snackbar
          open={cancelSuccess}
          autoHideDuration={6000}
          onClose={handleCloseSuccessSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSuccessSnackbar}
            severity="success"
            sx={{ width: '100%' }}
          >
            Order cancelled successfully! Your refund will be processed shortly.
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!cancelError}
          autoHideDuration={6000}
          onClose={handleCloseErrorSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseErrorSnackbar}
            severity="error"
            sx={{ width: '100%' }}
          >
            {cancelError}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AccountOrderDetailPage;
