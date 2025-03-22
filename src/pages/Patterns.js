import React, { useContext } from 'react';
import { Container, Typography, Box, Grid, Paper, Divider, Chip } from '@mui/material';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, CartesianGrid } from 'recharts';
import BrutalTruth from '../components/common/BrutalTruth';
import EmptyState from '../components/common/EmptyState';
import TimelineIcon from '@mui/icons-material/Timeline';
import { UserContext } from '../context/UserContext';

const Patterns = () => {
  const { dates, identifyPatterns, generateRecommendations } = useContext(UserContext);
  
  // Check if we have enough data
  if (dates.length < 3) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dating Patterns
        </Typography>
        <EmptyState
          title="Not enough data yet"
          message="Log at least 3 dates to start seeing patterns in your dating history."
          actionText="Log More Dates"
          actionLink="/log"
          icon={<TimelineIcon fontSize="inherit" />}
        />
      </Container>
    );
  }

  // Identify patterns
  const patterns = identifyPatterns();
  const recommendations = generateRecommendations();

  // Prepare data for charts
  const prepareRatingDistribution = () => {
    const ratings = {};
    dates.forEach(date => {
      ratings[date.rating] = (ratings[date.rating] || 0) + 1;
    });
    
    return Object.entries(ratings).map(([rating, count]) => ({
      name: `${rating}/10`,
      value: count
    }));
  };

  const prepareDateTypeDistribution = () => {
    const types = {};
    dates.forEach(date => {
      types[date.type] = (types[date.type] || 0) + 1;
    });
    
    return Object.entries(types).map(([type, count]) => ({
      name: type,
      value: count
    }));
  };

  const prepareActivitySuccessRate = () => {
    const activities = {};
    const activityCount = {};
    
    dates.forEach(date => {
      date.activities.forEach(activity => {
        if (!activities[activity]) {
          activities[activity] = 0;
          activityCount[activity] = 0;
        }
        
        activities[activity] += date.rating;
        activityCount[activity] += 1;
      });
    });
    
    return Object.entries(activities)
      .map(([activity, totalRating]) => ({
        name: activity,
        rating: +(totalRating / activityCount[activity]).toFixed(1)
      }))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8); // Only top 8 for readability
  };

  const ratingData = prepareRatingDistribution();
  const typeData = prepareDateTypeDistribution();
  const activityData = prepareActivitySuccessRate();

  // Colors for charts
  const COLORS = ['#d32f2f', '#ef5350', '#f44336', '#e57373', '#ef9a9a', '#ffcdd2', '#ffebee'];
  const getColorForRating = (rating) => {
    const ratingNum = parseInt(rating);
    if (ratingNum <= 3) return '#d32f2f';
    if (ratingNum <= 5) return '#ff9800';
    if (ratingNum <= 7) return '#ffc107';
    return '#4caf50';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dating Patterns & Insights
      </Typography>
      
      <Grid container spacing={3}>
        {/* Recommendations */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Brutally Honest Recommendations</Typography>
            <Box mt={2}>
              {recommendations.map((recommendation, index) => (
                <BrutalTruth key={index} text={recommendation} />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Success Factors */}
        {patterns.successFactors && patterns.successFactors.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>What Works For You</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box>
                {patterns.successFactors.map((factor, index) => (
                  <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                    ✓ {factor}
                  </Typography>
                ))}
                
                {patterns.idealDayOfWeek && (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    ✓ Dates on {patterns.idealDayOfWeek}s tend to go better
                  </Typography>
                )}
                
                {patterns.highestRatedTypes && patterns.highestRatedTypes.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Your most successful date types:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {patterns.highestRatedTypes.map((type) => (
                        <Chip key={type} label={type} color="success" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Red Flags */}
        {patterns.redFlags && patterns.redFlags.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Common Red Flags</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box>
                {patterns.redFlags.map((flag, index) => (
                  <Typography key={index} variant="body1" sx={{ mb: 1 }} color="error">
                    ✗ {flag}
                  </Typography>
                ))}
                
                <Typography variant="body1" sx={{ mt: 2 }}>
                  These red flags appear repeatedly in your lower-rated dates. Pay attention to them early on.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Rating Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Rating Distribution</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Number of Dates">
                    {ratingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getColorForRating(entry.name)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Date Type Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Date Type Distribution</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box height={300} display="flex" justifyContent="center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} dates`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Activity Success Rate */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Activity Success Rates</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Average rating of dates by activity type
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activityData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 10]} />
                  <YAxis type="category" dataKey="name" width={80} />
                  <Tooltip />
                  <Bar dataKey="rating" name="Avg. Rating">
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getColorForRating(entry.rating)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Patterns;