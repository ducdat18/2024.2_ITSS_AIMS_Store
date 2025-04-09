import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { mockApiService } from '../../mock/mockApi';
import { OrderStatus } from '../../types';

// Sidebar width when open
const DRAWER_WIDTH = 280;
// Sidebar width when collapsed
const COLLAPSED_DRAWER_WIDTH = 65;

const ProductManagerLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] =
    useState<null | HTMLElement>(null);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  // Effect to fetch pending orders count
  React.useEffect(() => {
    const fetchPendingOrdersCount = async () => {
      try {
        const orders = await mockApiService.getOrders();
        const pendingCount = orders.filter(
          (order) => order.status === OrderStatus.PENDING_PROCESSING
        ).length;
        setPendingOrdersCount(pendingCount);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchPendingOrdersCount();
  }, []);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };

  const handleOpenNotificationsMenu = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleLogout = () => {
    // In a real app, this would call a logout service
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Navigation items for sidebar
  const navigationItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/product-management',
      active: location.pathname === '/product-management',
    },
    {
      text: 'Products',
      icon: <InventoryIcon />,
      path: '/product-management/products',
      active: location.pathname.includes('/product-management/products'),
    },
    {
      text: 'Add Product',
      icon: <AddIcon />,
      path: '/product-management/products/add',
      active: location.pathname === '/product-management/products/add',
    },
    {
      text: 'Orders',
      icon: <ShippingIcon />,
      path: '/product-management/orders',
      active: location.pathname.includes('/product-management/orders'),
      badge: pendingOrdersCount,
    },
  ];

  // Drawer content (sidebar)
  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box
        sx={{
          height: 70,
          display: 'flex',
          alignItems: 'center',
          px: 2,
          borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
        }}
      >
        <WavesIcon
          sx={{ mr: sidebarCollapsed ? 0 : 1, color: 'primary.light' }}
        />
        {!sidebarCollapsed && (
          <Typography
            variant="h6"
            component="div"
            sx={{ color: 'primary.light', fontWeight: 'bold' }}
          >
            AIMS PM
          </Typography>
        )}
      </Box>
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigate(item.path)}
              selected={item.active}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'rgba(100, 255, 218, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(100, 255, 218, 0.15)',
                  },
                },
                '&:hover': {
                  bgcolor: 'rgba(100, 255, 218, 0.05)',
                },
                minHeight: 48,
                justifyContent: sidebarCollapsed ? 'center' : 'initial',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  color: item.active ? 'primary.light' : 'inherit',
                  minWidth: 0,
                  mr: sidebarCollapsed ? 0 : 3,
                  justifyContent: 'center',
                }}
              >
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              {!sidebarCollapsed && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    color: item.active ? 'primary.light' : 'inherit',
                    fontWeight: item.active ? 'bold' : 'regular',
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(100, 255, 218, 0.05)',
              },
              minHeight: 48,
              justifyContent: sidebarCollapsed ? 'center' : 'initial',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: sidebarCollapsed ? 0 : 3,
                justifyContent: 'center',
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {!sidebarCollapsed && <ListItemText primary="Logout" />}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: {
            xs: '100%',
            md: sidebarCollapsed
              ? `calc(100% - ${COLLAPSED_DRAWER_WIDTH}px)`
              : `calc(100% - ${DRAWER_WIDTH}px)`,
          },
          ml: {
            xs: 0,
            md: sidebarCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH,
          },
          boxShadow: 'none',
          borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          {/* Notifications Menu */}
          <Box sx={{ ml: 2 }}>
            <Tooltip title="Show notifications">
              <IconButton
                size="large"
                color="inherit"
                onClick={handleOpenNotificationsMenu}
              >
                <Badge badgeContent={pendingOrdersCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="notifications-menu"
              anchorEl={anchorElNotifications}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNotifications)}
              onClose={handleCloseNotificationsMenu}
            >
              {pendingOrdersCount > 0 ? (
                <MenuItem
                  onClick={() => {
                    handleNavigate('/product-management/orders');
                    handleCloseNotificationsMenu();
                  }}
                >
                  <ShippingIcon sx={{ mr: 1, fontSize: 18 }} />
                  <Typography variant="body2">
                    {pendingOrdersCount} pending order
                    {pendingOrdersCount !== 1 && 's'} to review
                  </Typography>
                </MenuItem>
              ) : (
                <MenuItem onClick={handleCloseNotificationsMenu}>
                  <Typography variant="body2">No new notifications</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* Profile Menu */}
          <Box sx={{ ml: 2 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  <PersonIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu}>
                <PersonIcon sx={{ mr: 1, fontSize: 18 }} />
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <SettingsIcon sx={{ mr: 1, fontSize: 18 }} />
                <Typography textAlign="center">Settings</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1, fontSize: 18 }} />
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Responsive Drawer */}
      <Box
        component="nav"
        sx={{
          width: {
            xs: 0,
            md: sidebarCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH,
          },
          flexShrink: { md: 0 },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
              borderRight: '1px solid rgba(100, 255, 218, 0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: sidebarCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH,
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
              borderRight: '1px solid rgba(100, 255, 218, 0.1)',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: '100%',
            md: sidebarCollapsed
              ? `calc(100% - ${COLLAPSED_DRAWER_WIDTH}px)`
              : `calc(100% - ${DRAWER_WIDTH}px)`,
          },
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar /> {/* This adds spacing below the app bar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default ProductManagerLayout;
