import React, { useContext } from 'react';
import { Container, Typography, Grid, Box, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import WarnIcon from '@mui/icons-material/Warning';
import StatCard from '../components/common/StatCard';
import BrutalTruth from '../components/common/BrutalTruth';
import UserSelector from '../components/common/UserSelector';
import UserProfile from '../components/common/UserProfile';
import Leaderboard from '../components/common/Leaderboard';
import { UserContext } from '../context/UserContext';

const Dashboard = () => {
  const { currentUser, dates, assessments, burnoutLevel, generateInsights, getLeaderboards } = useContext(UserContext);
  
  // Calculate stats
  const totalDates = dates.length;
  const averageRating = totalDates > 0
    ? (dates.reduce((sum, date) => sum + date.rating, 0) / totalDates).toFixed(1)
    : 'N/A';
  const highestRated = totalDates > 0
    ? [...dates].sort((a, b) => b.rating - a.rating)[0]
    : null;
  const assessmentCount = assessments.length;

  // Generate insights (brutally honest feedback)
  const insights = generateInsights();
  
  // Get leaderboards
  const leaderboards = getLeaderboards();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <UserSelector />
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dating Insights Dashboard
        </Typography>
        
        {burnoutLevel > 7 && (
          <Box display="flex" alignItems="center">
            <WarnIcon color="error" />
            <Typography variant="body1" color="error" sx={{ ml: 1 }}>
              Burnout Alert
            </Typography>
          </Box>
        )}
      </Box>
      
      <UserProfile />

      <Grid container spacing={4} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Dates Logged"
            value={totalDates}
            icon={<FavoriteIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Date Rating"
            value={averageRating}
            icon={<AssessmentIcon fontSize="large" />}
            color={averageRating < 4 ? 'error.main' : averageRating < 7 ? 'warning.main' : 'success.main'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Assessments Completed"
            value={assessmentCount}
            icon={<TimelineIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Burnout Level"
            value={`${burnoutLevel}/10`}
            icon={<HelpOutlineIcon fontSize="large" />}
            color={burnoutLevel > 7 ? 'error.main' : burnoutLevel > 4 ? 'warning.main' : 'info.main'}
          />
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>Social Leaderboards</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        See how you stack up against other guys in the dating scene. Higher ratings mean you've been more satisfied with your dates!
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Leaderboard 
            title="Most Active Daters"
            data={leaderboards.mostDates}
            metric="count"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Leaderboard 
            title="Highest Avg Ratings"
            data={leaderboards.highestRatings}
            metric="rating"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Leaderboard 
            title="Success Rates"
            data={leaderboards.successRates}
            metric="success"
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Leaderboard 
            title="Date Activity Variety"
            data={leaderboards.dateVariety}
            metric="count"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Leaderboard 
            title="Lowest Burnout Levels"
            data={leaderboards.lowestBurnout}
            metric="burnout"
          />
        </Grid>
        
        {insights.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Brutally Honest Insights</Typography>
              <Box sx={{ mt: 2 }}>
                {insights.map((insight, index) => (
                  <BrutalTruth key={index} text={insight} />
                ))}
              </Box>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom>Quick Actions</Typography>
            <Grid container spacing={2} sx={{ mt: 1, flexGrow: 1 }}>
              <Grid item xs={12}>
                <Button
                  component={Link}
                  to="/log"
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<FavoriteIcon />}
                >
                  Log a New Date
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  component={Link}
                  to="/assessment"
                  variant="outlined"
                  fullWidth
                  startIcon={<AssessmentIcon />}
                >
                  New Compatibility Assessment
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  component={Link}
                  to="/patterns"
                  variant="outlined"
                  fullWidth
                  startIcon={<TimelineIcon />}
                >
                  View Dating Patterns
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  component={Link}
                  to="/decision-helper"
                  variant="outlined"
                  fullWidth
                  startIcon={<HelpOutlineIcon />}
                >
                  Decision Helper
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            {totalDates > 0 ? (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Most Recent Date
                  </Typography>
                  <Typography variant="body1">
                    {dates[dates.length - 1].name} - {new Date(dates[dates.length - 1].date).toLocaleDateString()}
                  </Typography>
                </Box>

                {highestRated && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Highest Rated Date
                    </Typography>
                    <Typography variant="body1">
                      {highestRated.name} - Rating: {highestRated.rating}/10
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No dates logged yet. Start tracking your dating experiences to gain insights.
                </Typography>
                <Button
                  component={Link}
                  to="/log"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Log Your First Date
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;