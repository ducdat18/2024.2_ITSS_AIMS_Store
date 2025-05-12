import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { CheckCircleOutline as CheckCircleIcon } from '@mui/icons-material';
import ErrorState from '../../components/customer/common/ErrorState';
import LoadingState from '../../components/customer/common/LoadingState';
import PageContainer from '../../components/customer/common/PageContainer';
import SectionContainer from '../../components/customer/common/SectionContainer';
import SuccessMessage from '../../components/customer/common/SuccessMessage';
import CancellationForm from '../../components/order/CancellationForm';
import { mockApiService } from '../../mock/mockApi';

const CancelOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        if (!id) {
          setError('Order ID is missing');
          setLoading(false);
          return;
        }
        const order = await mockApiService.getOrderById('order-005');
        if (!order) {
          setError('Order not found');
          setLoading(false);
          return;
        }
        if (order.status !== 'PENDING_PROCESSING') {
          setError(
            'This order cannot be cancelled as it is already being processed'
          );
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleCancelOrder = async (reason: string, comments: string) => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError('Failed to cancel order. Please try again later.');
      setLoading(false);
    }
  };

  if (loading && !success) {
    return <LoadingState message="Processing your request..." />;
  }

  if (success) {
    return (
      <PageContainer>
        <SuccessMessage
          title="Order Cancelled Successfully"
          message={
            <>
              Your order #{id} has been cancelled. A refund will be initiated to
              your original payment method.
              <br />
              You will receive a confirmation email shortly.
              <br />
              <span style={{ fontSize: '0.8rem' }}>
                Redirecting to home page...
              </span>
            </>
          }
        />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        backPath={`/order/confirmation/${id}`}
        backText="Back to Order Details"
      />
    );
  }

  return (
    <PageContainer>
      <SectionContainer title="Cancel Order">
        <CancellationForm
          orderId={id || ''}
          onCancel={handleCancelOrder}
          onBack={() => navigate(`/order/confirmation/${id}`)}
        />
      </SectionContainer>
    </PageContainer>
  );
};

export default CancelOrderPage;
