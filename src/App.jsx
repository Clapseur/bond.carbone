import React, { useState } from 'react';
import Header from './components/Header.jsx';
import ConnectionForm from './components/ConnectionForm.jsx';
import ProfileSetup from './components/ProfileSetup.jsx';
import ProfileView from './components/ProfileView.jsx';
import Beams from './assets/components/Beams.jsx';

function App() {
  const [currentView, setCurrentView] = useState('connection');
  const [userCode, setUserCode] = useState('');

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Beams Background - lowest layer */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Beams
          beamWidth={1.5}
          beamHeight={12}
          beamNumber={8}
          lightColor="#ffffff"
          speed={1.5}
          noiseIntensity={1.2}
          scale={0.15}
          rotation={35}
        />
      </div>
      
      {/* Header - above beams */}
      <Header />
      
      {/* Content Layer - highest interactive layer */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center pt-20">
        {currentView === 'connection' && (
          <ConnectionForm 
            onCodeValidated={(code) => {
              setUserCode(code);
              setCurrentView('setup');
            }}
          />
        )}
        {currentView === 'setup' && (
          <ProfileSetup 
            code={userCode}
            onProfileCreated={() => setCurrentView('profile')}
          />
        )}
        {currentView === 'profile' && (
          <ProfileView code={userCode} />
        )}
      </div>
    </div>
  );
}

export default App;