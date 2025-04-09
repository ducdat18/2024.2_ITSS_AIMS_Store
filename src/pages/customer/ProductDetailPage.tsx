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
  Add as AddIcon,
  Remove as RemoveIcon,
  Warning as WarningIcon,
  Waves as WavesIcon,
  MusicNote,
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
        return <BookIcon sx={{ fontSize: 40, color: 'primary.light' }} />;
      case ProductCategory.CD:
        return <CDIcon sx={{ fontSize: 40, color: 'primary.light' }} />;
      case ProductCategory.LP:
        return <LPIcon sx={{ fontSize: 40, color: 'primary.light' }} />;
      case ProductCategory.DVD:
        return <DVDIcon sx={{ fontSize: 40, color: 'primary.light' }} />;
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
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: 'primary.light',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <BookIcon fontSize="small" />
          Product Details
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AuthorIcon sx={{ mr: 1, color: 'primary.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Authors:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {book.authors.join(', ')}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PublisherIcon sx={{ mr: 1, color: 'primary.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Publisher:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {book.publisher}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <DateIcon sx={{ mr: 1, color: 'primary.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Publication Date:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {formatDate(book.publicationDate)}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <InfoIcon sx={{ mr: 1, color: 'primary.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Cover Type:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {book.coverType === CoverType.PAPERBACK ? 'Paperback' : 'Hardcover'}
        </Typography>
      </Grid2>

      {book.pages && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <InfoIcon sx={{ mr: 1, color: 'primary.light' }} />
            <Typography variant="subtitle2" color="text.secondary">
              Pages:
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ ml: 4, mb: 2, color: 'text.primary' }}
          >
            {book.pages}
          </Typography>
        </Grid2>
      )}

      {book.language && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LanguageIcon sx={{ mr: 1, color: 'primary.light' }} />
            <Typography variant="subtitle2" color="text.secondary">
              Language:
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ ml: 4, mb: 2, color: 'text.primary' }}
          >
            {book.language}
          </Typography>
        </Grid2>
      )}

      {book.genre && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <GenreIcon sx={{ mr: 1, color: 'primary.light' }} />
            <Typography variant="subtitle2" color="text.secondary">
              Genre:
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ ml: 4, mb: 2, color: 'text.primary' }}
          >
            {book.genre}
          </Typography>
        </Grid2>
      )}
    </Grid2>
  );

  const renderCDDetails = (cd: CDProduct) => (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: 'secondary.light',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <CDIcon fontSize="small" />
          Product Details
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <ArtistIcon sx={{ mr: 1, color: 'secondary.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Artists:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {cd.artists.join(', ')}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <RecordLabelIcon sx={{ mr: 1, color: 'secondary.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Record Label:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {cd.recordLabel}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <GenreIcon sx={{ mr: 1, color: 'secondary.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Genre:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {cd.genre}
        </Typography>
      </Grid2>

      {cd.releaseDate && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DateIcon sx={{ mr: 1, color: 'secondary.light' }} />
            <Typography variant="subtitle2" color="text.secondary">
              Release Date:
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ ml: 4, mb: 2, color: 'text.primary' }}
          >
            {formatDate(cd.releaseDate)}
          </Typography>
        </Grid2>
      )}
    </Grid2>
  );

  const renderLPDetails = (lp: LPProduct) => (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: 'warning.light',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <LPIcon fontSize="small" />
          Product Details
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <ArtistIcon sx={{ mr: 1, color: 'warning.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Artists:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {lp.artists.join(', ')}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <RecordLabelIcon sx={{ mr: 1, color: 'warning.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Record Label:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {lp.recordLabel}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <GenreIcon sx={{ mr: 1, color: 'warning.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Genre:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {lp.genre}
        </Typography>
      </Grid2>

      {lp.releaseDate && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DateIcon sx={{ mr: 1, color: 'warning.light' }} />
            <Typography variant="subtitle2" color="text.secondary">
              Release Date:
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ ml: 4, mb: 2, color: 'text.primary' }}
          >
            {formatDate(lp.releaseDate)}
          </Typography>
        </Grid2>
      )}
    </Grid2>
  );

  const renderDVDDetails = (dvd: DVDProduct) => (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: 'success.light',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <DVDIcon fontSize="small" />
          Product Details
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <DirectorIcon sx={{ mr: 1, color: 'success.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Director:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {dvd.director}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <StudioIcon sx={{ mr: 1, color: 'success.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Studio:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {dvd.studio}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <RuntimeIcon sx={{ mr: 1, color: 'success.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Runtime:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {dvd.runtime} minutes
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <InfoIcon sx={{ mr: 1, color: 'success.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Disc Type:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {dvd.discType === DiscType.BLURAY ? 'Blu-ray' : 'HD-DVD'}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LanguageIcon sx={{ mr: 1, color: 'success.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Languages:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {dvd.language.join(', ')}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <SubtitlesIcon sx={{ mr: 1, color: 'success.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Subtitles:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {dvd.subtitles.join(', ')}
        </Typography>
      </Grid2>

      {dvd.releaseDate && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DateIcon sx={{ mr: 1, color: 'success.light' }} />
            <Typography variant="subtitle2" color="text.secondary">
              Release Date:
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ ml: 4, mb: 2, color: 'text.primary' }}
          >
            {formatDate(dvd.releaseDate)}
          </Typography>
        </Grid2>
      )}

      {dvd.genre && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <GenreIcon sx={{ mr: 1, color: 'success.light' }} />
            <Typography variant="subtitle2" color="text.secondary">
              Genre:
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ ml: 4, mb: 2, color: 'text.primary' }}
          >
            {dvd.genre}
          </Typography>
        </Grid2>
      )}
    </Grid2>
  );

  const renderTracklist = (tracks: string[]) => (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: 'primary.light',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2,
        }}
      >
        <MusicNote fontSize="small" />
        Tracklist
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderColor: 'rgba(100, 255, 218, 0.1)',
          backgroundColor: 'rgba(13, 37, 56, 0.5)',
        }}
      >
        <Grid2 container spacing={1}>
          {tracks.map((track, index) => (
            <Grid2 size={{ xs: 12 }} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  p: 1,
                  borderBottom:
                    index < tracks.length - 1
                      ? '1px solid rgba(100, 255, 218, 0.05)'
                      : 'none',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ minWidth: 30, color: 'primary.light' }}
                >
                  {index + 1}.
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {track}
                </Typography>
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          p: 5,
          height: '70vh',
          gap: 2,
        }}
      >
        <WavesIcon
          sx={{
            fontSize: 60,
            color: 'primary.light',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(0.95)',
                opacity: 0.7,
              },
              '70%': {
                transform: 'scale(1.1)',
                opacity: 1,
              },
              '100%': {
                transform: 'scale(0.95)',
                opacity: 0.7,
              },
            },
          }}
        />
        <Typography
          variant="h5"
          sx={{
            color: 'text.secondary',
            fontWeight: 'medium',
          }}
        >
          Diving into product details...
        </Typography>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box
        sx={{
          py: { xs: 4, md: 5 },
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Alert
            severity="error"
            sx={{
              mb: 3,
              backgroundColor: 'rgba(255, 82, 82, 0.1)',
              border: '1px solid rgba(255, 82, 82, 0.3)',
              '& .MuiAlert-icon': {
                color: 'error.main',
              },
            }}
            icon={<WarningIcon />}
          >
            {error || 'Product not found'}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')}
            sx={{
              mt: 2,
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
            Back to Products
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 4, md: 5 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(2, 136, 209, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(100, 255, 218, 0.05) 0%, transparent 50%)',
          zIndex: 1,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Breadcrumbs navigation */}
        <Breadcrumbs
          sx={{
            mb: 3,
            '& .MuiBreadcrumbs-separator': {
              color: 'rgba(100, 255, 218, 0.3)',
            },
          }}
        >
          <Link
            component={RouterLink}
            to="/"
            color="inherit"
            sx={{
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.light',
              },
            }}
          >
            Home
          </Link>
          <Link
            component={RouterLink}
            to="/products"
            color="inherit"
            sx={{
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.light',
              },
            }}
          >
            Products
          </Link>
          <Link
            component={RouterLink}
            to={`/products/category/${product.category}`}
            color="inherit"
            sx={{
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.light',
              },
            }}
          >
            {product.category}
          </Link>
          <Typography color="primary.light">{product.title}</Typography>
        </Breadcrumbs>

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
                <WavesIcon
                  sx={{
                    fontSize: 80,
                    color: 'primary.light',
                    mb: 2,
                    opacity: 0.8,
                  }}
                />
                {getCategoryIcon(product.category)}
                <Typography
                  variant="h5"
                  color="primary.light"
                  sx={{
                    mt: 2,
                    fontWeight: 'medium',
                  }}
                >
                  {product.title}
                </Typography>
                <Chip
                  label={product.category}
                  color={getCategoryColor(product.category)}
                  sx={{
                    mt: 2,
                    borderRadius: '4px',
                  }}
                />
              </Box>

              {/* Discount Badge */}
              {product.discount && (
                <Chip
                  label={`${product.discount}% OFF`}
                  color="error"
                  size="medium"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    px: 1,
                    zIndex: 10,
                    borderRadius: '4px',
                  }}
                />
              )}
            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 7 }}>
            <Box>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                }}
              >
                {product.title}
              </Typography>

              {product.discount ? (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography
                      variant="h5"
                      color="error.main"
                      fontWeight="bold"
                    >
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
                    Price is not includes 10% VAT
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h5"
                    color="primary.light"
                    fontWeight="bold"
                  >
                    {formatCurrency(product.price)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price is not includes 10% VAT
                  </Typography>
                </Box>
              )}

              <Typography variant="body2" color="success.main" gutterBottom>
                In Stock: {product.quantity} items
              </Typography>

              <Divider
                sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
              />

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.7,
                  }}
                >
                  <strong>Description:</strong> {product.description}
                </Typography>
              </Box>

              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  mb: 3,
                  backgroundImage:
                    'linear-gradient(135deg, rgba(13, 37, 56, 0.7) 0%, rgba(4, 28, 44, 0.7) 100%)',
                  borderRadius: 2,
                  border: '1px solid rgba(100, 255, 218, 0.1)',
                }}
              >
                <Box
                  sx={{
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="subtitle1" color="text.primary">
                    Quantity:
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={quantity <= 1}
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      sx={{
                        minWidth: 30,
                        width: 30,
                        height: 30,
                        p: 0,
                        borderColor: 'rgba(100, 255, 218, 0.3)',
                        color: 'primary.light',
                        '&:hover': {
                          borderColor: 'rgba(100, 255, 218, 0.5)',
                          backgroundColor: 'rgba(100, 255, 218, 0.05)',
                        },
                        '&.Mui-disabled': {
                          borderColor: 'rgba(100, 255, 218, 0.1)',
                        },
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </Button>
                    <TextField
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      slotProps={{
                        input: {
                          inputProps: {
                            min: 1,
                            max: product.quantity,
                            style: { textAlign: 'center' },
                          },
                        },
                      }}
                      sx={{
                        width: 60,
                        mx: 1,
                        '& .MuiOutlinedInput-root': {
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
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={quantity >= product.quantity}
                      onClick={() =>
                        quantity < product.quantity && setQuantity(quantity + 1)
                      }
                      sx={{
                        minWidth: 30,
                        width: 30,
                        height: 30,
                        p: 0,
                        borderColor: 'rgba(100, 255, 218, 0.3)',
                        color: 'primary.light',
                        '&:hover': {
                          borderColor: 'rgba(100, 255, 218, 0.5)',
                          backgroundColor: 'rgba(100, 255, 218, 0.05)',
                        },
                        '&.Mui-disabled': {
                          borderColor: 'rgba(100, 255, 218, 0.1)',
                        },
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </Button>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h6" color="primary.light">
                    Total:{' '}
                    {formatCurrency(
                      product.discount
                        ? Math.round(
                            product.price * (1 - product.discount / 100)
                          ) * quantity
                        : product.price * quantity
                    )}
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CartIcon />}
                    onClick={handleAddToCart}
                    sx={{
                      px: 3,
                      py: 1,
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
                    Add to Cart
                  </Button>
                </Box>
              </Paper>

              {addedToCart && (
                <Alert
                  severity="success"
                  sx={{
                    mb: 2,
                    backgroundColor: 'rgba(0, 191, 165, 0.1)',
                    border: '1px solid rgba(0, 191, 165, 0.3)',
                    '& .MuiAlert-icon': {
                      color: 'success.main',
                    },
                  }}
                >
                  Product added to cart successfully!
                </Alert>
              )}
            </Box>
          </Grid2>
        </Grid2>

        <Box sx={{ mt: 5 }}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 2,
              border: '1px solid rgba(100, 255, 218, 0.1)',
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{ borderBottom: 1, borderColor: 'rgba(100, 255, 218, 0.1)' }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="product information tabs"
                sx={{
                  '& .MuiTab-root': {
                    color: 'text.secondary',
                    '&.Mui-selected': {
                      color: 'primary.light',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'primary.light',
                  },
                }}
              >
                <Tab
                  label="Details"
                  {...a11yProps(0)}
                  icon={<InfoIcon />}
                  iconPosition="start"
                />
                {(product.category === ProductCategory.CD ||
                  product.category === ProductCategory.LP) && (
                  <Tab
                    label="Tracklist"
                    {...a11yProps(1)}
                    icon={<MusicNote />}
                    iconPosition="start"
                  />
                )}
                <Tab
                  label="Specifications"
                  {...a11yProps(
                    product.category === ProductCategory.CD ||
                      product.category === ProductCategory.LP
                      ? 2
                      : 1
                  )}
                  icon={<InfoIcon />}
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 2 }}>{renderProductDetails()}</Box>
            </TabPanel>

            {(product.category === ProductCategory.CD ||
              product.category === ProductCategory.LP) && (
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ p: 2 }}>
                  {renderTracklist(
                    product.category === ProductCategory.CD
                      ? (product as CDProduct).tracklist
                      : (product as LPProduct).tracklist
                  )}
                </Box>
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
              <Box sx={{ p: 2 }}>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: 'primary.light',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <InfoIcon fontSize="small" />
                      Physical Specifications
                    </Typography>
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <InfoIcon sx={{ mr: 1, color: 'primary.light' }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Dimensions:
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ ml: 4, mb: 2, color: 'text.primary' }}
                    >
                      {`${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`}
                    </Typography>
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <InfoIcon sx={{ mr: 1, color: 'primary.light' }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Weight:
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ ml: 4, mb: 2, color: 'text.primary' }}
                    >
                      {`${product.weight} kg`}
                    </Typography>
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <DateIcon sx={{ mr: 1, color: 'primary.light' }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Warehouse Entry Date:
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ ml: 4, mb: 2, color: 'text.primary' }}
                    >
                      {formatDate(product.warehouseEntryDate)}
                    </Typography>
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <InfoIcon sx={{ mr: 1, color: 'primary.light' }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Barcode:
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ ml: 4, mb: 2, color: 'text.primary' }}
                    >
                      {product.barcode}
                    </Typography>
                  </Grid2>
                </Grid2>
              </Box>
            </TabPanel>
          </Paper>
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
      </Container>
    </Box>
  );
};

export default ProductDetailPage;
