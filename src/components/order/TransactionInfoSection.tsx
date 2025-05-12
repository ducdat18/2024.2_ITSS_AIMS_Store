import React from 'react';
import { Grid2, Typography } from '@mui/material';
import { Waves as WavesIcon } from '@mui/icons-material';
import SectionContainer from '../customer/common/SectionContainer';

export interface TransactionInfo {
  transactionId: string;
  transactionDate: string;
  content: string;
  paymentMethod: string;
}

interface TransactionInfoSectionProps {
  transactionInfo: TransactionInfo;
}

const TransactionInfoSection: React.FC<TransactionInfoSectionProps> = ({
  transactionInfo,
}) => {
  return (
    <SectionContainer
      title="Transaction Information"
      icon={<WavesIcon fontSize="small" />}
    >
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Transaction ID
          </Typography>
          <Typography variant="body1" gutterBottom color="text.primary">
            {transactionInfo.transactionId}
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Transaction Date
          </Typography>
          <Typography variant="body1" gutterBottom color="text.primary">
            {new Date(transactionInfo.transactionDate).toLocaleString()}
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Transaction Content
          </Typography>
          <Typography variant="body1" gutterBottom color="text.primary">
            {transactionInfo.content}
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Payment Method
          </Typography>
          <Typography variant="body1" gutterBottom color="text.primary">
            {transactionInfo.paymentMethod}
          </Typography>
        </Grid2>
      </Grid2>
    </SectionContainer>
  );
};

export default TransactionInfoSection;
