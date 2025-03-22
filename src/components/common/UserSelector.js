import React, { useContext } from 'react';
import { Box, Avatar, Typography, Paper, Grid } from '@mui/material';
import { UserContext } from '../../context/UserContext';

const UserSelector = () => {
  const { currentUser, allProfiles, switchUser } = useContext(UserContext);
  
  const handleUserSelect = (username) => {
    switchUser(username);
  };
  
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Select User</Typography>
      <Grid container spacing={2}>
        {Object.entries(allProfiles).map(([username, profile]) => (
          <Grid item xs={6} sm={4} md={2} key={username}>
            <Box 
              onClick={() => handleUserSelect(username)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 1,
                cursor: 'pointer',
                borderRadius: 1,
                border: username === currentUser ? '2px solid #d32f2f' : '2px solid transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                }
              }}
            >
              <Avatar 
                src={profile.avatar} 
                alt={profile.name}
                sx={{ 
                  width: 60, 
                  height: 60,
                  mb: 1,
                  border: username === currentUser ? '2px solid #d32f2f' : 'none'
                }}
              />
              <Typography variant="subtitle2" align="center">{profile.name}</Typography>
              <Typography variant="caption" color="text.secondary" align="center">Age: {profile.age}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default UserSelector;