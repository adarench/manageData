import React, { useContext } from 'react';
import { Paper, Typography, Box, Avatar, Chip, Divider } from '@mui/material';
import { UserContext } from '../../context/UserContext';

const UserProfile = () => {
  const { currentUser, allProfiles, burnoutLevel, dates, assessments } = useContext(UserContext);
  const profile = allProfiles[currentUser];
  
  const getBurnoutColor = () => {
    if (burnoutLevel <= 3) return 'success';
    if (burnoutLevel <= 6) return 'warning';
    return 'error';
  };
  
  // Calculate stats
  const totalDates = dates.length;
  const avgRating = totalDates > 0
    ? (dates.reduce((sum, date) => sum + date.rating, 0) / totalDates).toFixed(1)
    : 'N/A';
  
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar 
          src={profile.avatar} 
          alt={profile.name}
          sx={{ width: 80, height: 80, mr: 2 }}
        />
        <Box>
          <Typography variant="h5">{profile.name}</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Age: {profile.age}
          </Typography>
          <Box display="flex" alignItems="center" mt={1}>
            <Chip 
              label={`Burnout Level: ${burnoutLevel}/10`} 
              color={getBurnoutColor()}
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip 
              label={`${totalDates} Dates`} 
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
            />
            {avgRating !== 'N/A' && (
              <Chip 
                label={`Avg Rating: ${avgRating}`} 
                variant="outlined"
                size="small"
              />
            )}
          </Box>
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle2" gutterBottom>Bio</Typography>
      <Typography variant="body2" paragraph>
        {profile.bio}
      </Typography>
      
      <Typography variant="subtitle2" gutterBottom>Interests</Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {profile.interests.map(interest => (
          <Chip 
            key={interest}
            label={interest}
            size="small"
            variant="outlined"
          />
        ))}
      </Box>
    </Paper>
  );
};

export default UserProfile;