import React, { useState, useContext } from 'react';
import { Container, Typography, Box, Paper, Divider, Button, Slider, FormControlLabel, Switch, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BackupIcon from '@mui/icons-material/Backup';
import RestoreIcon from '@mui/icons-material/Restore';
import { UserContext } from '../context/UserContext';

const Settings = () => {
  const { burnoutLevel, updateBurnoutLevel } = useContext(UserContext);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [exportData, setExportData] = useState('');
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleBurnoutChange = (e, value) => {
    updateBurnoutLevel(value - burnoutLevel); // Pass the difference
  };

  const handleResetDialogOpen = () => {
    setOpenResetDialog(true);
  };

  const handleResetDialogClose = () => {
    setOpenResetDialog(false);
  };

  const handleConfirmReset = () => {
    // Clear all local storage data
    localStorage.removeItem('datingInsights_dates');
    localStorage.removeItem('datingInsights_assessments');
    localStorage.removeItem('datingInsights_goals');
    localStorage.removeItem('datingInsights_burnoutLevel');
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'All data has been reset. Refresh the page to see changes.',
      severity: 'success'
    });
    
    setOpenResetDialog(false);
  };

  const handleExportDialogOpen = () => {
    // Gather all data from localStorage
    const exportObject = {
      dates: JSON.parse(localStorage.getItem('datingInsights_dates') || '[]'),
      assessments: JSON.parse(localStorage.getItem('datingInsights_assessments') || '[]'),
      goals: JSON.parse(localStorage.getItem('datingInsights_goals') || '[]'),
      burnoutLevel: parseInt(localStorage.getItem('datingInsights_burnoutLevel') || '0')
    };
    
    setExportData(JSON.stringify(exportObject, null, 2));
    setOpenExportDialog(true);
  };

  const handleExportDialogClose = () => {
    setOpenExportDialog(false);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportData);
    setSnackbar({
      open: true,
      message: 'Data copied to clipboard',
      severity: 'success'
    });
  };

  const handleImportDialogOpen = () => {
    setImportData('');
    setImportError('');
    setOpenImportDialog(true);
  };

  const handleImportDialogClose = () => {
    setOpenImportDialog(false);
  };

  const handleImportDataChange = (e) => {
    setImportData(e.target.value);
    setImportError('');
  };

  const handleImportData = () => {
    try {
      const data = JSON.parse(importData);
      
      // Validate data structure
      if (!data.dates || !Array.isArray(data.dates)) throw new Error('Invalid dates format');
      if (!data.assessments || !Array.isArray(data.assessments)) throw new Error('Invalid assessments format');
      if (!data.goals || !Array.isArray(data.goals)) throw new Error('Invalid goals format');
      if (typeof data.burnoutLevel !== 'number') throw new Error('Invalid burnout level format');
      
      // Import data to localStorage
      localStorage.setItem('datingInsights_dates', JSON.stringify(data.dates));
      localStorage.setItem('datingInsights_assessments', JSON.stringify(data.assessments));
      localStorage.setItem('datingInsights_goals', JSON.stringify(data.goals));
      localStorage.setItem('datingInsights_burnoutLevel', data.burnoutLevel.toString());
      
      setSnackbar({
        open: true,
        message: 'Data imported successfully. Refresh the page to see changes.',
        severity: 'success'
      });
      
      setOpenImportDialog(false);
    } catch (error) {
      setImportError('Invalid data format: ' + error.message);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Dating Burnout Level</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Adjust your current burnout level. This affects recommendations and the Option D feature.
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ width: '100%', px: 2 }}>
              <Typography gutterBottom>Current Level: {burnoutLevel}/10</Typography>
              <Slider
                value={burnoutLevel}
                onChange={handleBurnoutChange}
                step={1}
                marks
                min={0}
                max={10}
                valueLabelDisplay="auto"
                sx={{ mb: 2 }}
                color={burnoutLevel > 7 ? 'error' : burnoutLevel > 4 ? 'warning' : 'primary'}
              />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">No Burnout</Typography>
                <Typography variant="body2" color="text.secondary">Severe Burnout</Typography>
              </Box>
            </Box>
            
            <Box mt={2}>
              <Alert severity={burnoutLevel > 7 ? 'error' : burnoutLevel > 4 ? 'warning' : 'info'} sx={{ mt: 2 }}>
                {burnoutLevel > 7 ? (
                  'You have severe dating burnout. Consider taking a break from dating.'  
                ) : burnoutLevel > 4 ? (
                  'You have moderate dating burnout. Be selective about dates to avoid increasing burnout.'  
                ) : (
                  'Your burnout level is low. Keep a healthy balance in your dating life.'  
                )}
              </Alert>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Privacy Settings</Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box>
              <FormControlLabel
                control={<Switch checked={true} disabled />}
                label="Store all data locally only"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0, ml: 4 }}>
                Your dating data never leaves your device. This option cannot be changed to ensure maximum privacy.
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Data Management</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Export your data for backup or import from a previous backup.
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="outlined"
                startIcon={<BackupIcon />}
                onClick={handleExportDialogOpen}
              >
                Export Data
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<RestoreIcon />}
                onClick={handleImportDialogOpen}
              >
                Import Data
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleResetDialogOpen}
              >
                Reset All Data
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Reset Confirmation Dialog */}
      <Dialog open={openResetDialog} onClose={handleResetDialogClose}>
        <DialogTitle>Confirm Reset</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to reset all data? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetDialogClose}>Cancel</Button>
          <Button onClick={handleConfirmReset} color="error">Reset</Button>
        </DialogActions>
      </Dialog>
      
      {/* Export Dialog */}
      <Dialog open={openExportDialog} onClose={handleExportDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Export Data</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Copy this data and save it somewhere secure. You can use it to restore your data later.
          </Typography>
          <TextField
            multiline
            rows={10}
            value={exportData}
            fullWidth
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExportDialogClose}>Close</Button>
          <Button onClick={handleCopyToClipboard} color="primary">Copy to Clipboard</Button>
        </DialogActions>
      </Dialog>
      
      {/* Import Dialog */}
      <Dialog open={openImportDialog} onClose={handleImportDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Import Data</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Paste your previously exported data below. Warning: this will overwrite your current data.
          </Typography>
          <TextField
            multiline
            rows={10}
            value={importData}
            onChange={handleImportDataChange}
            fullWidth
            variant="outlined"
            error={!!importError}
            helperText={importError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImportDialogClose}>Cancel</Button>
          <Button onClick={handleImportData} color="primary" disabled={!importData}>Import</Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;