import React, { useState, useContext } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Link,
  Alert,
  CircularProgress,
  Grid,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    weeklyQuota: 1,
    personalGoals: []
  });
  
  const [localError, setLocalError] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const { register, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const { displayName, email, password, confirmPassword, weeklyQuota, personalGoals } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (e, newValue) => {
    setFormData({ ...formData, weeklyQuota: newValue });
  };

  const handleAddGoal = () => {
    if (goalInput.trim() && !personalGoals.includes(goalInput.trim())) {
      setFormData({
        ...formData,
        personalGoals: [...personalGoals, goalInput.trim()]
      });
      setGoalInput('');
    }
  };

  const handleDeleteGoal = (goalToDelete) => {
    setFormData({
      ...formData,
      personalGoals: personalGoals.filter(goal => goal !== goalToDelete)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!displayName || !email || !password || !confirmPassword) {
      setLocalError('Please fill all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    try {
      await register({
        displayName,
        email,
        password,
        weeklyQuota,
        personalGoals
      });
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      // Error is handled in AuthContext
    }
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          my: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" gutterBottom align="center">
            Create Account
          </Typography>
          
          {(error || localError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {localError || error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="displayName"
              label="Display Name"
              name="displayName"
              autoComplete="name"
              autoFocus
              value={displayName}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={handleChange}
              disabled={loading}
              helperText="Password must be at least 6 characters"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
              Weekly Date Quota (numbers acquired)
            </Typography>
            <Slider
              value={weeklyQuota}
              onChange={handleSliderChange}
              aria-labelledby="quota-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={10}
              disabled={loading}
            />
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
              Personal Dating Goals (Optional)
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  id="goalInput"
                  label="Add a goal"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={3}>
                <Button 
                  variant="outlined" 
                  onClick={handleAddGoal}
                  disabled={loading || !goalInput.trim()}
                  sx={{ height: '100%' }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {personalGoals.map((goal, index) => (
                <Chip
                  key={index}
                  label={goal}
                  onDelete={() => handleDeleteGoal(goal)}
                  color="primary"
                  variant="outlined"
                  disabled={loading}
                />
              ))}
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>
            
            <Box display="flex" justifyContent="center" mt={2}>
              <Link component={RouterLink} to="/login" variant="body2">
                {"Already have an account? Sign In"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;