// src/pages/productManager/AddProductPage.tsx
import React, { useState } from 'react';
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
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Clear as ClearIcon,
  Waves as WavesIcon,
  Book as BookIcon,
  Album as CDIcon,
  Radio as LPIcon,
  MovieCreation as DVDIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ProductCategory, CoverType, DiscType } from '../../types';
import { formatCurrency } from '../../utils/formatters';

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Common fields for all product types
    title: '',
    category: '',
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

    // Book fields
    authors: [''],
    coverType: CoverType.PAPERBACK,
    publisher: '',
    publicationDate: '',
    pages: '',
    language: '',
    genre: '',

    // CD/LP fields
    artists: [''],
    recordLabel: '',
    tracklist: [''],
    releaseDate: '',

    // DVD fields
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

  const steps = ['Basic Information', 'Category Details', 'Review & Save'];

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
        const percentage = (priceNum / valueNum) * 100;

        if (priceNum < valueNum * 0.3) {
          setPriceStatus({
            isValid: false,
            message: 'Price must be at least 30% of the product value',
            percent: percentage,
          });
        } else if (priceNum > valueNum * 1.5) {
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
      } else if (name === 'value' && formData.price) {
        // Update price validation when value changes
        const valueNum = parseFloat(numValue);
        const priceNum = parseFloat(formData.price);
        const percentage = (priceNum / valueNum) * 100;

        if (priceNum < valueNum * 0.3) {
          setPriceStatus({
            isValid: false,
            message: 'Price must be at least 30% of the product value',
            percent: percentage,
          });
        } else if (priceNum > valueNum * 1.5) {
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
      }
    } else if (name.includes('.')) {
      // Handle nested objects like dimensions.width
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, any>),
          [child]: value,
        },
      }));
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
    setFormData((prev) => {
      const prevArray = prev[field as keyof typeof prev] as string[];
      const newArray = [...prevArray];
      newArray[index] = value;

      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const addArrayField = (field: string) => {
    setFormData((prev) => {
      const prevArray = prev[field as keyof typeof prev] as string[];
      return {
        ...prev,
        [field]: [...prevArray, ''],
      };
    });
  };

  const removeArrayField = (field: string, index: number) => {
    setFormData((prev) => {
      const prevArray = prev[field as keyof typeof prev] as string[];
      if (prevArray.length <= 1) return prev; // Keep at least one field

      const newArray = [...prevArray];
      newArray.splice(index, 1);

      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};

    if (activeStep === 0) {
      // Validate basic information
      if (!formData.title.trim()) {
        newErrors.title = 'Title is required';
      }

      if (!formData.category) {
        newErrors.category = 'Category is required';
      }

      if (!formData.value) {
        newErrors.value = 'Value is required';
      }

      if (!formData.price) {
        newErrors.price = 'Price is required';
      } else if (!priceStatus.isValid) {
        newErrors.price = priceStatus.message || 'Invalid price';
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
    } else if (activeStep === 1) {
      // Validate category details based on selected category
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      try {
        // In a real app, this would call an API to save the product
        console.log('Saving product:', formData);

        // Show success alert
        alert('Product saved successfully!');

        // Navigate back to product list
        navigate('/product-management/products');
      } catch (error) {
        console.error('Error saving product:', error);
      }
    }
  };

  const renderBasicInformationStep = () => (
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
          select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          error={!!errors.category}
          helperText={errors.category}
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
        >
          {Object.values(ProductCategory).map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>
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
            startAdornment: <InputAdornment position="start">₫</InputAdornment>,
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
          label="Price (VND)"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          error={!!errors.price}
          helperText={errors.price || priceStatus.message}
          required
          InputProps={{
            startAdornment: <InputAdornment position="start">₫</InputAdornment>,
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
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 4 }}>
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

      <Grid2 size={{ xs: 12, sm: 4 }}>
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
    </Grid2>
  );

  const renderBookFields = () => (
    <Grid2 container spacing={3}>
      <Grid2 size={{ xs: 12 }}>
        <Typography variant="subtitle1" gutterBottom>
          Book-specific Information
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12 }}>
        <FormControl component="fieldset" error={!!errors.authors}>
          <FormLabel component="legend">Authors</FormLabel>
          {formData.authors.map((author, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}
            >
              <TextField
                fullWidth
                label={`Author ${index + 1}`}
                value={author}
                onChange={(e) =>
                  handleArrayFieldChange(index, 'authors', e.target.value)
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
    </Grid2>
  );

  const renderCDLPFields = () => (
    <Grid2 container spacing={3}>
      <Grid2 size={{ xs: 12 }}>
        <Typography variant="subtitle1" gutterBottom>
          {formData.category === ProductCategory.CD
            ? 'CD-specific Information'
            : 'LP Record-specific Information'}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12 }}>
        <FormControl component="fieldset" error={!!errors.artists}>
          <FormLabel component="legend">Artists</FormLabel>
          {formData.artists.map((artist, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}
            >
              <TextField
                fullWidth
                label={`Artist ${index + 1}`}
                value={artist}
                onChange={(e) =>
                  handleArrayFieldChange(index, 'artists', e.target.value)
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
        <FormControl component="fieldset" error={!!errors.tracklist}>
          <FormLabel component="legend">Tracklist</FormLabel>
          {formData.tracklist.map((track, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}
            >
              <TextField
                fullWidth
                label={`Track ${index + 1}`}
                value={track}
                onChange={(e) =>
                  handleArrayFieldChange(index, 'tracklist', e.target.value)
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
                  onClick={() => removeArrayField('tracklist', index)}
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
          ))}
          {errors.tracklist && (
            <FormHelperText error>{errors.tracklist}</FormHelperText>
          )}
        </FormControl>
      </Grid2>
    </Grid2>
  );

  const renderDVDFields = () => (
    <Grid2 container spacing={3}>
      <Grid2 size={{ xs: 12 }}>
        <Typography variant="subtitle1" gutterBottom>
          DVD-specific Information
        </Typography>
      </Grid2>

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

      <Grid2 size={{ xs: 12 }}>
        <FormControl component="fieldset" error={!!errors.language_array}>
          <FormLabel component="legend">Languages</FormLabel>
          {formData.language_array.map((lang, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}
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
                  onClick={() => removeArrayField('language_array', index)}
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
          ))}
          {errors.language_array && (
            <FormHelperText error>{errors.language_array}</FormHelperText>
          )}
        </FormControl>
      </Grid2>

      <Grid2 size={{ xs: 12 }}>
        <FormControl component="fieldset" error={!!errors.subtitles}>
          <FormLabel component="legend">Subtitles</FormLabel>
          {formData.subtitles.map((subtitle, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}
            >
              <TextField
                fullWidth
                label={`Subtitle ${index + 1}`}
                value={subtitle}
                onChange={(e) =>
                  handleArrayFieldChange(index, 'subtitles', e.target.value)
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
                  onClick={() => removeArrayField('subtitles', index)}
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
          ))}
          {errors.subtitles && (
            <FormHelperText error>{errors.subtitles}</FormHelperText>
          )}
        </FormControl>
      </Grid2>
    </Grid2>
  );

  const renderCategoryDetailsStep = () => {
    if (!formData.category) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          Please select a product category in the previous step.
        </Alert>
      );
    }

    switch (formData.category) {
      case ProductCategory.BOOK:
        return renderBookFields();
      case ProductCategory.CD:
      case ProductCategory.LP:
        return renderCDLPFields();
      case ProductCategory.DVD:
        return renderDVDFields();
      default:
        return null;
    }
  };

  const renderReviewStep = () => {
    const getCategoryIcon = () => {
      switch (formData.category) {
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

    return (
      <Box>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please review the product information below before saving.
        </Alert>

        <Paper
          sx={{
            p: 3,
            mb: 3,
            backgroundImage:
              'linear-gradient(135deg, rgba(13, 37, 56, 0.7) 0%, rgba(1, 22, 39, 0.7) 100%)',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {getCategoryIcon()}
            <Typography variant="h5" sx={{ ml: 2, fontWeight: 'bold' }}>
              {formData.title}
            </Typography>
          </Box>

          <Chip label={formData.category} color="primary" sx={{ mb: 2 }} />

          <Divider sx={{ my: 2 }} />

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Value
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {formData.value && formatCurrency(parseInt(formData.value))}
              </Typography>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Price
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {formData.price && formatCurrency(parseInt(formData.price))}
                {formData.value && formData.price && (
                  <Typography
                    variant="caption"
                    color={priceStatus.isValid ? 'success.main' : 'error.main'}
                    sx={{ ml: 1 }}
                  >
                    (
                    {(
                      (parseInt(formData.price) / parseInt(formData.value)) *
                      100
                    ).toFixed(0)}
                    % of value)
                  </Typography>
                )}
              </Typography>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Barcode
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {formData.barcode}
              </Typography>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Quantity
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {formData.quantity} units
              </Typography>
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {formData.description}
              </Typography>
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Dimensions & Weight
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {formData.dimensions.width} × {formData.dimensions.height} ×{' '}
                {formData.dimensions.depth} cm, {formData.weight} kg
              </Typography>
            </Grid2>
          </Grid2>

          <Divider sx={{ my: 2 }} />

          {/* Category-specific details */}
          {formData.category === ProductCategory.BOOK && (
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12 }}>
                <Typography
                  variant="subtitle1"
                  color="primary.light"
                  gutterBottom
                >
                  Book Details
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Authors
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {formData.authors.filter(Boolean).join(', ')}
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Cover Type
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {formData.coverType === CoverType.PAPERBACK
                    ? 'Paperback'
                    : 'Hardcover'}
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Publisher
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {formData.publisher}
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Publication Date
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {formData.publicationDate &&
                    new Date(formData.publicationDate).toLocaleDateString()}
                </Typography>
              </Grid2>

              {formData.pages && (
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Pages
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {formData.pages}
                  </Typography>
                </Grid2>
              )}

              {formData.language && (
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Language
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {formData.language}
                  </Typography>
                </Grid2>
              )}

              {formData.genre && (
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Genre
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {formData.genre}
                  </Typography>
                </Grid2>
              )}
            </Grid2>
          )}

          {(formData.category === ProductCategory.CD ||
            formData.category === ProductCategory.LP) && (
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12 }}>
                <Typography
                  variant="subtitle1"
                  color="primary.light"
                  gutterBottom
                >
                  {formData.category === ProductCategory.CD
                    ? 'CD Details'
                    : 'LP Record Details'}
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Artists
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {formData.artists.filter(Boolean).join(', ')}
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Record Label
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {formData.recordLabel}
                </Typography>
              </Grid2>

              {formData.genre && (
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Genre
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {formData.genre}
                  </Typography>
                </Grid2>
              )}

              {formData.releaseDate && (
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Release Date
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {new Date(formData.releaseDate).toLocaleDateString()}
                  </Typography>
                </Grid2>
              )}

              <Grid2 size={{ xs: 12 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tracklist
                </Typography>
                <Box sx={{ ml: 2 }}>
                  {formData.tracklist.filter(Boolean).map((track, index) => (
                    <Typography key={index} variant="body1" sx={{ mb: 0.5 }}>
                      {index + 1}. {track}
                    </Typography>
                  ))}
                </Box>
              </Grid2>
            </Grid2>
          )}

          {formData.category === ProductCategory.DVD && (
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12 }}>
                <Typography
                  variant="subtitle1"
                  color="primary.light"
                  gutterBottom
                >
                  DVD Details
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Disc Type
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {formData.discType === DiscType.BLURAY ? 'Blu-ray' : 'HD-DVD'}
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Director
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {formData.director}
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Studio
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {formData.studio}
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Runtime
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {formData.runtime} minutes
                </Typography>
              </Grid2>

              {formData.genre && (
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Genre
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {formData.genre}
                  </Typography>
                </Grid2>
              )}

              {formData.releaseDate && (
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Release Date
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {new Date(formData.releaseDate).toLocaleDateString()}
                  </Typography>
                </Grid2>
              )}

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Languages
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {formData.language_array.filter(Boolean).join(', ')}
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Subtitles
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {formData.subtitles.filter(Boolean).join(', ')}
                </Typography>
              </Grid2>
            </Grid2>
          )}
        </Paper>
      </Box>
    );
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderBasicInformationStep();
      case 1:
        return renderCategoryDetailsStep();
      case 2:
        return renderReviewStep();
      default:
        return 'Unknown step';
    }
  };

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
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
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
            <WavesIcon /> Add New Product
          </Typography>
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
          <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box component="form" onSubmit={handleSubmit}>
            {getStepContent(activeStep)}

            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}
            >
              <Button
                color="primary"
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<ArrowBackIcon />}
                sx={{
                  borderColor: 'rgba(100, 255, 218, 0.3)',
                  '&:hover': {
                    borderColor: 'rgba(100, 255, 218, 0.5)',
                    backgroundColor: 'rgba(100, 255, 218, 0.05)',
                  },
                }}
              >
                Back
              </Button>
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    startIcon={<SaveIcon />}
                  >
                    Save Product
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddProductPage;
