import React, { useContext } from 'react';
import { Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { UserContext } from '../../context/UserContext';

const LeaderboardRow = ({ position, user, value, metric, allProfiles, currentUser }) => {
  const isCurrentUser = user === currentUser;
  const profile = allProfiles[user];
  
  const getPositionColor = (pos) => {
    switch(pos) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return 'transparent';
    }
  };
  
  const formatValue = (val, metricType) => {
    switch(metricType) {
      case 'rating':
        return val.toFixed(1) + '/10';
      case 'success':
        return val.toFixed(1) + '%';
      case 'count':
        return val;
      case 'burnout':
        return val + '/10';
      default:
        return val;
    }
  };
  
  return (
    <TableRow 
      sx={{ 
        '&:last-child td, &:last-child th': { border: 0 },
        backgroundColor: isCurrentUser ? 'rgba(211, 47, 47, 0.1)' : 'inherit',
        fontWeight: isCurrentUser ? 'bold' : 'normal',
      }}
    >
      <TableCell align="center">
        <Box 
          sx={{ 
            width: 30, 
            height: 30, 
            borderRadius: '50%', 
            backgroundColor: getPositionColor(position),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            fontWeight: 'bold',
            color: position <= 3 ? '#000' : 'inherit'
          }}
        >
          {position}
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Avatar 
            src={profile?.avatar} 
            alt={user}
            sx={{ 
              width: 30, 
              height: 30,
              mr: 1,
              border: isCurrentUser ? '1px solid #d32f2f' : 'none'
            }}
          />
          <Typography variant="body2" fontWeight={isCurrentUser ? 'bold' : 'normal'}>
            {user}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="right">
        <Chip 
          label={formatValue(value, metric)} 
          color={position === 1 ? "primary" : "default"}
          variant={position <= 3 ? "filled" : "outlined"}
          size="small"
        />
      </TableCell>
    </TableRow>
  );
};

const Leaderboard = ({ title, data, metric }) => {
  const { currentUser, allProfiles } = useContext(UserContext);
  
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box display="flex" alignItems="center" mb={1}>
        <EmojiEventsIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">{title}</Typography>
      </Box>
      {metric === 'rating' && (
        <Typography variant="caption" color="text.secondary" paragraph>
          Ratings reflect how satisfied the guys were with their dates (higher = more satisfied)
        </Typography>
      )}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" width={50}>Rank</TableCell>
              <TableCell>User</TableCell>
              <TableCell align="right">Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <LeaderboardRow 
                key={item.name}
                position={index + 1}
                user={item.name}
                value={item.value}
                metric={metric}
                allProfiles={allProfiles}
                currentUser={currentUser}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Leaderboard;