import React, { useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const ProfileView = ({ code }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [code]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_codes')
        .select('*')
        .eq('code', code)
        .single();

      if (!error && data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-md mx-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-md mx-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Profil non trouvé</h2>
          <p className="text-gray-300">Ce code n'existe pas ou n'a pas été configuré.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-2xl mx-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Profil Carbone</h1>
        <p className="text-blue-400 font-mono text-lg">{code}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Prénom</label>
            <p className="text-white text-lg">{profile.prenom}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nom</label>
            <p className="text-white text-lg">{profile.nom}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <p className="text-white text-lg">{profile.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          {profile.telephone && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Téléphone</label>
              <p className="text-white text-lg">{profile.telephone}</p>
            </div>
          )}
          
          {profile.entreprise && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Entreprise</label>
              <p className="text-white text-lg">{profile.entreprise}</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Créé le</label>
            <p className="text-white text-lg">
              {new Date(profile.profile_created_at || profile.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
        <p className="text-center text-gray-400 text-sm">
          Partagez ce lien pour que d'autres puissent voir votre profil :
        </p>
        <p className="text-center text-blue-400 font-mono mt-2">
          {window.location.origin}/{code}
        </p>
      </div>
    </div>
  );
};

export default ProfileView;