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
    // Check for existing session token
    const token = localStorage.getItem('carbone_session_token');
    if (token) {
      setUserSession(JSON.parse(token));
    }
    
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isAppLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="relative w-full min-h-screen bg-black overflow-x-hidden">
        <Beams rotation={35} />
        <Header userSession={userSession} setUserSession={setUserSession} />
        
        <Routes>
          <Route path="/" element={<ConnectionForm />} />
          <Route 
            path="/:profileId" 
            element={
              <DynamicProfilePage 
                userSession={userSession} 
                setUserSession={setUserSession} 
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;