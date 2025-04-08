// src/components/layout/AdminLayout.tsx
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
  People as PeopleIcon,
  Person as PersonIcon,
  PersonAdd as PersonAddIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  Block as BlockIcon,
  Notifications as NotificationsIcon,
  AdminPanelSettings as AdminIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { mockAccountService } from '../../mock/mockDataAccount';
import { UserAccount, UserRole } from '../../types';

// Drawer width when open
const drawerWidth = 240;

const AdminLayout: React.FC = () => {
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
  const [adminAccount, setAdminAccount] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch admin account data
  useEffect(() => {
    const fetchAdminAccount = async () => {
      try {
        // Fetch accounts with admin role
        const accounts = await mockAccountService.getAccounts();
        const adminAccounts = accounts.filter(
          (account) =>
            account.roles.includes(UserRole.ADMIN) && !account.isBlocked
        );

        if (adminAccounts.length > 0) {
          // Use the first admin account
          setAdminAccount(adminAccounts[0]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin account:', error);
        setLoading(false);
      }
    };

    fetchAdminAccount();
  }, []);

  // Handle notification menu
  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  // Handle profile menu
  const handleProfileOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget as HTMLElement);
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
    // In a real app, this would call a logout API
    navigate('/login');
  };

  // Check if a menu item is active
  const isActive = (path: string) => {
    if (path === '/admin' || path === '/admin/dashboard') {
      return (
        location.pathname === '/admin' ||
        location.pathname === '/admin/dashboard'
      );
    }
    return location.pathname.startsWith(path);
  };

  // Get first letter of username for avatar
  const getAvatarInitial = () => {
    if (!adminAccount || !adminAccount.username) return 'A';
    return adminAccount.username.charAt(0).toUpperCase();
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
            <WavesIcon sx={{ color: 'primary.light', mr: 1.5, fontSize: 28 }} />
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  lineHeight: 1.1,
                }}
              >
                AIMS Admin
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
                Control Panel
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
                adminAccount ? `Account: ${adminAccount.username}` : 'Account'
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

      {/* Drawer / Sidebar - Changed to temporary for both mobile and desktop */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            borderRight: '1px solid rgba(100, 255, 218, 0.1)',
            boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            px: [2],
            py: 2,
            borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
          }}
        >
          <WavesIcon
            sx={{
              fontSize: 32,
              color: 'primary.light',
              mr: 1.5,
            }}
          />
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'primary.light',
                lineHeight: 1.1,
              }}
            >
              AIMS Admin
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                letterSpacing: '0.05em',
              }}
            >
              VERSION 1.0
            </Typography>
          </Box>
        </Toolbar>

        <Divider sx={{ borderColor: 'rgba(100, 255, 218, 0.1)' }} />

        {/* Main navigation */}
        <List component="nav" sx={{ pt: 1 }}>
          <ListItemButton
            component={Link}
            to="/admin/dashboard"
            selected={isActive('/admin/dashboard')}
            sx={{
              py: 1.5,
              pl: 2,
              '&.Mui-selected': {
                backgroundColor: 'rgba(2, 136, 209, 0.15)',
                borderLeft: '3px solid #0288d1',
                '&:hover': {
                  backgroundColor: 'rgba(2, 136, 209, 0.2)',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(2, 136, 209, 0.1)',
              },
            }}
          >
            <ListItemIcon>
              <DashboardIcon
                sx={{
                  color: isActive('/admin/dashboard')
                    ? 'primary.light'
                    : 'text.secondary',
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              primaryTypographyProps={{
                color: isActive('/admin/dashboard')
                  ? 'primary.light'
                  : 'text.primary',
                fontWeight: isActive('/admin/dashboard') ? 'bold' : 'regular',
              }}
            />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/admin/users"
            selected={isActive('/admin/users')}
            sx={{
              py: 1.5,
              pl: 2,
              '&.Mui-selected': {
                backgroundColor: 'rgba(2, 136, 209, 0.15)',
                borderLeft: '3px solid #0288d1',
                '&:hover': {
                  backgroundColor: 'rgba(2, 136, 209, 0.2)',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(2, 136, 209, 0.1)',
              },
            }}
          >
            <ListItemIcon>
              <PeopleIcon
                sx={{
                  color: isActive('/admin/users')
                    ? 'primary.light'
                    : 'text.secondary',
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="User Management"
              primaryTypographyProps={{
                color: isActive('/admin/users')
                  ? 'primary.light'
                  : 'text.primary',
                fontWeight: isActive('/admin/users') ? 'bold' : 'regular',
              }}
            />
          </ListItemButton>

          <Divider sx={{ my: 1, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

          <ListSubheader
            sx={{
              bgcolor: 'transparent',
              color: 'text.secondary',
              lineHeight: '30px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              px: 2,
            }}
          >
            User Actions
          </ListSubheader>

          <ListItemButton
            component={Link}
            to="/admin/users/add"
            selected={isActive('/admin/users/add')}
            sx={{
              py: 1.5,
              pl: 2,
              '&.Mui-selected': {
                backgroundColor: 'rgba(2, 136, 209, 0.15)',
                borderLeft: '3px solid #0288d1',
                '&:hover': {
                  backgroundColor: 'rgba(2, 136, 209, 0.2)',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(2, 136, 209, 0.1)',
              },
            }}
          >
            <ListItemIcon>
              <PersonAddIcon
                sx={{
                  color: isActive('/admin/users/add')
                    ? 'primary.light'
                    : 'text.secondary',
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Add New User"
              primaryTypographyProps={{
                color: isActive('/admin/users/add')
                  ? 'primary.light'
                  : 'text.primary',
                fontWeight: isActive('/admin/users/add') ? 'bold' : 'regular',
              }}
            />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/admin/users?role=ADMIN"
            selected={location.search.includes('role=ADMIN')}
            sx={{
              py: 1.5,
              pl: 2,
              '&.Mui-selected': {
                backgroundColor: 'rgba(0, 191, 165, 0.15)',
                borderLeft: '3px solid #00bfa5',
                '&:hover': {
                  backgroundColor: 'rgba(0, 191, 165, 0.2)',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 191, 165, 0.1)',
              },
            }}
          >
            <ListItemIcon>
              <AdminIcon
                sx={{
                  color: location.search.includes('role=ADMIN')
                    ? 'success.light'
                    : 'text.secondary',
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Admin Users"
              primaryTypographyProps={{
                color: location.search.includes('role=ADMIN')
                  ? 'success.light'
                  : 'text.primary',
                fontWeight: location.search.includes('role=ADMIN')
                  ? 'bold'
                  : 'regular',
              }}
            />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/admin/users?status=blocked"
            selected={location.search.includes('status=blocked')}
            sx={{
              py: 1.5,
              pl: 2,
              '&.Mui-selected': {
                backgroundColor: 'rgba(255, 82, 82, 0.15)',
                borderLeft: '3px solid #ff5252',
                '&:hover': {
                  backgroundColor: 'rgba(255, 82, 82, 0.2)',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 82, 82, 0.1)',
              },
            }}
          >
            <ListItemIcon>
              <BlockIcon
                sx={{
                  color: location.search.includes('status=blocked')
                    ? 'error.light'
                    : 'text.secondary',
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Blocked Users"
              primaryTypographyProps={{
                color: location.search.includes('status=blocked')
                  ? 'error.light'
                  : 'text.primary',
                fontWeight: location.search.includes('status=blocked')
                  ? 'bold'
                  : 'regular',
              }}
            />
          </ListItemButton>

          <Box sx={{ flexGrow: 1 }} />

          <Divider sx={{ my: 1, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

          <ListItemButton
            onClick={handleLogout}
            sx={{
              py: 1.5,
              pl: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 82, 82, 0.1)',
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon sx={{ color: 'error.light' }} />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                color: 'text.primary',
              }}
            />
          </ListItemButton>
        </List>
      </Drawer>

      {/* Main content - Modified to always use full width */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8, // Space for the app bar
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            p: { xs: 2, md: 3 },
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Outlet />
        </Container>
      </Box>

      {/* Notifications menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
        slotProps={{
          paper: {
            sx: {
              width: 320,
              maxHeight: 450,
              mt: 1.5,
              overflow: 'auto',
              borderRadius: 2,
              boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(100, 255, 218, 0.1)',
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(100, 255, 218, 0.1)' }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="primary.light"
          >
            Notifications
          </Typography>
          <Typography variant="caption" color="text.secondary">
            No new notifications
          </Typography>
        </Box>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            You don't have any notifications at the moment
          </Typography>
        </Box>
      </Menu>

      {/* Profile menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              minWidth: 180,
              borderRadius: 2,
              boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(100, 255, 218, 0.1)',
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="primary.light"
          >
            {adminAccount ? adminAccount.username : 'Admin User'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {adminAccount ? adminAccount.email : 'Loading...'}
          </Typography>
        </Box>
        <MenuItem
          onClick={() => {
            handleProfileClose();
            navigate('/admin/profile');
          }}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(2, 136, 209, 0.1)',
            },
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" sx={{ color: 'primary.light' }} />
          </ListItemIcon>
          <ListItemText
            primary="My Profile"
            sx={{ '& .MuiTypography-root': { fontSize: '0.9rem' } }}
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleProfileClose();
            navigate('/admin/settings');
          }}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(2, 136, 209, 0.1)',
            },
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" sx={{ color: 'primary.light' }} />
          </ListItemIcon>
          <ListItemText
            primary="Settings"
            sx={{ '& .MuiTypography-root': { fontSize: '0.9rem' } }}
          />
        </MenuItem>
        <Divider sx={{ borderColor: 'rgba(100, 255, 218, 0.1)' }} />
        <MenuItem
          onClick={() => {
            handleProfileClose();
            handleLogout();
          }}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(255, 82, 82, 0.1)',
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: 'error.light' }} />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            sx={{ '& .MuiTypography-root': { fontSize: '0.9rem' } }}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AdminLayout;
