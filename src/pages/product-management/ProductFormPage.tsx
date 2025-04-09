// src/pages/product-manager/ProductFormPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid2,
  Divider,
  InputAdornment,
  FormHelperText,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Cancel as CancelIcon,
  Book as BookIcon,
  Album as CDIcon,
  Radio as LPIcon,
  MovieCreation as DVDIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { mockApiService } from '../../mock/mockApi';
import {
  Product,
  ProductCategory,
  CoverType,
  DiscType,
  BookProduct,
  CDProduct,
  LPProduct,
  DVDProduct,
  Dimensions,
} from '../../types';

// Define initial blank products for each category
const initialBookProduct: BookProduct = {
  id: '',
  title: '',
  category: ProductCategory.BOOK,
  value: 0,
  price: 0,
  barcode: '',
  description: '',
  quantity: 0,
  warehouseEntryDate: new Date().toISOString().split('T')[0],
  dimensions: { width: 0, height: 0, depth: 0 },
  weight: 0,
  authors: [''],
  coverType: CoverType.PAPERBACK,
  publisher: '',
  publicationDate: new Date().toISOString().split('T')[0],
  pages: 0,
  language: '',
  genre: '',
};

const initialCDProduct: CDProduct = {
  id: '',
  title: '',
  category: ProductCategory.CD,
  value: 0,
  price: 0,
  barcode: '',
  description: '',
  quantity: 0,
  warehouseEntryDate: new Date().toISOString().split('T')[0],
  dimensions: { width: 0, height: 0, depth: 0 },
  weight: 0,
  artists: [''],
  recordLabel: '',
  tracklist: [''],
  genre: '',
  releaseDate: new Date().toISOString().split('T')[0],
};

const initialLPProduct: LPProduct = {
  id: '',
  title: '',
  category: ProductCategory.LP,
  value: 0,
  price: 0,
  barcode: '',
  description: '',
  quantity: 0,
  warehouseEntryDate: new Date().toISOString().split('T')[0],
  dimensions: { width: 0, height: 0, depth: 0 },
  weight: 0,
  artists: [''],
  recordLabel: '',
  tracklist: [''],
  genre: '',
  releaseDate: new Date().toISOString().split('T')[0],
};

const initialDVDProduct: DVDProduct = {
  id: '',
  title: '',
  category: ProductCategory.DVD,
  value: 0,
  price: 0,
  barcode: '',
  description: '',
  quantity: 0,
  warehouseEntryDate: new Date().toISOString().split('T')[0],
  dimensions: { width: 0, height: 0, depth: 0 },
  weight: 0,
  discType: DiscType.BLURAY,
  director: '',
  runtime: 0,
  studio: '',
  language: [''],
  subtitles: [''],
  releaseDate: new Date().toISOString().split('T')[0],
  genre: '',
};

// Get category icon
const getCategoryIcon = (category: ProductCategory) => {
  switch (category) {
    case ProductCategory.BOOK:
      return <BookIcon />;
    case ProductCategory.CD:
      return <CDIcon />;
    case ProductCategory.LP:
      return <LPIcon />;
    case ProductCategory.DVD:
      return <DVDIcon />;
    default:
      return <BookIcon />;
  }
};

const ProductFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // State
  const [loading, setLoading] = useState(isEditMode);
  const [product, setProduct] = useState<Product | null>(null);
  const [formValues, setFormValues] = useState<any>(initialBookProduct);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(
    ProductCategory.BOOK
  );

  // Price limits based on value (30% to 150%)
  const minPrice = formValues.value ? Math.round(formValues.value * 0.3) : 0;
  const maxPrice = formValues.value ? Math.round(formValues.value * 1.5) : 0;

  // Load product if in edit mode
  useEffect(() => {
    const fetchProduct = async () => {
      if (isEditMode && id) {
        try {
          setLoading(true);
          const fetchedProduct = await mockApiService.getProductById(id);

          if (!fetchedProduct) {
            setSnackbarMessage('Product not found');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setLoading(false);
            navigate('/product-management/products');
            return;
          }

          setProduct(fetchedProduct);
          setFormValues(fetchedProduct);
          setSelectedCategory(fetchedProduct.category);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching product:', error);
          setSnackbarMessage('Error loading product');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          setLoading(false);
        }
      } else {
        // Initialize form based on selected category
        setFormValues(getInitialProductByCategory(selectedCategory));
      }
    };

    fetchProduct();
  }, [id, isEditMode, navigate]);

  // Get initial product values based on category
  const getInitialProductByCategory = (category: ProductCategory) => {
    switch (category) {
      case ProductCategory.BOOK:
        return initialBookProduct;
      case ProductCategory.CD:
        return initialCDProduct;
      case ProductCategory.LP:
        return initialLPProduct;
      case ProductCategory.DVD:
        return initialDVDProduct;
      default:
        return initialBookProduct;
    }
  };

  // Handle change in product category
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCategory = e.target.value as ProductCategory;

    if (formTouched) {
      // Show confirmation dialog if form has been modified
      setLeaveDialogOpen(true);
      setSelectedCategory(newCategory);
    } else {
      // Otherwise just change the category
      setSelectedCategory(newCategory);
      setFormValues(getInitialProductByCategory(newCategory));
    }
  };

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormTouched(true);

    // Handle numeric fields
    if (
      ['value', 'price', 'quantity', 'weight', 'pages', 'runtime'].includes(
        name
      )
    ) {
      const numValue = value === '' ? '' : parseFloat(value);
      setFormValues((prev: any) => ({ ...prev, [name]: numValue }));
    }
    // Handle dimension fields
    else if (name.startsWith('dimensions.')) {
      const dimensionKey = name.split('.')[1] as keyof Dimensions;
      const numValue = value === '' ? '' : parseFloat(value);
      setFormValues((prev: any) => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimensionKey]: numValue,
        },
      }));
    }
    // Handle all other fields
    else {
      setFormValues((prev: any) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle adding array items (authors, artists, tracklist, etc.)
  const handleAddArrayItem = (field: string) => {
    setFormValues((prev: any) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
    setFormTouched(true);
  };

  // Handle removing array items
  const handleRemoveArrayItem = (field: string, index: number) => {
    if (formValues[field].length > 1) {
      setFormValues((prev: any) => ({
        ...prev,
        [field]: prev[field].filter((_: any, i: number) => i !== index),
      }));
      setFormTouched(true);
    } else {
      setSnackbarMessage(`At least one ${field} is required`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Handle changes to array items
  const handleArrayItemChange = (
    field: string,
    index: number,
    value: string
  ) => {
    setFormValues((prev: any) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
    setFormTouched(true);
  };

  // Validate the form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields for all products
    if (!formValues.title) newErrors.title = 'Title is required';
    if (!formValues.barcode) newErrors.barcode = 'Barcode is required';
    if (!formValues.description)
      newErrors.description = 'Description is required';

    // Validate numeric fields
    if (!formValues.value) newErrors.value = 'Value is required';
    else if (formValues.value <= 0)
      newErrors.value = 'Value must be greater than 0';

    if (!formValues.price) newErrors.price = 'Price is required';
    else if (formValues.price < minPrice || formValues.price > maxPrice) {
      newErrors.price = `Price must be between ${minPrice} and ${maxPrice} VND (30%-150% of value)`;
    }

    if (!formValues.quantity && formValues.quantity !== 0)
      newErrors.quantity = 'Quantity is required';
    else if (formValues.quantity < 0)
      newErrors.quantity = 'Quantity cannot be negative';

    if (!formValues.weight) newErrors.weight = 'Weight is required';
    else if (formValues.weight <= 0)
      newErrors.weight = 'Weight must be greater than 0';

    // Validate dimensions
    if (!formValues.dimensions.width)
      newErrors['dimensions.width'] = 'Width is required';
    if (!formValues.dimensions.height)
      newErrors['dimensions.height'] = 'Height is required';
    if (!formValues.dimensions.depth)
      newErrors['dimensions.depth'] = 'Depth is required';

    // Validate category-specific fields
    if (formValues.category === ProductCategory.BOOK) {
      if (formValues.authors.some((author: string) => !author)) {
        newErrors.authors = 'All authors must be filled in';
      }
      if (!formValues.publisher) newErrors.publisher = 'Publisher is required';
      if (!formValues.publicationDate)
        newErrors.publicationDate = 'Publication date is required';
    } else if (
      formValues.category === ProductCategory.CD ||
      formValues.category === ProductCategory.LP
    ) {
      if (formValues.artists.some((artist: string) => !artist)) {
        newErrors.artists = 'All artists must be filled in';
      }
      if (!formValues.recordLabel)
        newErrors.recordLabel = 'Record label is required';
      if (formValues.tracklist.some((track: string) => !track)) {
        newErrors.tracklist = 'All tracks must be filled in';
      }
      if (!formValues.genre) newErrors.genre = 'Genre is required';
    } else if (formValues.category === ProductCategory.DVD) {
      if (!formValues.director) newErrors.director = 'Director is required';
      if (!formValues.runtime) newErrors.runtime = 'Runtime is required';
      else if (formValues.runtime <= 0)
        newErrors.runtime = 'Runtime must be greater than 0';
      if (!formValues.studio) newErrors.studio = 'Studio is required';
      if (formValues.language.some((lang: string) => !lang)) {
        newErrors.language = 'All languages must be filled in';
      }
      if (formValues.subtitles.some((sub: string) => !sub)) {
        newErrors.subtitles = 'All subtitles must be filled in';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSnackbarMessage('Please fix the errors in the form');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      // In a real implementation, this would call the API to save the product
      const successMessage = isEditMode
        ? 'Product updated successfully'
        : 'Product added successfully';

      setSnackbarMessage(successMessage);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setTimeout(() => {
        navigate('/product-management/products');
      }, 1500);
    } catch (error) {
      console.error('Error saving product:', error);
      setSnackbarMessage('Error saving product');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Handle leave confirmation for category change
  const handleLeaveConfirmation = () => {
    setFormValues(getInitialProductByCategory(selectedCategory));
    setLeaveDialogOpen(false);
    setFormTouched(false);
  };

  // Handle cancel leaving
  const handleCancelLeave = () => {
    setLeaveDialogOpen(false);
    setSelectedCategory(formValues.category);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography>Loading product...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 60,
                height: 3,
                background:
                  'linear-gradient(90deg, rgba(100, 255, 218, 0.7), rgba(100, 255, 218, 0.1))',
                borderRadius: 2,
              },
            }}
          >
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </Typography>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/product-management/products')}
          >
            Back to Products
          </Button>
        </Box>

        <Paper
          elevation={3}
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 4,
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            border: '1px solid rgba(100, 255, 218, 0.1)',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.light',
              mb: 3,
            }}
          >
            Product Information
          </Typography>

          {/* Select Product Category - Only enabled in Add mode */}
          <FormControl
            component="fieldset"
            sx={{ mb: 4, width: '100%' }}
            disabled={isEditMode}
          >
            <FormLabel component="legend" sx={{ color: 'text.secondary' }}>
              Product Category
            </FormLabel>
            <RadioGroup
              row
              name="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {Object.values(ProductCategory).map((category) => (
                <FormControlLabel
                  key={category}
                  value={category}
                  control={<Radio />}
                  label={
                    <Chip
                      icon={getCategoryIcon(category)}
                      label={category}
                      variant={
                        selectedCategory === category ? 'filled' : 'outlined'
                      }
                      sx={{
                        minWidth: 100,
                        justifyContent: 'flex-start',
                        opacity: selectedCategory === category ? 1 : 0.7,
                      }}
                    />
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Divider sx={{ mb: 4, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

          {/* Common Product Fields */}
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                }}
              >
                Basic Information
              </Typography>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Title *"
                name="title"
                value={formValues.title}
                onChange={handleInputChange}
                error={!!errors.title}
                helperText={errors.title}
                required
                sx={{
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
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Barcode *"
                name="barcode"
                value={formValues.barcode}
                onChange={handleInputChange}
                error={!!errors.barcode}
                helperText={errors.barcode}
                required
                sx={{
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
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description *"
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description}
                required
                multiline
                rows={3}
                sx={{
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
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Value (VND) *"
                name="value"
                type="number"
                value={formValues.value}
                onChange={handleInputChange}
                error={!!errors.value}
                helperText={errors.value}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">VND</InputAdornment>
                  ),
                }}
                sx={{
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
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Price (VND) *"
                name="price"
                type="number"
                value={formValues.price}
                onChange={handleInputChange}
                error={!!errors.price}
                helperText={
                  errors.price ||
                  (formValues.value
                    ? `Valid range: ${minPrice} - ${maxPrice} VND`
                    : '')
                }
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">VND</InputAdornment>
                  ),
                }}
                sx={{
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
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Discount (%)"
                name="discount"
                type="number"
                value={formValues.discount || ''}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                sx={{
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
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Quantity in Stock *"
                name="quantity"
                type="number"
                value={formValues.quantity}
                onChange={handleInputChange}
                error={!!errors.quantity}
                helperText={errors.quantity}
                required
                sx={{
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
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Warehouse Entry Date *"
                name="warehouseEntryDate"
                type="date"
                value={formValues.warehouseEntryDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
                sx={{
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
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Weight (kg) *"
                name="weight"
                type="number"
                value={formValues.weight}
                onChange={handleInputChange}
                error={!!errors.weight}
                helperText={errors.weight}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">kg</InputAdornment>
                  ),
                }}
                sx={{
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
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                  mt: 2,
                }}
              >
                Dimensions
              </Typography>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Width (cm) *"
                name="dimensions.width"
                type="number"
                value={formValues.dimensions.width}
                onChange={handleInputChange}
                error={!!errors['dimensions.width']}
                helperText={errors['dimensions.width']}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">cm</InputAdornment>
                  ),
                }}
                sx={{
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
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Height (cm) *"
                name="dimensions.height"
                type="number"
                value={formValues.dimensions.height}
                onChange={handleInputChange}
                error={!!errors['dimensions.height']}
                helperText={errors['dimensions.height']}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">cm</InputAdornment>
                  ),
                }}
                sx={{
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
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Depth (cm) *"
                name="dimensions.depth"
                type="number"
                value={formValues.dimensions.depth}
                onChange={handleInputChange}
                error={!!errors['dimensions.depth']}
                helperText={errors['dimensions.depth']}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">cm</InputAdornment>
                  ),
                }}
                sx={{
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
            </Grid2>
          </Grid2>

          <Divider sx={{ my: 4, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

          {/* Category-specific Fields */}
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                }}
              >
                {formValues.category}-Specific Information
              </Typography>
            </Grid2>

            {/* BOOK Category Fields */}
            {formValues.category === ProductCategory.BOOK && (
              <>
                <Grid2 size={{ xs: 12 }}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Authors*
                    </Typography>
                    {formValues.authors.map((author: string, index: number) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          mb: 1,
                          gap: 1,
                          alignItems: 'flex-start',
                        }}
                      >
                        <TextField
                          fullWidth
                          placeholder={`Author #${index + 1}`}
                          value={author}
                          onChange={(e) =>
                            handleArrayItemChange(
                              'authors',
                              index,
                              e.target.value
                            )
                          }
                          error={!!errors.authors}
                          sx={{
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
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleRemoveArrayItem('authors', index)
                          }
                          disabled={formValues.authors.length <= 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => handleAddArrayItem('authors')}
                      sx={{ mt: 1 }}
                    >
                      Add Author
                    </Button>
                    {errors.authors && (
                      <FormHelperText error>{errors.authors}</FormHelperText>
                    )}
                  </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Publisher *"
                    name="publisher"
                    value={formValues.publisher}
                    onChange={handleInputChange}
                    error={!!errors.publisher}
                    helperText={errors.publisher}
                    required
                    sx={{
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
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Publication Date *"
                    name="publicationDate"
                    type="date"
                    value={formValues.publicationDate}
                    onChange={handleInputChange}
                    error={!!errors.publicationDate}
                    helperText={errors.publicationDate}
                    InputLabelProps={{ shrink: true }}
                    required
                    sx={{
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
                </Grid2>

                <Grid2 size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth>
                    <FormLabel
                      id="cover-type-label"
                      sx={{ color: 'text.secondary', mb: 1 }}
                    >
                      Cover Type *
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="cover-type-label"
                      name="coverType"
                      value={formValues.coverType}
                      onChange={handleInputChange}
                    >
                      <FormControlLabel
                        value={CoverType.PAPERBACK}
                        control={<Radio />}
                        label="Paperback"
                      />
                      <FormControlLabel
                        value={CoverType.HARDCOVER}
                        control={<Radio />}
                        label="Hardcover"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Number of Pages"
                    name="pages"
                    type="number"
                    value={formValues.pages || ''}
                    onChange={handleInputChange}
                    sx={{
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
                </Grid2>

                <Grid2 size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Language"
                    name="language"
                    value={formValues.language || ''}
                    onChange={handleInputChange}
                    sx={{
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
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Genre"
                    name="genre"
                    value={formValues.genre || ''}
                    onChange={handleInputChange}
                    sx={{
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
                </Grid2>
              </>
            )}

            {/* CD and LP Category Fields */}
            {(formValues.category === ProductCategory.CD ||
              formValues.category === ProductCategory.LP) && (
              <>
                <Grid2 size={{ xs: 12 }}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Artists*
                    </Typography>
                    {formValues.artists.map((artist: string, index: number) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          mb: 1,
                          gap: 1,
                          alignItems: 'flex-start',
                        }}
                      >
                        <TextField
                          fullWidth
                          placeholder={`Artist #${index + 1}`}
                          value={artist}
                          onChange={(e) =>
                            handleArrayItemChange(
                              'artists',
                              index,
                              e.target.value
                            )
                          }
                          error={!!errors.artists}
                          sx={{
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
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleRemoveArrayItem('artists', index)
                          }
                          disabled={formValues.artists.length <= 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => handleAddArrayItem('artists')}
                      sx={{ mt: 1 }}
                    >
                      Add Artist
                    </Button>
                    {errors.artists && (
                      <FormHelperText error>{errors.artists}</FormHelperText>
                    )}
                  </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Record Label *"
                    name="recordLabel"
                    value={formValues.recordLabel}
                    onChange={handleInputChange}
                    error={!!errors.recordLabel}
                    helperText={errors.recordLabel}
                    required
                    sx={{
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
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Genre *"
                    name="genre"
                    value={formValues.genre}
                    onChange={handleInputChange}
                    error={!!errors.genre}
                    helperText={errors.genre}
                    required
                    sx={{
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
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Release Date"
                    name="releaseDate"
                    type="date"
                    value={formValues.releaseDate || ''}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    sx={{
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
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Tracklist*
                    </Typography>
                    {formValues.tracklist.map(
                      (track: string, index: number) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            mb: 1,
                            gap: 1,
                            alignItems: 'flex-start',
                          }}
                        >
                          <TextField
                            fullWidth
                            placeholder={`Track #${index + 1}`}
                            value={track}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'tracklist',
                                index,
                                e.target.value
                              )
                            }
                            error={!!errors.tracklist}
                            sx={{
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
                          <IconButton
                            color="error"
                            onClick={() =>
                              handleRemoveArrayItem('tracklist', index)
                            }
                            disabled={formValues.tracklist.length <= 1}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )
                    )}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => handleAddArrayItem('tracklist')}
                      sx={{ mt: 1 }}
                    >
                      Add Track
                    </Button>
                    {errors.tracklist && (
                      <FormHelperText error>{errors.tracklist}</FormHelperText>
                    )}
                  </Box>
                </Grid2>
              </>
            )}

            {/* DVD Category Fields */}
            {formValues.category === ProductCategory.DVD && (
              <>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Director *"
                    name="director"
                    value={formValues.director}
                    onChange={handleInputChange}
                    error={!!errors.director}
                    helperText={errors.director}
                    required
                    sx={{
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
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Studio *"
                    name="studio"
                    value={formValues.studio}
                    onChange={handleInputChange}
                    error={!!errors.studio}
                    helperText={errors.studio}
                    required
                    sx={{
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
                </Grid2>

                <Grid2 size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth>
                    <FormLabel
                      id="disc-type-label"
                      sx={{ color: 'text.secondary', mb: 1 }}
                    >
                      Disc Type *
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="disc-type-label"
                      name="discType"
                      value={formValues.discType}
                      onChange={handleInputChange}
                    >
                      <FormControlLabel
                        value={DiscType.BLURAY}
                        control={<Radio />}
                        label="Blu-ray"
                      />
                      <FormControlLabel
                        value={DiscType.HDDVD}
                        control={<Radio />}
                        label="HD-DVD"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Runtime (minutes) *"
                    name="runtime"
                    type="number"
                    value={formValues.runtime}
                    onChange={handleInputChange}
                    error={!!errors.runtime}
                    helperText={errors.runtime}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">min</InputAdornment>
                      ),
                    }}
                    sx={{
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
                </Grid2>

                <Grid2 size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Genre"
                    name="genre"
                    value={formValues.genre || ''}
                    onChange={handleInputChange}
                    sx={{
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
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Release Date"
                    name="releaseDate"
                    type="date"
                    value={formValues.releaseDate || ''}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    sx={{
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
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Languages*
                    </Typography>
                    {formValues.language.map((lang: string, index: number) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          mb: 1,
                          gap: 1,
                          alignItems: 'flex-start',
                        }}
                      >
                        <TextField
                          fullWidth
                          placeholder={`Language #${index + 1}`}
                          value={lang}
                          onChange={(e) =>
                            handleArrayItemChange(
                              'language',
                              index,
                              e.target.value
                            )
                          }
                          error={!!errors.language}
                          sx={{
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
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleRemoveArrayItem('language', index)
                          }
                          disabled={formValues.language.length <= 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => handleAddArrayItem('language')}
                      sx={{ mt: 1 }}
                    >
                      Add Language
                    </Button>
                    {errors.language && (
                      <FormHelperText error>{errors.language}</FormHelperText>
                    )}
                  </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Subtitles*
                    </Typography>
                    {formValues.subtitles.map(
                      (subtitle: string, index: number) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            mb: 1,
                            gap: 1,
                            alignItems: 'flex-start',
                          }}
                        >
                          <TextField
                            fullWidth
                            placeholder={`Subtitle #${index + 1}`}
                            value={subtitle}
                            onChange={(e) =>
                              handleArrayItemChange(
                                'subtitles',
                                index,
                                e.target.value
                              )
                            }
                            error={!!errors.subtitles}
                            sx={{
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
                          <IconButton
                            color="error"
                            onClick={() =>
                              handleRemoveArrayItem('subtitles', index)
                            }
                            disabled={formValues.subtitles.length <= 1}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )
                    )}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => handleAddArrayItem('subtitles')}
                      sx={{ mt: 1 }}
                    >
                      Add Subtitle
                    </Button>
                    {errors.subtitles && (
                      <FormHelperText error>{errors.subtitles}</FormHelperText>
                    )}
                  </Box>
                </Grid2>
              </>
            )}
          </Grid2>

          <Divider sx={{ my: 4, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

          {/* Form Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/product-management/products')}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              startIcon={<SaveIcon />}
              sx={{
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
              {isEditMode ? 'Update Product' : 'Add Product'}
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Dialog for category change confirmation */}
      <Dialog
        open={leaveDialogOpen}
        onClose={handleCancelLeave}
        aria-labelledby="category-change-dialog-title"
        aria-describedby="category-change-dialog-description"
      >
        <DialogTitle id="category-change-dialog-title">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="warning" />
            Change Product Category?
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="category-change-dialog-description">
            Changing the product category will reset the form and all your
            current changes will be lost. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLeave} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLeaveConfirmation} color="error">
            Change Category
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductFormPage;
