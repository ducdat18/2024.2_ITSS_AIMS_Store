// src/pages/productManager/ProductManagerDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2,
  Paper,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  AddCircle as AddCircleIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { mockApiService } from '../../mock/mockApi';
import { ProductCategory, OrderStatus, Product, Order } from '../../types';
import { formatCurrency } from '../../utils/formatters';

const ProductManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<{
    totalProducts: number;
    lowStockProducts: number;
    pendingOrders: number;
    productCategories: {
      [key in ProductCategory]: number;
    };
    recentProducts: Product[];
    pendingOrdersList: Order[];
    dailyOperations: {
      added: number;
      updated: number;
      deleted: number;
    };
  }>({
    totalProducts: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
    productCategories: {
      [ProductCategory.BOOK]: 0,
      [ProductCategory.CD]: 0,
      [ProductCategory.LP]: 0,
      [ProductCategory.DVD]: 0,
    },
    recentProducts: [],
    pendingOrdersList: [],
    dailyOperations: {
      added: 0,
      updated: 0,
      deleted: 0,
    },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch products
        const products = await mockApiService.getProducts();
        const orders = await mockApiService.getOrders();

        // Calculate statistics
        const lowStock = products.filter(
          (product) => product.quantity < 10
        ).length;
        const pendingOrders = orders.filter(
          (order) => order.status === OrderStatus.PENDING_PROCESSING
        ).length;

        // Count products by category
        const categoryCounts = products.reduce(
          (acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
          },
          {
            [ProductCategory.BOOK]: 0,
            [ProductCategory.CD]: 0,
            [ProductCategory.LP]: 0,
            [ProductCategory.DVD]: 0,
          }
        );

        // Get most recent products (last 5)
        const recentProducts = [...products]
          .sort(
            (a, b) =>
              new Date(b.warehouseEntryDate).getTime() -
              new Date(a.warehouseEntryDate).getTime()
          )
          .slice(0, 5);

        // Get pending orders (last 5)
        const pendingOrdersList = orders
          .filter((order) => order.status === OrderStatus.PENDING_PROCESSING)
          .slice(0, 5);

        // Set dashboard data
        setDashboardStats({
          totalProducts: products.length,
          lowStockProducts: lowStock,
          pendingOrders: pendingOrders,
          productCategories: categoryCounts,
          recentProducts: recentProducts,
          pendingOrdersList: pendingOrdersList,
          dailyOperations: {
            added: 12, // Mocked daily statistics
            updated: 8,
            deleted: 3,
          },
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return 'error.main';
    if (percentage < 70) return 'warning.main';
    return 'success.main';
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
          Loading dashboard...
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
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
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
            <DashboardIcon /> Product Manager Dashboard
          </Typography>

          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={() => navigate('/product-management/products/add')}
              sx={{ mr: 2 }}
            >
              Add New Product
            </Button>
            <IconButton
              color="primary"
              onClick={() => window.location.reload()}
              sx={{ bgcolor: 'rgba(2, 136, 209, 0.1)' }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>

        <Alert
          severity="info"
          sx={{
            mb: 4,
            backgroundColor: 'rgba(2, 136, 209, 0.1)',
            border: '1px solid rgba(100, 255, 218, 0.2)',
            '& .MuiAlert-icon': {
              color: 'primary.light',
            },
          }}
        >
          Daily operations limit: Added {dashboardStats.dailyOperations.added}{' '}
          products, Updated {dashboardStats.dailyOperations.updated} products,
          Deleted {dashboardStats.dailyOperations.deleted} products. You can
          update up to {30 - dashboardStats.dailyOperations.updated} more
          products today.
        </Alert>

        {/* Statistics Cards */}
        <Grid2 container spacing={3} sx={{ mb: 4 }}>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                borderRadius: 2,
                border: '1px solid rgba(100, 255, 218, 0.1)',
                height: '100%',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
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
                    'radial-gradient(circle at 80% 20%, rgba(2, 136, 209, 0.1) 0%, transparent 70%)',
                  opacity: 0.6,
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
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Products
                  </Typography>
                  <InventoryIcon
                    sx={{ color: 'primary.light', fontSize: 40 }}
                  />
                </Box>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{ fontWeight: 'bold', color: 'primary.light', mb: 1 }}
                >
                  {dashboardStats.totalProducts}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Across {Object.keys(dashboardStats.productCategories).length}{' '}
                  categories
                </Typography>
              </Box>
            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                borderRadius: 2,
                border: '1px solid rgba(100, 255, 218, 0.1)',
                height: '100%',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
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
                    'radial-gradient(circle at 80% 20%, rgba(255, 82, 82, 0.1) 0%, transparent 70%)',
                  opacity: 0.6,
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
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Low Stock Alert
                  </Typography>
                  <TrendingDownIcon
                    sx={{ color: 'error.main', fontSize: 40 }}
                  />
                </Box>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{ fontWeight: 'bold', color: 'error.main', mb: 1 }}
                >
                  {dashboardStats.lowStockProducts}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Products with less than 10 items in stock
                </Typography>
              </Box>
            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                borderRadius: 2,
                border: '1px solid rgba(100, 255, 218, 0.1)',
                height: '100%',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
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
                    'radial-gradient(circle at 80% 20%, rgba(255, 152, 0, 0.1) 0%, transparent 70%)',
                  opacity: 0.6,
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
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Pending Orders
                  </Typography>
                  <ShoppingCartIcon
                    sx={{ color: 'warning.main', fontSize: 40 }}
                  />
                </Box>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{ fontWeight: 'bold', color: 'warning.main', mb: 1 }}
                >
                  {dashboardStats.pendingOrders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Orders waiting for approval
                </Typography>
              </Box>
            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                borderRadius: 2,
                border: '1px solid rgba(100, 255, 218, 0.1)',
                height: '100%',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
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
                    'radial-gradient(circle at 80% 20%, rgba(0, 191, 165, 0.1) 0%, transparent 70%)',
                  opacity: 0.6,
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
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Daily Updates
                  </Typography>
                  <TrendingUpIcon
                    sx={{ color: 'success.main', fontSize: 40 }}
                  />
                </Box>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{ fontWeight: 'bold', color: 'success.main', mb: 1 }}
                >
                  {dashboardStats.dailyOperations.updated}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Products updated today (limit: 30)
                </Typography>
              </Box>
            </Paper>
          </Grid2>
        </Grid2>

        {/* Category Distribution and Recent Products */}
        <Grid2 container spacing={3} sx={{ mb: 4 }}>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                borderRadius: 2,
                border: '1px solid rgba(100, 255, 218, 0.1)',
                height: '100%',
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
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: 'primary.light',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 3,
                  }}
                >
                  <InventoryIcon fontSize="small" />
                  Product Categories
                </Typography>
                <Divider
                  sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                />

                {Object.entries(dashboardStats.productCategories).map(
                  ([category, count]) => {
                    const percentage =
                      ((count as number) / dashboardStats.totalProducts) * 100;
                    return (
                      <Box key={category} sx={{ mb: 3 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 1,
                          }}
                        >
                          <Typography variant="body1" color="text.primary">
                            {category}
                          </Typography>
                          <Typography variant="body1" color="text.primary">
                            {count} ({percentage.toFixed(1)}%)
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: '100%',
                            height: 8,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 4,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              width: `${percentage}%`,
                              backgroundColor: getProgressColor(percentage),
                              borderRadius: 4,
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  }
                )}

                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    component={Link}
                    to="/product-management/products"
                    sx={{
                      mt: 1,
                      borderColor: 'rgba(100, 255, 218, 0.3)',
                      '&:hover': {
                        borderColor: 'rgba(100, 255, 218, 0.5)',
                        backgroundColor: 'rgba(100, 255, 218, 0.05)',
                      },
                    }}
                  >
                    View All Products
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                borderRadius: 2,
                border: '1px solid rgba(100, 255, 218, 0.1)',
                height: '100%',
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
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: 'primary.light',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 3,
                  }}
                >
                  <WavesIcon fontSize="small" />
                  Recent Product Additions
                </Typography>
                <Divider
                  sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                />

                {dashboardStats.recentProducts.length > 0 ? (
                  <List>
                    {dashboardStats.recentProducts.map((product: any) => (
                      <ListItem
                        key={product.id}
                        sx={{
                          p: 2,
                          mb: 1,
                          bgcolor: 'rgba(13, 37, 56, 0.5)',
                          borderRadius: 1,
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'rgba(13, 37, 56, 0.8)',
                          },
                        }}
                        secondaryAction={
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                              navigate(
                                `/product-management/products/edit/${product.id}`
                              )
                            }
                            sx={{
                              borderColor: 'rgba(100, 255, 218, 0.3)',
                              '&:hover': {
                                borderColor: 'rgba(100, 255, 218, 0.5)',
                                backgroundColor: 'rgba(100, 255, 218, 0.05)',
                              },
                            }}
                          >
                            Edit
                          </Button>
                        }
                      >
                        <ListItemText
                          primary={
                            <Typography color="text.primary">
                              {product.title}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ color: 'text.secondary', mt: 0.5 }}>
                              <Typography variant="body2" component="span">
                                {product.category} •{' '}
                                {formatCurrency(product.price)} • Stock:{' '}
                                {product.quantity} • Added:{' '}
                                {new Date(
                                  product.warehouseEntryDate
                                ).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    align="center"
                  >
                    No recent products added
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid2>
        </Grid2>

        {/* Pending Orders */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            borderRadius: 2,
            border: '1px solid rgba(100, 255, 218, 0.1)',
            mb: 4,
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
                'radial-gradient(circle at 50% 50%, rgba(255, 152, 0, 0.08) 0%, transparent 70%)',
              opacity: 0.8,
              zIndex: 1,
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: 'warning.main',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 3,
              }}
            >
              <ShoppingCartIcon fontSize="small" />
              Pending Orders
            </Typography>
            <Divider sx={{ mb: 3, borderColor: 'rgba(255, 152, 0, 0.1)' }} />

            {dashboardStats.pendingOrdersList.length > 0 ? (
              <List>
                <Grid2 container spacing={2}>
                  {dashboardStats.pendingOrdersList.map((order: any) => (
                    <Grid2 size={{ xs: 12, md: 6 }} key={order.id}>
                      <Card
                        sx={{
                          bgcolor: 'rgba(13, 37, 56, 0.5)',
                          border: '1px solid rgba(255, 152, 0, 0.2)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'rgba(13, 37, 56, 0.8)',
                          },
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="h6"
                            color="warning.main"
                            gutterBottom
                          >
                            Order #{order.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Date: {new Date(order.createdAt).toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Customer: {order.deliveryInfo.recipientName}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ mt: 1 }}
                          >
                            Items: {order.items.length} • Total:{' '}
                            {formatCurrency(order.totalAmount)}
                          </Typography>

                          <Box
                            sx={{
                              mt: 2,
                              display: 'flex',
                              justifyContent: 'flex-end',
                            }}
                          >
                            <Button
                              variant="outlined"
                              color="warning"
                              size="small"
                              onClick={() =>
                                navigate(
                                  `/product-management/orders/${order.id}`
                                )
                              }
                              sx={{
                                borderColor: 'rgba(255, 152, 0, 0.5)',
                                color: 'warning.main',
                                '&:hover': {
                                  borderColor: 'warning.main',
                                  backgroundColor: 'rgba(255, 152, 0, 0.05)',
                                },
                              }}
                            >
                              Review Order
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid2>
                  ))}
                </Grid2>
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center">
                No pending orders at the moment
              </Typography>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                color="warning"
                endIcon={<ArrowForwardIcon />}
                component={Link}
                to="/product-management/orders"
                sx={{
                  mt: 1,
                  borderColor: 'rgba(255, 152, 0, 0.5)',
                  color: 'warning.main',
                  '&:hover': {
                    borderColor: 'warning.main',
                    backgroundColor: 'rgba(255, 152, 0, 0.05)',
                  },
                }}
              >
                View All Orders
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProductManagerDashboard;
