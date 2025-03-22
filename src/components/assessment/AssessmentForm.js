import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Stack,
  Chip,
  Autocomplete,
} from '@mui/material';

const INTEREST_OPTIONS = [
  'Travel', 'Food', 'Movies', 'Music', 'Books', 'Art',
  'Sports', 'Fitness', 'Technology', 'Science', 'Politics',
  'Spirituality', 'Family', 'Pets', 'Outdoor Activities',
  'Board Games', 'Video Games', 'Social Causes', 'Career'
];

const VALUE_OPTIONS = [
  'Family', 'Career', 'Financial Security', 'Personal Growth',
  'Adventure', 'Honesty', 'Independence', 'Loyalty', 'Creativity',
  'Social Justice', 'Religion/Spirituality', 'Health', 'Friendship',
  'Work/Life Balance', 'Privacy', 'Recognition', 'Status', 'Comfort'
];

const COMMUNICATION_STYLES = [
  'Direct',
  'Analytical',
  'Intuitive',
  'Functional',
  'Personal',
  'Receptive',
  'Emotional',
  'Logical',
  'Avoidant'
];

const AssessmentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    shared_interests: [],
    shared_values: [],
    communication_compatibility: 5,
    emotional_compatibility: 5,
    lifestyle_compatibility: 5,
    conflict_resolution: 5,
    long_term_potential: 5,
    physical_attraction: 5,
    red_flags: [],
    communication_style: '',
    partner_communication_style: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSliderChange = (name) => (e, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleMultipleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Shared Interests & Values</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Being brutally honest about what you truly share helps identify genuine compatibility.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    multiple
                    id="shared_interests"
                    options={INTEREST_OPTIONS}
                    freeSolo
                    value={formData.shared_interests}
                    onChange={(e, value) => handleMultipleChange('shared_interests', value)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                          key={option}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Shared Interests"
                        placeholder="What interests do you genuinely share?"
                        helperText="Be skeptical about 'shared' interests"
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    multiple
                    id="shared_values"
                    options={VALUE_OPTIONS}
                    freeSolo
                    value={formData.shared_values}
                    onChange={(e, value) => handleMultipleChange('shared_values', value)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                          key={option}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Shared Values"
                        placeholder="What values do you truly align on?"
                        helperText="Value alignment is more predictive than shared interests"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Communication Styles</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Different communication styles can lead to misunderstandings and frustration.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <FormLabel>Your Communication Style</FormLabel>
                    <RadioGroup
                      name="communication_style"
                      value={formData.communication_style}
                      onChange={handleChange}
                    >
                      {COMMUNICATION_STYLES.map(style => (
                        <FormControlLabel key={style} value={style} control={<Radio />} label={style} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <FormLabel>Their Communication Style</FormLabel>
                    <RadioGroup
                      name="partner_communication_style"
                      value={formData.partner_communication_style}
                      onChange={handleChange}
                    >
                      {COMMUNICATION_STYLES.map(style => (
                        <FormControlLabel key={style} value={style} control={<Radio />} label={style} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Compatibility Factors</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Be realistic in your assessments. Don't inflate scores based on wishful thinking.
              </Typography>
              
              <Stack spacing={4}>
                <Box>
                  <Typography gutterBottom>Communication Compatibility</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2" color="text.secondary">Poor</Typography>
                    <Slider
                      value={formData.communication_compatibility}
                      onChange={handleSliderChange('communication_compatibility')}
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={1}
                      max={10}
                    />
                    <Typography variant="body2" color="text.secondary">Excellent</Typography>
                  </Stack>
                </Box>
                
                <Box>
                  <Typography gutterBottom>Emotional Compatibility</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2" color="text.secondary">Poor</Typography>
                    <Slider
                      value={formData.emotional_compatibility}
                      onChange={handleSliderChange('emotional_compatibility')}
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={1}
                      max={10}
                    />
                    <Typography variant="body2" color="text.secondary">Excellent</Typography>
                  </Stack>
                </Box>
                
                <Box>
                  <Typography gutterBottom>Lifestyle Compatibility</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2" color="text.secondary">Poor</Typography>
                    <Slider
                      value={formData.lifestyle_compatibility}
                      onChange={handleSliderChange('lifestyle_compatibility')}
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={1}
                      max={10}
                    />
                    <Typography variant="body2" color="text.secondary">Excellent</Typography>
                  </Stack>
                </Box>
                
                <Box>
                  <Typography gutterBottom>Conflict Resolution</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2" color="text.secondary">Poor</Typography>
                    <Slider
                      value={formData.conflict_resolution}
                      onChange={handleSliderChange('conflict_resolution')}
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={1}
                      max={10}
                    />
                    <Typography variant="body2" color="text.secondary">Excellent</Typography>
                  </Stack>
                </Box>
                
                <Box>
                  <Typography gutterBottom>Long-term Potential</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2" color="text.secondary">Poor</Typography>
                    <Slider
                      value={formData.long_term_potential}
                      onChange={handleSliderChange('long_term_potential')}
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={1}
                      max={10}
                    />
                    <Typography variant="body2" color="text.secondary">Excellent</Typography>
                  </Stack>
                </Box>
                
                <Box>
                  <Typography gutterBottom>Physical Attraction</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2" color="text.secondary">Low</Typography>
                    <Slider
                      value={formData.physical_attraction}
                      onChange={handleSliderChange('physical_attraction')}
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={1}
                      max={10}
                    />
                    <Typography variant="body2" color="text.secondary">High</Typography>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Red Flags & Notes</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Don't ignore red flags or rationalize them away. Be honest with yourself.
              </Typography>
              
              <TextField
                fullWidth
                label="Red Flags"
                name="red_flags"
                value={formData.red_flags}
                onChange={handleChange}
                multiline
                rows={2}
                margin="normal"
                placeholder="List any concerning behaviors or incompatibilities"
                helperText="The red flags you ignore now will be the reasons you break up later"
              />
              
              <Divider sx={{ my: 2 }} />
              
              <TextField
                fullWidth
                label="Additional Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={4}
                margin="normal"
                placeholder="Any other thoughts about this relationship's compatibility?"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Save Assessment
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssessmentForm;