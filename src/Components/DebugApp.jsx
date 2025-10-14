// Composant de débogage temporaire pour diagnostiquer les problèmes
import React from 'react';

function DebugApp() {
  const [state, setState] = React.useState('loading');

  React.useEffect(() => {
    console.log('🔍 DebugApp: Démarrage du diagnostic...');

    // Vérifier les données localStorage
    const user = localStorage.getItem('utilisateurConnecte');
    console.log('👤 Utilisateur connecté:', user);

    // Vérifier les réservations
    const reservations = localStorage.getItem('reservations');
    console.log('📋 Réservations:', reservations);

    setState('ready');
  }, []);

  if (state === 'loading') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f0f0f0',
        color: '#333',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>🔍 Diagnostic en cours...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      background: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '30px' }}>
        🔍 Diagnostic de l'Application MyBeauty
      </h1>

      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#333', marginBottom: '15px' }}>📊 État des Données</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
            <h3 style={{ color: '#007bff', marginBottom: '10px' }}>👤 Utilisateur Connecté</h3>
            <pre style={{ background: '#fff', padding: '10px', borderRadius: '3px', fontSize: '12px' }}>
              {localStorage.getItem('utilisateurConnecte') || 'AUCUN'}
            </pre>
          </div>

          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
            <h3 style={{ color: '#007bff', marginBottom: '10px' }}>📋 Réservations</h3>
            <pre style={{ background: '#fff', padding: '10px', borderRadius: '3px', fontSize: '12px' }}>
              {localStorage.getItem('reservations') || 'AUCUNE'}
            </pre>
          </div>

          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
            <h3 style={{ color: '#007bff', marginBottom: '10px' }}>💳 Paiements</h3>
            <pre style={{ background: '#fff', padding: '10px', borderRadius: '3px', fontSize: '12px' }}>
              {localStorage.getItem('paiements') || 'AUCUN'}
            </pre>
          </div>
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#333', marginBottom: '15px' }}>🚀 Actions de Test</h2>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🏠 Accueil
          </button>

          <button
            onClick={() => window.location.href = '/connexion'}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔐 Connexion
          </button>

          <button
            onClick={() => window.location.href = '/services'}
            style={{
              background: '#ffc107',
              color: 'black',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🌟 Services
          </button>

          <button
            onClick={() => window.location.href = '/dashboard-client'}
            style={{
              background: '#17a2b8',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            📱 Dashboard Client
          </button>
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#333', marginBottom: '15px' }}>🔧 Utilitaires</h2>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              localStorage.clear();
              alert('Données supprimées ! Rechargez la page.');
            }}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🗑️ Effacer Données
          </button>

          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔄 Recharger
          </button>
        </div>
      </div>

      <div style={{
        background: '#e9ecef',
        padding: '15px',
        borderRadius: '5px',
        fontSize: '14px',
        color: '#6c757d'
      }}>
        <p><strong>💡 Conseils :</strong></p>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Ouvrez la console (F12) pour voir les erreurs JavaScript</li>
          <li>Vérifiez que le serveur fonctionne sur http://localhost:5175/</li>
          <li>Essayez de vider le cache du navigateur si nécessaire</li>
        </ul>
      </div>
    </div>
  );
}

export default DebugApp;
