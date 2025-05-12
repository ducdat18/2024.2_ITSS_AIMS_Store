import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Home as HomeIcon,
  Book as BookIcon,
  Album as CDIcon,
  Radio as LPIcon,
  MovieCreation as DVDIcon,
  Person as PersonIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  // Category definitions
  const categories = [
    { label: 'Books', value: 'BOOK', icon: <BookIcon /> },
    { label: 'CDs', value: 'CD', icon: <CDIcon /> },
    { label: 'LP Records', value: 'LP', icon: <LPIcon /> },
    { label: 'DVDs', value: 'DVD', icon: <DVDIcon /> },
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundImage: 'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
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

        <Divider sx={{ borderColor: 'rgba(100, 255, 218, 0.1)' }} />

        <List>
          <ListItemButton onClick={() => handleNavigation('/')}>
            <ListItemIcon sx={{ color: 'primary.light' }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>

          <Divider sx={{ borderColor: 'rgba(100, 255, 218, 0.1)' }} />

          <Typography
            variant="subtitle2"
            sx={{ px: 2, py: 1, fontWeight: 'bold', color: 'text.secondary' }}
          >
            Product Categories
          </Typography>

          {categories.map((category) => (
            <ListItemButton
              key={category.value}
              onClick={() =>
                handleNavigation(`/products?category=${category.value}`)
              }
            >
              <ListItemIcon sx={{ color: 'primary.light' }}>
                {category.icon}
              </ListItemIcon>
              <ListItemText primary={category.label} />
            </ListItemButton>
          ))}

          <Divider sx={{ borderColor: 'rgba(100, 255, 218, 0.1)' }} />

          <ListItemButton onClick={() => handleNavigation('/login')}>
            <ListItemIcon sx={{ color: 'primary.light' }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
