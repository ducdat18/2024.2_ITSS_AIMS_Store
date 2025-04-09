import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Grid2,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { mockApiService } from '../../mock/mockApi';
import { Order, OrderStatus } from '../../types';
import { formatCurrency } from '../../utils/formatters';

// Order status configuration
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

const OrderManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );

  // Fetch orders on component mount
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

  // Filter orders based on tab and search query
  useEffect(() => {
    let filtered = [...orders];

    // Filter by status based on tab
    if (tabValue === 0) {
      // All orders
    } else if (tabValue === 1) {
      // Pending orders
      filtered = filtered.filter(
        (order) => order.status === OrderStatus.PENDING_PROCESSING
      );
    } else if (tabValue === 2) {
      // Approved orders
      filtered = filtered.filter(
        (order) => order.status === OrderStatus.APPROVED
      );
    } else if (tabValue === 3) {
      // Rejected or cancelled orders
      filtered = filtered.filter(
        (order) =>
          order.status === OrderStatus.REJECTED ||
          order.status === OrderStatus.CANCELLED
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.deliveryInfo.recipientName.toLowerCase().includes(query) ||
          order.deliveryInfo.email.toLowerCase().includes(query) ||
          order.deliveryInfo.phone.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
    setPage(0);
  }, [orders, tabValue, searchQuery]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search query change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handle order view
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOpenViewDialog(true);
  };

  // Handle order approval
  const handleApproveOrder = (order: Order) => {
    setSelectedOrder(order);
    setOpenApproveDialog(true);
  };

  // Handle order rejection
  const handleRejectOrder = (order: Order) => {
    setSelectedOrder(order);
    setRejectionReason('');
    setOpenRejectDialog(true);
  };

  // Confirm order approval
  const confirmApproval = async () => {
    try {
      if (!selectedOrder) return;

      // Check inventory before approving
      let hasInsufficientInventory = false;

      // Simulate inventory check
      selectedOrder.items.forEach((item) => {
        if (item.quantity > item.product.quantity) {
          hasInsufficientInventory = true;
        }
      });

      if (hasInsufficientInventory) {
        setSnackbarMessage(
          'Order cannot be approved due to insufficient inventory'
        );
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setOpenApproveDialog(false);
        return;
      }

      // Update order status (in a real app, this would call an API)
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: OrderStatus.APPROVED }
            : order
        )
      );

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
      if (!selectedOrder) return;

      // Update order status (in a real app, this would call an API)
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: OrderStatus.REJECTED }
            : order
        )
      );

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

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Get current page orders
  const currentOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
          <Typography
            variant="h4"
            component="h1"
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
            <ShippingIcon /> Order Management
          </Typography>

          <Box>
            <Tooltip title="Refresh">
              <IconButton
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 500);
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Filter and Search */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
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
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <TextField
              placeholder="Search by Order ID, Customer Name, Email, or Phone"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: 'primary.light' }} />
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
          </Box>
        </Paper>

        {/* Tabs and Order Table */}
        <Paper
          elevation={3}
          sx={{
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            border: '1px solid rgba(100, 255, 218, 0.1)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{
              borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
              '& .MuiTab-root': {
                minWidth: 100,
              },
            }}
          >
            <Tab label="All Orders" />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span>Pending</span>
                  {orders.filter(
                    (order) => order.status === OrderStatus.PENDING_PROCESSING
                  ).length > 0 && (
                    <Chip
                      label={
                        orders.filter(
                          (order) =>
                            order.status === OrderStatus.PENDING_PROCESSING
                        ).length
                      }
                      size="small"
                      color="warning"
                      sx={{ height: 20 }}
                    />
                  )}
                </Box>
              }
            />
            <Tab label="Approved" />
            <Tab label="Rejected & Cancelled" />
          </Tabs>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(1, 22, 39, 0.5)' }}>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : currentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(2, 136, 209, 0.08)',
                        },
                        cursor: 'pointer',
                        ...(order.status === OrderStatus.PENDING_PROCESSING && {
                          backgroundColor: 'rgba(255, 152, 0, 0.05)',
                        }),
                      }}
                      onClick={() => handleViewOrder(order)}
                    >
                      <TableCell>{order.id}</TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <PersonIcon fontSize="small" color="disabled" />
                          <div>
                            <Typography variant="body2">
                              {order.deliveryInfo.recipientName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {order.deliveryInfo.email}
                            </Typography>
                          </div>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <CalendarIcon fontSize="small" color="disabled" />
                          <Typography variant="body2">
                            {formatDate(order.createdAt)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {order.items.length} item
                          {order.items.length !== 1 && 's'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.items
                            .map((item) => item.product.title)
                            .join(', ')
                            .substring(0, 30)}
                          {order.items
                            .map((item) => item.product.title)
                            .join(', ').length > 30 && '...'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(order.totalAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={statusConfig[order.status].label}
                          color={statusConfig[order.status].color as any}
                          icon={statusConfig[order.status].icon}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                          <Tooltip title="View Order">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewOrder(order);
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {order.status === OrderStatus.PENDING_PROCESSING && (
                            <>
                              <Tooltip title="Approve Order">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApproveOrder(order);
                                  }}
                                >
                                  <CheckCircleIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Reject Order">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRejectOrder(order);
                                  }}
                                >
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredOrders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>

      {/* View Order Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6">
                  Order Details: {selectedOrder.id}
                </Typography>
                <Chip
                  size="small"
                  label={statusConfig[selectedOrder.status].label}
                  color={statusConfig[selectedOrder.status].color as any}
                  icon={statusConfig[selectedOrder.status].icon}
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  Customer Information
                </Typography>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2">Name</Typography>
                    <Typography variant="body2">
                      {selectedOrder.deliveryInfo.recipientName}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2">Email</Typography>
                    <Typography variant="body2">
                      {selectedOrder.deliveryInfo.email}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2">Phone</Typography>
                    <Typography variant="body2">
                      {selectedOrder.deliveryInfo.phone}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2">Province</Typography>
                    <Typography variant="body2">
                      {selectedOrder.deliveryInfo.province}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12 }}>
                    <Typography variant="subtitle2">Address</Typography>
                    <Typography variant="body2">
                      {selectedOrder.deliveryInfo.address}
                    </Typography>
                  </Grid2>
                </Grid2>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  Order Items
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2">
                              {item.product.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {item.product.category}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(item.price)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(item.price * item.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  Delivery Information
                </Typography>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2">Rush Delivery</Typography>
                    <Typography variant="body2">
                      {selectedOrder.deliveryInfo.isRushDelivery ? 'Yes' : 'No'}
                    </Typography>
                  </Grid2>

                  {selectedOrder.deliveryInfo.isRushDelivery && (
                    <>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2">
                          Delivery Time
                        </Typography>
                        <Typography variant="body2">
                          {selectedOrder.deliveryInfo.rushDeliveryTime
                            ? formatDate(
                                selectedOrder.deliveryInfo.rushDeliveryTime
                              )
                            : 'Not specified'}
                        </Typography>
                      </Grid2>

                      {selectedOrder.deliveryInfo.rushDeliveryInstructions && (
                        <Grid2 size={{ xs: 12 }}>
                          <Typography variant="subtitle2">
                            Delivery Instructions
                          </Typography>
                          <Typography variant="body2">
                            {
                              selectedOrder.deliveryInfo
                                .rushDeliveryInstructions
                            }
                          </Typography>
                        </Grid2>
                      )}
                    </>
                  )}
                </Grid2>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  Payment Information
                </Typography>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2">Subtotal</Typography>
                    <Typography variant="body2">
                      {formatCurrency(selectedOrder.subtotal)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2">VAT (10%)</Typography>
                    <Typography variant="body2">
                      {formatCurrency(selectedOrder.vat)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2">Delivery Fee</Typography>
                    <Typography variant="body2">
                      {formatCurrency(selectedOrder.deliveryFee)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="primary">
                      Total Amount
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(selectedOrder.totalAmount)}
                    </Typography>
                  </Grid2>

                  {selectedOrder.transactionId && (
                    <>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2">
                          Transaction ID
                        </Typography>
                        <Typography variant="body2">
                          {selectedOrder.transactionId}
                        </Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2">
                          Transaction Date
                        </Typography>
                        <Typography variant="body2">
                          {selectedOrder.transactionDatetime
                            ? formatDate(selectedOrder.transactionDatetime)
                            : 'N/A'}
                        </Typography>
                      </Grid2>
                    </>
                  )}
                </Grid2>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenViewDialog(false)}>Close</Button>

              {selectedOrder.status === OrderStatus.PENDING_PROCESSING && (
                <>
                  <Button
                    color="success"
                    variant="contained"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => {
                      setOpenViewDialog(false);
                      handleApproveOrder(selectedOrder);
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    color="error"
                    variant="contained"
                    startIcon={<CancelIcon />}
                    onClick={() => {
                      setOpenViewDialog(false);
                      handleRejectOrder(selectedOrder);
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

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

export default OrderManagementPage;
