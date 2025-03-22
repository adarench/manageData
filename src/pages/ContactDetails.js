import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Button,
  TextField,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Card,
  CardContent,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Link,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import { getContactById, updateContact, deleteContact } from '../services/api';
import { format } from 'date-fns';

const ContactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editedContact, setEditedContact] = useState({
    name: '',
    phoneNumber: '',
    status: '',
    notes: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchContact();
  }, [id]);

  const fetchContact = async () => {
    setLoading(true);
    try {
      const data = await getContactById(id);
      setContact(data);
      setEditedContact({
        name: data.name,
        phoneNumber: data.phoneNumber || '',
        status: data.status,
        notes: data.notes || '',
        tags: data.tags || []
      });
    } catch (err) {
      setError('Failed to load contact details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    // Reset to original values
    if (contact) {
      setEditedContact({
        name: contact.name,
        phoneNumber: contact.phoneNumber || '',
        status: contact.status,
        notes: contact.notes || '',
        tags: contact.tags || []
      });
    }
    setTagInput('');
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleContactInputChange = (e) => {
    setEditedContact({
      ...editedContact,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !editedContact.tags.includes(tagInput.trim())) {
      setEditedContact({
        ...editedContact,
        tags: [...editedContact.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setEditedContact({
      ...editedContact,
      tags: editedContact.tags.filter(tag => tag !== tagToDelete)
    });
  };

  const handleUpdateContact = async () => {
    try {
      const updatedContact = await updateContact(id, editedContact);
      setContact(updatedContact);
      setOpenEditDialog(false);
    } catch (err) {
      setError('Failed to update contact');
      console.error(err);
    }
  };

  const handleDeleteContactConfirm = async () => {
    try {
      await deleteContact(id);
      navigate('/contacts');
    } catch (err) {
      setError('Failed to delete contact. Make sure there are no dates associated with this contact.');
      console.error(err);
      setOpenDeleteDialog(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'interested':
        return 'success';
      case 'ghosted':
        return 'error';
      case 'repeat':
        return 'primary';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to="/contacts"
          sx={{ mt: 2 }}
        >
          Back to Contacts
        </Button>
      </Container>
    );
  }

  if (!contact) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">Contact not found</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to="/contacts"
          sx={{ mt: 2 }}
        >
          Back to Contacts
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        component={RouterLink}
        to="/contacts"
        sx={{ mb: 3 }}
      >
        Back to Contacts
      </Button>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box display="flex" alignItems="center">
            <Avatar 
              alt={contact.name} 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=random&color=fff&size=128`} 
              sx={{ width: 80, height: 80, mr: 3 }}
            />
            <Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="h4" component="h1">
                  {contact.name}
                </Typography>
                <Chip
                  label={contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                  color={getStatusColor(contact.status)}
                  sx={{ ml: 2 }}
                />
              </Box>
              
              {contact.phoneNumber && (
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {contact.phoneNumber}
                </Typography>
              )}
              
              <Box sx={{ mt: 1 }}>
                {contact.tags && contact.tags.map((tag, i) => (
                  <Chip
                    key={i}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
          
          <Box>
            <IconButton 
              color="primary" 
              aria-label="edit contact"
              onClick={handleOpenEditDialog}
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              color="error" 
              aria-label="delete contact"
              onClick={handleOpenDeleteDialog}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        
        {contact.notes && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Notes
            </Typography>
            <Typography variant="body1" paragraph>
              {contact.notes}
            </Typography>
          </Box>
        )}
        
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Stats
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Average Rating
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Typography variant="h5" component="div" sx={{ mr: 1 }}>
                      {contact.avgRating ? contact.avgRating.toFixed(1) : 'N/A'}
                    </Typography>
                    {contact.avgRating > 0 && (
                      <Rating 
                        value={contact.avgRating / 2} 
                        precision={0.5} 
                        readOnly 
                        size="small" 
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Dates
                  </Typography>
                  <Typography variant="h5" component="div">
                    {contact.dates ? contact.dates.length : 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Last Date
                  </Typography>
                  <Typography variant="h5" component="div">
                    {contact.dates && contact.dates.length > 0
                      ? format(new Date(contact.dates[0].dateTime), 'MMM d, yyyy')
                      : 'None'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Date History
        </Typography>
        <Button
          variant="contained"
          startIcon={<EventIcon />}
          component={RouterLink}
          to="/log"
          state={{ contactId: contact.id, contactName: contact.name }}
        >
          Log New Date
        </Button>
      </Box>

      <Paper>
        {contact.dates && contact.dates.length > 0 ? (
          <List>
            {contact.dates.map((date, index) => (
              <React.Fragment key={date.id}>
                <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle1">
                          {format(new Date(date.dateTime), 'MMMM d, yyyy - h:mm a')}
                        </Typography>
                        <Chip 
                          label={date.status} 
                          color={date.status === 'completed' ? 'success' : 'primary'} 
                          size="small" 
                        />
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Box display="flex" alignItems="center" mt={1}>
                          <Typography component="span" variant="body2" color="text.primary" sx={{ mr: 1 }}>
                            Rating:
                          </Typography>
                          {date.rating ? (
                            <Rating value={date.rating} readOnly size="small" max={5} />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Not rated
                            </Typography>
                          )}
                        </Box>
                        {date.location && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Location: {date.location}
                          </Typography>
                        )}
                        {date.notes && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {date.notes.length > 100 ? `${date.notes.substring(0, 100)}...` : date.notes}
                          </Typography>
                        )}
                        <Box sx={{ mt: 1 }}>
                          <Link 
                            component={RouterLink} 
                            to={`/log/${date.id}`}
                            underline="hover"
                          >
                            View Details
                          </Link>
                        </Box>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < contact.dates.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box textAlign="center" p={4}>
            <Typography variant="body1" color="textSecondary">
              No dates logged with this contact yet.
            </Typography>
            <Button
              variant="contained"
              startIcon={<EventIcon />}
              component={RouterLink}
              to="/log"
              state={{ contactId: contact.id, contactName: contact.name }}
              sx={{ mt: 2 }}
            >
              Log First Date
            </Button>
          </Box>
        )}
      </Paper>

      {/* Edit Contact Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Contact</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              value={editedContact.name}
              onChange={handleContactInputChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              value={editedContact.phoneNumber}
              onChange={handleContactInputChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={editedContact.status}
                label="Status"
                onChange={handleContactInputChange}
              >
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="interested">Interested</MenuItem>
                <MenuItem value="ghosted">Ghosted</MenuItem>
                <MenuItem value="repeat">Repeat</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              fullWidth
              id="notes"
              label="Notes"
              name="notes"
              multiline
              rows={3}
              value={editedContact.notes}
              onChange={handleContactInputChange}
            />
            
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
              Tags
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  id="tagInput"
                  label="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />
              </Grid>
              <Grid item xs={3}>
                <Button 
                  variant="outlined" 
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  sx={{ height: '100%' }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {editedContact.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button 
            onClick={handleUpdateContact} 
            variant="contained"
            disabled={!editedContact.name.trim()}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Contact Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {contact.name}? This action cannot be undone.
          </Typography>
          {contact.dates && contact.dates.length > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This contact has {contact.dates.length} date(s) associated with it. You must delete all dates first.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button 
            onClick={handleDeleteContactConfirm} 
            color="error"
            disabled={contact.dates && contact.dates.length > 0}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ContactDetails;