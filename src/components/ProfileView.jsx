import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Lanyard from './Lanyard/Lanyard';
import { Star } from 'lucide-react';
import { IconButton } from './animate-ui/buttons/icon';

const ProfileView = ({ profileData, userSession, setUserSession }) => {
  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    if (userSession?.starredProfiles) {
      setIsStarred(userSession.starredProfiles.includes(profileData.code));
    }
  }, [userSession, profileData.code]);

  const handleStarProfile = () => {
    console.log('Star button clicked!', { userSession, profileData: profileData.code, isStarred });
    
    let updatedSession = userSession || { starredProfiles: [] };
    
    if (!updatedSession.starredProfiles) {
      updatedSession.starredProfiles = [];
    }
    
    updatedSession = { ...updatedSession };
    updatedSession.starredProfiles = [...updatedSession.starredProfiles];
    
    if (isStarred) {
      updatedSession.starredProfiles = updatedSession.starredProfiles.filter(
        id => id !== profileData.code
      );
      console.log('Removing from favorites');
    } else {
      if (!updatedSession.starredProfiles.includes(profileData.code)) {
        updatedSession.starredProfiles.push(profileData.code);
      }
      console.log('Adding to favorites');
    }

    localStorage.setItem('carbone_session_token', JSON.stringify(updatedSession));
    setUserSession(updatedSession);
    setIsStarred(!isStarred);
    
    console.log('Updated session:', updatedSession);
  };

  return (
    <div className="min-h-screen relative">
      <div className="relative z-50">
        <Lanyard 
          position={[0, 0, 25]} 
          profileData={profileData}
          transparent={true}
          fov={25}
          gravity={[0, -30, 0]}
        />
      </div>
      
      <div className="fixed top-24 right-6 z-[100]">
        <div className="relative">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-full scale-150 -z-10" />
          
          <IconButton 
            icon={Star}
            active={isStarred}
            onClick={handleStarProfile}
            size="md"
            animate={true}
            className="shadow-2xl transition-all duration-300 hover:shadow-yellow-400/25"
          />
          
          <div className="absolute top-full mt-2 right-0 bg-black/80 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            {isStarred ? 'Remove from favorites' : 'Add to favorites'}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 z-60 bg-black/70 backdrop-blur-sm rounded-lg p-3 max-w-xs opacity-80 hover:opacity-100 transition-opacity">
      </div>
    </div>
  );
};

export default ProfileView;