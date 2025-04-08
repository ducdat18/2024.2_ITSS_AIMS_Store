// src/pages/productManager/OrderManagementPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Badge,
  Tabs,
  Tab,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid2,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Done as ApproveIcon,
  Close as RejectIcon,
  ShoppingCart as ShoppingCartIcon,
  FilterList as FilterListIcon,
  LocalShipping as LocalShippingIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { mockApiService } from '../../mock/mockApi';
import { Order, OrderStatus, Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const OrderManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await mockApiService.getOrders();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [tabValue, searchQuery, orders]);

  const filterOrders = () => {
    let result = [...orders];

    // Filter by status based on tab
    switch (tabValue) {
      case 0: // Pending
        result = result.filter(
          (order) => order.status === OrderStatus.PENDING_PROCESSING
        );
        break;
      case 1: // Approved
        result = result.filter(
          (order) => order.status === OrderStatus.APPROVED
        );
        break;
      case 2: // Rejected
        result = result.filter(
          (order) =>
            order.status === OrderStatus.REJECTED ||
            order.status === OrderStatus.CANCELLED
        );
        break;
      case 3: // All
        // No filtering needed
        break;
      default:
        break;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.deliveryInfo.recipientName.toLowerCase().includes(query) ||
          (order.transactionId &&
            order.transactionId.toLowerCase().includes(query))
      );
    }

    setFilteredOrders(result);
    setPage(0);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOpenViewDialog(true);
  };

  const handleApproveOrder = (order: Order) => {
    setSelectedOrder(order);
    setOpenApproveDialog(true);
  };

  const handleRejectOrder = (order: Order) => {
    setSelectedOrder(order);
    setOpenRejectDialog(true);
  };

  const confirmApprove = async () => {
    if (selectedOrder) {
      try {
        // Check if inventory is sufficient
        const insufficientItems = selectedOrder.items.filter(
          (item) => item.quantity > item.product.quantity
        );

        if (insufficientItems.length > 0) {
          setSnackbar({
            open: true,
            message:
              'Cannot approve order: Insufficient inventory for some items',
            severity: 'error',
          });
          setOpenApproveDialog(false);
          return;
        }

        // In a real app, this would call an API to update the order status
        const updatedOrders = orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: OrderStatus.APPROVED }
            : order
        );
        setOrders(updatedOrders);

        setSnackbar({
          open: true,
          message: 'Order approved successfully',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error approving order:', error);
        setSnackbar({
          open: true,
          message: 'Failed to approve order',
          severity: 'error',
        });
      }
    }
    setOpenApproveDialog(false);
  };

  const confirmReject = async () => {
    if (selectedOrder) {
      try {
        // In a real app, this would call an API to update the order status
        const updatedOrders = orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: OrderStatus.REJECTED, rejectReason }
            : order
        );
        setOrders(updatedOrders);

        setSnackbar({
          open: true,
          message: 'Order rejected successfully',
          severity: 'success',
        });
        setRejectReason('');
      } catch (error) {
        console.error('Error rejecting order:', error);
        setSnackbar({
          open: true,
          message: 'Failed to reject order',
          severity: 'error',
        });
      }
    }
    setOpenRejectDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getStatusColor = (
    status: OrderStatus
  ):
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning' => {
    switch (status) {
      case OrderStatus.PENDING_PROCESSING:
        return 'warning';
      case OrderStatus.APPROVED:
        return 'success';
      case OrderStatus.REJECTED:
      case OrderStatus.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_PROCESSING:
        return <ShoppingCartIcon fontSize="small" />;
      case OrderStatus.APPROVED:
        return <CheckCircleIcon fontSize="small" />;
      case OrderStatus.REJECTED:
      case OrderStatus.CANCELLED:
        return <BlockIcon fontSize="small" />;
      default:
        return null;
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
        <Typography variant="h5" color="text.secondary">
          Loading orders...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: 3,
        minHeight: '100vh',
        backgroundColor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
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
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="primary"
            onClick={() => navigate('/product-management')}
            sx={{ mr: 1, bgcolor: 'rgba(2, 136, 209, 0.1)' }}
          >
            <ArrowBackIcon />
          </IconButton>
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
            <ShoppingCartIcon /> Order Management
          </Typography>
        </Box>

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
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{ mb: { xs: 2, md: 0 } }}
            >
              <Tab
                label={
                  <Badge
                    badgeContent={
                      orders.filter(
                        (o) => o.status === OrderStatus.PENDING_PROCESSING
                      ).length
                    }
                    color="warning"
                    max={99}
                  >
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <ShoppingCartIcon fontSize="small" />
                      <span>Pending</span>
                    </Box>
                  </Badge>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircleIcon fontSize="small" />
                    <span>Approved</span>
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <BlockIcon fontSize="small" />
                    <span>Rejected</span>
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FilterListIcon fontSize="small" />
                    <span>All Orders</span>
                  </Box>
                }
              />
            </Tabs>

            <TextField
              placeholder="Search orders..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(100, 255, 218, 0.7)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: '100%', md: 300 } }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {filteredOrders.length} of {orders.length} orders
          </Typography>

          <TabPanel value={tabValue} index={0}>
            {renderOrderTable(filteredOrders, true)}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {renderOrderTable(filteredOrders, false)}
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            {renderOrderTable(filteredOrders, false)}
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            {renderOrderTable(filteredOrders, false)}
          </TabPanel>
        </Paper>
      </Container>

      {/* View Order Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            border: '1px solid rgba(100, 255, 218, 0.1)',
          },
        }}
      >
        <DialogTitle sx={{ color: 'primary.light' }}>
          Order Details - {selectedOrder?.id}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Stepper
                activeStep={
                  selectedOrder.status === OrderStatus.PENDING_PROCESSING
                    ? 0
                    : selectedOrder.status === OrderStatus.APPROVED
                    ? 1
                    : 2
                }
                alternativeLabel
                sx={{ mb: 4 }}
              >
                <Step>
                  <StepLabel>Order Placed</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Order Approved</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Order Completed</StepLabel>
                </Step>
              </Stepper>

              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Paper
                    sx={{
                      p: 2,
                      mb: 3,
                      backgroundColor: 'rgba(13, 37, 56, 0.5)',
                      borderRadius: 2,
                      border: '1px solid rgba(100, 255, 218, 0.1)',
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <PersonIcon fontSize="small" />
                      Customer Information
                    </Typography>
                    <Divider
                      sx={{ mb: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                    />
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.deliveryInfo.recipientName}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.deliveryInfo.email}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.deliveryInfo.phone}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Paper
                    sx={{
                      p: 2,
                      mb: 3,
                      backgroundColor: 'rgba(13, 37, 56, 0.5)',
                      borderRadius: 2,
                      border: '1px solid rgba(100, 255, 218, 0.1)',
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <LocalShippingIcon fontSize="small" />
                      Delivery Information
                    </Typography>
                    <Divider
                      sx={{ mb: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                    />
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.deliveryInfo.address}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Province
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.deliveryInfo.province}
                      </Typography>
                    </Box>
                    {selectedOrder.deliveryInfo.isRushDelivery && (
                      <>
                        <Box sx={{ mt: 2 }}>
                          <Chip
                            label="Rush Delivery"
                            color="warning"
                            size="small"
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="body2">
                            Delivery Time:{' '}
                            {selectedOrder.deliveryInfo.rushDeliveryTime &&
                              new Date(
                                selectedOrder.deliveryInfo.rushDeliveryTime
                              ).toLocaleString()}
                          </Typography>
                          {selectedOrder.deliveryInfo
                            .rushDeliveryInstructions && (
                            <Typography variant="body2">
                              Instructions:{' '}
                              {
                                selectedOrder.deliveryInfo
                                  .rushDeliveryInstructions
                              }
                            </Typography>
                          )}
                        </Box>
                      </>
                    )}
                  </Paper>
                </Grid2>
              </Grid2>

              <Paper
                sx={{
                  p: 2,
                  mb: 3,
                  backgroundColor: 'rgba(13, 37, 56, 0.5)',
                  borderRadius: 2,
                  border: '1px solid rgba(100, 255, 218, 0.1)',
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <ShoppingCartIcon fontSize="small" />
                  Order Items
                </Typography>
                <Divider
                  sx={{ mb: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                />

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Product
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                          Quantity
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.product.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2">
                                {item.product.title}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(item.price * item.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box
                  sx={{
                    mt: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: { xs: '100%', sm: '300px' },
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Subtotal:</Typography>
                    <Typography variant="body2">
                      {formatCurrency(selectedOrder.subtotal)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: { xs: '100%', sm: '300px' },
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">VAT (10%):</Typography>
                    <Typography variant="body2">
                      {formatCurrency(selectedOrder.vat)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: { xs: '100%', sm: '300px' },
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Delivery Fee:</Typography>
                    <Typography variant="body2">
                      {formatCurrency(selectedOrder.deliveryFee)}
                    </Typography>
                  </Box>
                  <Divider
                    sx={{
                      my: 1,
                      width: { xs: '100%', sm: '300px' },
                      borderColor: 'rgba(100, 255, 218, 0.1)',
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: { xs: '100%', sm: '300px' },
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      Total:
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="primary.light"
                    >
                      {formatCurrency(selectedOrder.totalAmount)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(13, 37, 56, 0.5)',
                  borderRadius: 2,
                  border: '1px solid rgba(100, 255, 218, 0.1)',
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <PaymentIcon fontSize="small" />
                  Payment Information
                </Typography>
                <Divider
                  sx={{ mb: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                />

                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Transaction ID
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedOrder.transactionId}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Transaction Date
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedOrder.transactionDatetime &&
                        new Date(
                          selectedOrder.transactionDatetime
                        ).toLocaleString()}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Transaction Content
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedOrder.transactionContent}
                    </Typography>
                  </Grid2>
                </Grid2>
              </Paper>

              {/* Check for any inventory issues */}
              {selectedOrder.status === OrderStatus.PENDING_PROCESSING && (
                <Box sx={{ mt: 3 }}>
                  {selectedOrder.items.some(
                    (item) => item.quantity > item.product.quantity
                  ) ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">
                        This order has insufficient inventory for some items:
                      </Typography>
                      <List dense disablePadding>
                        {selectedOrder.items
                          .filter(
                            (item) => item.quantity > item.product.quantity
                          )
                          .map((item) => (
                            <ListItem key={item.product.id} disablePadding>
                              <ListItemText
                                primary={`${item.product.title}: Ordered ${item.quantity}, but only ${item.product.quantity} in stock`}
                              />
                            </ListItem>
                          ))}
                      </List>
                    </Alert>
                  ) : (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      All items in this order have sufficient inventory
                    </Alert>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {selectedOrder?.status === OrderStatus.PENDING_PROCESSING && (
            <>
              <Button
                onClick={() => {
                  setOpenViewDialog(false);
                  handleRejectOrder(selectedOrder);
                }}
                color="error"
                variant="outlined"
                startIcon={<RejectIcon />}
                sx={{
                  borderColor: 'rgba(255, 82, 82, 0.3)',
                  '&:hover': {
                    borderColor: 'rgba(255, 82, 82, 0.5)',
                    backgroundColor: 'rgba(255, 82, 82, 0.05)',
                  },
                }}
              >
                Reject Order
              </Button>
              <Button
                onClick={() => {
                  setOpenViewDialog(false);
                  handleApproveOrder(selectedOrder);
                }}
                color="success"
                variant="contained"
                startIcon={<ApproveIcon />}
                disabled={
                  selectedOrder
                    ? selectedOrder.items.some(
                        (item) => item.quantity > item.product.quantity
                      )
                    : false
                }
                sx={{
                  ml: 1,
                  bgcolor: 'rgba(0, 191, 165, 0.8)',
                  '&:hover': { bgcolor: 'success.main' },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(0, 191, 165, 0.2)',
                  },
                }}
              >
                Approve Order
              </Button>
            </>
          )}
          <Button
            onClick={() => setOpenViewDialog(false)}
            color="primary"
            variant="contained"
            sx={{ ml: 1 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approve Order Dialog */}
      <Dialog
        open={openApproveDialog}
        onClose={() => setOpenApproveDialog(false)}
        PaperProps={{
          sx: {
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            border: '1px solid rgba(0, 191, 165, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ color: 'success.main' }}>Approve Order</DialogTitle>
        <DialogContent>
          {selectedOrder &&
          selectedOrder.items.some(
            (item) => item.quantity > item.product.quantity
          ) ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              Cannot approve: This order has insufficient inventory for some
              items.
            </Alert>
          ) : (
            <DialogContentText sx={{ color: 'text.primary' }}>
              Are you sure you want to approve this order? This will update
              inventory and notify the customer.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenApproveDialog(false)}
            color="primary"
            variant="outlined"
            sx={{
              borderColor: 'rgba(100, 255, 218, 0.3)',
              '&:hover': {
                borderColor: 'rgba(100, 255, 218, 0.5)',
                backgroundColor: 'rgba(100, 255, 218, 0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmApprove}
            color="success"
            variant="contained"
            disabled={
              selectedOrder
                ? selectedOrder.items.some(
                    (item) => item.quantity > item.product.quantity
                  )
                : false
            }
            sx={{
              ml: 1,
              bgcolor: 'rgba(0, 191, 165, 0.8)',
              '&:hover': { bgcolor: 'success.main' },
              '&.Mui-disabled': {
                bgcolor: 'rgba(0, 191, 165, 0.2)',
              },
            }}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Order Dialog */}
      <Dialog
        open={openRejectDialog}
        onClose={() => setOpenRejectDialog(false)}
        PaperProps={{
          sx: {
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            border: '1px solid rgba(255, 82, 82, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ color: 'error.main' }}>Reject Order</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.primary', mb: 2 }}>
            Are you sure you want to reject this order? Please provide a reason
            for rejection:
          </DialogContentText>
          <TextField
            autoFocus
            label="Reason for Rejection"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            fullWidth
            multiline
            rows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 82, 82, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 82, 82, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(255, 82, 82, 0.7)',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenRejectDialog(false)}
            color="primary"
            variant="outlined"
            sx={{
              borderColor: 'rgba(100, 255, 218, 0.3)',
              '&:hover': {
                borderColor: 'rgba(100, 255, 218, 0.5)',
                backgroundColor: 'rgba(100, 255, 218, 0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmReject}
            color="error"
            variant="contained"
            disabled={!rejectReason.trim()}
            sx={{
              ml: 1,
              bgcolor: 'rgba(255, 82, 82, 0.8)',
              '&:hover': { bgcolor: 'error.main' },
            }}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );

  function renderOrderTable(data: Order[], showActions: boolean) {
    return (
      <>
        <TableContainer
          sx={{
            maxHeight: 'calc(100vh - 300px)',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(100, 255, 218, 0.2)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(100, 255, 218, 0.05)',
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: 'rgba(1, 22, 39, 0.8)',
                    fontWeight: 'bold',
                    color: 'primary.light',
                  }}
                >
                  Order ID
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: 'rgba(1, 22, 39, 0.8)',
                    fontWeight: 'bold',
                    color: 'primary.light',
                  }}
                >
                  Customer
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: 'rgba(1, 22, 39, 0.8)',
                    fontWeight: 'bold',
                    color: 'primary.light',
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: 'rgba(1, 22, 39, 0.8)',
                    fontWeight: 'bold',
                    color: 'primary.light',
                  }}
                >
                  Items
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: 'rgba(1, 22, 39, 0.8)',
                    fontWeight: 'bold',
                    color: 'primary.light',
                  }}
                >
                  Total
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: 'rgba(1, 22, 39, 0.8)',
                    fontWeight: 'bold',
                    color: 'primary.light',
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    bgcolor: 'rgba(1, 22, 39, 0.8)',
                    fontWeight: 'bold',
                    color: 'primary.light',
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow
                    key={order.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(2, 136, 209, 0.08)',
                      },
                    }}
                  >
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {order.deliveryInfo.recipientName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.deliveryInfo.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {order.items.map((item) => (
                          <Tooltip
                            key={item.product.id}
                            title={`${item.product.title} (${item.quantity}x)`}
                          >
                            <Chip
                              label={`${item.quantity}x`}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          </Tooltip>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(order.status) ?? undefined}
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: 1,
                        }}
                      >
                        <Tooltip title="View Order">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleViewOrder(order)}
                            sx={{ bgcolor: 'rgba(2, 136, 209, 0.1)' }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {showActions &&
                          order.status === OrderStatus.PENDING_PROCESSING && (
                            <>
                              <Tooltip title="Approve Order">
                                <IconButton
                                  color="success"
                                  size="small"
                                  onClick={() => handleApproveOrder(order)}
                                  sx={{ bgcolor: 'rgba(0, 191, 165, 0.1)' }}
                                  disabled={
                                    selectedOrder
                                      ? selectedOrder.items.some(
                                          (item) =>
                                            item.quantity >
                                            item.product.quantity
                                        )
                                      : false
                                  }
                                >
                                  <ApproveIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject Order">
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() => handleRejectOrder(order)}
                                  sx={{ bgcolor: 'rgba(255, 82, 82, 0.1)' }}
                                >
                                  <RejectIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      No orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          sx={{
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows':
              {
                color: 'text.secondary',
              },
          }}
        />
      </>
    );
  }
};

export default OrderManagementPage;
