import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormHelperText,
  Typography,
  Slider,
  Autocomplete,
  Stack,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const COMMON_RED_FLAGS = [
  'Rude to service staff',
  'Only talks about themselves',
  'Still hung up on ex',
  'Constantly checking phone',
  'Dismissive of your interests',
  'Excessive drinking',
  'Doesn\'t ask questions',
  'Love bombing',
  'Different political values',
  'Negative about everything',
  'Late without apology',
  'Controlling behavior',
];

const COMMON_ACTIVITIES = [
  'Coffee',
  'Dinner',
  'Drinks',
  'Movie',
  'Walk',
  'Museum',
  'Concert',
  'Hiking',
  'Art gallery',
  'Festival',
  'Cooking together',
  'Board games',
];

const DateForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
    contactName: '',
    dateTime: new Date(),
    type: '',
    activities: [],
    dateNumber: 1,
    rating: 5,
    redFlags: [],
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dateTime: date });
    if (errors.dateTime) {
      setErrors({ ...errors, dateTime: '' });
    }
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleRatingChange = (e, value) => {
    setFormData({ ...formData, rating: value });
  };

  const handleCustomRedFlag = (e, values) => {
    setFormData({ ...formData, redFlags: values });
    if (errors.redFlags) {
      setErrors({ ...errors, redFlags: '' });
    }
  };

  const handleCustomActivity = (e, values) => {
    // Ensure values is always an array, even if it's null or undefined
    const safeValues = Array.isArray(values) ? values : [];
    console.log('Activity values received:', values);
    console.log('Safe activity values:', safeValues);
    
    setFormData({ ...formData, activities: safeValues });
    if (errors.activities) {
      setErrors({ ...errors, activities: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.contactName.trim()) newErrors.contactName = 'Name is required';
    if (!formData.dateTime) newErrors.dateTime = 'Date is required';
    if (!formData.type.trim()) newErrors.type = 'Date type is required';
    if (!formData.activities.length) newErrors.activities = 'At least one activity is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Submitting form data:', formData);
      console.log('Activities:', formData.activities);
      console.log('Activities type:', typeof formData.activities);
      console.log('Activities is array:', Array.isArray(formData.activities));
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            error={!!errors.contactName}
            helperText={errors.contactName}
            margin="normal"
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={formData.dateTime}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  error={!!errors.dateTime}
                  helperText={errors.dateTime}
                  required
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal" error={!!errors.type} required>
            <InputLabel>Date Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Date Type"
            >
              <MenuItem value="App Match">App Match</MenuItem>
              <MenuItem value="Setup">Setup</MenuItem>
              <MenuItem value="Met in Person">Met in Person</MenuItem>
              <MenuItem value="Friend of Friend">Friend of Friend</MenuItem>
              <MenuItem value="Coworker">Coworker</MenuItem>
              <MenuItem value="Long-term Partner">Long-term Partner</MenuItem>
            </Select>
            {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal" error={!!errors.dateNumber} required>
            <InputLabel>Date Number</InputLabel>
            <Select
              name="dateNumber"
              value={formData.dateNumber}
              onChange={handleChange}
              label="Date Number"
            >
              <MenuItem value={1}>First Date</MenuItem>
              <MenuItem value={2}>Second Date</MenuItem>
              <MenuItem value={3}>Third Date</MenuItem>
              <MenuItem value={4}>Fourth Date</MenuItem>
              <MenuItem value={5}>Fifth Date</MenuItem>
              <MenuItem value={6}>Sixth+ Date</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth margin="normal" error={!!errors.activities} required>
            <InputLabel id="activities-label">Activities</InputLabel>
            <Select
              labelId="activities-label"
              id="activities"
              multiple
              value={formData.activities || []}
              onChange={(e) => {
                const newValues = e.target.value;
                console.log('Selected activities:', newValues);
                setFormData({ ...formData, activities: newValues });
                if (errors.activities) {
                  setErrors({ ...errors, activities: '' });
                }
              }}
              input={<OutlinedInput label="Activities" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {COMMON_ACTIVITIES.map((activity) => (
                <MenuItem key={activity} value={activity}>
                  {activity}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.activities || 'What did you do together?'}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mt: 2, mb: 4 }}>
            <Typography gutterBottom>Rating (1-10)</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" color="text.secondary">1</Typography>
              <Slider
                value={formData.rating}
                onChange={handleRatingChange}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
              />
              <Typography variant="body2" color="text.secondary">10</Typography>
            </Stack>
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="caption" color="error">Terrible</Typography>
              <Typography variant="caption" color="warning.main">Ok</Typography>
              <Typography variant="caption" color="success.main">Amazing</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            multiple
            id="redFlags"
            options={COMMON_RED_FLAGS}
            freeSolo
            value={formData.redFlags}
            onChange={handleCustomRedFlag}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                  color="error"
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Red Flags"
                placeholder="Add any red flags"
                margin="normal"
                helperText="Be brutally honest. No one else will see this."
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Additional Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            placeholder="What went well? What didn't? How did you feel? Would you see them again?"
          />
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            {initialData ? 'Update Date' : 'Log Date'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DateForm;