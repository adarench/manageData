import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import PrivateRoute from './components/routing/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import DateLog from './pages/DateLog';
import Assessment from './pages/Assessment';
import Patterns from './pages/Patterns';
import DecisionHelper from './pages/DecisionHelper';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Contacts from './pages/Contacts';
import ContactDetails from './pages/ContactDetails';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f',
    },
    secondary: {
      main: '#212121',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontWeight: 700,
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
              <Route path="/" element={
                <>
                  <Navbar />
                  <Dashboard />
                </>
              } />
              <Route path="/log" element={
                <>
                  <Navbar />
                  <DateLog />
                </>
              } />
              <Route path="/assessment" element={
                <>
                  <Navbar />
                  <Assessment />
                </>
              } />
              <Route path="/patterns" element={
                <>
                  <Navbar />
                  <Patterns />
                </>
              } />
              <Route path="/decision-helper" element={
                <>
                  <Navbar />
                  <DecisionHelper />
                </>
              } />
              <Route path="/settings" element={
                <>
                  <Navbar />
                  <Settings />
                </>
              } />
              <Route path="/contacts" element={
                <>
                  <Navbar />
                  <Contacts />
                </>
              } />
              <Route path="/contacts/:id" element={
                <>
                  <Navbar />
                  <ContactDetails />
                </>
              } />
            </Route>
          </Routes>
        </ThemeProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;