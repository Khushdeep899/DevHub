import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignInComponent from './components/SignIn';
import RegisterComponent from './components/Register';
import DashboardFunc from './pages/Dashboard';
import ChannelInfoFunc from './pages/ChannelInfo';
import SearchResultsPage from './pages/SearchResult';
import { AuthProvider } from './contexts/AuthContext';
import ChatPageFunc from './pages/ChatPage';
import AccountFunc from './pages/Account';
import AdminPanel from './components/Admin';
function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInComponent />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route path="/channels" element={<DashboardFunc />} />
        <Route path="/channels/:channelId" component={ChannelInfoFunc} />
        <Route path="/channels/:channelId/messages" element={<ChatPageFunc />} />
        <Route path="/search" component={SearchResultsPage} />
        <Route path="/account" element={<AccountFunc />} />
        <Route path="/Admin" element={<AdminPanel />} />

        <Route path="*" element={<Navigate to="/" />} /> {/* Fallback route */}
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;

