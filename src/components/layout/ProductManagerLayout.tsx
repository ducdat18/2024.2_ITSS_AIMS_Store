import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Container,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  AddShoppingCart as AddShoppingCartIcon,
  Edit as EditIcon,
  ListAlt as ListAltIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { mockAccountService } from '../../mock/mockDataAccount';
import { UserAccount, UserRole } from '../../types';

// Drawer width when open
const drawerWidth = 240;

const ProductManagerLayout: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [notificationsAnchorEl, setNotificationsAnchorEl] =
    useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [productManagerAccount, setProductManagerAccount] =
    useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch product manager account data
  useEffect(() => {
    const fetchProductManagerAccount = async () => {
      try {
        const accounts = await mockAccountService.getAccounts();
        const productManagerAccounts = accounts.filter(
          (account) =>
            account.roles.includes(UserRole.PRODUCT_MANAGER) &&
            !account.isBlocked
        );

        if (productManagerAccounts.length > 0) {
          setProductManagerAccount(productManagerAccounts[0]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching product manager account:', error);
        setLoading(false);
      }
    };

    fetchProductManagerAccount();
  }, []);

  // Handle notification menu
  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  // Handle profile menu
  const handleProfileOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Handle logout
  const handleLogout = () => {
    navigate('/login');
  };

  // Check if a menu item is active
  const isActive = (path: string) => {
    if (path === '/product-manager' || path === '/product-manager/dashboard') {
      return (
        location.pathname === '/product-manager' ||
        location.pathname === '/product-manager/dashboard'
      );
    }
    return location.pathname.startsWith(path);
  };

  // Get first letter of username for avatar
  const getAvatarInitial = () => {
    if (!productManagerAccount || !productManagerAccount.username) return 'P';
    return productManagerAccount.username.charAt(0).toUpperCase();
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          backgroundImage:
            'linear-gradient(rgba(0, 44, 77, 0.99), rgba(1, 22, 39, 0.97))',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: '100%',
        }}
      >
        <Toolbar disableGutters sx={{ px: 2 }}>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InventoryIcon
              sx={{ color: 'primary.light', mr: 1.5, fontSize: 28 }}
            />
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  lineHeight: 1.1,
                }}
              >
                AIMS Product Manager
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'primary.light',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '0.7rem',
                }}
              >
                Product Management
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Notification Icon */}
          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              onClick={handleNotificationsOpen}
              sx={{ ml: 1 }}
            >
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User profile */}
          {loading ? (
            <CircularProgress
              size={24}
              sx={{ ml: 2, color: 'primary.light' }}
            />
          ) : (
            <Tooltip
              title={
                productManagerAccount
                  ? `Account: ${productManagerAccount.username}`
                  : 'Account'
              }
            >
              <IconButton
                onClick={handleProfileOpen}
                sx={{
                  ml: 1,
                  p: 0.5,
                  border: '2px solid rgba(100, 255, 218, 0.2)',
                  '&:hover': {
                    border: '2px solid rgba(100, 255, 218, 0.5)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'primary.dark',
                    fontSize: '1rem',
                    width: 32,
                    height: 32,
                  }}
                >
                  {getAvatarInitial()}
                </Avatar>
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background:
              'linear-gradient(rgba(0, 44, 77, 0.99), rgba(1, 22, 39, 0.97))',
            color: 'white',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItemButton
              component={Link}
              to="/product-manager/dashboard"
              selected={isActive('/product-manager/dashboard')}
            >
              <ListItemIcon>
                <DashboardIcon sx={{ color: 'primary.light' }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/product-manager/products"
              selected={isActive('/product-manager/products')}
            >
              <ListItemIcon>
                <InventoryIcon sx={{ color: 'primary.light' }} />
              </ListItemIcon>
              <ListItemText primary="Product List" />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/product-manager/add-product"
              selected={isActive('/product-manager/add-product')}
            >
              <ListItemIcon>
                <AddShoppingCartIcon sx={{ color: 'primary.light' }} />
              </ListItemIcon>
              <ListItemText primary="Add Product" />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/product-manager/orders"
              selected={isActive('/product-manager/orders')}
            >
              <ListItemIcon>
                <ListAltIcon sx={{ color: 'primary.light' }} />
              </ListItemIcon>
              <ListItemText primary="Order Management" />
            </ListItemButton>
          </List>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          <List>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon sx={{ color: 'primary.light' }} />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          overflow: 'auto',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
      >
        <MenuItem onClick={handleNotificationsClose}>
          No new notifications
        </MenuItem>
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileClose}
      >
        <MenuItem onClick={handleProfileClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleProfileClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProductManagerLayout;
