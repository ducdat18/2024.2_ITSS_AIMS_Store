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
  Menu,
  MenuItem,
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
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

  const handleCategoryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCategoryClose = () => {
    setAnchorEl(null);
  };

  const handleCategorySelect = (category: string) => {
    navigate(`/products/category/${category}`);
    setAnchorEl(null);
    setDrawerOpen(false);
  };

  const categories = [
    { label: 'Books', value: 'BOOK', icon: <BookIcon /> },
    { label: 'CDs', value: 'CD', icon: <CDIcon /> },
    { label: 'LP Records', value: 'LP', icon: <LPIcon /> },
    { label: 'DVDs', value: 'DVD', icon: <DVDIcon /> },
  ];

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
      }}
    >
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
              color: 'primary.main',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              mr: 3,
            }}
          >
            AIMS
          </Typography>

          {!isMobile && (
            <>
              <Button color="primary" component={Link} to="/" sx={{ mx: 1 }}>
                Home
              </Button>

              <Button
                color="primary"
                endIcon={<ExpandMoreIcon />}
                onClick={handleCategoryClick}
                sx={{ mx: 1 }}
              >
                Categories
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCategoryClose}
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category.value}
                    onClick={() => handleCategorySelect(category.value)}
                  >
                    <ListItemIcon>{category.icon}</ListItemIcon>
                    <ListItemText>{category.label}</ListItemText>
                  </MenuItem>
                ))}
              </Menu>

              <Button
                color="primary"
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
              borderRadius: 1,
              backgroundColor: alpha(theme.palette.common.black, 0.04),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.black, 0.08),
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
              <IconButton type="submit" sx={{ p: 1 }}>
                <SearchIcon />
              </IconButton>
              <InputBase
                placeholder="Search products…"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  color: 'inherit',
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
              color="primary"
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
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <Typography
            variant="h6"
            sx={{ px: 2, mb: 1, fontWeight: 'bold', color: 'primary.main' }}
          >
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

            <Divider />
            <Typography
              variant="subtitle2"
              sx={{ px: 2, py: 1, fontWeight: 'bold', color: 'text.secondary' }}
            >
              Categories
            </Typography>

            {categories.map((category) => (
              <ListItemButton
                key={category.value}
                onClick={() => handleCategorySelect(category.value)}
                sx={{ pl: 3 }}
              >
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  {category.icon}
                </ListItemIcon>
                <ListItemText primary={category.label} />
              </ListItemButton>
            ))}

            <Divider />
            <ListItemButton
              onClick={() => {
                navigate('/cart');
                setDrawerOpen(false);
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
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
              <ListItemIcon sx={{ color: 'primary.main' }}>
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
