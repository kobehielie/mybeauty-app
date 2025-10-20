// Importer les outils React nécessaires
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataLoader } from '../hooks/useDataLoader';
import SEOHead from './SEOHead.jsx';
// Importer le composant UserAvatar pour afficher l'avatar de l'utilisateur
import UserAvatar from './UserAvatar.jsx';

// Composant pour afficher la liste des services disponibles
function Services() {
    // Pour naviguer vers d'autres pages
    const navigate = useNavigate();

    // Variable pour stocker l'utilisateur connecté
    const [utilisateurConnecte, setUtilisateurConnecte] = useState(null);

    // Variable pour ouvrir/fermer le menu utilisateur
    const [menuOuvert, setMenuOuvert] = useState(false);

    // Charger uniquement les données nécessaires (services et prestataires)
    const { data, loading } = useDataLoader(['services', 'prestataires']);

    // useEffect s'exécute quand la page se charge
    useEffect(() => {
        // Vérifier si quelqu'un est connecté
        const utilisateurTexte = localStorage.getItem('utilisateurConnecte');
        if (utilisateurTexte) {
            setUtilisateurConnecte(JSON.parse(utilisateurTexte));
        }
    }, []);

    // Fonction pour se déconnecter
    function seDeconnecter() {
        localStorage.removeItem('utilisateurConnecte');
        setUtilisateurConnecte(null);
        setMenuOuvert(false);
        navigate('/');
    }

    // Afficher un loader pendant le chargement
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-pink-600 mx-auto"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <span className="text-3xl">💅</span>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-4 font-medium">Chargement des services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <SEOHead 
                title="Services de beauté - MyBeauty | Coiffure, Maquillage, Soins en Côte d'Ivoire"
                description="Découvrez tous nos services de beauté : coiffure, maquillage, soins du visage, épilation, manucure, pédicure. Réservez en ligne avec paiement Mobile Money. Prestataires qualifiés à Abidjan."
                keywords="services beauté, coiffure, maquillage, soins visage, épilation, manucure, pédicure, réservation en ligne, Abidjan, Côte d'Ivoire"
                canonical="https://mybeauty.ci/services"
            />
            {/* En-tête avec titre et menu utilisateur */}
            <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 md:p-6 shadow-lg" role="banner">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold cursor-pointer" onClick={() => navigate('/')}>💅 MyBeauty</h1>
                        <p className="text-xs md:text-sm mt-1 hidden sm:block">Services populaires</p>
                    </div>

                    {/* Si utilisateur non connecté, afficher les boutons Connexion/Inscription */}
                    {!utilisateurConnecte ? (
                        <div className="flex gap-2 md:gap-3">
                            <button
                                onClick={() => navigate('/connexion')}
                                className="bg-white text-pink-600 font-semibold px-3 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-lg hover:bg-pink-100 transition shadow-lg"
                            >
                                🔓 <span className="hidden sm:inline">Connexion</span>
                            </button>
                            <button
                                onClick={() => navigate('/inscription')}
                                className="bg-purple-700 text-white font-semibold px-3 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-lg hover:bg-purple-800 transition shadow-lg"
                            >
                                ✨ <span className="hidden sm:inline">Inscription</span>
                            </button>
                        </div>
                    ) : (
                        /* Si utilisateur connecté, afficher son profil */
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

                            {/* Menu déroulant avec les options utilisateur */}
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

            {/* Section principale avec les services */}
            <main className="flex-1 p-4 md:p-8" role="main">
                <div className="max-w-7xl mx-auto">
                    {/* Titre de la section */}
                    <section className="text-center mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
                            🌟 Services Populaires
                        </h2>
                        <p className="text-base md:text-xl text-gray-600 px-4">
                            Découvrez tous nos services beauté et bien-être
                        </p>
                    </section>

                    {/* Grille des services */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8" aria-label="Liste des services disponibles">
                        {(data.services || []).map((service) => (
                            <div key={service.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1">
                                {/* Image du service */}
                                <img
                                    src={service.image || 'https://via.placeholder.com/400'}
                                    alt={service.nom}
                                    className="w-full h-48 object-cover"
                                    loading="lazy"
                                />
                                <div className="p-6">
                                    {/* Titre et description du service */}
                                    <h3 className="font-bold text-2xl text-gray-800 mb-2">{service.nom}</h3>
                                    <p className="text-sm text-gray-600 mb-4">{service.description}</p>

                                    {/* Prix et durée */}
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-3xl font-bold text-pink-600">
                                            {service.prix.toLocaleString()} FCFA
                                        </span>
                                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
                                            ⏱️ {service.duree} min
                                        </span>
                                    </div>

                                    {/* Bouton pour réserver le service */}
                                    <button
                                        onClick={() => {
                                            // Étape 1 : Trouver un prestataire qui propose ce service
                                            const prestataire = data.prestataires.find(p =>
                                                p.catalogue && p.catalogue.includes(service.id)
                                            );

                                            if (prestataire) {
                                                // Étape 2 : Préparer les données de la réservation
                                                const donneesReservation = {
                                                    service: service,
                                                    prestataire: prestataire,
                                                    date: new Date().toLocaleDateString('fr-FR'),
                                                    heure: '10:00'
                                                };

                                                // Étape 3 : Sauvegarder dans la mémoire du navigateur
                                                localStorage.setItem('reservationEnCours', JSON.stringify(donneesReservation));

                                                // Étape 4 : Aller vers la page de paiement
                                                navigate('/paiement', { state: donneesReservation });
                                            } else {
                                                // Si aucun prestataire n'est trouvé
                                                alert('Aucun prestataire disponible pour ce service');
                                            }
                                        }}
                                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition shadow-lg"
                                    >
                                        📅 Réserver
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </main>

            {/* Pied de page */}
            <footer className="bg-gray-800 text-white py-6 mt-12" role="contentinfo">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-sm">© 2025 MyBeauty - Tous droits réservés</p>
                    <p className="text-xs text-gray-400 mt-2">
                        Votre plateforme de réservation beauté en Côte d'Ivoire
                    </p>
                </div>
            </footer>
        </div>
    );
}

// Exporter le composant
export default Services;
