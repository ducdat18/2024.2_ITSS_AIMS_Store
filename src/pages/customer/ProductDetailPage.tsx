import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid2, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import CustomBreadcrumbs from '../../components/customer/common/CustomBreadcrumbs';
import ErrorState from '../../components/customer/common/ErrorState';
import LoadingState from '../../components/customer/common/LoadingState';
import PageContainer from '../../components/customer/common/PageContainer';
import ProductCategoryIcon from '../../components/product/ProductCategoryIcon';
import AddToCartSection from '../../components/product/ProductDetailInfo/AddToCardSection';
import ProductHeader from '../../components/product/ProductDetailInfo/ProductHeader';
import ProductTabs from '../../components/product/ProductDetailInfo/ProductTabs';
import { mockApiService } from '../../mock/mockApi';
import { Product } from '../../types';
import { addToCart } from '../../services/cart';
import { useNotification } from '../../components/customer/common/Notification';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError, NotificationComponent } = useNotification();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) {
          setError('Product ID is missing');
          setLoading(false);
          return;
        }

        const productData = await mockApiService.getProductById(id);
        if (!productData) {
          setError('Product not found');
          setLoading(false);
          return;
        }

        setProduct(productData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      try {
        addToCart(product, quantity);
        showSuccess(`${quantity} item(s) added to your cart!`);
      } catch (error) {
        console.error('Error adding to cart:', error);
        showError('Failed to add product to cart. Please try again.');
      }
    }
  };

  if (loading) {
    return <LoadingState message="Diving for product details..." />;
  }

  if (error || !product) {
    return (
      <ErrorState
        message={error || 'Product not found'}
        backPath="/products"
        backText="Back to Products"
      />
    );
  }

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Products', link: '/products' },
    { label: product.category, link: `/products/category/${product.category}` },
    { label: product.title },
  ];

  return (
    <PageContainer>
      <CustomBreadcrumbs items={breadcrumbItems} />

      <Grid2 container spacing={4}>
        <Grid2 size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={3}
            sx={{
              height: 400,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
              mb: { xs: 2, md: 0 },
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2,
              border: '1px solid rgba(100, 255, 218, 0.1)',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage:
                  'radial-gradient(circle at 50% 50%, rgba(2, 136, 209, 0.1) 0%, transparent 70%)',
                opacity: 0.8,
                zIndex: 1,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                textAlign: 'center',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <ProductCategoryIcon category={product.category} size="large" />
            </Box>
          </Paper>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 7 }}>
          <ProductHeader product={product} />

          <AddToCartSection
            product={product}
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
          />
        </Grid2>
      </Grid2>

      <Box sx={{ mt: 5 }}>
        <ProductTabs product={product} />
      </Box>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/products')}
          sx={{
            px: 3,
            py: 1,
            borderColor: 'rgba(100, 255, 218, 0.3)',
            '&:hover': {
              borderColor: 'rgba(100, 255, 218, 0.5)',
              backgroundColor: 'rgba(100, 255, 218, 0.05)',
            },
          }}
        >
          Continue Shopping
        </Button>
      </Box>

      <NotificationComponent />
    </PageContainer>
  );
};

export default ProductDetailPage;
