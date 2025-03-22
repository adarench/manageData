import React, { useState, useContext } from 'react';
import { Container, Typography, Box, Button, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DateForm from '../components/dateLog/DateForm';
import DateCard from '../components/dateLog/DateCard';
import EmptyState from '../components/common/EmptyState';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { UserContext } from '../context/UserContext';

const DateLog = () => {
  const { dates, addDate } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [editDate, setEditDate] = useState(null);
  
  const handleOpen = () => {
    setEditDate(null);
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    setEditDate(null);
  };
  
  const handleSubmit = (formData) => {
    addDate(formData);
    handleClose();
  };
  
  const handleEdit = (date) => {
    setEditDate(date);
    setOpen(true);
  };
  
  const handleDelete = (id) => {
    // Will be implemented within UserContext
    console.log('Delete date with ID:', id);
  };
  
  // Sort dates by date (newest first)
  const sortedDates = [...dates].sort((a, b) => new Date(b.dateTime || b.date) - new Date(a.dateTime || a.date));

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Date Log
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={handleOpen}
        >
          Log New Date
        </Button>
      </Box>
      
      {sortedDates.length === 0 ? (
        <EmptyState
          title="No dates logged yet"
          message="Start tracking your dating experiences to gain insights and recognize patterns."
          actionText="Log Your First Date"
          actionLink={null}
          icon={<FavoriteIcon fontSize="inherit" />}
          onClick={handleOpen}
        />
      ) : (
        <Box>
          {sortedDates.map(date => (
            <DateCard
              key={date.id}
              date={date}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </Box>
      )}
      
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editDate ? 'Edit Date' : 'Log New Date'}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DateForm onSubmit={handleSubmit} initialData={editDate} />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default DateLog;