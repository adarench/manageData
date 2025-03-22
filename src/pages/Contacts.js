import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  TextField, 
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FilterListIcon from '@mui/icons-material/FilterList';
import { getContacts, createContact } from '../services/api';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phoneNumber: '',
    notes: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchContacts();
  }, [statusFilter]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (statusFilter) {
        filters.status = statusFilter;
      }
      
      const data = await getContacts(filters);
      setContacts(data);
    } catch (err) {
      setError('Failed to load contacts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewContact({
      name: '',
      phoneNumber: '',
      notes: '',
      tags: []
    });
    setTagInput('');
  };

  const handleContactInputChange = (e) => {
    setNewContact({
      ...newContact,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newContact.tags.includes(tagInput.trim())) {
      setNewContact({
        ...newContact,
        tags: [...newContact.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setNewContact({
      ...newContact,
      tags: newContact.tags.filter(tag => tag !== tagToDelete)
    });
  };

  const handleSubmitContact = async () => {
    try {
      await createContact(newContact);
      handleCloseDialog();
      fetchContacts();
    } catch (err) {
      setError('Failed to create contact');
      console.error(err);
    }
  };

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Contacts
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenDialog}
        >
          Add Contact
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search contacts..."
              value={search}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">
                <Box display="flex" alignItems="center">
                  <FilterListIcon sx={{ mr: 1 }} />
                  Filter by Status
                </Box>
              </InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Filter by Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="">All Contacts</MenuItem>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="interested">Interested</MenuItem>
                <MenuItem value="ghosted">Ghosted</MenuItem>
                <MenuItem value="repeat">Repeat</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 0 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : filteredContacts.length === 0 ? (
          <Box textAlign="center" p={4}>
            <Typography variant="body1" color="textSecondary">
              No contacts found. Add your first contact to get started.
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              sx={{ mt: 2 }}
              onClick={handleOpenDialog}
            >
              Add Contact
            </Button>
          </Box>
        ) : (
          <List>
            {filteredContacts.map((contact, index) => (
              <React.Fragment key={contact.id}>
                <ListItem
                  button
                  component={Link}
                  to={`/contacts/${contact.id}`}
                  alignItems="flex-start"
                  sx={{ py: 2 }}
                >
                  <ListItemAvatar>
                    <Avatar alt={contact.name} src={`https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=random&color=fff`} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <Typography variant="h6" component="span">
                          {contact.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                          color={getStatusColor(contact.status)}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {contact.phoneNumber && `${contact.phoneNumber} • `}
                          {contact.avgRating > 0 ? `Avg Rating: ${contact.avgRating.toFixed(1)}/5` : 'No ratings yet'}
                        </Typography>
                        <Box mt={1}>
                          {contact.tags.map((tag, i) => (
                            <Chip
                              key={i}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < filteredContacts.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* New Contact Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Contact</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              value={newContact.name}
              onChange={handleContactInputChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              value={newContact.phoneNumber}
              onChange={handleContactInputChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="notes"
              label="Notes"
              name="notes"
              multiline
              rows={3}
              value={newContact.notes}
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
              {newContact.tags.map((tag, index) => (
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
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitContact} 
            variant="contained"
            disabled={!newContact.name.trim()}
          >
            Add Contact
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Contacts;