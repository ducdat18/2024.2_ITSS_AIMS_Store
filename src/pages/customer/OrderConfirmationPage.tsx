import React from 'react';
import { Box, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowBack as ArrowBackIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { CartItemType } from '../../components/cart/CardItem';
import PageContainer from '../../components/customer/common/PageContainer';
import SuccessMessage from '../../components/customer/common/SuccessMessage';
import DeliveryInfoSection from '../../components/order/DeliveryInfoSection';
import OrderInfoSection from '../../components/order/OrderInfoSection';
import OrderItemList from '../../components/order/OrderItemList';
import TransactionInfoSection from '../../components/order/TransactionInfoSection';
import { OrderStatus, ProductCategory, CoverType } from '../../types';

const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentTime = new Date().toISOString();
  const tomorrowTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const orderId = id || 'order-123456789';

  const orderInfo = {
    id: orderId,
    orderDate: currentTime,
    status: OrderStatus.PENDING_PROCESSING,
  };

  const transactionInfo = {
    transactionId: `VNP${Date.now().toString().substring(0, 10)}`,
    transactionDate: currentTime,
    content: `Payment for order #${orderId}`,
    paymentMethod: 'Credit Card (VNPay)',
  };

  const deliveryInfo = {
    recipientName: 'Nguyen Van A',
    phone: '0901234567',
    email: 'nguyenvana@example.com',
    province: 'Hanoi',
    address: '123 Cau Giay Street, Cau Giay District',
    isRushDelivery: true,
    rushDeliveryTime: tomorrowTime,
    rushDeliveryInstructions: 'Please call before delivering',
  };

  const orderItems: CartItemType[] = [
    {
      product: {
        id: 'book-1',
        title: 'The Great Gatsby',
        category: ProductCategory.BOOK,
        price: 180000,
        value: 150000,
        quantity: 10,
        weight: 0.5,
        dimensions: { width: 15, height: 23, depth: 2 },
        description: 'A classic novel',
        discount: 0,
        barcode: '123456789',
        warehouseEntryDate: '2023-01-01',
        authors: ['F. Scott Fitzgerald'],
        coverType: CoverType.PAPERBACK,
        publisher: 'Scribner',
        publicationDate: '1925-04-10',
        pages: 180,
        language: 'English',
        genre: 'Literary Fiction',
      },
      quantity: 2,
      price: 180000,
    },
    {
      product: {
        id: 'cd-1',
        title: 'Thriller',
        category: ProductCategory.CD,
        price: 220000,
        value: 180000,
        quantity: 5,
        weight: 0.3,
        dimensions: { width: 12, height: 12, depth: 1 },
        description: 'Classic album',
        discount: 0,
        barcode: '987654321',
        warehouseEntryDate: '2023-02-01',
        artists: ['Michael Jackson'],
        recordLabel: 'Epic Records',
        tracklist: ['Thriller', 'Beat It', 'Billie Jean', 'Human Nature'],
        genre: 'Pop',
        releaseDate: '1982-11-30',
      },
      quantity: 1,
      price: 220000,
    },
  ];

  // Order pricing
  const orderPricing = {
    subtotal: 580000,
    vat: 58000,
    deliveryFee: 22000,
    rushDeliveryFee: 20000,
  };

  // Handle cancel order
  const handleCancelOrder = () => {
    navigate(`/order/cancel/${orderId}`);
  };

  return (
    <PageContainer>
      <SuccessMessage
        title="Order Successfully Placed!"
        message={`Thank you for your purchase. Your order has been successfully processed and is now in ${OrderStatus.PENDING_PROCESSING} status.`}
      />

      <OrderInfoSection orderInfo={orderInfo} />

      <TransactionInfoSection transactionInfo={transactionInfo} />

      <DeliveryInfoSection deliveryInfo={deliveryInfo} />

      <OrderItemList items={orderItems} pricing={orderPricing} />

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          startIcon={<ArrowBackIcon />}
          sx={{
            px: 3,
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
          Continue Shopping
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleCancelOrder}
          startIcon={<CancelIcon />}
          sx={{
            px: 3,
            py: 1.2,
            borderColor: 'rgba(255, 82, 82, 0.3)',
            '&:hover': {
              borderColor: 'rgba(255, 82, 82, 0.5)',
              backgroundColor: 'rgba(255, 82, 82, 0.05)',
            },
          }}
        >
          Cancel Order
        </Button>
      </Box>
    </PageContainer>
  );
};

export default OrderConfirmationPage;
