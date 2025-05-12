import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Alert,
  Button,
  Grid2,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Cancel as CancelIcon,
  Send as SendIcon,
} from '@mui/icons-material';

export type CancellationReason =
  | 'Changed my mind'
  | 'Found a better price elsewhere'
  | 'Ordered by mistake'
  | 'Delivery time is too long'
  | 'other';

interface CancellationFormProps {
  orderId: string;
  onCancel: (reason: string, comments: string) => Promise<void>;
  onBack: () => void;
}

const CancellationForm: React.FC<CancellationFormProps> = ({
  orderId,
  onCancel,
  onBack,
}) => {
  const [selectedReasonOption, setSelectedReasonOption] = useState<
    CancellationReason | ''
  >('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as CancellationReason;
    setSelectedReasonOption(value);

    if (value === 'other') {
      setCancellationReason('');
    } else {
      setCancellationReason(value);
    }
  };

  const handleCommentsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdditionalComments(event.target.value);

    if (selectedReasonOption === 'other') {
      setCancellationReason(event.target.value);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onCancel(cancellationReason, additionalComments);
    } catch (error) {
      console.error('Error cancelling order:', error);
      setLoading(false);
    }
  };

  return (
    <Box>
      <Alert
        severity="warning"
        sx={{
          mb: 3,
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          border: '1px solid rgba(255, 152, 0, 0.3)',
          '& .MuiAlert-icon': {
            color: 'warning.main',
          },
        }}
      >
        You are about to cancel order #{orderId}. This action cannot be undone.
      </Alert>

      <Typography variant="h6" gutterBottom color="primary.light">
        Please select a reason for cancellation:
      </Typography>

      <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
        <RadioGroup value={selectedReasonOption} onChange={handleReasonChange}>
          <FormControlLabel
            value="Changed my mind"
            control={
              <Radio
                sx={{
                  color: 'rgba(100, 255, 218, 0.5)',
                  '&.Mui-checked': {
                    color: 'primary.light',
                  },
                }}
              />
            }
            label="Changed my mind"
          />
          <FormControlLabel
            value="Found a better price elsewhere"
            control={
              <Radio
                sx={{
                  color: 'rgba(100, 255, 218, 0.5)',
                  '&.Mui-checked': {
                    color: 'primary.light',
                  },
                }}
              />
            }
            label="Found a better price elsewhere"
          />
          <FormControlLabel
            value="Ordered by mistake"
            control={
              <Radio
                sx={{
                  color: 'rgba(100, 255, 218, 0.5)',
                  '&.Mui-checked': {
                    color: 'primary.light',
                  },
                }}
              />
            }
            label="Ordered by mistake"
          />
          <FormControlLabel
            value="Delivery time is too long"
            control={
              <Radio
                sx={{
                  color: 'rgba(100, 255, 218, 0.5)',
                  '&.Mui-checked': {
                    color: 'primary.light',
                  },
                }}
              />
            }
            label="Delivery time is too long"
          />
          <FormControlLabel
            value="other"
            control={
              <Radio
                sx={{
                  color: 'rgba(100, 255, 218, 0.5)',
                  '&.Mui-checked': {
                    color: 'primary.light',
                  },
                }}
              />
            }
            label="Other reason"
          />
        </RadioGroup>
      </FormControl>

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Additional Comments"
        value={additionalComments}
        onChange={handleCommentsChange}
        placeholder={
          selectedReasonOption === 'other'
            ? 'Please specify your reason for cancellation'
            : 'Any additional comments (optional)'
        }
        required={selectedReasonOption === 'other'}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(1, 22, 39, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(1, 22, 39, 0.5)',
            },
            '& fieldset': {
              borderColor: 'rgba(100, 255, 218, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(100, 255, 218, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(100, 255, 218, 0.7)',
            },
          },
        }}
      />

      <Typography variant="body2" color="text.secondary">
        After your order is cancelled, a full refund will be processed back to
        your original payment method. The refund may take 3-5 business days to
        appear in your account, depending on your payment provider.
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Grid2 container spacing={2} justifyContent="center">
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={onBack}
              startIcon={<SendIcon />}
              disabled={loading}
              sx={{
                py: 1.2,
                borderColor: 'rgba(100, 255, 218, 0.3)',
                '&:hover': {
                  borderColor: 'rgba(100, 255, 218, 0.5)',
                  backgroundColor: 'rgba(100, 255, 218, 0.05)',
                },
              }}
            >
              Go Back
            </Button>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={handleSubmit}
              disabled={
                loading ||
                (selectedReasonOption === 'other' && !cancellationReason) ||
                !selectedReasonOption
              }
              startIcon={<CancelIcon />}
              endIcon={loading ? null : <SendIcon />}
              sx={{
                py: 1.2,
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
              {loading ? 'Processing...' : 'Confirm Cancellation'}
            </Button>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default CancellationForm;
