import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Alert,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import CartItem, { CartItemType } from './CardItem';

interface CartItemListProps {
  items: CartItemType[];
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  insufficientItems?: { [key: string]: number };
}

const CartItemList: React.FC<CartItemListProps> = ({
  items,
  onQuantityChange,
  onRemoveItem,
  insufficientItems = {},
}) => {
  const hasInsufficientItems = Object.keys(insufficientItems).length > 0;

  return (
    <>
      {hasInsufficientItems && (
        <Alert
          severity="warning"
          icon={<WarningIcon />}
          sx={{
            mb: 3,
            backgroundColor: 'rgba(255, 152, 0, 0.1)',
            border: '1px solid rgba(255, 152, 0, 0.3)',
            '& .MuiAlert-icon': {
              color: 'warning.main',
            },
          }}
        >
          Some items in your cart have insufficient inventory. Please update
          quantities.
        </Alert>
      )}

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          mb: 4,
          borderRadius: 2,
          backgroundImage: 'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
          border: '1px solid rgba(100, 255, 218, 0.1)',
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead
            sx={{
              bgcolor: 'rgba(2, 136, 209, 0.1)',
              '& .MuiTableCell-root': {
                borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
                color: 'primary.light',
                fontWeight: 'bold',
              },
            }}
          >
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onQuantityChange={onQuantityChange}
                onRemove={onRemoveItem}
                insufficientStock={
                  insufficientItems[item.product.id] !== undefined
                }
                availableStock={insufficientItems[item.product.id]}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CartItemList;
