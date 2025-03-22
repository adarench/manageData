import React, { useState, useContext } from 'react';
import { Container, Typography, Box, Button, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AssessmentForm from '../components/assessment/AssessmentForm';
import AssessmentResults from '../components/assessment/AssessmentResults';
import EmptyState from '../components/common/EmptyState';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { UserContext } from '../context/UserContext';

const Assessment = () => {
  const { assessments, addAssessment } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  
  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  
  const handleSubmit = (formData) => {
    addAssessment(formData);
    handleClose();
    // Switch to results tab and select the new assessment
    setSelectedTab(1);
    // The new assessment will be the latest one added
    setSelectedAssessment(0);
  };
  
  const handleViewResults = (index) => {
    setSelectedAssessment(index);
    setSelectedTab(1);
  };

  // Sort assessments by date (newest first)
  const sortedAssessments = [...assessments].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Compatibility Assessment
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={handleOpen}
        >
          New Assessment
        </Button>
      </Box>
      
      {sortedAssessments.length === 0 ? (
        <EmptyState
          title="No assessments yet"
          message="Evaluate your compatibility with current or potential partners to gain insights."
          actionText="Create First Assessment"
          actionLink={null}
          icon={<AssessmentIcon fontSize="inherit" />}
          onClick={handleOpen}
        />
      ) : (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={selectedTab} onChange={handleTabChange}>
              <Tab label="Assessment List" />
              <Tab label="Results" disabled={selectedAssessment === null} />
            </Tabs>
          </Box>
          
          {selectedTab === 0 ? (
            <Box>
              {sortedAssessments.map((assessment, index) => {
                const date = new Date(assessment.date);
                const sharedInterests = assessment.shared_interests.join(', ');
                const sharedValues = assessment.shared_values.join(', ');
                
                return (
                  <Box 
                    key={assessment.id} 
                    sx={{ 
                      p: 3, 
                      mb: 2, 
                      border: '1px solid', 
                      borderColor: 'divider',
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'background.paper', boxShadow: 1 }
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Assessment from {date.toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Shared Interests:</strong> {sharedInterests || 'None specified'}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          <strong>Shared Values:</strong> {sharedValues || 'None specified'}
                        </Typography>
                      </Box>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => handleViewResults(index)}
                      >
                        View Results
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box>
              {selectedAssessment !== null && sortedAssessments[selectedAssessment] && (
                <AssessmentResults assessment={sortedAssessments[selectedAssessment]} />
              )}
            </Box>
          )}
        </Box>
      )}
      
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          New Compatibility Assessment
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
          <AssessmentForm onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Assessment;