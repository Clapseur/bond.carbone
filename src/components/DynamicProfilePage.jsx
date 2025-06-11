import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProfileSetup from './ProfileSetup';
import ProfileView from './ProfileView';
import LoadingScreen from './LoadingScreen';

const DynamicProfilePage = ({ userSession, setUserSession }) => {
  const { profileId } = useParams();
  const [pageStatus, setPageStatus] = useState('loading'); // 'loading', 'vacant', 'occupied'
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    checkPageStatus();
  }, [profileId]);

  const checkPageStatus = async () => {
    try {
      // Check if this ID exists and is used
      const { data, error } = await supabase
        .from('user_codes')
        .select('*')
        .eq('code', profileId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Code doesn't exist - invalid ID
        setError('Invalid profile ID');
        setPageStatus('error');
        return;
      }

      if (error) {
        setError('Database error');
        setPageStatus('error');
        return;
      }

      if (data.is_used && data.prenom) {
        // Page is occupied
        setProfileData(data);
        setPageStatus('occupied');
        
        // Create session token if not exists
        if (!userSession) {
          const sessionToken = {
            profileId: data.code,
            name: `${data.prenom} ${data.nom}`,
            email: data.email,
            createdAt: Date.now(),
            starredProfiles: []
          };
          localStorage.setItem('carbone_session_token', JSON.stringify(sessionToken));
          setUserSession(sessionToken);
        }
      } else {
        // Page is vacant
        setPageStatus('vacant');
      }
    } catch (err) {
      console.error('Erreur de connexion détaillée:', err);
      setError('Connection error');
      setPageStatus('error');
    }
  };

  const handleProfileCreated = (newProfileData) => {
    setProfileData(newProfileData);
    setPageStatus('occupied');
    
    // Create session token
    const sessionToken = {
      profileId: newProfileData.code,
      name: `${newProfileData.prenom} ${newProfileData.nom}`,
      email: newProfileData.email,
      createdAt: Date.now(),
      starredProfiles: []
    };
    localStorage.setItem('carbone_session_token', JSON.stringify(sessionToken));
    setUserSession(sessionToken);
  };

  if (pageStatus === 'loading') {
    return <LoadingScreen />;
  }

  if (pageStatus === 'error') {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4" style={{paddingTop: '70px'}}>
        <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (pageStatus === 'vacant') {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4" style={{paddingTop: '70px'}}>
        <ProfileSetup 
          code={profileId}
          onProfileCreated={handleProfileCreated}
          isPageParking={true}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4" style={{paddingTop: '70px'}}>
      <ProfileView 
        profileData={profileData}
        userSession={userSession}
        setUserSession={setUserSession}
      />
    </div>
  );
};

export default DynamicProfilePage;