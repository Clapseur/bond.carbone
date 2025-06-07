import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const ConnectionForm = ({ onCodeValidated }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 5) {
      setError('Le code doit contenir exactement 5 caractères');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('user_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();

      if (error || !data) {
        setError('Code invalide. Veuillez vérifier et réessayer.');
        return;
      }

      // Vérifier si le profil existe déjà
      if (data.is_used && data.prenom) {
        // Rediriger vers la vue du profil
        window.location.href = `/${code.toUpperCase()}`;
        return;
      }

      onCodeValidated(code.toUpperCase());
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-30 glassmorphic-card p-8 w-full max-w-md mx-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Connexion Carbone</h1>
        <p className="text-gray-300">Entrez votre code d'accès pour continuer</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
            Code d'accès
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={5}
            className="w-full px-4 py-3 bg-white/5 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 text-center text-2xl font-mono tracking-widest backdrop-blur-md transition-all duration-300"
            placeholder="XXXXX"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="text-red-300 text-sm text-center bg-red-500/20 border border-red-400/30 rounded-xl p-3 backdrop-blur-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || code.length !== 5}
          className="w-full bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed backdrop-blur-md border border-white/20 hover:border-white/40 disabled:border-white/10"
        >
          {loading ? 'Vérification...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};

export default ConnectionForm;