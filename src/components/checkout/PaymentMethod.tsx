import React from 'react';
import {
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Alert,
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

export type PaymentMethodType = 'creditCard' | 'bankTransfer' | 'cod';

interface PaymentMethodProps {
  value: PaymentMethodType;
  onChange: (value: PaymentMethodType) => void;
  availableMethods?: Array<{
    value: PaymentMethodType;
    label: string;
    icon: React.ReactNode;
  }>;
  infoMessage?: string;
}

const defaultMethods = [
  {
    value: 'creditCard' as PaymentMethodType,
    label: 'Credit Card / Debit Card (VNPay)',
    icon: <CreditCardIcon />,
  },
];

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  value,
  onChange,
  availableMethods = defaultMethods,
  infoMessage = 'You will be redirected to VNPay to complete your payment securely.',
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value as PaymentMethodType);
  };

  return (
    <Box>
      <FormControl component="fieldset">
        <RadioGroup value={value} onChange={handleChange}>
          {availableMethods.map((method) => (
            <FormControlLabel
              key={method.value}
              value={method.value}
              control={
                <Radio
                  color="primary"
                  sx={{
                    color: 'rgba(100, 255, 218, 0.5)',
                    '&.Mui-checked': {
                      color: 'primary.light',
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      color: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {method.icon}
                  </Box>
                  <Typography color="text.primary">{method.label}</Typography>
                </Box>
              }
            />
          ))}
        </RadioGroup>
      </FormControl>

      <Alert
        severity="info"
        sx={{
          mt: 2,
          backgroundColor: 'rgba(2, 136, 209, 0.1)',
          border: '1px solid rgba(100, 255, 218, 0.2)',
          '& .MuiAlert-icon': {
            color: 'primary.light',
          },
        }}
        icon={<InfoIcon />}
      >
        {infoMessage}
      </Alert>
    </Box>
  );
};

export default PaymentMethod;
