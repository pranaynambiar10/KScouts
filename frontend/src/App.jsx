import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PlayerProfile from './pages/PlayerProfile';
import Events from './pages/Events';
import Certificates from './pages/Certificates';
import CreateEvent from './pages/CreateEvent';
import PlayersList from './pages/PlayersList';
import ClubApplications from './pages/ClubApplications';
import CertVerify from './pages/CertVerify';
import PlayerDetail from './pages/PlayerDetail';
import MyApplications from './pages/MyApplications';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<PlayerProfile />} />
      <Route path="/events" element={<Events />} />
      <Route path="/certificates" element={<Certificates />} />
      <Route path="/events/create" element={<CreateEvent />} />
      <Route path="/players" element={<PlayersList />} />
      <Route path="/players/:userId" element={<PlayerDetail />} />
      <Route path="/club/applications" element={<ClubApplications />} />
      <Route path="/my-applications" element={<MyApplications />} />
      <Route path="/verify" element={<CertVerify />} />
    </Routes>
  );
}

export default App;
