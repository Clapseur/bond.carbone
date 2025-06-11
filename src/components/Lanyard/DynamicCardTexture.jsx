import { useEffect, useRef } from 'react';
import { CanvasTexture } from 'three';

const DynamicCardTexture = ({ profileData, onTextureReady }) => {
  const canvasRef = useRef();

  useEffect(() => {
    if (!profileData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size (should match your card dimensions)
    canvas.width = 512;
    canvas.height = 320;
    
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#2563eb');
    gradient.addColorStop(1, '#1e40af');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add border
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    
    // Set text properties
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    
    // Name (large)
    ctx.font = 'bold 32px Arial';
    ctx.fillText(`${profileData.prenom} ${profileData.nom}`, canvas.width / 2, 80);
    
    // Company and position
    ctx.font = '20px Arial';
    ctx.fillStyle = '#e2e8f0';
    if (profileData.entreprise) {
      ctx.fillText(profileData.entreprise, canvas.width / 2, 120);
    }
    
    // Email
    ctx.font = '16px Arial';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(profileData.email, canvas.width / 2, 160);
    
    // Phone
    if (profileData.telephone) {
      ctx.fillText(profileData.telephone, canvas.width / 2, 185);
    }
    
    // Code at bottom
    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#60a5fa';
    ctx.fillText(profileData.code, canvas.width / 2, 280);
    
    // Create texture and notify parent
    const texture = new CanvasTexture(canvas);
    texture.needsUpdate = true;
    onTextureReady(texture);
    
  }, [profileData, onTextureReady]);

  return <canvas ref={canvasRef} style={{ display: 'none' }} />;
};

export default DynamicCardTexture;