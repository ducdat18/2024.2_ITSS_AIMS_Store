import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Alert } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { UserAccount, UserRole } from '../../types';
import { mockAccountService } from '../../mock/mockDataAccount';
import LoadingIndicator from '../../components/admin/common/LoadingIndicator';
import PageHeader from '../../components/admin/common/PageHeader';
import PageLayout from '../../components/admin/dashboard/PageLayout';
import UserForm from '../../components/admin/user/UserForm';



// Form data interface
interface UserFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles: UserRole[];
  isBlocked: boolean;
}

// Form errors interface
interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  roles?: string;
  general?: string;
}

const UserFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Form state
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    roles: [],
    isBlocked: false,
  });

  // Other state
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(isEditMode);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch user data for edit mode
  useEffect(() => {
    const fetchUserData = async () => {
      if (isEditMode && id) {
        try {
          setLoading(true);
          const userData = await mockAccountService.getAccountById(id);

          if (!userData) {
            setErrorMessage('User not found');
            setLoading(false);
            return;
          }

          setFormData({
            username: userData.username,
            email: userData.email,
            password: '', // Don't show password in edit mode
            confirmPassword: '', // Don't show password in edit mode
            roles: userData.roles,
            isBlocked: userData.isBlocked,
          });

          setLoading(false);
        } catch (err) {
          console.error('Error fetching user data:', err);
          setErrorMessage('Failed to load user data. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [id, isEditMode]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when field is changed
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }

    setFormTouched(true);
  };

  // Handle role checkbox change
  const handleRoleChange = (role: UserRole) => {
    setFormData((prev) => {
      const newRoles = prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role];

      return {
        ...prev,
        roles: newRoles,
      };
    });

    // Clear roles error if present
    if (errors.roles) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.roles;
        return newErrors;
      });
    }

    setFormTouched(true);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Validate password (only required in create mode)
    if (!isEditMode) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      // Validate confirm password
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (formData.password || formData.confirmPassword) {
      // In edit mode, password is optional, but if provided, validate it
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    // Validate roles
    if (formData.roles.length === 0) {
      newErrors.roles = 'At least one role must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Create or update user
      if (isEditMode && id) {
        // Prepare update data (exclude confirmPassword)
        const updateData: Partial<UserAccount> = {
          username: formData.username,
          email: formData.email,
          roles: formData.roles,
          isBlocked: formData.isBlocked,
        };

        // Only include password if it was provided
        if (formData.password) {
          updateData.password = formData.password;
        }

        // Call the update API
        const updatedUser = await mockAccountService.updateAccount(
          id,
          updateData
        );

        if (updatedUser) {
          setSuccessMessage('User updated successfully');
          setTimeout(() => {
            navigate(`/admin/users/${id}`);
          }, 2000);
        } else {
          setErrorMessage('Failed to update user. User not found.');
        }
      } else {
        // Create new user
        // We need to provide userId for mock data
        const newUserId = `user-${Date.now().toString().substring(8, 13)}`;

        const newUser = await mockAccountService.createAccount({
          userId: newUserId,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          roles: formData.roles,
          isBlocked: formData.isBlocked,
          lastLogin: undefined,
        });

        setSuccessMessage('User created successfully');
        setTimeout(() => {
          navigate(`/admin/users/${newUser.id}`);
        }, 2000);
      }

      setSubmitLoading(false);
      setFormTouched(false);
    } catch (err) {
      console.error('Error saving user:', err);
      setErrorMessage('Error saving user. Please try again.');
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingIndicator
        message={isEditMode ? 'Loading user data...' : 'Preparing form...'}
      />
    );
  }

  return (
    <PageLayout>
      <Container maxWidth="md">
        {/* Page title */}
        <PageHeader
          title={isEditMode ? 'Edit User' : 'Add New User'}
          icon={<PersonIcon />}
          onBackClick={() => navigate(-1)}
        />

        {/* Success/error messages */}
        {successMessage && (
          <Alert
            severity="success"
            onClose={() => setSuccessMessage(null)}
            sx={{
              mb: 3,
              backgroundColor: 'rgba(0, 191, 165, 0.1)',
              border: '1px solid rgba(0, 191, 165, 0.3)',
            }}
          >
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert
            severity="error"
            onClose={() => setErrorMessage(null)}
            sx={{
              mb: 3,
              backgroundColor: 'rgba(255, 82, 82, 0.1)',
              border: '1px solid rgba(255, 82, 82, 0.3)',
            }}
          >
            {errorMessage}
          </Alert>
        )}

        {/* User form */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            border: '1px solid rgba(100, 255, 218, 0.1)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                'radial-gradient(circle at 30% 20%, rgba(2, 136, 209, 0.08) 0%, transparent 70%)',
              opacity: 0.6,
              zIndex: 1,
            },
          }}
        >
          <UserForm
            formData={formData}
            errors={errors}
            isEditMode={isEditMode}
            submitLoading={submitLoading}
            formTouched={formTouched}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onInputChange={handleInputChange}
            onRoleChange={handleRoleChange}
            onTogglePasswordVisibility={togglePasswordVisibility}
            onToggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
          />
        </Paper>
      </Container>
    </PageLayout>
  );
};

export default UserFormPage;
