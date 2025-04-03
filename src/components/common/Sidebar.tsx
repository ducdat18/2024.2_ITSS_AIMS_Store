// src/components/layout/Sidebar.tsx
import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
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

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 240,
          backgroundColor: '#f9ca16',
          color: '#000000',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          AIMS Menu
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItemButton onClick={() => handleNavigation('/')}>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton
          onClick={() => handleNavigation('/products/category/BOOK')}
        >
          <ListItemText primary="Books" />
        </ListItemButton>
        <ListItemButton
          onClick={() => handleNavigation('/products/category/CD')}
        >
          <ListItemText primary="CDs" />
        </ListItemButton>
        <ListItemButton
          onClick={() => handleNavigation('/products/category/LP')}
        >
          <ListItemText primary="LP Records" />
        </ListItemButton>
        <ListItemButton
          onClick={() => handleNavigation('/products/category/DVD')}
        >
          <ListItemText primary="DVDs" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => handleNavigation('/cart')}>
          <ListItemText primary="Shopping Cart" />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation('/login')}>
          <ListItemText primary="Login" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
