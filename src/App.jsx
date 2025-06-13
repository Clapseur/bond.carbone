import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ConnectionForm from './components/ConnectionForm';
import ProfileSetup from './components/ProfileSetup';
import ProfileView from './components/ProfileView';
import DynamicProfilePage from './components/DynamicProfilePage';
import Beams from './components/Beams';
import LoadingScreen from './components/LoadingScreen';
import { supabase } from './lib/supabase';

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('carbone_session_token');
    if (token) {
      setUserSession(JSON.parse(token));
    }
    
    setTimeout(() => {
      setIsAppLoading(false);
    }, 2000);
  }, []);

  if (isAppLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-black text-white relative">
        <div className="fixed inset-0 z-0">
          <Beams />
        </div>
        
        <div className="relative z-10">
          <Header userSession={userSession} setUserSession={setUserSession} />
          <Routes>
            <Route 
              path="/" 
              element={<ConnectionForm />} 
            />
            <Route 
              path="/:profileId" 
              element={
                <DynamicProfilePage 
                  userSession={userSession} 
                  setUserSession={setUserSession} 
                />
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;