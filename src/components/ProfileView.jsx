import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const ProfileView = ({ profileData, userSession, setUserSession }) => {
  const [isStarred, setIsStarred] = useState(
    userSession?.starredProfiles?.includes(profileData.code) || false
  );

  const handleStarProfile = () => {
    if (!userSession) return;

    const updatedSession = { ...userSession };
    
    if (isStarred) {
      // Remove from starred
      updatedSession.starredProfiles = updatedSession.starredProfiles.filter(
        id => id !== profileData.code
      );
    } else {
      // Add to starred
      if (!updatedSession.starredProfiles) {
        updatedSession.starredProfiles = [];
      }
      updatedSession.starredProfiles.push(profileData.code);
    }

    localStorage.setItem('carbone_session_token', JSON.stringify(updatedSession));
    setUserSession(updatedSession);
    setIsStarred(!isStarred);
  };

  return (
    <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-2xl mx-4">
      {/* Star button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleStarProfile}
          className={`p-2 rounded-full transition-colors ${
            isStarred 
              ? 'bg-yellow-500 text-white' 
              : 'bg-white/10 text-gray-400 hover:text-yellow-500'
          }`}
        >
          ★
        </button>
      </div>
      
      {/* Profile content */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {profileData.prenom} {profileData.nom}
        </h1>
        <p className="text-gray-300">{profileData.poste} @ {profileData.entreprise}</p>
        <p className="text-gray-400">{profileData.location}</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Bio</h3>
          <p className="text-gray-300">{profileData.bio}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-medium text-white">Email</h4>
            <p className="text-gray-300">{profileData.email}</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-medium text-white">Téléphone</h4>
            <p className="text-gray-300">{profileData.telephone}</p>
          </div>
        </div>
        
        {profileData.linkedin && (
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-medium text-white">LinkedIn</h4>
            <a href={profileData.linkedin} className="text-blue-400 hover:underline">
              {profileData.linkedin}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;