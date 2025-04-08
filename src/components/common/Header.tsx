// src/components/layout/Header.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  Badge,
  Container,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  useMediaQuery,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Book as BookIcon,
  Album as CDIcon,
  Radio as LPIcon,
  MovieCreation as DVDIcon,
  Waves as WavesIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?search=${searchQuery}`);
  };

  // Category definitions - now only used in mobile drawer
  const categories = [
    { label: 'Books', value: 'BOOK', icon: <BookIcon /> },
    { label: 'CDs', value: 'CD', icon: <CDIcon /> },
    { label: 'LP Records', value: 'LP', icon: <LPIcon /> },
    { label: 'DVDs', value: 'DVD', icon: <DVDIcon /> },
  ];

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

          <Box sx={{ display: 'flex' }}>
            <IconButton
              color="inherit"
              component={Link}
              to="/cart"
              aria-label="cart"
            >
              <Badge badgeContent={0} color="primary">
                <CartIcon />
              </Badge>
            </IconButton>

            <Button
              variant="outlined"
              color="primary"
              startIcon={<PersonIcon />}
              onClick={() => navigate('/login')}
              sx={{ ml: { xs: 0, sm: 1 }, display: { xs: 'none', sm: 'flex' } }}
            >
              Login
            </Button>
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
            <ListItemButton
              onClick={() => {
                navigate('/cart');
                setDrawerOpen(false);
              }}
            >
              <ListItemIcon sx={{ color: 'primary.light' }}>
                <CartIcon />
              </ListItemIcon>
              <ListItemText primary="Shopping Cart" />
            </ListItemButton>

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
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
