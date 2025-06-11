import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import Stepper, { Step } from './Stepper';
import Beams from './Beams';

const ProfileSetup = ({ code, onProfileCreated }) => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    entreprise: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tosAccepted, setTosAccepted] = useState(false);
  const [hasNoCompany, setHasNoCompany] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCompanyCheckbox = (e) => {
    setHasNoCompany(e.target.checked);
    if (e.target.checked) {
      setFormData({
        ...formData,
        entreprise: ''
      });
    }
  };

  const handleFinalStepCompleted = async () => {
    if (!tosAccepted) {
      setError('Vous devez accepter les conditions d\'utilisation');
      return;
    }

    setLoading(true);
    setError('');

    // Add validation before creating profileData
    if (!formData.prenom || !formData.nom || !formData.email) {
      setError('Veuillez remplir tous les champs obligatoires');
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Format d\'email invalide');
      setLoading(false);
      return;
    }

    try {
      // First, verify the code exists
      const { data: existingCode, error: checkError } = await supabase
        .from('user_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();

      if (checkError || !existingCode) {
        console.error('Code verification failed:', checkError);
        setError('Code invalide ou inexistant');
        setLoading(false);
        return;
      }

      // Check if code is already used
      if (existingCode.is_used && existingCode.prenom) {
        setError('Ce code a déjà été utilisé');
        setLoading(false);
        return;
      }

      const profileData = {
        prenom: formData.prenom.trim(),
        nom: formData.nom.trim(),
        email: formData.email.trim().toLowerCase(),
        telephone: formData.telephone.trim(),
        entreprise: hasNoCompany ? null : formData.entreprise.trim(),
        is_used: true,
        profile_created_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('user_codes')
        .update(profileData)
        .eq('code', code.toUpperCase());

      if (updateError) {
        console.error('Database update error:', updateError);
        
        // Handle specific database errors
        if (updateError.code === '23505') {
          setError('Cette adresse email est déjà utilisée');
        } else if (updateError.code === '23502') {
          setError('Certains champs obligatoires sont manquants');
        } else if (updateError.message.includes('permission')) {
          setError('Permissions insuffisantes pour cette opération');
        } else {
          setError(`Erreur de base de données: ${updateError.message}`);
        }
        setLoading(false);
        return;
      }

      // Create session token with 1 day expiration
      const sessionToken = {
        code: code,
        profileData: profileData,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 1 day
      };

      // Store in localStorage
      localStorage.setItem('carbone_session_token', JSON.stringify(sessionToken));

      onProfileCreated({ code, ...profileData });
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Erreur inattendue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Add Beams background */}
      <Beams rotation={25} className="absolute inset-0 z-0" />
      
      <div className="relative z-10 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Configuration du Profil</h1>
          <p className="text-gray-300">Code: <span className="font-mono text-blue-400">{code}</span></p>
        </div>

        {error && (
          <div className="mb-6 text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {error}
          </div>
        )}

        {/* Well-styled container for the stepper */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-2xl">
          <Stepper
            initialStep={1}
            onStepChange={(step) => {
              console.log(step);
            }}
            onFinalStepCompleted={handleFinalStepCompleted}
            backButtonText="Précédent"
            nextButtonText="Suivant"
            disableStepIndicators={false}
          >
            <Step>
              <div className="w-full">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Informations Personnelles</h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <div className="flex-1">
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      placeholder="Prénom"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Nom"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </Step>
            
            <Step>
              <div className="w-full">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Contact</h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <div className="flex-1">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="Téléphone"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </Step>
            
            <Step>
              <div className="w-full">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Entreprise</h2>
                
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    id="noCompany"
                    checked={hasNoCompany}
                    onChange={handleCompanyCheckbox}
                    className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="noCompany" className="text-sm text-gray-300">
                    Je n'ai pas d'entreprise
                  </label>
                </div>
                
                <div className={`w-full ${hasNoCompany ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input
                    type="text"
                    name="entreprise"
                    value={formData.entreprise}
                    onChange={handleChange}
                    placeholder="Nom de l'entreprise"
                    disabled={hasNoCompany}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </Step>
            
            <Step>
              <div className="w-full">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Finalisation</h2>
                <div className="flex items-center justify-center space-x-3 mt-4">
                  <input
                    type="checkbox"
                    id="tos"
                    checked={tosAccepted}
                    onChange={(e) => setTosAccepted(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="tos" className="text-sm text-gray-300">
                    J'accepte les conditions d'utilisation
                  </label>
                </div>
              </div>
            </Step>
          </Stepper>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
