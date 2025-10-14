// Importer les outils React nécessaires
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Importer le composant UserAvatar pour afficher l'avatar de l'utilisateur
import UserAvatar from './UserAvatar.jsx';

// Composant pour afficher le profil de l'utilisateur
function Profil() {
    // Pour naviguer vers d'autres pages
    const navigate = useNavigate();

    // Variable pour stocker les informations de l'utilisateur connecté
    const [utilisateur, setUtilisateur] = useState(null);

    // useEffect s'exécute quand la page se charge
    useEffect(() => {
        // Étape 1 : Récupérer les données de l'utilisateur depuis la mémoire du navigateur
        const utilisateurTexte = localStorage.getItem('utilisateurConnecte');

        if (utilisateurTexte) {
            // Étape 2 : Convertir le texte en objet JavaScript
            setUtilisateur(JSON.parse(utilisateurTexte));
        } else {
            // Étape 3 : Si pas d'utilisateur connecté, rediriger vers la connexion
            navigate('/connexion');
        }
    }, [navigate]);

    // Fonction pour se déconnecter
    function seDeconnecter() {
        // Étape 1 : Supprimer l'utilisateur de la mémoire du navigateur
        localStorage.removeItem('utilisateurConnecte');

        // Étape 2 : Rediriger vers la page d'accueil
        navigate('/');
    }

    // Si les données ne sont pas encore chargées, afficher un loader
    if (!utilisateur) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* En-tête avec titre et bouton retour */}
            <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>💅 MyBeauty</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-white text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-100 transition"
                    >
                        ← Retour
                    </button>
                </div>
            </header>

            <div className="max-w-5xl mx-auto p-8">
                {/* Carte de profil avec photo et informations */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    {/* Dégradé coloré en haut de la carte */}
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-32"></div>

                    <div className="relative px-8 pb-8">
                        {/* Photo de profil et informations principales */}
                        <div className="flex items-end -mt-16 mb-6">
                            <UserAvatar user={utilisateur} size="2xl" className="shadow-lg" />
                            <div className="ml-6 mb-2">
                                <h2 className="text-3xl font-bold text-gray-800">
                                    {utilisateur.prenom} {utilisateur.nom}
                                </h2>
                                <span className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-semibold ${
                                    utilisateur.role === 'client'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-purple-100 text-purple-600'
                                }`}>
                                    {utilisateur.role === 'client' ? '👤 Client' : '💼 Prestataire'}
                                </span>
                            </div>
                        </div>

                        {/* Informations de contact */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Email</label>
                                <p className="text-lg text-gray-800 mt-1">📧 {utilisateur.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Téléphone</label>
                                <p className="text-lg text-gray-800 mt-1">📱 {utilisateur.telephone || 'Non renseigné'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Boutons d'action selon le rôle de l'utilisateur */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   
                    {/* Bouton pour les réservations (seulement pour les clients) */}
                    {utilisateur.role === 'client' && (
                        <button
                            onClick={() => navigate('/dashboard-client')}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-left"
                        >
                            <div className="text-3xl mb-3">📅</div>
                            <h3 className="font-bold text-lg mb-1">Mes réservations</h3>
                            <p className="text-sm text-gray-600">Consultez vos rendez-vous et historique</p>
                        </button>
                    )}

                    {/* Bouton pour les services (seulement pour les prestataires) */}
                    {utilisateur.role === 'prestataire' && (
                        <button 
                            onClick={() => navigate('/mes-services')}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-left"
                        >
                            <div className="text-3xl mb-3">📋</div>
                            <h3 className="font-bold text-lg mb-1">Mes services</h3>
                            <p className="text-sm text-gray-600">Gérez votre catalogue</p>
                        </button>
                    )}

                    {/* Bouton de déconnexion (pour tous les utilisateurs) */}
                    <button
                        onClick={seDeconnecter}
                        className="bg-red-50 border-2 border-red-200 p-6 rounded-xl hover:bg-red-100 transition text-left"
                    >
                        <div className="text-3xl mb-3"><img src="/images/deconnexion.png" alt="Déconnexion" className="w-12 h-12" /></div>
                        <h3 className="font-bold text-lg mb-1 text-red-600">Déconnexion</h3>
                        <p className="text-sm text-gray-600">Se déconnecter du compte</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

// Exporter le composant
export default Profil;
