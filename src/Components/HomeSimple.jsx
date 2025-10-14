// Version simplifiée de Home pour diagnostiquer le problème
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Importer le composant UserAvatar pour afficher l'avatar de l'utilisateur
import UserAvatar from './UserAvatar.jsx';
import { useAuth } from '../contexts/SimpleAuthContext';
import dataLoader from '../data/dataLoader.js';
import SEOHead from './SEOHead.jsx';

function Home() {
    const data = dataLoader.loadAll();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [menuOuvert, setMenuOuvert] = useState(false);

    // Fonction pour aller à la page d'inscription
    function allerAInscription() {
        navigate('/inscription');
    }

    // Fonction pour aller à la page de connexion
    function allerAConnexion() {
        navigate('/connexion');
    }

    // Fonction pour aller à la page de recherche
    function allerARecherche() {
        navigate('/recherche');
    }

    // Fonction pour se déconnecter
    function seDeconnecter() {
        logout();
        setMenuOuvert(false);
        navigate('/');
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <SEOHead 
                title="MyBeauty - Services de beauté en Côte d'Ivoire | Réservation en ligne"
                description="Découvrez MyBeauty, la plateforme de réservation de services de beauté en Côte d'Ivoire. Trouvez des coiffeurs, esthéticiennes, maquilleurs près de chez vous. Réservation en ligne, paiement Mobile Money sécurisé."
                keywords="beauté, coiffure, esthétique, réservation, Côte d'Ivoire, Abidjan, Mobile Money, prestataires beauté, coiffeur, maquillage, soins, épilation, Koumassi, Cocody, Marcory, Plateau"
                canonical="https://mybeauty.ci/"
            />
            <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 shadow-lg" role="banner">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">MyBeauty</h1>
                        <p className="text-sm mt-1">Votre plateforme de réservation beauté</p>
                    </div>
                    
                    {/* Si utilisateur non connecté, afficher les boutons Connexion/Inscription */}
                    {!user ? (
                        <div className="flex gap-3">
                            <button 
                                onClick={allerAConnexion} 
                                className="bg-white text-pink-600 font-semibold px-6 py-3 rounded-lg hover:bg-pink-100 transition shadow-lg"
                            >
                                Connexion
                            </button>
                            <button 
                                onClick={allerAInscription} 
                                className="bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-800 transition shadow-lg"
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
                                <UserAvatar user={user} size="md" />
                                <div className="text-left">
                                    <p className="font-semibold text-sm">{user.prenom} {user.nom}</p>
                                    <p className="text-xs opacity-90">{user.role}</p>
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
                                            {user.prenom} {user.nom}
                                        </p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                        <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                                            {user.role === 'client' ? 'Client' : 'Prestataire'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => navigate('/profil')}
                                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                    >
                                        👤 Mon profil
                                    </button>
                                    <button
                                        onClick={() => navigate('/chat')}
                                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
                                    >
                                        <img src="/images/chat-a-bulles.png" alt="Chat" className="w-4 h-4" />
                                        Messages
                                    </button>
                                    {user.role === 'prestataire' && (
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center gap-2">
                                            <img src="/images/services.png" alt="Services" className="w-4 h-4" />
                                            Mes services
                                        </a>
                                    )}
                                    {user.role === 'client' && (
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                                            Mes réservations
                                        </a>
                                    )}
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                                        Paramètres
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
            
            <main className="flex-1 p-8" role="main">
                <div className="max-w-7xl mx-auto">
                    <section className="text-center mb-12" aria-labelledby="welcome-title">
                        <h2 id="welcome-title" className="text-4xl font-bold text-gray-800 mb-4">
                            Bienvenue sur MyBeauty
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Trouvez les meilleurs professionnels de la beauté près de chez vous
                        </p>
                        
                        {/* Barre de recherche simplifiée */}
                        <div className="max-w-2xl mx-auto mb-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher un prestataire, une spécialité, un quartier..."
                                    className="w-full px-6 py-4 pr-12 border-2 border-gray-300 rounded-full focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            allerARecherche();
                                        }
                                    }}
                                />
                                <button
                                    onClick={allerARecherche}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        {/* Boutons d'action rapide */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <button
                                onClick={allerARecherche}
                                className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition shadow-lg"
                            >
                                🔍 Recherche avancée
                            </button>
                            <button
                                onClick={() => navigate('/services')}
                                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition shadow-lg"
                            >
                                📋 Voir tous les services
                            </button>
                            {user && (
                                <button
                                    onClick={() => navigate('/chat')}
                                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-lg flex items-center gap-2"
                                >
                                    <img src="/images/chat-a-bulles.png" alt="Chat" className="w-5 h-5" />
                                    Messages
                                </button>
                            )}
                        </div>
                    </section>

                    {/* Statistiques */}
                    <section className="grid grid-cols-3 gap-6 mb-12" aria-labelledby="stats-title">
                        <h3 id="stats-title" className="sr-only">Statistiques de la plateforme</h3>
                        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition">
                            <div className="text-4xl font-bold text-blue-600">{data.clients.length}</div>
                            <div className="text-gray-600 mt-1">Clients satisfaits</div>
                        </div>
                        <div 
                            onClick={() => navigate('/services')}
                            className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition cursor-pointer transform hover:scale-105"
                        >
                            <div className="text-4xl font-bold text-purple-600">{data.prestataires.length}</div>
                            <div className="text-gray-600 mt-1">Prestataires qualifiés</div>
                        </div>
                        <div 
                            onClick={() => navigate('/services')}
                            className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition cursor-pointer transform hover:scale-105"
                        >
                            <div className="text-4xl font-bold text-green-600">{data.services.length}</div>
                            <div className="text-gray-600 mt-1">Services proposés</div>
                        </div>
                    </section>

                    {/* Prestataires */}
                    <section className="mb-12" aria-labelledby="prestataires-title">
                        <h2 id="prestataires-title" className="text-3xl font-bold mb-6 text-gray-800">Nos Prestataires</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {data.prestataires.map(p => {
                                // Charger les avis du mockData
                                const avisMockData = data.avis.filter(a => a.prestataireId === p.id);
                                
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
