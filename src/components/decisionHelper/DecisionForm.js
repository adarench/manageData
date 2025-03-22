import React, { useState, useContext } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Slider,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Chip,
  Stack,
  Paper,
  Grid,
  Divider,
} from '@mui/material';
import { UserContext } from '../../context/UserContext';
import BrutalTruth from '../common/BrutalTruth';

const DecisionForm = ({ onSubmit }) => {
  const { burnoutLevel } = useContext(UserContext);
  
  const [formData, setFormData] = useState({
    name: '',
    dates: 1,
    redFlagCount: 0,
    greenFlagCount: 0,
    enjoymentLevel: 5,
    values: 5,
    interests: [],
    burnoutIndicators: 0,
    datePreferences: {
      activityLevel: 'medium',
      budget: 'medium',
      foodPreferences: [],
      interests: [],
    },
  });

  const [errors, setErrors] = useState({});
  const [showBurnoutWarning, setShowBurnoutWarning] = useState(false);

  const burnoutIndicators = [
    'Dreading dates rather than looking forward to them',
    'Feeling emotionally exhausted after socializing',
    'Going on dates just to not be alone',
    'Finding yourself telling the same stories repeatedly',
    'Confusing current dates with previous ones',
    'Feeling like dating is a chore or obligation',
    'Cancelling dates at the last minute out of fatigue',
    'Struggling to be present during dates',
  ];

  const interestOptions = [
    'Movies', 'Music', 'Reading', 'Art', 'Hiking',
    'Cooking', 'Travel', 'Sports', 'Gaming', 'Technology',
    'Fashion', 'Photography', 'Dancing', 'Theater', 'Podcasts',
  ];

  const foodOptions = [
    'Italian', 'Mexican', 'Chinese', 'Japanese', 'Thai',
    'Indian', 'Mediterranean', 'French', 'American', 'Vegetarian',
    'Vegan', 'Seafood', 'BBQ', 'Desserts', 'Coffee',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSliderChange = (name) => (e, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleInterestsChange = (event, values) => {
    setFormData({ ...formData, interests: values });
  };

  const handleBurnoutIndicatorsChange = (e) => {
    const { checked } = e.target;
    let newCount = formData.burnoutIndicators + (checked ? 1 : -1);
    setFormData({ ...formData, burnoutIndicators: newCount });
    
    // Show warning if multiple indicators are checked
    setShowBurnoutWarning(newCount >= 3 || burnoutLevel > 6);
  };

  const handleDatePreferenceChange = (field, value) => {
    setFormData({
      ...formData,
      datePreferences: {
        ...formData.datePreferences,
        [field]: value,
      },
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Decision Helper</Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Answer honestly to get a clear assessment of whether to pursue this relationship.
          </Typography>
        </Grid>

        {(burnoutLevel > 7 || showBurnoutWarning) && (
          <Grid item xs={12}>
            <BrutalTruth text="You're showing signs of dating burnout. Consider taking a break from dating to reset." />
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Their Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
            margin="normal"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Number of Dates So Far</Typography>
            <Slider
              value={formData.dates}
              onChange={handleSliderChange('dates')}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={10}
              sx={{ mt: 2 }}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Relationship Indicators</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom>Red Flags (Dealbreakers)</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1 }}>
                    How many genuine red flags have you noticed?
                  </Typography>
                  <Slider
                    value={formData.redFlagCount}
                    onChange={handleSliderChange('redFlagCount')}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={0}
                    max={10}
                    color="error"
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom>Green Flags (Positive Qualities)</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1 }}>
                    How many genuine positive qualities have you noticed?
                  </Typography>
                  <Slider
                    value={formData.greenFlagCount}
                    onChange={handleSliderChange('greenFlagCount')}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={0}
                    max={10}
                    color="success"
                  />
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, mb: 3 }}>
              <Typography gutterBottom>Overall Enjoyment Level</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1 }}>
                How much do you genuinely enjoy spending time with them?
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary">Not at all</Typography>
                <Slider
                  value={formData.enjoymentLevel}
                  onChange={handleSliderChange('enjoymentLevel')}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={10}
                />
                <Typography variant="body2" color="text.secondary">Immensely</Typography>
              </Stack>
            </Box>

            <Box sx={{ mt: 3, mb: 3 }}>
              <Typography gutterBottom>Shared Values</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1 }}>
                How well do your core values align?
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary">Completely misaligned</Typography>
                <Slider
                  value={formData.values}
                  onChange={handleSliderChange('values')}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={10}
                />
                <Typography variant="body2" color="text.secondary">Perfectly aligned</Typography>
              </Stack>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Shared Interests</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body2" color="text.secondary" paragraph>
              These will be used to generate conversation starters. Be honest about what you actually share.
            </Typography>
            
            <Autocomplete
              multiple
              id="interests"
              options={interestOptions}
              freeSolo
              value={formData.interests}
              onChange={handleInterestsChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Shared Interests"
                  placeholder="Add shared interests"
                  helperText="What do you both genuinely enjoy?"
                  fullWidth
                />
              )}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Date Preferences</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body2" color="text.secondary" paragraph>
              This information will be used to suggest personalized date ideas.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <FormLabel>Preferred Activity Level</FormLabel>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                    <Button 
                      variant={formData.datePreferences.activityLevel === 'low' ? "contained" : "outlined"}
                      onClick={() => handleDatePreferenceChange('activityLevel', 'low')}
                      fullWidth
                    >
                      Low Energy
                    </Button>
                    <Button 
                      variant={formData.datePreferences.activityLevel === 'medium' ? "contained" : "outlined"}
                      onClick={() => handleDatePreferenceChange('activityLevel', 'medium')}
                      fullWidth
                    >
                      Medium
                    </Button>
                    <Button 
                      variant={formData.datePreferences.activityLevel === 'high' ? "contained" : "outlined"}
                      onClick={() => handleDatePreferenceChange('activityLevel', 'high')}
                      fullWidth
                    >
                      High Energy
                    </Button>
                  </Stack>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <FormLabel>Budget Range</FormLabel>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                    <Button 
                      variant={formData.datePreferences.budget === 'low' ? "contained" : "outlined"}
                      onClick={() => handleDatePreferenceChange('budget', 'low')}
                      fullWidth
                    >
                      Budget-Friendly
                    </Button>
                    <Button 
                      variant={formData.datePreferences.budget === 'medium' ? "contained" : "outlined"}
                      onClick={() => handleDatePreferenceChange('budget', 'medium')}
                      fullWidth
                    >
                      Moderate
                    </Button>
                    <Button 
                      variant={formData.datePreferences.budget === 'high' ? "contained" : "outlined"}
                      onClick={() => handleDatePreferenceChange('budget', 'high')}
                      fullWidth
                    >
                      Splurge
                    </Button>
                  </Stack>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  id="foodPreferences"
                  options={foodOptions}
                  freeSolo
                  value={formData.datePreferences.foodPreferences}
                  onChange={(e, value) => handleDatePreferenceChange('foodPreferences', value)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Food Preferences"
                      placeholder="Add food preferences"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  id="dateInterests"
                  options={[
                    'Outdoors', 'Arts', 'Sports', 'Music', 'Learning',
                    'Food', 'Drinks', 'Shows', 'Active', 'Relaxed'
                  ]}
                  freeSolo
                  value={formData.datePreferences.interests}
                  onChange={(e, value) => handleDatePreferenceChange('interests', value)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Date Activity Interests"
                      placeholder="Add date interests"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Dating Burnout Assessment</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Check any statements that apply to your current dating experience.
            </Typography>
            
            <FormControl component="fieldset">
              <FormGroup>
                {burnoutIndicators.map((indicator, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox 
                        onChange={handleBurnoutIndicatorsChange} 
                        name={`burnout-${index}`} 
                      />
                    }
                    label={indicator}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Generate Insights
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DecisionForm;