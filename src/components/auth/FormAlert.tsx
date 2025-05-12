import React from 'react';
import { Alert, AlertProps } from '@mui/material';

export const FormAlert: React.FC<AlertProps> = (props) => {
  const isSuccess = props.severity === 'success';

  return (
    <Alert
      {...props}
      sx={{
        mb: 3,
        backgroundColor: isSuccess
          ? 'rgba(0, 191, 165, 0.1)'
          : 'rgba(255, 82, 82, 0.1)',
        border: `1px solid ${
          isSuccess ? 'rgba(0, 191, 165, 0.3)' : 'rgba(255, 82, 82, 0.3)'
        }`,
        '& .MuiAlert-icon': {
          color: isSuccess ? 'success.main' : 'error.main',
        },
        ...props.sx,
      }}
    />
  );
};
