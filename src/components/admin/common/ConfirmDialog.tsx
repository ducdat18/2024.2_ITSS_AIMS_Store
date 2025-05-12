import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  username?: string;
  color?: 'primary' | 'success' | 'error' | 'warning';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  username,
  color = 'primary',
}) => {
  const getColorStyles = () => {
    switch (color) {
      case 'error':
        return {
          borderColor: 'rgba(255, 82, 82, 0.2)',
          textColor: 'error.light',
        };
      case 'success':
        return {
          borderColor: 'rgba(0, 191, 165, 0.2)',
          textColor: 'success.light',
        };
      case 'warning':
        return {
          borderColor: 'rgba(255, 152, 0, 0.2)',
          textColor: 'warning.light',
        };
      default:
        return {
          borderColor: 'rgba(100, 255, 218, 0.2)',
          textColor: 'primary.light',
        };
    }
  };

  const colorStyles = getColorStyles();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
          },
        },
        paper: {
          sx: {
            bgcolor: '#0d2538',
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            border: `1px solid ${colorStyles.borderColor}`,
            borderRadius: 2,
            boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.3)',
            p: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ color: colorStyles.textColor }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'text.secondary' }}>
          {message}
          {username && (
            <Typography
              component="span"
              sx={{
                fontWeight: 'bold',
                color: colorStyles.textColor,
                mx: 0.5,
              }}
            >
              {username}
            </Typography>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} sx={{ color: 'text.secondary' }}>
          {cancelText}
        </Button>
        <Button
          variant="contained"
          color={color}
          onClick={onConfirm}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              transition: 'all 0.6s',
            },
            '&:hover::after': {
              left: '100%',
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
