import React from 'react';
import {
  Box,
  TableRow,
  TableCell,
  Typography,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, Waves as WavesIcon } from '@mui/icons-material';
import { formatCurrency } from '../../utils/formatters';
import { Product } from '../../types';
import QuantitySelector from '../customer/common/QuanlitySelector';

export interface CartItemType {
  product: Product;
  quantity: number;
  price: number;
}

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  insufficientStock?: boolean;
  availableStock?: number;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onRemove,
  insufficientStock = false,
  availableStock,
}) => {
  return (
    <TableRow
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
        '& .MuiTableCell-root': {
          borderBottom: '1px solid rgba(100, 255, 218, 0.05)',
        },
        transition: 'background-color 0.3s ease',
        '&:hover': {
          backgroundColor: 'rgba(2, 136, 209, 0.05)',
        },
      }}
    >
      <TableCell component="th" scope="row">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              bgcolor: 'rgba(2, 136, 209, 0.1)',
              color: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              borderRadius: 1,
              border: '1px solid rgba(100, 255, 218, 0.1)',
            }}
          >
            <WavesIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.primary">
              {item.product.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.product.category}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell align="right" sx={{ color: 'primary.light' }}>
        {formatCurrency(item.price)}
      </TableCell>

      <TableCell align="center">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <QuantitySelector
            quantity={item.quantity}
            onChange={(newQuantity) =>
              onQuantityChange(item.product.id, newQuantity)
            }
            min={1}
            max={item.product.quantity}
          />

          {insufficientStock && (
            <Typography
              variant="caption"
              color="error"
              sx={{ display: 'block', mt: 1 }}
            >
              Only {availableStock} available
            </Typography>
          )}
        </Box>
      </TableCell>

      <TableCell
        align="right"
        sx={{ fontWeight: 'bold', color: 'primary.light' }}
      >
        {formatCurrency(item.price * item.quantity)}
      </TableCell>

      <TableCell align="right">
        <IconButton
          color="error"
          onClick={() => onRemove(item.product.id)}
          size="small"
          sx={{
            bgcolor: 'rgba(255, 82, 82, 0.1)',
            '&:hover': {
              bgcolor: 'rgba(255, 82, 82, 0.2)',
            },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default CartItem;
