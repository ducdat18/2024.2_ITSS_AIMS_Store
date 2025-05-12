import React from 'react';
import {
  Menu,
  MenuItem,
  IconButton,
  Divider,
  SxProps,
  Theme,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

export interface ActionMenuItem {
  label: string;
  icon: React.ReactElement;
  onClick: () => void;
  color?: string;
  divider?: boolean; // To add a divider after this item
}

interface ActionMenuProps {
  menuItems: ActionMenuItem[];
  buttonSx?: SxProps<Theme>;
  menuSx?: SxProps<Theme>;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  menuItems,
  buttonSx,
  menuSx,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (callback: () => void) => {
    callback();
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          color: 'text.secondary',
          '&:hover': {
            backgroundColor: 'rgba(2, 136, 209, 0.1)',
            color: 'primary.light',
          },
          ...buttonSx,
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#0d2538',
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
              border: '1px solid rgba(100, 255, 218, 0.1)',
              borderRadius: 2,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
              mt: 0.5,
              '& .MuiMenuItem-root': {
                py: 1,
                px: 2,
              },
              '& .MuiMenuItem-root:hover': {
                backgroundColor: 'rgba(2, 136, 209, 0.1)',
              },
              ...menuSx,
            },
          },
        }}
      >
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            <MenuItem
              onClick={() => handleItemClick(item.onClick)}
              sx={{
                color: item.color || 'inherit',
              }}
            >
              {React.isValidElement(item.icon) &&
                React.cloneElement(item.icon as React.ReactElement<any>, {
                  fontSize: 'small',
                  sx: { mr: 1.5, color: item.color || 'primary.light' },
                })}
              {item.label}
            </MenuItem>
            {item.divider && (
              <Divider
                sx={{ my: 1, borderColor: 'rgba(100, 255, 218, 0.1)' }}
              />
            )}
          </React.Fragment>
        ))}
      </Menu>
    </>
  );
};

export default ActionMenu;
