import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import ForumIcon from '@mui/icons-material/Forum';
import EventIcon from '@mui/icons-material/Event';
import BrutalTruth from '../common/BrutalTruth';

const DecisionResults = ({ results }) => {
  const { decision, explanation, recommendation } = results.evaluationResult;
  const conversationStarters = results.conversationStarters;
  const dateIdeas = results.dateIdeas;

  const getDecisionColor = () => {
    switch (decision) {
      case 'Worth Pursuing':
        return 'success.main';
      case 'Proceed with Caution':
        return 'warning.main';
      case 'End It':
        return 'error.main';
      case 'Option D: Take a Break':
        return 'info.main';
      default:
        return 'text.primary';
    }
  };

  const getDecisionIcon = () => {
    switch (decision) {
      case 'Worth Pursuing':
        return <CheckCircleIcon color="success" fontSize="large" />;
      case 'Proceed with Caution':
        return <WarningIcon color="warning" fontSize="large" />;
      case 'End It':
        return <CancelIcon color="error" fontSize="large" />;
      case 'Option D: Take a Break':
        return <WarningIcon color="info" fontSize="large" />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, textAlign: 'center', position: 'relative' }}>
            <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
              {getDecisionIcon()}
              <Typography variant="h4" color={getDecisionColor()} sx={{ ml: 1 }}>
                {decision}
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              {explanation}
            </Typography>
            
            <BrutalTruth text={recommendation} />
          </Paper>
        </Grid>

        {decision !== 'Option D: Take a Break' && decision !== 'End It' && (
          <>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <ForumIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="h6">Conversation Starters</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  {conversationStarters.length > 0 ? (
                    <List>
                      {conversationStarters.map((starter, index) => (
                        <ListItem key={index} sx={{ pl: 0 }}>
                          <ListItemIcon sx={{ minWidth: '30px' }}>
                            <Typography variant="body2" color="primary" fontWeight="bold">
                              {index + 1}.
                            </Typography>
                          </ListItemIcon>
                          <ListItemText primary={starter} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Add shared interests to generate conversation starters.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <EventIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="h6">Date Ideas</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  {dateIdeas.length > 0 ? (
                    <List>
                      {dateIdeas.map((idea, index) => (
                        <ListItem key={index} sx={{ pl: 0 }}>
                          <ListItemIcon sx={{ minWidth: '30px' }}>
                            <Typography variant="body2" color="primary" fontWeight="bold">
                              {index + 1}.
                            </Typography>
                          </ListItemIcon>
                          <ListItemText primary={idea} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Provide more date preferences to generate personalized ideas.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {decision === 'Option D: Take a Break' && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Self-Care Recommendations</Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Delete dating apps for at least 30 days" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Reconnect with friends you haven't seen while busy dating" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Invest time in a hobby you've neglected" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Focus on physical self-care: sleep, exercise, nutrition" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Reflect on what you've learned from recent dating experiences" />
                  </ListItem>
                </List>
                
                <Box textAlign="center" mt={3}>
                  <Button variant="contained" color="primary">
                    Reset Burnout Tracker
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DecisionResults;