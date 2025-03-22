import React, { useState, useContext } from 'react';
import { Container, Typography, Box, Stepper, Step, StepLabel, StepContent, Button, Paper } from '@mui/material';
import DecisionForm from '../components/decisionHelper/DecisionForm';
import DecisionResults from '../components/decisionHelper/DecisionResults';
import { UserContext } from '../context/UserContext';

const DecisionHelper = () => {
  const { evaluateRelationship, generateConversationStarters, generateDateIdeas } = useContext(UserContext);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(null);
  const [results, setResults] = useState(null);

  const handleFormSubmit = (data) => {
    setFormData(data);
    
    // Calculate results
    const evaluationResult = evaluateRelationship(data);
    const conversationStarters = generateConversationStarters(data.interests);
    const dateIdeas = generateDateIdeas(data.datePreferences);
    
    setResults({
      evaluationResult,
      conversationStarters,
      dateIdeas
    });
    
    setActiveStep(1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData(null);
    setResults(null);
  };

  const steps = [
    {
      label: 'Enter Relationship Data',
      description: 'Provide honest information about the relationship to get accurate insights.',
      content: <DecisionForm onSubmit={handleFormSubmit} />
    },
    {
      label: 'Review Assessment',
      description: 'See a data-driven evaluation of this relationship.',
      content: results && <DecisionResults results={results} />
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Decision Helper
      </Typography>
      <Typography variant="body1" paragraph>
        Should you pursue this relationship? Get a candid, data-driven assessment.
      </Typography>
      
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="h6">{step.label}</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {step.description}
                </Typography>
                {step.content}
                {index === 1 && (
                  <Box sx={{ mb: 2, mt: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={handleReset}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Evaluate Another Relationship
                    </Button>
                  </Box>
                )}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Container>
  );
};

export default DecisionHelper;