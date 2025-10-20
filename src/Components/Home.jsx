// Importer les outils React nécessaires
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Importer le hook optimisé pour charger les données
import { useDataLoader } from '../hooks/useDataLoader';
import SEOHead from './SEOHead.jsx';
// Importer le composant UserAvatar pour afficher l'avatar de l'utilisateur
import UserAvatar from './UserAvatar.jsx';

// Composant pour la page d'accueil
function Home() {
    // Charger uniquement les données nécessaires pour la page d'accueil
    const { data, loading } = useDataLoader(['services', 'prestataires', 'avis', 'clients']);
    
    // Pour naviguer vers d'autres pages
    const navigate = useNavigate();
    
    // Variable pour stocker l'utilisateur connecté
    const [utilisateurConnecte, setUtilisateurConnecte] = useState(null);
    
    // Variable pour ouvrir/fermer le menu utilisateur
    const [menuOuvert, setMenuOuvert] = useState(false);
    
    // Variables pour la barre de recherche
    const [termeRecherche, setTermeRecherche] = useState(''); // Terme de recherche saisi
    const [resultatsRecherche, setResultatsRecherche] = useState([]); // Résultats de la recherche

    // useEffect s'exécute quand la page se charge
    useEffect(() => {
        // Vérifier si quelqu'un est connecté
        const utilisateurTexte = localStorage.getItem('utilisateurConnecte');
        if (utilisateurTexte) {
            setUtilisateurConnecte(JSON.parse(utilisateurTexte));
        }
    }, []);

    // Fonction pour aller à la page d'inscription
    function allerAInscription() {
        navigate('/inscription');
    }

    // Fonction pour aller à la page de connexion
    function allerAConnexion() {
        navigate('/connexion');
    }

    // Fonction pour se déconnecter
    function seDeconnecter() {
        localStorage.removeItem('utilisateurConnecte');
        setUtilisateurConnecte(null);
        setMenuOuvert(false);
    }

    // Fonction pour rechercher des services ou prestataires (optimisée avec useMemo)
    const effectuerRecherche = useMemo(() => {
        return (terme) => {
            if (!terme.trim() || !data.services || !data.prestataires) {
                setResultatsRecherche([]);
                return;
            }

            const resultats = [];
            const termeLower = terme.toLowerCase();

            // Rechercher dans les services
            data.services.forEach(service => {
                if (service.nom.toLowerCase().includes(termeLower) || 
                    service.description.toLowerCase().includes(termeLower)) {
                    resultats.push({
                        type: 'service',
                        id: service.id,
                        nom: service.nom,
                        description: service.description,
                        prix: service.prix,
                        image: service.image
                    });
                }
            });

            // Rechercher dans les prestataires
            data.prestataires.forEach(prestataire => {
                if (prestataire.nom.toLowerCase().includes(termeLower) || 
                    prestataire.prenom.toLowerCase().includes(termeLower) ||
                    prestataire.specialite.toLowerCase().includes(termeLower) ||
                    prestataire.quartier.toLowerCase().includes(termeLower)) {
                    resultats.push({
                        type: 'prestataire',
                        id: prestataire.id,
                        nom: `${prestataire.prenom} ${prestataire.nom}`,
                        specialite: prestataire.specialite,
                        quartier: prestataire.quartier,
                        image: prestataire.image
                    });
                }
            });

            setResultatsRecherche(resultats.slice(0, 6)); // Limiter à 6 résultats
        };
    }, [data.services, data.prestataires]);

    // Afficher un loader pendant le chargement initial
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
                    <p className="text-gray-600 mt-4 font-medium">Chargement de MyBeauty...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <SEOHead 
                title="MyBeauty - Services de beauté en Côte d'Ivoire | Réservation en ligne"
                description="Découvrez MyBeauty, la plateforme de réservation de services de beauté en Côte d'Ivoire. Trouvez des coiffeurs, esthéticiennes, maquilleurs près de chez vous. Réservation en ligne, paiement Mobile Money sécurisé."
                keywords="beauté, coiffure, esthétique, réservation, Côte d'Ivoire, Abidjan, Mobile Money, prestataires beauté, coiffeur, maquillage, soins, épilation, Koumassi, Cocody, Marcory, Plateau"
                canonical="https://mybeauty.ci/"
            />
            <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 md:p-6 shadow-lg" role="banner">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold">MyBeauty</h1>
                        <p className="text-xs md:text-sm mt-1 hidden sm:block">Votre plateforme de réservation beauté</p>
                    </div>
                    
                    {/* Si utilisateur non connecté, afficher les boutons Connexion/Inscription */}
                    {!utilisateurConnecte ? (
                        <div className="flex gap-2 md:gap-3">
                            <button 
                                onClick={allerAConnexion} 
                                className="bg-white text-pink-600 font-semibold px-3 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-lg hover:bg-pink-100 transition shadow-lg"
                            >
                                Connexion
                            </button>
                            <button 
                                onClick={allerAInscription} 
                                className="bg-purple-700 text-white font-semibold px-3 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-lg hover:bg-purple-800 transition shadow-lg"
                            >
                                Inscription
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
                                            {utilisateurConnecte.role === 'client' ? 'Client' : 'Prestataire'}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/profil')}
                                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                    >
                                        👤 Mon profil
                                    </button>
                                    
                                    {/* Dashboard selon le rôle */}
                                    {utilisateurConnecte.role === 'prestataire' && (
                                        <>
                                            <button
                                                onClick={() => navigate('/dashboard-prestataire')}
                                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                            >
                                                📊 Mon Dashboard
                                            </button>
                                            <button
                                                onClick={() => navigate('/mes-services')}
                                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                            >
                                                📋 Mes services
                                            </button>
                                            <button
                                                onClick={() => navigate('/mes-clients')}
                                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                            >
                                                👥 Mes clients
                                            </button>
                                        </>
                                    )}
                                    
                                    {utilisateurConnecte.role === 'client' && (
                                        <>
                                            <button
                                                onClick={() => navigate('/dashboard-client')}
                                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                            >
                                                📊 Mon Dashboard
                                            </button>
                                            <button
                                                onClick={() => navigate('/services')}
                                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                            >
                                                🔍 Rechercher des services
                                            </button>
                                        </>
                                    )}
                                   
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
            
            <main className="flex-1 p-4 md:p-8" role="main">
                <div className="max-w-7xl mx-auto">
                    <section className="text-center mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
                            Bienvenue sur MyBeauty
                        </h2>
                        <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 px-4">
                            Trouvez les meilleurs professionnels de la beauté près de chez vous
                        </p>
                        
                        {/* Barre de recherche */}
                        <div className="max-w-2xl mx-auto mb-6 md:mb-8 px-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={termeRecherche}
                                    onChange={(e) => {
                                        setTermeRecherche(e.target.value);
                                        effectuerRecherche(e.target.value);
                                    }}
                                    className="w-full px-4 md:px-6 py-3 md:py-4 text-base md:text-lg border-2 border-gray-300 rounded-full focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-lg"
                                />
                                <button className="absolute right-2 top-2 bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Résultats de recherche */}
                            {resultatsRecherche.length > 0 && (
                                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                                    {resultatsRecherche.map((resultat, index) => (
                                        <div
                                            key={index}
                                            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                            onClick={() => {
                                                if (resultat.type === 'prestataire') {
                                                    navigate(`/prestataire/${resultat.id}`);
                                                } else {
                                                    navigate('/services');
                                                }
                                            }}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {resultat.type === 'service' ? '💅' : '👤'}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-800">{resultat.nom}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {resultat.type === 'service' ? resultat.description : `${resultat.specialite} - ${resultat.quartier}`}
                                                    </p>
                                                    {resultat.prix && (
                                                        <p className="text-sm text-pink-600 font-medium">
                                                            {resultat.prix.toLocaleString()} FCFA
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Statistiques */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 px-4">
                        <h3 className="sr-only">Statistiques de la plateforme</h3>
                        <div 
                            onClick={() => {
                                // Si l'utilisateur est un prestataire, aller vers ses clients
                                if (utilisateurConnecte && utilisateurConnecte.role === 'prestataire') {
                                    navigate('/mes-clients');
                                } else {
                                    // Sinon, afficher un message ou rediriger vers inscription
                                    navigate('/inscription');
                                }
                            }}
                            className="bg-white p-4 md:p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition cursor-pointer transform hover:scale-105"
                        >
                            <div className="text-2xl md:text-4xl font-bold text-blue-600">{(data.clients || []).length}</div>
                            <div className="text-sm md:text-base text-gray-600 mt-1">Clients satisfaits</div>
                        </div>
                        <div 
                            onClick={() => navigate('/services')}
                            className="bg-white p-4 md:p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition cursor-pointer transform hover:scale-105"
                        >
                            <div className="text-2xl md:text-4xl font-bold text-purple-600">{(data.prestataires || []).length}</div>
                            <div className="text-sm md:text-base text-gray-600 mt-1">Prestataires qualifiés</div>
                        </div>
                        <div 
                            onClick={() => navigate('/services')}
                            className="bg-white p-4 md:p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition cursor-pointer transform hover:scale-105"
                        >
                            <div className="text-2xl md:text-4xl font-bold text-green-600">{(data.services || []).length}</div>
                            <div className="text-sm md:text-base text-gray-600 mt-1">Services proposés</div>
                        </div>
                    </div>

                    {/* Prestataires */}
                    <section className="mb-8 md:mb-12 px-4">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800">Nos Prestataires</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {(data.prestataires || []).map(p => {
                                // Calculer la note moyenne du prestataire
                                const avisMockData = (data.avis || []).filter(a => a.prestataireId === p.id);
                                
                                // Charger les avis du localStorage
                                const avisLocaux = JSON.parse(localStorage.getItem('avis') || '[]');
                                const avisLocauxPrestataire = avisLocaux.filter(a => a.prestataireId === p.id);
                                
                                // Combiner les deux sources
                                const tousLesAvis = [...avisMockData, ...avisLocauxPrestataire];
                                
                                // Calculer la moyenne
                                const moyenneNote = tousLesAvis.length > 0
                                    ? (tousLesAvis.reduce((sum, a) => sum + a.note, 0) / tousLesAvis.length).toFixed(1)
                                    : '0.0';
                                
                                return (
                                    <div 
                                        key={p.id} 
                                        onClick={() => navigate(`/prestataire/${p.id}`)}
                                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
                                    >
                                        <img 
                                            src={p.image || 'https://via.placeholder.com/400'} 
                                            alt={p.nom}
                                            className="w-full h-48 object-cover"
                                            loading="lazy"
                                        />
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg text-gray-800">{p.prenom} {p.nom}</h3>
                                            <p className="text-sm text-purple-600 font-semibold mt-1">
                                                {p.specialite}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {p.quartier}, {p.ville}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {p.disponibilite24h ? '24h/24' : `${p.heureOuverture || '08:00'} - ${p.heureFermeture || '18:00'}`}
                                            </p>
                                            <div className="mt-3 flex items-center justify-between">
                                                <span className="text-sm font-semibold text-gray-700">
                                                    ⭐ {moyenneNote} ({tousLesAvis.length} avis)
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    📋 {p.catalogue.length} services
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </main>

            {/* Section Support & Contact */}
            <section className="bg-gray-50 py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800 text-center">
                        📞 Support & Contact
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {/* Support Client */}
                        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
                            <div className="text-4xl mb-4">📞</div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">Support Client</h3>
                            <p className="text-gray-600 mb-4">
                                Notre équipe est disponible 24h/24 pour vous aider
                            </p>
                            <p className="text-pink-600 font-semibold text-lg">
                                +225 0546439043
                            </p>
                        </div>
                        
                        {/* Chat en direct */}
                        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
                            <div className="text-4xl mb-4">
                                <img src="/images/chat-a-bulles.png" alt="Chat" className="w-12 h-12 mx-auto" loading="lazy" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">Chat en direct</h3>
                            <p className="text-gray-600 mb-4">
                                Discutez avec vos prestataires favoris
                            </p>
                            <button
                                onClick={() => navigate('/chat')}
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                            >
                                Ouvrir le chat
                            </button>
                        </div>
                        
                        {/* Email */}
                        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
                            <div className="text-4xl mb-4">📧</div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">Email</h3>
                            <p className="text-gray-600 mb-4">
                                Envoyez-nous vos questions par email
                            </p>
                            <p className="text-pink-600 font-semibold text-lg">
                                edencanaanjes@gmail.com
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
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

export default Home;
