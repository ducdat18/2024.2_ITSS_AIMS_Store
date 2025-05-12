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

// Navigation Item Component
interface NavItemProps {
  to: string;
  icon: React.ReactElement;
  label: string;
  isActive: boolean;
  activeColor?: 'primary' | 'success' | 'error' | 'warning';
}

const NavItem: React.FC<NavItemProps> = ({
  to,
  icon,
  label,
  isActive,
  activeColor = 'primary',
}) => {
  const getActiveStyles = () => {
    switch (activeColor) {
      case 'success':
        return {
          backgroundColor: 'rgba(0, 191, 165, 0.15)',
          borderLeft: '3px solid #00bfa5',
          hoverBg: 'rgba(0, 191, 165, 0.2)',
          iconColor: 'success.light',
          textColor: 'success.light',
        };
      case 'error':
        return {
          backgroundColor: 'rgba(255, 82, 82, 0.15)',
          borderLeft: '3px solid #ff5252',
          hoverBg: 'rgba(255, 82, 82, 0.2)',
          iconColor: 'error.light',
          textColor: 'error.light',
        };
      default:
        return {
          backgroundColor: 'rgba(2, 136, 209, 0.15)',
          borderLeft: '3px solid #0288d1',
          hoverBg: 'rgba(2, 136, 209, 0.2)',
          iconColor: 'primary.light',
          textColor: 'primary.light',
        };
    }
  };

  const activeStyles = getActiveStyles();

  return (
    <ListItemButton
      component={Link}
      to={to}
      selected={isActive}
      sx={{
        py: 1.5,
        pl: 2,
        '&.Mui-selected': {
          backgroundColor: activeStyles.backgroundColor,
          borderLeft: activeStyles.borderLeft,
          '&:hover': {
            backgroundColor: activeStyles.hoverBg,
          },
        },
        '&:hover': {
          backgroundColor: 'rgba(2, 136, 209, 0.1)',
        },
      }}
    >
      <ListItemIcon>
        <Box
          sx={{ color: isActive ? activeStyles.iconColor : 'text.secondary' }}
        >
          {icon}
        </Box>
      </ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          color: isActive ? activeStyles.textColor : 'text.primary',
          fontWeight: isActive ? 'bold' : 'regular',
        }}
      />
    </ListItemButton>
  );
};

// Notifications Menu Component
interface NotificationsMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const NotificationsMenu: React.FC<NotificationsMenuProps> = ({
  anchorEl,
  open,
  onClose,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
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
        <Typography variant="subtitle1" fontWeight="bold" color="primary.light">
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
  );
};

// Profile Menu Component
interface ProfileMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  user: UserAccount | null;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  anchorEl,
  open,
  onClose,
  user,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
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
        <Typography variant="subtitle1" fontWeight="bold" color="primary.light">
          {user ? user.username : 'Admin User'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user ? user.email : 'Loading...'}
        </Typography>
      </Box>
      <MenuItem
        onClick={onProfileClick}
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
        onClick={onSettingsClick}
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
        onClick={onLogoutClick}
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
  );
};

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

  // Render app logo
  const renderLogo = (variant: 'appbar' | 'drawer') => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <WavesIcon
        sx={{
          color: 'primary.light',
          mr: 1.5,
          fontSize: variant === 'drawer' ? 32 : 28,
        }}
      />
      <Box>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 'bold',
            lineHeight: 1.1,
            color: variant === 'drawer' ? 'primary.light' : 'inherit',
          }}
        >
          AIMS Admin
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: variant === 'drawer' ? 'text.secondary' : 'primary.light',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '0.7rem',
          }}
        >
          {variant === 'drawer' ? 'VERSION 1.0' : 'Control Panel'}
        </Typography>
      </Box>
    </Box>
  );

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

          {renderLogo('appbar')}

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

      {/* Drawer / Sidebar */}
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
          {renderLogo('drawer')}
        </Toolbar>

        <Divider sx={{ borderColor: 'rgba(100, 255, 218, 0.1)' }} />

        {/* Main navigation */}
        <List component="nav" sx={{ pt: 1 }}>
          {/* Dashboard Link */}
          <NavItem
            to="/admin/dashboard"
            icon={<DashboardIcon />}
            label="Dashboard"
            isActive={isActive('/admin/dashboard')}
          />

          {/* User Management Link */}
          <NavItem
            to="/admin/users"
            icon={<PeopleIcon />}
            label="User Management"
            isActive={isActive('/admin/users')}
          />

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

          {/* Add User Link */}
          <NavItem
            to="/admin/users/add"
            icon={<PersonAddIcon />}
            label="Add New User"
            isActive={isActive('/admin/users/add')}
          />

          {/* Admin Users Link */}
          <NavItem
            to="/admin/users?role=ADMIN"
            icon={<AdminIcon />}
            label="Admin Users"
            isActive={location.search.includes('role=ADMIN')}
            activeColor="success"
          />

          {/* Blocked Users Link */}
          <NavItem
            to="/admin/users?status=blocked"
            icon={<BlockIcon />}
            label="Blocked Users"
            isActive={location.search.includes('status=blocked')}
            activeColor="error"
          />

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

      {/* Main content */}
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

      {/* Notifications Menu */}
      <NotificationsMenu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
      />

      {/* Profile Menu */}
      <ProfileMenu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileClose}
        user={adminAccount}
        onProfileClick={() => {
          handleProfileClose();
          navigate('/admin/profile');
        }}
        onSettingsClick={() => {
          handleProfileClose();
          navigate('/admin/settings');
        }}
        onLogoutClick={() => {
          handleProfileClose();
          handleLogout();
        }}
      />
    </Box>
  );
};

export default AdminLayout;
