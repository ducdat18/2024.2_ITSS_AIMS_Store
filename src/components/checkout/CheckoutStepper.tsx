import React from 'react';
import { Stepper, Step, StepLabel, styled } from '@mui/material';
import {
  LocalShipping as LocalShippingIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

// Custom styled component for the Stepper
const OceanStepper = styled(Stepper)(({ theme }) => ({
  '& .MuiStepLabel-root .Mui-active': {
    color: theme.palette.primary.light,
  },
  '& .MuiStepLabel-root .Mui-completed': {
    color: theme.palette.primary.light,
  },
  '& .MuiStepLabel-label': {
    color: theme.palette.text.secondary,
  },
  '& .MuiStepLabel-label.Mui-active': {
    color: theme.palette.primary.light,
    fontWeight: 'bold',
  },
  '& .MuiStepConnector-line': {
    borderColor: 'rgba(100, 255, 218, 0.2)',
  },
  '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
    borderColor: theme.palette.primary.light,
  },
  '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
    borderColor: theme.palette.primary.light,
  },
}));

interface CheckoutStepperProps {
  activeStep: number;
  steps?: { label: string; icon: React.ReactNode }[];
  mb?: number;
}

const defaultSteps = [
  { label: 'Delivery Information', icon: <LocalShippingIcon /> },
  { label: 'Review & Payment', icon: <PaymentIcon /> },
];

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({
  activeStep,
  steps = defaultSteps,
  mb = 5,
}) => {
  return (
    <OceanStepper activeStep={activeStep} sx={{ mb }} alternativeLabel>
      {steps.map((step, index) => (
        <Step key={step.label}>
          <StepLabel StepIconProps={{ icon: step.icon }}>
            {step.label}
          </StepLabel>
        </Step>
      ))}
    </OceanStepper>
  );
};

export default CheckoutStepper;
