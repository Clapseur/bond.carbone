import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ConnectionForm = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

      if (data.is_used && data.prenom) {
        navigate(`/${code.toUpperCase()}`);
        return;
      }

      navigate(`/${code.toUpperCase()}`);
    } catch (error) {
      console.error('Erreur de connexion détaillée:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-3 z-40"
      style={{
        paddingTop: '60px',
        paddingBottom: '20px'
      }}
    >
      <div 
        className="mobile-form glassmorphic-card"
        style={{
          width: '100%',
          margin: '0 auto'
        }}
      >
        <div className="text-center mb-4">
          <h1 
            className="font-bold text-white mb-2 mobile-text"
            style={{ fontSize: '16px' }}
          >
            Connexion Carbone
          </h1>
          <p 
            className="text-gray-300 mobile-text"
            style={{ fontSize: '11px', lineHeight: '1.3' }}
          >
            Entrez votre code d'accès pour continuer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label 
              htmlFor="code" 
              className="block font-medium text-gray-300 mb-2 mobile-text"
              style={{ fontSize: '11px' }}
            >
              Code d'accès
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={5}
              className="mobile-input glassmorphic-card w-full text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/50 text-center font-mono tracking-widest transition-all duration-300"
              style={{
                fontSize: '14px',
                padding: '10px 8px',
                letterSpacing: '3px'
              }}
              placeholder="XXXXX"
              disabled={loading}
            />
          </div>

          {error && (
            <div 
              className="text-red-300 text-center mobile-text"
              style={{
                fontSize: '10px',
                padding: '8px',
                color: 'red',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!code || code.length !== 5 || loading}
            className="glassmorphic-card w-full text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mobile-text"
            style={{
              fontSize: '12px',
              padding: '10px 12px'
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConnectionForm;