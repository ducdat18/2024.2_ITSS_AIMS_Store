// src/pages/customer/ProductDetailPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid2,
  Paper,
  Divider,
  Chip,
  TextField,
  Alert,
  Breadcrumbs,
  Link,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Book as BookIcon,
  Album as CDIcon,
  Radio as LPIcon,
  MovieCreation as DVDIcon,
  ShoppingCart as CartIcon,
  ArrowBack as ArrowBackIcon,
  SupervisorAccount as AuthorIcon,
  CalendarToday as DateIcon,
  Store as PublisherIcon,
  MusicNote as ArtistIcon,
  Label as RecordLabelIcon,
  Person as DirectorIcon,
  Subtitles as SubtitlesIcon,
  Language as LanguageIcon,
  AccessTime as RuntimeIcon,
  Laptop as StudioIcon,
  Category as GenreIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { mockApiService } from '../../mock/mockApi';
import {
  Product,
  ProductCategory,
  BookProduct,
  CDProduct,
  LPProduct,
  DVDProduct,
  CoverType,
  DiscType,
} from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `product-tab-${index}`,
    'aria-controls': `product-tabpanel-${index}`,
  };
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [tabValue, setTabValue] = useState(0);

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

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.quantity || 1)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      // In a real app, this would use a cart context or service
      console.log('Added to cart:', { product, quantity });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  const getCategoryIcon = (category: ProductCategory) => {
    switch (category) {
      case ProductCategory.BOOK:
        return <BookIcon sx={{ fontSize: 40 }} />;
      case ProductCategory.CD:
        return <CDIcon sx={{ fontSize: 40 }} />;
      case ProductCategory.LP:
        return <LPIcon sx={{ fontSize: 40 }} />;
      case ProductCategory.DVD:
        return <DVDIcon sx={{ fontSize: 40 }} />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: ProductCategory) => {
    switch (category) {
      case ProductCategory.BOOK:
        return 'primary';
      case ProductCategory.CD:
        return 'secondary';
      case ProductCategory.LP:
        return 'warning';
      case ProductCategory.DVD:
        return 'success';
      default:
        return 'primary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderBookDetails = (book: BookProduct) => (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Typography variant="h6" gutterBottom>
          Product Details
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AuthorIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="subtitle2">Authors:</Typography>
        </Box>
        <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
          {book.authors.join(', ')}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PublisherIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="subtitle2">Publisher:</Typography>
        </Box>
        <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
          {book.publisher}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <DateIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="subtitle2">Publication Date:</Typography>
        </Box>
        <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
          {formatDate(book.publicationDate)}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="subtitle2">Cover Type:</Typography>
        </Box>
        <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
          {book.coverType === CoverType.PAPERBACK ? 'Paperback' : 'Hardcover'}
        </Typography>
      </Grid2>

      {book.pages && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="subtitle2">Pages:</Typography>
          </Box>
          <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
            {book.pages}
          </Typography>
        </Grid2>
      )}

      {book.language && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LanguageIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="subtitle2">Language:</Typography>
          </Box>
          <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
            {book.language}
          </Typography>
        </Grid2>
      )}

      {book.genre && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <GenreIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="subtitle2">Genre:</Typography>
          </Box>
          <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
            {book.genre}
          </Typography>
        </Grid2>
      )}
    </Grid2>
  );

  const renderCDDetails = (cd: CDProduct) => (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Typography variant="h6" gutterBottom>
          Product Details
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <ArtistIcon sx={{ mr: 1, color: 'secondary.main' }} />
          <Typography variant="subtitle2">Artists:</Typography>
        </Box>
        <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
          {cd.artists.join(', ')}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <RecordLabelIcon sx={{ mr: 1, color: 'secondary.main' }} />
          <Typography variant="subtitle2">Record Label:</Typography>
        </Box>
        <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
          {cd.recordLabel}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <GenreIcon sx={{ mr: 1, color: 'secondary.main' }} />
          <Typography variant="subtitle2">Genre:</Typography>
        </Box>
        <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
          {cd.genre}
        </Typography>
      </Grid2>

      {cd.releaseDate && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DateIcon sx={{ mr: 1, color: 'secondary.main' }} />
            <Typography variant="subtitle2">Release Date:</Typography>
          </Box>
          <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
            {formatDate(cd.releaseDate)}
          </Typography>
        </Grid2>
      )}
    </Grid2>
  );

  const renderLPDetails = (lp: LPProduct) => (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Typography variant="h6" gutterBottom>
          Product Details
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <ArtistIcon sx={{ mr: 1, color: 'warning.main' }} />
          <Typography variant="subtitle2">Artists:</Typography>
        </Box>
        <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
          {lp.artists.join(', ')}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <RecordLabelIcon sx={{ mr: 1, color: 'warning.main' }} />
          <Typography variant="subtitle2">Record Label:</Typography>
        </Box>
        <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
          {lp.recordLabel}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <GenreIcon sx={{ mr: 1, color: 'warning.main' }} />
          <Typography variant="subtitle2">Genre:</Typography>
        </Box>
        <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
          {lp.genre}
        </Typography>
      </Grid2>

      {lp.releaseDate && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DateIcon sx={{ mr: 1, color: 'warning.main' }} />
            <Typography variant="subtitle2">Release Date:</Typography>
          </Box>
          <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
            {formatDate(lp.releaseDate)}
          </Typography>
        </Grid2>
      )}
    </Grid2>
  );

  const renderDVDDetails = (dvd: DVDProduct) => (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Typography variant="h6" gutterBottom>
          Product Details
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <DirectorIcon sx={{ mr: 1, color: 'success.main' }} />
          <Typography variant="subtitle2">Director:</Typography>
        </Box>
        <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
          {dvd.director}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <StudioIcon sx={{ mr: 1, color: 'success.main' }} />
          <Typography variant="subtitle2">Studio:</Typography>
        </Box>
        <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
          {dvd.studio}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <RuntimeIcon sx={{ mr: 1, color: 'success.main' }} />
          <Typography variant="subtitle2">Runtime:</Typography>
        </Box>
        <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
          {dvd.runtime} minutes
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <InfoIcon sx={{ mr: 1, color: 'success.main' }} />
          <Typography variant="subtitle2">Disc Type:</Typography>
        </Box>
        <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
          {dvd.discType === DiscType.BLURAY ? 'Blu-ray' : 'HD-DVD'}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LanguageIcon sx={{ mr: 1, color: 'success.main' }} />
          <Typography variant="subtitle2">Languages:</Typography>
        </Box>
        <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
          {dvd.language.join(', ')}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <SubtitlesIcon sx={{ mr: 1, color: 'success.main' }} />
          <Typography variant="subtitle2">Subtitles:</Typography>
        </Box>
        <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
          {dvd.subtitles.join(', ')}
        </Typography>
      </Grid2>

      {dvd.releaseDate && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DateIcon sx={{ mr: 1, color: 'success.main' }} />
            <Typography variant="subtitle2">Release Date:</Typography>
          </Box>
          <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
            {formatDate(dvd.releaseDate)}
          </Typography>
        </Grid2>
      )}

      {dvd.genre && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <GenreIcon sx={{ mr: 1, color: 'success.main' }} />
            <Typography variant="subtitle2">Genre:</Typography>
          </Box>
          <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
            {dvd.genre}
          </Typography>
        </Grid2>
      )}
    </Grid2>
  );

  const renderTracklist = (tracks: string[]) => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Tracklist
      </Typography>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Grid2 container spacing={1}>
          {tracks.map((track, index) => (
            <Grid2 size={{ xs: 12 }} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  p: 1,
                  borderBottom:
                    index < tracks.length - 1 ? '1px solid #eee' : 'none',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ minWidth: 30, color: 'text.secondary' }}
                >
                  {index + 1}.
                </Typography>
                <Typography variant="body1">{track}</Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Paper>
    </Box>
  );

  const renderProductDetails = () => {
    if (!product) return null;

    switch (product.category) {
      case ProductCategory.BOOK:
        return renderBookDetails(product as BookProduct);
      case ProductCategory.CD:
        return renderCDDetails(product as CDProduct);
      case ProductCategory.LP:
        return renderLPDetails(product as LPProduct);
      case ProductCategory.DVD:
        return renderDVDDetails(product as DVDProduct);
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Product not found'}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/products')}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/products" color="inherit">
          Products
        </Link>
        <Link
          component={RouterLink}
          to={`/products/category/${product.category}`}
          color="inherit"
        >
          {product.category}
        </Link>
        <Typography color="text.primary">{product.title}</Typography>
      </Breadcrumbs>

      <Grid2 container spacing={4}>
        <Grid2 size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={1}
            sx={{
              height: 400,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'grey.100',
              mb: { xs: 2, md: 0 },
              position: 'relative',
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
              }}
            >
              {getCategoryIcon(product.category)}
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                {product.title}
              </Typography>
              <Chip
                label={product.category}
                color={getCategoryColor(product.category)}
                sx={{ mt: 1 }}
              />
            </Box>
          </Paper>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 7 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.title}
            </Typography>

            {product.discount ? (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="h5" color="error" fontWeight="bold">
                    {formatCurrency(
                      Math.round(product.price * (1 - product.discount / 100))
                    )}
                  </Typography>
                  <Chip
                    label={`-${product.discount}%`}
                    color="error"
                    size="small"
                    sx={{ ml: 1, fontWeight: 'bold' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Original price:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      ml: 1,
                      color: 'text.secondary',
                      textDecoration: 'line-through',
                    }}
                  >
                    {formatCurrency(product.price)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Price includes 10% VAT
                </Typography>
              </Box>
            ) : (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {formatCurrency(product.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price includes 10% VAT
                </Typography>
              </Box>
            )}

            <Typography variant="body2" color="success.main" gutterBottom>
              In Stock: {product.quantity} items
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>Barcode:</strong> {product.barcode}
              </Typography>
              <Typography variant="body1">
                <strong>Description:</strong> {product.description}
              </Typography>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <TextField
                type="number"
                label="Quantity"
                variant="outlined"
                size="small"
                value={quantity}
                onChange={handleQuantityChange}
                slotProps={{
                  input: { inputProps: { min: 1, max: product.quantity } },
                }}
                sx={{ width: 100, mr: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<CartIcon />}
                onClick={handleAddToCart}
                size="large"
                sx={{ px: 4 }}
              >
                Add to Cart
              </Button>
            </Box>

            {addedToCart && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Product added to cart successfully!
              </Alert>
            )}
          </Box>
        </Grid2>
      </Grid2>

      <Box sx={{ mt: 5 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="product information tabs"
          >
            <Tab label="Details" {...a11yProps(0)} />
            {(product.category === ProductCategory.CD ||
              product.category === ProductCategory.LP) && (
              <Tab label="Tracklist" {...a11yProps(1)} />
            )}
            <Tab
              label="Specifications"
              {...a11yProps(
                product.category === ProductCategory.CD ||
                  product.category === ProductCategory.LP
                  ? 2
                  : 1
              )}
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Paper elevation={0} sx={{ p: 3 }}>
            {renderProductDetails()}
          </Paper>
        </TabPanel>

        {(product.category === ProductCategory.CD ||
          product.category === ProductCategory.LP) && (
          <TabPanel value={tabValue} index={1}>
            <Paper elevation={0} sx={{ p: 3 }}>
              {renderTracklist(
                product.category === ProductCategory.CD
                  ? (product as CDProduct).tracklist
                  : (product as LPProduct).tracklist
              )}
            </Paper>
          </TabPanel>
        )}

        <TabPanel
          value={tabValue}
          index={
            product.category === ProductCategory.CD ||
            product.category === ProductCategory.LP
              ? 2
              : 1
          }
        >
          <Paper elevation={0} sx={{ p: 3 }}>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Physical Specifications
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <InfoIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2">Dimensions:</Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
                  {`${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`}
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <InfoIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2">Weight:</Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
                  {`${product.weight} kg`}
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <DateIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2">
                    Warehouse Entry Date:
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
                  {formatDate(product.warehouseEntryDate)}
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <InfoIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2">Barcode:</Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
                  {product.barcode}
                </Typography>
              </Grid2>
            </Grid2>
          </Paper>
        </TabPanel>
      </Box>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
      </Box>
    </Container>
  );
};

export default ProductDetailPage;
