import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const BrutalTruth = ({ text }) => {
  return (
    <Paper elevation={0} className="brutal-truth">
      <Box display="flex" alignItems="center" mb={1}>
        <WarningIcon sx={{ mr: 1 }} />
        <Typography variant="subtitle1" fontWeight="bold">
          Brutal Truth
        </Typography>
      </Box>
      <Typography variant="body1">{text}</Typography>
    </Paper>
  );
};

export default BrutalTruth;