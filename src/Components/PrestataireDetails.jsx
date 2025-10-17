// Importer les outils React nécessaires
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Importer le fichier qui charge nos données
import dataLoader from '../data/dataLoader';
// Importer le composant Avis
import Avis from './Avis';
// Importer le composant UserAvatar pour afficher l'avatar de l'utilisateur
import UserAvatar from './UserAvatar.jsx';

// Composant qui affiche les détails d'un prestataire
function PrestataireDetails() {
    // Récupérer l'ID du prestataire depuis l'URL
    const { id } = useParams();
    
    // Pour naviguer vers d'autres pages
    const navigate = useNavigate();
    
    // Variable pour stocker l'utilisateur connecté
    const [utilisateurConnecte, setUtilisateurConnecte] = useState(null);
    
    // Variable pour ouvrir/fermer le menu
    const [menuOuvert, setMenuOuvert] = useState(false);
    
    // Variable pour stocker les infos du prestataire
    const [prestataire, setPrestataire] = useState(null);
    
    // Variable pour stocker la liste des services du prestataire
    const [services, setServices] = useState([]);
    
    // Variable pour stocker les avis des clients
    const [avis, setAvis] = useState([]);
    
    // Variable pour la note moyenne du prestataire
    const [moyenneNote, setMoyenneNote] = useState(0);
    
    // Charger toutes les données depuis le fichier JSON
    const data = dataLoader.loadAll();
    
    // useEffect s'exécute quand la page se charge
    useEffect(() => {
        // Étape 1 : Trouver le prestataire qui correspond à l'ID dans l'URL
        const idPrestataire = parseInt(id);
        const prestataireTrouve = data.prestataires.find(p => p.id === idPrestataire);
        setPrestataire(prestataireTrouve);

        // Étape 2 : Récupérer les services proposés par ce prestataire
        if (prestataireTrouve && prestataireTrouve.catalogue) {
            const servicesPrestataire = data.services.filter(s => 
                prestataireTrouve.catalogue.includes(s.id)
            );
            setServices(servicesPrestataire);
        }

        // Étape 3 : Charger les avis pour ce prestataire
        if (prestataireTrouve) {
            // Récupérer les avis depuis le fichier JSON
            const avisDuFichier = data.avis.filter(a => a.prestataireId === prestataireTrouve.id);
            
            // Récupérer les avis depuis la mémoire du navigateur
            const avisMemoire = JSON.parse(localStorage.getItem('avis') || '[]');
            const avisMemoirePrestataire = avisMemoire.filter(a => a.prestataireId === prestataireTrouve.id);
            
            // Combiner tous les avis
            const tousLesAvis = [...avisDuFichier, ...avisMemoirePrestataire];
            setAvis(tousLesAvis);
            
            // Calculer la note moyenne
            if (tousLesAvis.length > 0) {
                let total = 0;
                for (let i = 0; i < tousLesAvis.length; i++) {
                    total = total + tousLesAvis[i].note;
                }
                const moyenne = total / tousLesAvis.length;
                setMoyenneNote(moyenne);
            }
        }

        // Étape 4 : Vérifier si un utilisateur est connecté
        const utilisateurTexte = localStorage.getItem('utilisateurConnecte');
        if (utilisateurTexte) {
            setUtilisateurConnecte(JSON.parse(utilisateurTexte));
        }
    }, [id]);

    // Fonction pour se déconnecter
    function seDeconnecter() {
        localStorage.removeItem('utilisateurConnecte');
        setUtilisateurConnecte(null);
        setMenuOuvert(false);
        navigate('/');
    }

    if (!prestataire) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold cursor-pointer" onClick={() => navigate('/')}>💅 MyBeauty</h1>
                        <p className="text-sm mt-1">Détails du prestataire</p>
                    </div>
                    
                    {/* Si utilisateur non connecté */}
                    {!utilisateurConnecte ? (
                        <div className="flex gap-3">
                            <button 
                                onClick={() => navigate('/connexion')} 
                                className="bg-white text-pink-600 font-semibold px-6 py-3 rounded-lg hover:bg-pink-100 transition shadow-lg"
                            >
                                🔓 Connexion
                            </button>
                            <button 
                                onClick={() => navigate('/inscription')} 
                                className="bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-800 transition shadow-lg"
                            >
                                ✨ Inscription
                            </button>
                        </div>
                    ) : (
                        /* Si utilisateur connecté */
                        <div className="relative">
                            <button 
                                onClick={() => setMenuOuvert(!menuOuvert)}
                                className="flex items-center gap-3 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-3 rounded-lg transition"
                            >
                                <UserAvatar user={utilisateurConnecte} size="md" />
                                <div className="text-left">
                                    <p className="font-semibold text-sm">{utilisateurConnecte.prenom} {utilisateurConnecte.nom}</p>
                                    <p className="text-xs opacity-90">{utilisateurConnecte.role}</p>
                                </div>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Menu déroulant */}
                            {menuOuvert && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl py-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-200">
                                        <p className="text-sm font-semibold text-gray-800">
                                            {utilisateurConnecte.prenom} {utilisateurConnecte.nom}
                                        </p>
                                        <p className="text-xs text-gray-500">{utilisateurConnecte.email}</p>
                                        <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                                            {utilisateurConnecte.role === 'client' ? '👤 Client' : '💼 Prestataire'}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/profil')}
                                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                    >
                                        👤 Mon profil
                                    </button>
                                    {utilisateurConnecte.role === 'prestataire' && (
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                                            📋 Mes services
                                        </a>
                                    )}
                                    {utilisateurConnecte.role === 'client' && (
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                                            📅 Mes réservations
                                        </a>
                                    )}
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                                        ⚙️ Paramètres
                                    </a>
                                    <div className="border-t border-gray-200 mt-2"></div>
                                    <button 
                                        onClick={seDeconnecter}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                                    >
                                        <img src="/images/deconnexion.png" alt="Déconnexion" className="w-4 h-4" />
                                        Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Bouton retour */}
                    <button 
                        onClick={() => navigate('/')}
                        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-pink-600 transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Retour à l'accueil
                    </button>

                    {/* Carte prestataire */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                        <div className="md:flex">
                            <div className="md:w-1/3">
                                <img 
                                    src={prestataire.image || 'https://via.placeholder.com/400'} 
                                    alt={prestataire.nom}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="md:w-2/3 p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <h1 className="text-4xl font-bold text-gray-800">
                                        {prestataire.prenom} {prestataire.nom}
                                    </h1>
                                    <span className="bg-purple-100 text-purple-600 px-4 py-1 rounded-full text-sm font-semibold">
                                        💼 {prestataire.specialite}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">📍 Localisation</p>
                                        <p className="text-lg text-gray-800">{prestataire.quartier}, {prestataire.ville}</p>
                                        <p className="text-sm text-gray-500">{prestataire.adresse}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">📱 Contact</p>
                                        <p className="text-lg text-gray-800">{prestataire.telephone}</p>
                                        <p className="text-sm text-gray-500">Mobile Money: {prestataire.mobileMonkey}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-sm text-gray-600 font-medium mb-2">⏰ Horaires</p>
                                    <p className="text-lg text-gray-800">
                                        {prestataire.disponibilite24h ? (
                                            <span className="text-green-600 font-semibold">🌟 Disponible 24h/24</span>
                                        ) : (
                                            <>
                                                <span className="font-semibold">{prestataire.joursDisponibles.join(', ')}</span>
                                                <br />
                                                <span className="text-gray-600">{prestataire.heureOuverture} - {prestataire.heureFermeture}</span>
                                            </>
                                        )}
                                    </p>
                                </div>

                                <div className="flex gap-4 mb-6">
                                    {prestataire.serviceDomicile && (
                                        <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold">
                                            🏠 Service à domicile
                                        </span>
                                    )}
                                    {prestataire.serviceSalon && (
                                        <span className="bg-green-100 text-green-600 px-4 py-2 rounded-lg text-sm font-semibold">
                                            🏢 Service au salon
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-3xl">⭐</span>
                                        <span className="text-2xl font-bold text-gray-800">
                                            {moyenneNote > 0 ? moyenneNote.toFixed(1) : '0.0'}
                                        </span>
                                        <span className="text-gray-500">
                                            ({avis.length} avis)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Services du prestataire */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">
                            🌟 Services proposés ({services.length})
                        </h2>

                        {services.length === 0 ? (
                            <div className="bg-white rounded-xl p-12 text-center">
                                <p className="text-gray-500 text-lg">Aucun service disponible pour le moment</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {services.map((service) => (
                                    <div key={service.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1">
                                        <img 
                                            src={service.image || 'https://via.placeholder.com/400'} 
                                            alt={service.nom}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-6">
                                            <h3 className="font-bold text-2xl text-gray-800 mb-2">{service.nom}</h3>
                                            <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-3xl font-bold text-pink-600">
                                                    {service.prix.toLocaleString()} FCFA
                                                </span>
                                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
                                                    ⏱️ {service.duree} min
                                                </span>
                                            </div>
                                            <div className="flex gap-3">
                                                <button 
                                                    onClick={() => {
                                                        // Préparer les données de la réservation
                                                        const donneesReservation = {
                                                            service: service,
                                                            prestataire: prestataire,
                                                            date: new Date().toLocaleDateString('fr-FR'),
                                                            heure: '10:00'
                                                        };
                                                        
                                                        // Sauvegarder dans la mémoire du navigateur
                                                        const texte = JSON.stringify(donneesReservation);
                                                        localStorage.setItem('reservationEnCours', texte);
                                                        
                                                        // Aller vers la page de la carte
                                                        navigate('/localisation', { 
                                                            state: donneesReservation
                                                        });
                                                    }}
                                                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition shadow-lg flex items-center justify-center gap-2"
                                                >
                                                    🗺️ Voir et réserver
                                                </button>
                                                
                                                <button 
                                                    onClick={() => {
                                                        // Sauvegarder les infos du prestataire pour le chat
                                                        const prestataireInfo = {
                                                            id: prestataire.id,
                                                            nom: prestataire.nom,
                                                            prenom: prestataire.prenom,
                                                            specialite: prestataire.specialite,
                                                            image: prestataire.image
                                                        };
                                                        localStorage.setItem('prestatairePourChat', JSON.stringify(prestataireInfo));
                                                        
                                                        // Aller au chat
                                                        navigate('/chat');
                                                    }}
                                                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition shadow-lg flex items-center justify-center gap-2"
                                                >
                                                    <img src="/images/chat-a-bulles.png" alt="Chat" className="w-5 h-5" />
                                                    Chat
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Section Avis avec le composant dédié */}
                    <div className="mt-12">
                        <Avis prestataireId={parseInt(id)} />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6 mt-12">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-sm">© 2025 MyBeauty - Tous droits réservés</p>
                    <p className="text-xs text-gray-400 mt-2">
                        Votre plateforme de réservation beauté en Côte d'Ivoire
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default PrestataireDetails;
