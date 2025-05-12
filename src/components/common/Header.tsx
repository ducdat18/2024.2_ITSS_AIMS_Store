import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  Container,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  useMediaQuery,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Book as BookIcon,
  Album as CDIcon,
  Radio as LPIcon,
  MovieCreation as DVDIcon,
  Waves as WavesIcon,
  Inventory as InventoryIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../../types';

const Header: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Load user from localStorage on component mount
  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?search=${searchQuery}`);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    handleMenuClose();
    navigate('/');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  // Category definitions - now only used in mobile drawer
  const categories = [
    { label: 'Books', value: 'BOOK', icon: <BookIcon /> },
    { label: 'CDs', value: 'CD', icon: <CDIcon /> },
    { label: 'LP Records', value: 'LP', icon: <LPIcon /> },
    { label: 'DVDs', value: 'DVD', icon: <DVDIcon /> },
  ];

  // Check if user has a specific role
  const hasRole = (role: UserRole): boolean => {
    return currentUser?.roles?.includes(role) || false;
  };

  // Get proper dashboard link based on user role
  const getDashboardLink = (): string => {
    if (hasRole(UserRole.ADMIN)) {
      return '/admin';
    } else if (hasRole(UserRole.PRODUCT_MANAGER)) {
      return '/product-management';
    }
    return '/';
  };

  // Get settings link based on user role
  const getSettingsLink = (): string => {
    if (hasRole(UserRole.ADMIN)) {
      return '/admin/settings';
    } else if (hasRole(UserRole.PRODUCT_MANAGER)) {
      return '/product-management/dashboard';
    }
    return '/';
  };

  return (
    <AppBar position="sticky" elevation={4}>
      <Container>
        <Toolbar disableGutters sx={{ py: 1 }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="primary"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontWeight: 700,
              fontSize: '24px',
              color: 'primary.light',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              mr: 3,
            }}
          >
            <WavesIcon sx={{ mr: 1, color: 'primary.light' }} />
            AIMS
          </Typography>

          {!isMobile && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/products"
                sx={{
                  mx: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <InventoryIcon fontSize="small" />
                Products
              </Button>

              <Button
                color="inherit"
                component={Link}
                to="/about"
                sx={{ mx: 1 }}
              >
                About
              </Button>

              <Button
                color="inherit"
                component={Link}
                to="/contact"
                sx={{ mx: 1 }}
              >
                Contact
              </Button>
            </>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              position: 'relative',
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.common.white, 0.08),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.12),
              },
              mr: 2,
              width: { xs: '100%', sm: 'auto' },
              display: { xs: isMobile ? 'none' : 'flex', md: 'flex' },
            }}
          >
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <IconButton type="submit" sx={{ p: 1, color: 'text.secondary' }}>
                <SearchIcon />
              </IconButton>
              <InputBase
                placeholder="Search products…"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  color: 'text.primary',
                  width: '100%',
                  '& .MuiInputBase-input': {
                    padding: theme.spacing(1, 1, 1, 0),
                    width: '100%',
                    minWidth: '150px',
                  },
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {currentUser ? (
              <>
                <Tooltip title="Account menu">
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    size="small"
                    sx={{ ml: 1 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: hasRole(UserRole.ADMIN)
                          ? 'primary.main'
                          : 'secondary.main',
                      }}
                    >
                      {currentUser.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  sx={{
                    '& .MuiPaper-root': {
                      borderRadius: 2,
                      minWidth: 180,
                      backgroundColor: 'rgba(13, 37, 56, 0.95)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
                      border: '1px solid rgba(100, 255, 218, 0.1)',
                    },
                  }}
                >
                  <Box
                    sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center' }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        mr: 1,
                        backgroundColor: hasRole(UserRole.ADMIN)
                          ? 'primary.main'
                          : 'secondary.main',
                      }}
                    >
                      {currentUser.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.primary">
                        {currentUser.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {currentUser.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: 'rgba(100, 255, 218, 0.1)' }} />

                  {/* Show dashboard option for Admin and Product Manager */}
                  {(hasRole(UserRole.ADMIN) ||
                    hasRole(UserRole.PRODUCT_MANAGER)) && (
                    <MenuItem
                      onClick={() => handleNavigate(getDashboardLink())}
                    >
                      <ListItemIcon>
                        <DashboardIcon
                          fontSize="small"
                          sx={{ color: 'primary.light' }}
                        />
                      </ListItemIcon>
                      <ListItemText>Dashboard</ListItemText>
                    </MenuItem>
                  )}

                  <MenuItem onClick={() => handleNavigate(getSettingsLink())}>
                    <ListItemIcon>
                      <SettingsIcon
                        fontSize="small"
                        sx={{ color: 'primary.light' }}
                      />
                    </ListItemIcon>
                    <ListItemText>Settings</ListItemText>
                  </MenuItem>

                  <Divider sx={{ borderColor: 'rgba(100, 255, 218, 0.1)' }} />

                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon
                        fontSize="small"
                        sx={{ color: 'error.main' }}
                      />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<PersonIcon />}
                onClick={() => navigate('/login')}
                sx={{
                  ml: { xs: 0, sm: 1 },
                  display: { xs: 'none', sm: 'flex' },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            width: 250,
          },
        }}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <Typography
            variant="h6"
            sx={{
              px: 2,
              mb: 1,
              fontWeight: 'bold',
              color: 'primary.light',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <WavesIcon sx={{ mr: 1, color: 'primary.light' }} />
            AIMS Media Store
          </Typography>

          {currentUser && (
            <Box
              sx={{
                px: 2,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  mr: 1,
                  backgroundColor: hasRole(UserRole.ADMIN)
                    ? 'primary.main'
                    : 'secondary.main',
                }}
              >
                {currentUser.username.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="subtitle2" color="text.primary">
                {currentUser.username}
              </Typography>
            </Box>
          )}

          <Divider />
          <List>
            <ListItemButton
              onClick={() => {
                navigate('/');
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary="Home" />
            </ListItemButton>

            {/* Main Products link in mobile drawer */}
            <ListItemButton
              onClick={() => {
                navigate('/products');
                setDrawerOpen(false);
              }}
            >
              <ListItemIcon sx={{ color: 'primary.light' }}>
                <InventoryIcon />
              </ListItemIcon>
              <ListItemText primary="All Products" />
            </ListItemButton>

            {/* Category filter options in mobile menu */}
            <Divider />
            <Typography
              variant="subtitle2"
              sx={{ px: 2, py: 1, fontWeight: 'bold', color: 'text.secondary' }}
            >
              Filter By Category
            </Typography>

            {categories.map((category) => (
              <ListItemButton
                key={category.value}
                onClick={() => {
                  navigate(`/products?category=${category.value}`);
                  setDrawerOpen(false);
                }}
                sx={{ pl: 3 }}
              >
                <ListItemIcon sx={{ color: 'primary.light' }}>
                  {category.icon}
                </ListItemIcon>
                <ListItemText primary={category.label} />
              </ListItemButton>
            ))}

            <Divider />
            <ListItemButton
              onClick={() => {
                navigate('/contact');
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary="Contact" />
            </ListItemButton>

            <Divider />

            {currentUser ? (
              <>
                {(hasRole(UserRole.ADMIN) ||
                  hasRole(UserRole.PRODUCT_MANAGER)) && (
                  <ListItemButton
                    onClick={() => {
                      navigate(getDashboardLink());
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemIcon sx={{ color: 'primary.light' }}>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItemButton>
                )}

                <ListItemButton
                  onClick={() => {
                    handleLogout();
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemIcon sx={{ color: 'error.main' }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </>
            ) : (
              <ListItemButton
                onClick={() => {
                  navigate('/login');
                  setDrawerOpen(false);
                }}
              >
                <ListItemIcon sx={{ color: 'primary.light' }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
