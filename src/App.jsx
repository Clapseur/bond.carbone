// eslint-disable-next-line no-unused-vars
import { useState } from 'react'
import Beams from './assets/components/Beams.jsx';

function App() {
  return (
    <div className='w-full h-full'>
      <Beams
        beamWidth={2}
        beamHeight={15}
        beamNumber={12}
        lightColor="#ffffff"
        speed={2}
        noiseIntensity={1.75}
        scale={0.2}
        rotation={35}
      />
    </div>
  );
}

export default App;