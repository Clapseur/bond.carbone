import React, { useState } from 'react';
import supabase from '../lib/supabase';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tosAccepted) {
      setError('Vous devez accepter les conditions d\'utilisation');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('user_codes')
        .update({
          ...formData,
          is_used: true,
          profile_created_at: new Date().toISOString()
        })
        .eq('code', code);

      if (error) {
        setError('Erreur lors de la création du profil');
        return;
      }

      // Sauvegarder dans localStorage
      localStorage.setItem('carbone_profile', JSON.stringify({ code, ...formData }));
      
      onProfileCreated();
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Configuration du Profil</h1>
        <p className="text-gray-300">Code: <span className="font-mono text-blue-400">{code}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Prénom *
            </label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nom *
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Entreprise
          </label>
          <input
            type="text"
            name="entreprise"
            value={formData.entreprise}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Conditions d'Utilisation</h3>
          <div className="text-sm text-gray-300 space-y-2 max-h-32 overflow-y-auto">
            <p>En créant votre profil Carbone, vous acceptez que :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Vos données sont utilisées à des fins promotionnelles uniquement</li>
              <li>Toute personne ayant scanné votre QR code ou possédant votre numéro de compte peut accéder aux données liées à votre compte</li>
              <li>Vos informations sont stockées de manière sécurisée et ne sont pas partagées avec des tiers non autorisés</li>
              <li>Vous pouvez demander la suppression de vos données à tout moment</li>
              <li>L'utilisation de cette plateforme est soumise aux lois françaises en vigueur</li>
            </ul>
          </div>
          
          <label className="flex items-center mt-4">
            <input
              type="checkbox"
              checked={tosAccepted}
              onChange={(e) => setTosAccepted(e.target.checked)}
              className="mr-3 w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">
              J'accepte les conditions d'utilisation
            </span>
          </label>
        </div>

        {error && (
          <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !tosAccepted}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Création du profil...' : 'Créer mon profil'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;