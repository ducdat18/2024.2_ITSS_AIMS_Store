import React, { useState, useEffect, forwardRef } from 'react';
import { Snackbar, Alert as MuiAlert, AlertProps, Box } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationProps {
  message: string;
  type?: NotificationType;
  isOpen?: boolean;
  onClose?: () => void;
  autoHideDuration?: number;
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'success',
  isOpen = false,
  onClose,
  autoHideDuration = 3000,
  position = { vertical: 'bottom', horizontal: 'center' },
}) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  // Biểu tượng tương ứng với loại thông báo
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon />;
      case 'error':
        return <ErrorIcon />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ '& > *': { mt: 2 } }}>
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}
        anchorOrigin={{
          vertical: position.vertical,
          horizontal: position.horizontal,
        }}
      >
        <Alert
          onClose={handleClose}
          severity={type}
          icon={getIcon()}
          sx={{
            width: '100%',
            color: 'white',
            '& .MuiAlert-icon': {
              fontSize: '1.25rem',
              alignSelf: 'center',
            },
            '& .MuiAlert-message': {
              fontSize: '0.95rem',
              padding: '8px 0',
            },
            borderLeft:
              type === 'success'
                ? '5px solid rgba(100, 255, 218, 0.7)'
                : type === 'error'
                ? '5px solid rgba(255, 100, 100, 0.7)'
                : undefined,
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Cung cấp một hook để sử dụng thông báo dễ dàng
export const useNotification = () => {
  const [state, setState] = useState<{
    open: boolean;
    type: NotificationType;
    message: string;
  }>({
    open: false,
    type: 'success',
    message: '',
  });

  const showNotification = (
    message: string,
    type: NotificationType = 'success'
  ) => {
    setState({
      open: true,
      type,
      message,
    });
  };

  const closeNotification = () => {
    setState({ ...state, open: false });
  };

  const NotificationComponent = () => (
    <Notification
      isOpen={state.open}
      type={state.type}
      message={state.message}
      onClose={closeNotification}
    />
  );

  return {
    showSuccess: (message: string) => showNotification(message, 'success'),
    showError: (message: string) => showNotification(message, 'error'),
    showInfo: (message: string) => showNotification(message, 'info'),
    showWarning: (message: string) => showNotification(message, 'warning'),
    closeNotification,
    NotificationComponent,
  };
};

export default Notification;
