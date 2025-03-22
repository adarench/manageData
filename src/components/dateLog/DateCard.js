import React from 'react';
import { Card, CardContent, Typography, Chip, Box, Rating, Divider, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import { format } from 'date-fns';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const DateCard = ({ date, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleEdit = () => {
    handleMenuClose();
    onEdit(date);
  };
  
  const handleDelete = () => {
    handleMenuClose();
    onDelete(date.id);
  };

  const getRatingColor = (rating) => {
    if (rating <= 3) return 'error';
    if (rating <= 6) return 'warning';
    return 'success';
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" gutterBottom>
            {date.contactName || date.name}
          </Typography>
          <IconButton aria-label="more options" size="small" onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </Box>
        
        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            {format(new Date(date.dateTime || date.date), 'MMMM d, yyyy')}
          </Typography>
          <Chip 
            size="small" 
            label={date.type} 
            variant="outlined" 
            sx={{ mr: 1 }}
          />
          <Chip 
            size="small" 
            label={`Date #${date.dateNumber}`} 
            variant="outlined" 
          />
        </Box>
        
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Rating:
          </Typography>
          <Box display="flex" alignItems="center">
            <Chip 
              label={date.rating} 
              color={getRatingColor(date.rating)}
              size="small"
              sx={{ mr: 1 }}
            />
            <Rating 
              value={date.rating / 2} // Convert to 5-star scale
              precision={0.5} 
              readOnly 
            />
          </Box>
        </Box>
        
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Activities:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {date.activities.map((activity) => (
              <Chip 
                key={activity} 
                label={activity} 
                size="small"
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>
        
        {date.redFlags && date.redFlags.length > 0 && (
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Red Flags:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {date.redFlags.map((flag) => (
                <Chip 
                  key={flag} 
                  label={flag} 
                  size="small"
                  color="error"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Box>
        )}
        
        {date.notes && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Notes:
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {date.notes}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DateCard;