import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Alert,
  Pagination,
} from '@mui/material';
import {
  ShoppingBag as ShoppingBagIcon,
  ReceiptLong as ReceiptIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as PendingIcon,
  Visibility as ViewIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import { Order, OrderStatus } from '../../types';
import { mockApiService } from '../../mock/mockApi';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AccountOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    // Load user data from localStorage
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    } else {
      // Redirect to login if not logged in
      navigate('/login');
    }

    // Fetch orders
    const fetchOrders = async () => {
      try {
        const allOrders = await mockApiService.getOrders();

        // In a real app, we would filter orders by user ID
        // For now, we'll use all orders as a mock for the current user
        setOrders(allOrders);
        setFilteredOrders(allOrders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  useEffect(() => {
    // Filter orders based on tab
    if (tabValue === 0) {
      // All orders
      setFilteredOrders(orders);
    } else if (tabValue === 1) {
      // Pending orders
      setFilteredOrders(
        orders.filter(
          (order) => order.status === OrderStatus.PENDING_PROCESSING
        )
      );
    } else if (tabValue === 2) {
      // Approved orders
      setFilteredOrders(
        orders.filter((order) => order.status === OrderStatus.APPROVED)
      );
    } else if (tabValue === 3) {
      // Cancelled/Rejected orders
      setFilteredOrders(
        orders.filter(
          (order) =>
            order.status === OrderStatus.CANCELLED ||
            order.status === OrderStatus.REJECTED
        )
      );
    }

    // Reset to first page when changing tabs
    setPage(1);
  }, [tabValue, orders]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
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
            size="small"
          />
        );
      case OrderStatus.APPROVED:
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Approved"
            color="success"
            size="small"
          />
        );
      case OrderStatus.CANCELLED:
        return (
          <Chip
            icon={<CancelIcon />}
            label="Cancelled"
            color="error"
            size="small"
          />
        );
      case OrderStatus.REJECTED:
        return (
          <Chip
            icon={<CancelIcon />}
            label="Rejected"
            color="error"
            size="small"
          />
        );
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (page - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

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
          Loading your orders...
        </Typography>
      </Box>
    );
  }

  if (!currentUser) {
    return (
      <Container maxWidth="sm" sx={{ py: 5 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          You need to log in to view your orders
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/login')}
          fullWidth
        >
          Go to Login
        </Button>
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
        <Box sx={{ mb: 4 }}>
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
            <ShoppingBagIcon /> My Orders
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            View and track all your orders. Click on any order to see more
            details.
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            borderRadius: 2,
            border: '1px solid rgba(100, 255, 218, 0.1)',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="order status tabs"
              sx={{
                '& .MuiTab-root': {
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.light',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.light',
                },
              }}
            >
              <Tab
                label="All Orders"
                icon={<ReceiptIcon />}
                iconPosition="start"
              />
              <Tab
                label="Pending"
                icon={<PendingIcon />}
                iconPosition="start"
              />
              <Tab
                label="Approved"
                icon={<CheckCircleIcon />}
                iconPosition="start"
              />
              <Tab
                label="Cancelled/Rejected"
                icon={<CancelIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* All Orders Tab */}
          <TabPanel value={tabValue} index={0}>
            {currentOrders.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ShoppingBagIcon
                  sx={{
                    fontSize: 60,
                    color: 'text.secondary',
                    mb: 2,
                    opacity: 0.5,
                  }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No orders found
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  You haven't placed any orders yet.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/products"
                  sx={{
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
                  Start Shopping
                </Button>
              </Box>
            ) : (
              <>
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Items</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentOrders.map((order) => (
                        <TableRow
                          key={order.id}
                          sx={{
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            '&:hover': {
                              backgroundColor: 'rgba(2, 136, 209, 0.05)',
                            },
                          }}
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>
                            {formatCurrency(order.totalAmount)}
                          </TableCell>
                          <TableCell>{order.items.length}</TableCell>
                          <TableCell>{getStatusChip(order.status)}</TableCell>
                          <TableCell>
                            <Button
                              startIcon={<ViewIcon />}
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/orders/${order.id}`);
                              }}
                              sx={{
                                borderColor: 'rgba(100, 255, 218, 0.3)',
                                '&:hover': {
                                  borderColor: 'rgba(100, 255, 218, 0.5)',
                                  backgroundColor: 'rgba(100, 255, 218, 0.05)',
                                },
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mt: 3,
                      mb: 2,
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          color: 'text.secondary',
                        },
                        '& .MuiPaginationItem-root.Mui-selected': {
                          backgroundColor: 'rgba(2, 136, 209, 0.2)',
                          color: 'primary.light',
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </TabPanel>

          {/* Pending Orders Tab */}
          <TabPanel value={tabValue} index={1}>
            {currentOrders.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <PendingIcon
                  sx={{
                    fontSize: 60,
                    color: 'text.secondary',
                    mb: 2,
                    opacity: 0.5,
                  }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No pending orders
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  You don't have any orders awaiting processing.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/products"
                  sx={{
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
                  Start Shopping
                </Button>
              </Box>
            ) : (
              <>
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Items</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentOrders.map((order) => (
                        <TableRow
                          key={order.id}
                          sx={{
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            '&:hover': {
                              backgroundColor: 'rgba(2, 136, 209, 0.05)',
                            },
                          }}
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>
                            {formatCurrency(order.totalAmount)}
                          </TableCell>
                          <TableCell>{order.items.length}</TableCell>
                          <TableCell>{getStatusChip(order.status)}</TableCell>
                          <TableCell>
                            <Button
                              startIcon={<ViewIcon />}
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/orders/${order.id}`);
                              }}
                              sx={{
                                borderColor: 'rgba(100, 255, 218, 0.3)',
                                '&:hover': {
                                  borderColor: 'rgba(100, 255, 218, 0.5)',
                                  backgroundColor: 'rgba(100, 255, 218, 0.05)',
                                },
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mt: 3,
                      mb: 2,
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          color: 'text.secondary',
                        },
                        '& .MuiPaginationItem-root.Mui-selected': {
                          backgroundColor: 'rgba(2, 136, 209, 0.2)',
                          color: 'primary.light',
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </TabPanel>

          {/* Approved Orders Tab */}
          <TabPanel value={tabValue} index={2}>
            {currentOrders.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircleIcon
                  sx={{
                    fontSize: 60,
                    color: 'text.secondary',
                    mb: 2,
                    opacity: 0.5,
                  }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No approved orders
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  You don't have any approved orders yet.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/products"
                  sx={{
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
                  Start Shopping
                </Button>
              </Box>
            ) : (
              <>
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Items</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentOrders.map((order) => (
                        <TableRow
                          key={order.id}
                          sx={{
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            '&:hover': {
                              backgroundColor: 'rgba(2, 136, 209, 0.05)',
                            },
                          }}
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>
                            {formatCurrency(order.totalAmount)}
                          </TableCell>
                          <TableCell>{order.items.length}</TableCell>
                          <TableCell>{getStatusChip(order.status)}</TableCell>
                          <TableCell>
                            <Button
                              startIcon={<ViewIcon />}
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/orders/${order.id}`);
                              }}
                              sx={{
                                borderColor: 'rgba(100, 255, 218, 0.3)',
                                '&:hover': {
                                  borderColor: 'rgba(100, 255, 218, 0.5)',
                                  backgroundColor: 'rgba(100, 255, 218, 0.05)',
                                },
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mt: 3,
                      mb: 2,
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          color: 'text.secondary',
                        },
                        '& .MuiPaginationItem-root.Mui-selected': {
                          backgroundColor: 'rgba(2, 136, 209, 0.2)',
                          color: 'primary.light',
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </TabPanel>

          {/* Cancelled/Rejected Orders Tab */}
          <TabPanel value={tabValue} index={3}>
            {currentOrders.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CancelIcon
                  sx={{
                    fontSize: 60,
                    color: 'text.secondary',
                    mb: 2,
                    opacity: 0.5,
                  }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No cancelled or rejected orders
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  You don't have any cancelled or rejected orders.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/products"
                  sx={{
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
                  Start Shopping
                </Button>
              </Box>
            ) : (
              <>
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Items</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentOrders.map((order) => (
                        <TableRow
                          key={order.id}
                          sx={{
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            '&:hover': {
                              backgroundColor: 'rgba(2, 136, 209, 0.05)',
                            },
                          }}
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>
                            {formatCurrency(order.totalAmount)}
                          </TableCell>
                          <TableCell>{order.items.length}</TableCell>
                          <TableCell>{getStatusChip(order.status)}</TableCell>
                          <TableCell>
                            <Button
                              startIcon={<ViewIcon />}
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/orders/${order.id}`);
                              }}
                              sx={{
                                borderColor: 'rgba(100, 255, 218, 0.3)',
                                '&:hover': {
                                  borderColor: 'rgba(100, 255, 218, 0.5)',
                                  backgroundColor: 'rgba(100, 255, 218, 0.05)',
                                },
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mt: 3,
                      mb: 2,
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          color: 'text.secondary',
                        },
                        '& .MuiPaginationItem-root.Mui-selected': {
                          backgroundColor: 'rgba(2, 136, 209, 0.2)',
                          color: 'primary.light',
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default AccountOrdersPage;
