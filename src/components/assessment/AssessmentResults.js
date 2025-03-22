import React from 'react';
import { Box, Typography, Paper, Grid, Divider, Rating, LinearProgress, Chip } from '@mui/material';
import BrutalTruth from '../common/BrutalTruth';

const AssessmentResults = ({ assessment }) => {
  // Calculate overall compatibility score (average of all compatibility factors)
  const compatibilityFactors = [
    assessment.communication_compatibility,
    assessment.emotional_compatibility,
    assessment.lifestyle_compatibility,
    assessment.conflict_resolution,
    assessment.long_term_potential,
    assessment.physical_attraction
  ];
  
  const overallScore = Math.round(
    compatibilityFactors.reduce((sum, score) => sum + score, 0) / compatibilityFactors.length
  );

  // Determine the verbal assessment based on the overall score
  const getVerbalAssessment = (score) => {
    if (score <= 3) return 'Low Compatibility';
    if (score <= 5) return 'Moderate Compatibility';
    if (score <= 7) return 'Good Compatibility';
    return 'High Compatibility';
  };

  // Analyze communication styles compatibility
  const analyzeCommunicationStyles = () => {
    const your = assessment.communication_style;
    const their = assessment.partner_communication_style;
    
    if (!your || !their) return null;
    
    // Compatible pairs
    const compatiblePairs = [
      ['Direct', 'Direct'],
      ['Direct', 'Analytical'],
      ['Analytical', 'Analytical'],
      ['Analytical', 'Logical'],
      ['Intuitive', 'Intuitive'],
      ['Intuitive', 'Emotional'],
      ['Functional', 'Functional'],
      ['Functional', 'Direct'],
      ['Personal', 'Personal'],
      ['Personal', 'Receptive'],
      ['Receptive', 'Receptive'],
      ['Receptive', 'Emotional'],
      ['Emotional', 'Emotional'],
      ['Logical', 'Logical']
    ];
    
    // Check if it's a compatible pair
    const isCompatible = compatiblePairs.some(
      ([style1, style2]) => 
        (your === style1 && their === style2) || 
        (your === style2 && their === style1)
    );
    
    // Diametrically opposed styles (most challenging)
    const challengingPairs = [
      ['Direct', 'Avoidant'],
      ['Logical', 'Emotional'],
      ['Analytical', 'Intuitive'],
      ['Personal', 'Functional']
    ];
    
    const isVeryIncompatible = challengingPairs.some(
      ([style1, style2]) => 
        (your === style1 && their === style2) || 
        (your === style2 && their === style1)
    );
    
    if (isCompatible) {
      return {
        compatible: true,
        message: `Your ${your} style is generally compatible with their ${their} style.`
      };
    } else if (isVeryIncompatible) {
      return {
        compatible: false,
        message: `Warning: Your ${your} style often conflicts with their ${their} style. This will require significant effort to navigate.`
      };
    } else {
      return {
        compatible: 'somewhat',
        message: `Your ${your} style and their ${their} style are somewhat different. This may require extra communication effort.`
      };
    }
  };

  const communicationAnalysis = analyzeCommunicationStyles();

  // Generate a brutal truth based on the assessment
  const generateBrutalTruth = () => {
    // Low overall score
    if (overallScore <= 4) {
      return "You're forcing compatibility where it doesn't exist. This relationship requires too much work for too little reward.";
    }
    
    // Communication incompatibility
    if (communicationAnalysis && !communicationAnalysis.compatible) {
      return "Your communication styles fundamentally clash. This will be an ongoing source of frustration unless one of you significantly adapts.";
    }
    
    // Few shared values
    if (assessment.shared_values.length <= 1) {
      return "You have almost no core values in common. Long-term compatibility is unlikely without shared fundamental beliefs.";
    }
    
    // Low long-term potential
    if (assessment.long_term_potential <= 4) {
      return "Even you don't see a future here. Stop wasting both your time on something you know won't last.";
    }
    
    // Good compatibility but bad conflict resolution
    if (overallScore >= 7 && assessment.conflict_resolution <= 4) {
      return "Your inability to resolve conflicts will eventually erode all the good aspects of this relationship.";
    }
    
    // Physical attraction carrying the relationship
    if (assessment.physical_attraction >= 8 && 
        assessment.communication_compatibility <= 5 &&
        assessment.emotional_compatibility <= 5) {
      return "You're letting physical attraction mask fundamental compatibility issues. This rarely ends well.";
    }
    
    // Very high scores across the board
    if (overallScore >= 9) {
      return "No relationship is this perfect. You're either in the honeymoon phase or not being honest with yourself.";
    }
    
    // Default
    return "Be vigilant about the weak areas in your compatibility. They won't fix themselves.";
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Overall Compatibility: {overallScore}/10
            </Typography>
            <Rating 
              value={overallScore / 2}
              precision={0.5} 
              readOnly 
              size="large"
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle1" color="text.secondary">
              {getVerbalAssessment(overallScore)}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <BrutalTruth text={generateBrutalTruth()} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Compatibility Factors</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Communication</Typography>
                <Typography variant="body2">{assessment.communication_compatibility}/10</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={assessment.communication_compatibility * 10} 
                sx={{ height: 8, borderRadius: 5 }}
                color={assessment.communication_compatibility > 6 ? "success" : assessment.communication_compatibility > 4 ? "warning" : "error"}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Emotional</Typography>
                <Typography variant="body2">{assessment.emotional_compatibility}/10</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={assessment.emotional_compatibility * 10} 
                sx={{ height: 8, borderRadius: 5 }}
                color={assessment.emotional_compatibility > 6 ? "success" : assessment.emotional_compatibility > 4 ? "warning" : "error"}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Lifestyle</Typography>
                <Typography variant="body2">{assessment.lifestyle_compatibility}/10</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={assessment.lifestyle_compatibility * 10} 
                sx={{ height: 8, borderRadius: 5 }}
                color={assessment.lifestyle_compatibility > 6 ? "success" : assessment.lifestyle_compatibility > 4 ? "warning" : "error"}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Conflict Resolution</Typography>
                <Typography variant="body2">{assessment.conflict_resolution}/10</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={assessment.conflict_resolution * 10} 
                sx={{ height: 8, borderRadius: 5 }}
                color={assessment.conflict_resolution > 6 ? "success" : assessment.conflict_resolution > 4 ? "warning" : "error"}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Long-term Potential</Typography>
                <Typography variant="body2">{assessment.long_term_potential}/10</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={assessment.long_term_potential * 10} 
                sx={{ height: 8, borderRadius: 5 }}
                color={assessment.long_term_potential > 6 ? "success" : assessment.long_term_potential > 4 ? "warning" : "error"}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Physical Attraction</Typography>
                <Typography variant="body2">{assessment.physical_attraction}/10</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={assessment.physical_attraction * 10} 
                sx={{ height: 8, borderRadius: 5 }}
                color={assessment.physical_attraction > 6 ? "success" : assessment.physical_attraction > 4 ? "warning" : "error"}
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Communication Styles</Typography>
            <Divider sx={{ mb: 2 }} />
            
            {assessment.communication_style && assessment.partner_communication_style ? (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Your Style:</Typography>
                  <Chip label={assessment.communication_style} />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Their Style:</Typography>
                  <Chip label={assessment.partner_communication_style} />
                </Box>
                
                {communicationAnalysis && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="body2">
                      {communicationAnalysis.message}
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Communication styles not specified
              </Typography>
            )}
            
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Shared Foundations</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>Shared Interests:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {assessment.shared_interests && assessment.shared_interests.length > 0 ? (
                  assessment.shared_interests.map((interest) => (
                    <Chip key={interest} label={interest} size="small" />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">None specified</Typography>
                )}
              </Box>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>Shared Values:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {assessment.shared_values && assessment.shared_values.length > 0 ? (
                  assessment.shared_values.map((value) => (
                    <Chip key={value} label={value} size="small" color="primary" variant="outlined" />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">None specified</Typography>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssessmentResults;