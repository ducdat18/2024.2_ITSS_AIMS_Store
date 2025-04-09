// src/pages/productManager/EditProductPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid2,
  TextField,
  MenuItem,
  Button,
  IconButton,
  FormControl,
  FormLabel,
  FormHelperText,
  InputAdornment,
  Divider,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Radio,
  RadioGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Clear as ClearIcon,
  Waves as WavesIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApiService } from '../../mock/mockApi';
import { ProductCategory, CoverType, DiscType } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface FormData {
  title: string;
  category: ProductCategory;
  value: string;
  price: string;
  barcode: string;
  description: string;
  quantity: string;
  dimensions: {
    width: string;
    height: string;
    depth: string;
  };
  weight: string;
  discount: string;
  authors: string[];
  coverType: CoverType;
  publisher: string;
  publicationDate: string;
  pages: string;
  language: string;
  genre: string;
  artists: string[];
  recordLabel: string;
  tracklist: string[];
  releaseDate: string;
  discType: DiscType;
  director: string;
  runtime: string;
  studio: string;
  language_array: string[];
  subtitles: string[];
}

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPriceHistoryDialog, setOpenPriceHistoryDialog] = useState(false);
  const [priceUpdatedToday, setPriceUpdatedToday] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: ProductCategory.BOOK,
    value: '',
    price: '',
    barcode: '',
    description: '',
    quantity: '',
    dimensions: {
      width: '',
      height: '',
      depth: '',
    },
    weight: '',
    discount: '',
    authors: [''],
    coverType: CoverType.PAPERBACK,
    publisher: '',
    publicationDate: '',
    pages: '',
    language: '',
    genre: '',
    artists: [''],
    recordLabel: '',
    tracklist: [''],
    releaseDate: '',
    discType: DiscType.BLURAY,
    director: '',
    runtime: '',
    studio: '',
    language_array: [''],
    subtitles: [''],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [priceStatus, setPriceStatus] = useState<{
    isValid: boolean;
    message: string | null;
    percent: number;
  }>({
    isValid: true,
    message: null,
    percent: 0,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
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

        // Mock price update history
        setPriceUpdatedToday(Math.random() > 0.5); // Randomly set whether the price was updated today

        // Prepare form data from the product
        const newFormData: FormData = {
          title: productData.title,
          category: productData.category,
          value: productData.value.toString(),
          price: productData.price.toString(),
          barcode: productData.barcode,
          description: productData.description,
          quantity: productData.quantity.toString(),
          dimensions: {
            width: productData.dimensions.width.toString(),
            height: productData.dimensions.height.toString(),
            depth: productData.dimensions.depth.toString(),
          },
          weight: productData.weight.toString(),
          discount: productData.discount ? productData.discount.toString() : '',
          authors: [''],
          coverType: CoverType.PAPERBACK,
          publisher: '',
          publicationDate: '',
          pages: '',
          language: '',
          genre: '',
          artists: [''],
          recordLabel: '',
          tracklist: [''],
          releaseDate: '',
          discType: DiscType.BLURAY,
          director: '',
          runtime: '',
          studio: '',
          language_array: [''],
          subtitles: [''],
        };

        // Add category-specific fields
        if (productData.category === ProductCategory.BOOK) {
          newFormData.authors = productData.authors || [''];
          newFormData.coverType = productData.coverType || CoverType.PAPERBACK;
          newFormData.publisher = productData.publisher || '';
          newFormData.publicationDate = productData.publicationDate || '';
          newFormData.pages = productData.pages
            ? productData.pages.toString()
            : '';
          newFormData.language = productData.language || '';
          newFormData.genre = productData.genre || '';
        } else if (
          productData.category === ProductCategory.CD ||
          productData.category === ProductCategory.LP
        ) {
          newFormData.artists = productData.artists || [''];
          newFormData.recordLabel = productData.recordLabel || '';
          newFormData.tracklist = productData.tracklist || [''];
          newFormData.releaseDate = productData.releaseDate || '';
          newFormData.genre = productData.genre || '';
        } else if (productData.category === ProductCategory.DVD) {
          newFormData.discType = productData.discType || DiscType.BLURAY;
          newFormData.director = productData.director || '';
          newFormData.runtime = productData.runtime
            ? productData.runtime.toString()
            : '';
          newFormData.studio = productData.studio || '';
          newFormData.language_array = productData.language || [''];
          newFormData.subtitles = productData.subtitles || [''];
          newFormData.releaseDate = productData.releaseDate || '';
          newFormData.genre = productData.genre || '';
        }

        setFormData(newFormData);

        // Validate price
        if (newFormData.price && newFormData.value) {
          validatePrice(
            parseFloat(newFormData.price),
            parseFloat(newFormData.value)
          );
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const validatePrice = (price: number, value: number) => {
    const percentage = (price / value) * 100;

    if (price < value * 0.3) {
      setPriceStatus({
        isValid: false,
        message: 'Price must be at least 30% of the product value',
        percent: percentage,
      });
    } else if (price > value * 1.5) {
      setPriceStatus({
        isValid: false,
        message: 'Price cannot exceed 150% of the product value',
        percent: percentage,
      });
    } else {
      setPriceStatus({
        isValid: true,
        message: `Price is ${percentage.toFixed(0)}% of product value`,
        percent: percentage,
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;

    if (!name) return;

    if (name === 'value' || name === 'price') {
      // Only allow numbers for value and price
      const numValue = String(value).replace(/[^0-9]/g, '');

      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));

      // Validate price within 30% to 150% of value
      if (name === 'price' && formData.value) {
        const valueNum = parseFloat(formData.value);
        const priceNum = parseFloat(numValue);
        validatePrice(priceNum, valueNum);
      } else if (name === 'value' && formData.price) {
        // Update price validation when value changes
        const valueNum = parseFloat(numValue);
        const priceNum = parseFloat(formData.price);
        validatePrice(priceNum, valueNum);
      }
    } else if (name === 'discount') {
      // Only allow numbers between 0-100 for discount
      let numValue = String(value).replace(/[^0-9]/g, '');
      if (numValue && parseInt(numValue) > 100) {
        numValue = '100';
      }
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));
    } else if (name.includes('.')) {
      // Handle nested objects like dimensions.width
      const [parent, child] = name.split('.');
      setFormData((prev) => {
        const parentValue = prev[parent as keyof FormData];
        if (typeof parentValue === 'object' && parentValue !== null) {
          return {
            ...prev,
            [parent]: {
              ...parentValue,
              [child]: value,
            },
          };
        }
        return prev;
      });
    } else {
      // Handle normal fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle array fields (authors, artists, tracklist, etc.)
  const handleArrayFieldChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev: any) => {
      const prevArray = prev[field] || [''];
      const newArray = [...prevArray];
      newArray[index] = value;

      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const addArrayField = (field: string) => {
    setFormData((prev: any) => {
      const prevArray = prev[field] || [''];
      return {
        ...prev,
        [field]: [...prevArray, ''],
      };
    });
  };

  const removeArrayField = (field: string, index: number) => {
    setFormData((prev: any) => {
      const prevArray = prev[field] || [''];
      if (prevArray.length <= 1) return prev; // Keep at least one field

      const newArray = [...prevArray];
      newArray.splice(index, 1);

      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Basic validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.value) {
      newErrors.value = 'Value is required';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (!priceStatus.isValid) {
      newErrors.price = priceStatus.message || 'Invalid price';
    }

    // Check if price can be updated today
    if (
      priceUpdatedToday &&
      product &&
      formData.price !== product.price.toString()
    ) {
      newErrors.price = 'Price can only be updated twice per day';
    }

    if (!formData.barcode.trim()) {
      newErrors.barcode = 'Barcode is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    }

    if (!formData.dimensions.width) {
      newErrors['dimensions.width'] = 'Width is required';
    }

    if (!formData.dimensions.height) {
      newErrors['dimensions.height'] = 'Height is required';
    }

    if (!formData.dimensions.depth) {
      newErrors['dimensions.depth'] = 'Depth is required';
    }

    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
    }

    // Category-specific validation
    if (formData.category === ProductCategory.BOOK) {
      if (!formData.authors[0].trim()) {
        newErrors.authors = 'At least one author is required';
      }

      if (!formData.publisher.trim()) {
        newErrors.publisher = 'Publisher is required';
      }

      if (!formData.publicationDate) {
        newErrors.publicationDate = 'Publication date is required';
      }
    } else if (
      formData.category === ProductCategory.CD ||
      formData.category === ProductCategory.LP
    ) {
      if (!formData.artists[0].trim()) {
        newErrors.artists = 'At least one artist is required';
      }

      if (!formData.recordLabel.trim()) {
        newErrors.recordLabel = 'Record label is required';
      }

      if (!formData.tracklist[0].trim()) {
        newErrors.tracklist = 'At least one track is required';
      }
    } else if (formData.category === ProductCategory.DVD) {
      if (!formData.director.trim()) {
        newErrors.director = 'Director is required';
      }

      if (!formData.runtime) {
        newErrors.runtime = 'Runtime is required';
      }

      if (!formData.studio.trim()) {
        newErrors.studio = 'Studio is required';
      }

      if (!formData.language_array[0].trim()) {
        newErrors.language_array = 'At least one language is required';
      }

      if (!formData.subtitles[0].trim()) {
        newErrors.subtitles = 'At least one subtitle is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // In a real app, this would call an API to update the product
        console.log('Updating product:', formData);

        // Show success snackbar
        setSnackbar({
          open: true,
          message: 'Product updated successfully!',
          severity: 'success',
        });

        // Navigate back to product list after delay
        setTimeout(() => {
          navigate('/product-management/products');
        }, 2000);
      } catch (error) {
        console.error('Error updating product:', error);
        setSnackbar({
          open: true,
          message: 'Failed to update product',
          severity: 'error',
        });
      }
    }
  };

  const handleDelete = async () => {
    try {
      // In a real app, this would call an API to delete the product
      console.log('Deleting product:', id);

      // Show success snackbar
      setSnackbar({
        open: true,
        message: 'Product deleted successfully!',
        severity: 'success',
      });

      // Close the dialog
      setOpenDeleteDialog(false);

      // Navigate back to product list after delay
      setTimeout(() => {
        navigate('/product-management/products');
      }, 2000);
    } catch (error) {
      console.error('Error deleting product:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete product',
        severity: 'error',
      });
      setOpenDeleteDialog(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="h6" color="text.secondary">
          Loading product...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/product-management/products')}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        py: 3,
        minHeight: '100vh',
        backgroundColor: 'background.default',
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
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="primary"
              onClick={() => navigate('/product-management/products')}
              sx={{ mr: 1, bgcolor: 'rgba(2, 136, 209, 0.1)' }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
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
              <WavesIcon /> Edit Product
            </Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setOpenDeleteDialog(true)}
              sx={{
                borderColor: 'rgba(255, 82, 82, 0.3)',
                '&:hover': {
                  borderColor: 'rgba(255, 82, 82, 0.5)',
                  backgroundColor: 'rgba(255, 82, 82, 0.05)',
                },
              }}
            >
              Delete Product
            </Button>
          </Box>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            borderRadius: 2,
            border: '1px solid rgba(100, 255, 218, 0.1)',
          }}
        >
          {priceUpdatedToday && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              This product's price has already been updated today. Price can
              only be updated twice per day.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Product Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  required
                  sx={{
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
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  value={formData.category}
                  disabled // Category cannot be changed after creation
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(100, 255, 218, 0.3)',
                      },
                    },
                  }}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Barcode"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleInputChange}
                  error={!!errors.barcode}
                  helperText={errors.barcode}
                  required
                  sx={{
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
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Value (VND)"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  error={!!errors.value}
                  helperText={errors.value}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₫</InputAdornment>
                    ),
                  }}
                  sx={{
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
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 4 }}>
                <Box sx={{ position: 'relative' }}>
                  <TextField
                    fullWidth
                    label="Price (VND)"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    error={!!errors.price}
                    helperText={errors.price || priceStatus.message}
                    required
                    disabled={priceUpdatedToday}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₫</InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setOpenPriceHistoryDialog(true)}
                            size="small"
                            sx={{ color: 'primary.light' }}
                          >
                            <HistoryIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: priceStatus.isValid
                            ? 'rgba(100, 255, 218, 0.3)'
                            : 'rgba(255, 82, 82, 0.5)',
                        },
                        '&:hover fieldset': {
                          borderColor: priceStatus.isValid
                            ? 'rgba(100, 255, 218, 0.5)'
                            : 'rgba(255, 82, 82, 0.7)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: priceStatus.isValid
                            ? 'rgba(100, 255, 218, 0.7)'
                            : 'rgba(255, 82, 82, 0.9)',
                        },
                      },
                    }}
                  />
                </Box>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Discount (%)"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  InputProps={{
                    inputProps: { min: 0, max: 100 },
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  sx={{
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
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  error={!!errors.quantity}
                  helperText={errors.quantity}
                  required
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                  sx={{
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
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                  error={!!errors.weight}
                  helperText={errors.weight}
                  required
                  InputProps={{
                    inputProps: { min: 0, step: 0.01 },
                  }}
                  sx={{
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
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  required
                  multiline
                  rows={3}
                  sx={{
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
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Product Dimensions
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Width (cm)"
                  name="dimensions.width"
                  type="number"
                  value={formData.dimensions.width}
                  onChange={handleInputChange}
                  error={!!errors['dimensions.width']}
                  helperText={errors['dimensions.width']}
                  required
                  InputProps={{
                    inputProps: { min: 0, step: 0.1 },
                  }}
                  sx={{
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
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  name="dimensions.height"
                  type="number"
                  value={formData.dimensions.height}
                  onChange={handleInputChange}
                  error={!!errors['dimensions.height']}
                  helperText={errors['dimensions.height']}
                  required
                  InputProps={{
                    inputProps: { min: 0, step: 0.1 },
                  }}
                  sx={{
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
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Depth (cm)"
                  name="dimensions.depth"
                  type="number"
                  value={formData.dimensions.depth}
                  onChange={handleInputChange}
                  error={!!errors['dimensions.depth']}
                  helperText={errors['dimensions.depth']}
                  required
                  InputProps={{
                    inputProps: { min: 0, step: 0.1 },
                  }}
                  sx={{
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
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <Divider
                  sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                />
                <Typography variant="h6" gutterBottom color="primary.light">
                  Category-specific Information
                </Typography>
              </Grid2>

              {/* Book-specific fields */}
              {formData.category === ProductCategory.BOOK && (
                <>
                  <Grid2 size={{ xs: 12 }}>
                    <FormControl component="fieldset" error={!!errors.authors}>
                      <FormLabel component="legend">Authors</FormLabel>
                      {formData.authors.map((author: string, index: number) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            mb: 2,
                            alignItems: 'flex-start',
                          }}
                        >
                          <TextField
                            fullWidth
                            label={`Author ${index + 1}`}
                            value={author}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                index,
                                'authors',
                                e.target.value
                              )
                            }
                            sx={{
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
                          {index > 0 && (
                            <IconButton
                              color="error"
                              onClick={() => removeArrayField('authors', index)}
                              sx={{ ml: 1 }}
                            >
                              <ClearIcon />
                            </IconButton>
                          )}
                          {index === formData.authors.length - 1 && (
                            <IconButton
                              color="primary"
                              onClick={() => addArrayField('authors')}
                              sx={{ ml: 1 }}
                            >
                              <AddIcon />
                            </IconButton>
                          )}
                        </Box>
                      ))}
                      {errors.authors && (
                        <FormHelperText error>{errors.authors}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Cover Type</FormLabel>
                      <RadioGroup
                        name="coverType"
                        value={formData.coverType}
                        onChange={handleInputChange}
                        row
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

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Publisher"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleInputChange}
                      error={!!errors.publisher}
                      helperText={errors.publisher}
                      required
                      sx={{
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
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Publication Date"
                      name="publicationDate"
                      type="date"
                      value={formData.publicationDate}
                      onChange={handleInputChange}
                      error={!!errors.publicationDate}
                      helperText={errors.publicationDate}
                      required
                      InputLabelProps={{ shrink: true }}
                      sx={{
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
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Number of Pages"
                      name="pages"
                      type="number"
                      value={formData.pages}
                      onChange={handleInputChange}
                      InputProps={{
                        inputProps: { min: 1 },
                      }}
                      sx={{
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
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      sx={{
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
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleInputChange}
                      sx={{
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
                  </Grid2>
                </>
              )}

              {/* CD/LP-specific fields */}
              {(formData.category === ProductCategory.CD ||
                formData.category === ProductCategory.LP) && (
                <>
                  <Grid2 size={{ xs: 12 }}>
                    <FormControl component="fieldset" error={!!errors.artists}>
                      <FormLabel component="legend">Artists</FormLabel>
                      {formData.artists.map((artist: string, index: number) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            mb: 2,
                            alignItems: 'flex-start',
                          }}
                        >
                          <TextField
                            fullWidth
                            label={`Artist ${index + 1}`}
                            value={artist}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                index,
                                'artists',
                                e.target.value
                              )
                            }
                            sx={{
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
                          {index > 0 && (
                            <IconButton
                              color="error"
                              onClick={() => removeArrayField('artists', index)}
                              sx={{ ml: 1 }}
                            >
                              <ClearIcon />
                            </IconButton>
                          )}
                          {index === formData.artists.length - 1 && (
                            <IconButton
                              color="primary"
                              onClick={() => addArrayField('artists')}
                              sx={{ ml: 1 }}
                            >
                              <AddIcon />
                            </IconButton>
                          )}
                        </Box>
                      ))}
                      {errors.artists && (
                        <FormHelperText error>{errors.artists}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Record Label"
                      name="recordLabel"
                      value={formData.recordLabel}
                      onChange={handleInputChange}
                      error={!!errors.recordLabel}
                      helperText={errors.recordLabel}
                      required
                      sx={{
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
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleInputChange}
                      sx={{
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
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Release Date"
                      name="releaseDate"
                      type="date"
                      value={formData.releaseDate}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      sx={{
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
                  </Grid2>

                  <Grid2 size={{ xs: 12 }}>
                    <FormControl
                      component="fieldset"
                      error={!!errors.tracklist}
                    >
                      <FormLabel component="legend">Tracklist</FormLabel>
                      {formData.tracklist.map(
                        (track: string, index: number) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              mb: 2,
                              alignItems: 'flex-start',
                            }}
                          >
                            <TextField
                              fullWidth
                              label={`Track ${index + 1}`}
                              value={track}
                              onChange={(e) =>
                                handleArrayFieldChange(
                                  index,
                                  'tracklist',
                                  e.target.value
                                )
                              }
                              sx={{
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
                            {index > 0 && (
                              <IconButton
                                color="error"
                                onClick={() =>
                                  removeArrayField('tracklist', index)
                                }
                                sx={{ ml: 1 }}
                              >
                                <ClearIcon />
                              </IconButton>
                            )}
                            {index === formData.tracklist.length - 1 && (
                              <IconButton
                                color="primary"
                                onClick={() => addArrayField('tracklist')}
                                sx={{ ml: 1 }}
                              >
                                <AddIcon />
                              </IconButton>
                            )}
                          </Box>
                        )
                      )}
                      {errors.tracklist && (
                        <FormHelperText error>
                          {errors.tracklist}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid2>
                </>
              )}

              {/* DVD-specific fields */}
              {formData.category === ProductCategory.DVD && (
                <>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Disc Type</FormLabel>
                      <RadioGroup
                        name="discType"
                        value={formData.discType}
                        onChange={handleInputChange}
                        row
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

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Director"
                      name="director"
                      value={formData.director}
                      onChange={handleInputChange}
                      error={!!errors.director}
                      helperText={errors.director}
                      required
                      sx={{
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
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Runtime (minutes)"
                      name="runtime"
                      type="number"
                      value={formData.runtime}
                      onChange={handleInputChange}
                      error={!!errors.runtime}
                      helperText={errors.runtime}
                      required
                      InputProps={{
                        inputProps: { min: 1 },
                      }}
                      sx={{
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
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Studio"
                      name="studio"
                      value={formData.studio}
                      onChange={handleInputChange}
                      error={!!errors.studio}
                      helperText={errors.studio}
                      required
                      sx={{
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
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleInputChange}
                      sx={{
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
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Release Date"
                      name="releaseDate"
                      type="date"
                      value={formData.releaseDate}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      sx={{
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
                  </Grid2>

                  <Grid2 size={{ xs: 12 }}>
                    <FormControl
                      component="fieldset"
                      error={!!errors.language_array}
                    >
                      <FormLabel component="legend">Languages</FormLabel>
                      {formData.language_array.map(
                        (lang: string, index: number) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              mb: 2,
                              alignItems: 'flex-start',
                            }}
                          >
                            <TextField
                              fullWidth
                              label={`Language ${index + 1}`}
                              value={lang}
                              onChange={(e) =>
                                handleArrayFieldChange(
                                  index,
                                  'language_array',
                                  e.target.value
                                )
                              }
                              sx={{
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
                            {index > 0 && (
                              <IconButton
                                color="error"
                                onClick={() =>
                                  removeArrayField('language_array', index)
                                }
                                sx={{ ml: 1 }}
                              >
                                <ClearIcon />
                              </IconButton>
                            )}
                            {index === formData.language_array.length - 1 && (
                              <IconButton
                                color="primary"
                                onClick={() => addArrayField('language_array')}
                                sx={{ ml: 1 }}
                              >
                                <AddIcon />
                              </IconButton>
                            )}
                          </Box>
                        )
                      )}
                      {errors.language_array && (
                        <FormHelperText error>
                          {errors.language_array}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid2>

                  <Grid2 size={{ xs: 12 }}>
                    <FormControl
                      component="fieldset"
                      error={!!errors.subtitles}
                    >
                      <FormLabel component="legend">Subtitles</FormLabel>
                      {formData.subtitles.map(
                        (subtitle: string, index: number) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              mb: 2,
                              alignItems: 'flex-start',
                            }}
                          >
                            <TextField
                              fullWidth
                              label={`Subtitle ${index + 1}`}
                              value={subtitle}
                              onChange={(e) =>
                                handleArrayFieldChange(
                                  index,
                                  'subtitles',
                                  e.target.value
                                )
                              }
                              sx={{
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
                            {index > 0 && (
                              <IconButton
                                color="error"
                                onClick={() =>
                                  removeArrayField('subtitles', index)
                                }
                                sx={{ ml: 1 }}
                              >
                                <ClearIcon />
                              </IconButton>
                            )}
                            {index === formData.subtitles.length - 1 && (
                              <IconButton
                                color="primary"
                                onClick={() => addArrayField('subtitles')}
                                sx={{ ml: 1 }}
                              >
                                <AddIcon />
                              </IconButton>
                            )}
                          </Box>
                        )
                      )}
                      {errors.subtitles && (
                        <FormHelperText error>
                          {errors.subtitles}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid2>
                </>
              )}

              <Grid2 size={{ xs: 12 }}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/product-management/products')}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      borderColor: 'rgba(100, 255, 218, 0.3)',
                      '&:hover': {
                        borderColor: 'rgba(100, 255, 218, 0.5)',
                        backgroundColor: 'rgba(100, 255, 218, 0.05)',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Grid2>
            </Grid2>
          </Box>
        </Paper>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            border: '1px solid rgba(255, 82, 82, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ color: 'error.main' }}>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.primary' }}>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            color="primary"
            variant="outlined"
            sx={{
              borderColor: 'rgba(100, 255, 218, 0.3)',
              '&:hover': {
                borderColor: 'rgba(100, 255, 218, 0.5)',
                backgroundColor: 'rgba(100, 255, 218, 0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            sx={{
              ml: 1,
              bgcolor: 'rgba(255, 82, 82, 0.8)',
              '&:hover': { bgcolor: 'error.main' },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Price History Dialog */}
      <Dialog
        open={openPriceHistoryDialog}
        onClose={() => setOpenPriceHistoryDialog(false)}
        PaperProps={{
          sx: {
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            border: '1px solid rgba(100, 255, 218, 0.2)',
          },
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'primary.light' }}>Price History</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            The price of this product has been updated as follows:
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Current Price
            </Typography>
            <Typography variant="h6" color="primary.light">
              {formData.price && formatCurrency(parseInt(formData.price))}
            </Typography>
          </Box>
          <Divider sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }} />
          {/* Mock price history entries */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              April 8, 2025 (Today)
            </Typography>
            <Typography variant="body1">
              {formData.price && formatCurrency(parseInt(formData.price))}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              April 1, 2025
            </Typography>
            <Typography variant="body1">
              {formData.price &&
                formatCurrency(parseInt(formData.price) - 15000)}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              March 15, 2025
            </Typography>
            <Typography variant="body1">
              {formData.price &&
                formatCurrency(parseInt(formData.price) - 30000)}
            </Typography>
          </Box>
          <Alert severity="info" sx={{ mt: 3 }}>
            Remember: Product prices can only be updated twice per day according
            to AIMS policy.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenPriceHistoryDialog(false)}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProductPage;
