import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const EmptyState = ({
  title = 'No data yet',
  message = 'Start by adding some data',
  actionLink = null,
  actionText = 'Get Started',
  icon = null,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={4}
      textAlign="center"
    >
      {icon && <Box mb={2} fontSize="4rem" color="text.secondary">{icon}</Box>}
      <Typography variant="h5" gutterBottom fontWeight="medium">
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {message}
      </Typography>
      {actionLink && (
        <Button
          component={Link}
          to={actionLink}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;