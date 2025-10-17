// Importer les outils React nécessaires
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Composant pour le tableau de bord du prestataire
function DashboardPrestataire() {
    // Pour naviguer vers d'autres pages
    const navigate = useNavigate();

    // Variable pour stocker les informations du prestataire connecté
    const [prestataire, setPrestataire] = useState(null);

    // Variable pour stocker les réservations du prestataire
    const [mesReservations, setMesReservations] = useState([]);

    // Variables pour la gestion du planning
    const [modifierPlanning, setModifierPlanning] = useState(false);
    const [nouveauxHoraires, setNouveauxHoraires] = useState({
        heureOuverture: '',
        heureFermeture: '',
        joursDisponibles: [],
        disponibilite24h: false
    });

    // Variables pour modifier les informations
    const [modifierInfos, setModifierInfos] = useState(false);
    const [nouvellesInfos, setNouvellesInfos] = useState({
        telephone: '',
        quartier: '',
        specialite: ''
    });

    // useEffect s'exécute quand la page se charge
    useEffect(() => {
        // Étape 1 : Récupérer les données du prestataire depuis la mémoire du navigateur
        const prestataireTexte = localStorage.getItem('utilisateurConnecte');

        if (prestataireTexte) {
            // Étape 2 : Convertir le texte en objet JavaScript
            const prestataireData = JSON.parse(prestataireTexte);
            setPrestataire(prestataireData);

            // Étape 3 : Récupérer ou créer la liste des réservations du prestataire
            const reservationsSauvegardees = localStorage.getItem(`reservations_prestataire_${prestataireData.id}`);
            if (reservationsSauvegardees) {
                setMesReservations(JSON.parse(reservationsSauvegardees));
            } else {
                // Créer une liste vide si pas de réservations
                setMesReservations([]);
            }
        } else {
            // Étape 4 : Si pas de prestataire connecté, rediriger vers la connexion
            navigate('/connexion');
        }
    }, [navigate]);

    // Fonction pour se déconnecter
    function seDeconnecter() {
        // Étape 1 : Supprimer le prestataire de la mémoire du navigateur
        localStorage.removeItem('utilisateurConnecte');

        // Étape 2 : Rediriger vers la page d'accueil
        navigate('/');
    }

    // Fonction pour ouvrir le formulaire de modification du planning
    function ouvrirModificationPlanning() {
        setModifierPlanning(true);
        // Pré-remplir avec les données actuelles
        setNouveauxHoraires({
            heureOuverture: prestataire.heureOuverture || '08:00',
            heureFermeture: prestataire.heureFermeture || '18:00',
            joursDisponibles: prestataire.joursDisponibles || ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
            disponibilite24h: prestataire.disponibilite24h || false
        });
    }

    // Fonction pour sauvegarder les nouveaux horaires
    function sauvegarderPlanning() {
        // Étape 1 : Mettre à jour les données du prestataire
        const prestataireMisAJour = {
            ...prestataire,
            ...nouveauxHoraires
        };

        // Étape 2 : Sauvegarder dans la mémoire du navigateur
        localStorage.setItem('utilisateurConnecte', JSON.stringify(prestataireMisAJour));
        
        // Étape 3 : Mettre à jour l'état local
        setPrestataire(prestataireMisAJour);
        
        // Étape 4 : Fermer le formulaire
        setModifierPlanning(false);
        
        // Étape 5 : Afficher un message de succès
        alert('✅ Planning mis à jour avec succès !');
    }

    // Fonction pour ouvrir le formulaire de modification des informations
    function ouvrirModificationInfos() {
        setModifierInfos(true);
        // Pré-remplir avec les données actuelles
        setNouvellesInfos({
            telephone: prestataire.telephone || '',
            quartier: prestataire.quartier || '',
            specialite: prestataire.specialite || ''
        });
    }

    // Fonction pour sauvegarder les nouvelles informations
    function sauvegarderInfos() {
        // Étape 1 : Mettre à jour les données du prestataire
        const prestataireMisAJour = {
            ...prestataire,
            ...nouvellesInfos
        };

        // Étape 2 : Sauvegarder dans la mémoire du navigateur
        localStorage.setItem('utilisateurConnecte', JSON.stringify(prestataireMisAJour));
        
        // Étape 3 : Mettre à jour l'état local
        setPrestataire(prestataireMisAJour);
        
        // Étape 4 : Fermer le formulaire
        setModifierInfos(false);
        
        // Étape 5 : Afficher un message de succès
        alert('✅ Informations mises à jour avec succès !');
    }

    // Fonction pour gérer les réservations (accepter/refuser)
    function gererReservation(reservationIndex, action) {
        const nouvellesReservations = [...mesReservations];
        
        if (action === 'accepter') {
            nouvellesReservations[reservationIndex].statut = 'confirmée';
        } else if (action === 'refuser') {
            nouvellesReservations[reservationIndex].statut = 'refusée';
        }
        
        // Sauvegarder les changements
        setMesReservations(nouvellesReservations);
        localStorage.setItem(`reservations_prestataire_${prestataire.id}`, JSON.stringify(nouvellesReservations));
        
        alert(`✅ Réservation ${action === 'accepter' ? 'acceptée' : 'refusée'} !`);
    }

    // Si les données ne sont pas encore chargées, afficher un loader
    if (!prestataire) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* En-tête avec informations du prestataire */}
            <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 md:p-6 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    {/* Version mobile */}
                    <div className="flex md:hidden justify-between items-center">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg font-bold truncate">📋 Mes Services</h1>
                            <p className="text-xs opacity-90 truncate">Gérez votre activité</p>
                        </div>
                        <button
                            onClick={seDeconnecter}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs transition flex-shrink-0 ml-2"
                        >
                            Déconnexion
                        </button>
                    </div>

                    {/* Version desktop */}
                    <div className="hidden md:flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/profil')}
                                className="text-white hover:text-pink-200 transition"
                            >
                                ← Retour au profil
                            </button>
                            <div className="text-center">
                                <h1 className="text-2xl font-bold">📋 Mes Services</h1>
                                <p className="text-sm opacity-90">Gérez votre activité beauté</p>
                            </div>
                        </div>

                        {/* Informations du prestataire connecté */}
                        <div className="flex items-center gap-3">
                            <img
                                src={prestataire.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'}
                                alt={prestataire.prenom}
                                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                            />
                            <div className="text-right">
                                <p className="font-semibold text-sm">{prestataire.prenom} {prestataire.nom}</p>
                                <p className="text-xs opacity-90">{prestataire.specialite}</p>
                            </div>
                            <button
                                onClick={seDeconnecter}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition flex items-center gap-2"
                            >
                                <img src="/images/deconnexion.png" alt="Déconnexion" className="w-4 h-4" />
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-4 md:p-8">
                {/* Statistiques rapides */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                    {/* Nombre de clients */}
                    <div 
                        onClick={() => navigate('/mes-clients')}
                        className="bg-white p-4 md:p-6 rounded-xl shadow-md text-center cursor-pointer hover:shadow-xl transition transform hover:scale-105"
                    >
                        <div className="text-2xl md:text-3xl mb-2">👥</div>
                        <h3 className="font-bold text-2xl text-blue-600 mb-1">
                            {[...new Set(mesReservations.map(r => r.clientId))].length}
                        </h3>
                        <p className="text-sm text-gray-600">Mes clients</p>
                        <p className="text-xs text-blue-500 mt-1">Cliquez pour voir</p>
                    </div>

                    {/* Nombre total de réservations */}
                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md text-center">
                        <div className="text-2xl md:text-3xl mb-2">📋</div>
                        <h3 className="font-bold text-xl md:text-2xl text-gray-800 mb-1">{mesReservations.length}</h3>
                        <p className="text-xs md:text-sm text-gray-600">Réservations totales</p>
                    </div>

                    {/* Réservations confirmées */}
                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md text-center">
                        <div className="text-2xl md:text-3xl mb-2">✅</div>
                        <h3 className="font-bold text-xl md:text-2xl text-green-600 mb-1">
                            {mesReservations.filter(r => r.statut === 'confirmée').length}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600">Confirmées</p>
                    </div>

                    {/* Réservations en attente */}
                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md text-center">
                        <div className="text-2xl md:text-3xl mb-2">⏳</div>
                        <h3 className="font-bold text-xl md:text-2xl text-yellow-600 mb-1">
                            {mesReservations.filter(r => r.statut === 'en_attente').length}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600">En attente</p>
                    </div>

                    {/* Spécialité */}
                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md text-center">
                        <div className="text-2xl md:text-3xl mb-2">💅</div>
                        <h3 className="font-bold text-lg md:text-xl text-purple-600 mb-1">{prestataire.specialite}</h3>
                        <p className="text-xs md:text-sm text-gray-600">Ma spécialité</p>
                    </div>
                </div>

                {/* Informations professionnelles */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">🏢 Informations professionnelles</h2>
                        <button
                            onClick={ouvrirModificationInfos}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                            ✏️ Modifier
                        </button>
                    </div>

                    {!modifierInfos ? (
                        /* Affichage des informations */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Informations de base */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">📧 Email professionnel</label>
                                    <p className="text-lg text-gray-800">{prestataire.email}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">📱 Téléphone</label>
                                    <p className="text-lg text-gray-800">{prestataire.telephone || 'Non renseigné'}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">🏙️ Ville</label>
                                    <p className="text-lg text-gray-800">{prestataire.ville || 'Abidjan'}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">📍 Quartier</label>
                                    <p className="text-lg text-gray-800">{prestataire.quartier}</p>
                                </div>
                            </div>

                            {/* Services et disponibilité */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">💼 Services proposés</label>
                                    <p className="text-lg text-gray-800">Service au salon et à domicile</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">🕐 Horaires</label>
                                    <p className="text-lg text-gray-800">
                                        {prestataire.disponibilite24h ? '24h/24' : `${prestataire.heureOuverture || '08:00'} - ${prestataire.heureFermeture || '18:00'}`}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">📅 Jours disponibles</label>
                                    <p className="text-lg text-gray-800">
                                        {prestataire.joursDisponibles ? prestataire.joursDisponibles.join(', ') : 'Tous les jours'}
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={ouvrirModificationPlanning}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                    >
                                        📅 Gérer mon planning
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Formulaire de modification des informations */
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">📱 Téléphone</label>
                                    <input
                                        type="tel"
                                        value={nouvellesInfos.telephone}
                                        onChange={(e) => setNouvellesInfos({...nouvellesInfos, telephone: e.target.value})}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="Ex: 0123456789"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">📍 Quartier</label>
                                    <input
                                        type="text"
                                        value={nouvellesInfos.quartier}
                                        onChange={(e) => setNouvellesInfos({...nouvellesInfos, quartier: e.target.value})}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="Ex: Koumassi, Cocody..."
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-600 mb-2">💅 Spécialité</label>
                                    <input
                                        type="text"
                                        value={nouvellesInfos.specialite}
                                        onChange={(e) => setNouvellesInfos({...nouvellesInfos, specialite: e.target.value})}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="Ex: Coiffure, Maquillage, Soins..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={sauvegarderInfos}
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition"
                                >
                                    ✅ Sauvegarder
                                </button>
                                <button
                                    onClick={() => setModifierInfos(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition"
                                >
                                    ❌ Annuler
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Formulaire de gestion du planning */}
                {modifierPlanning && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Gérer mon planning</h2>
                        
                        <div className="space-y-6">
                            {/* Disponibilité 24h/24 */}
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="disponibilite24h"
                                    checked={nouveauxHoraires.disponibilite24h}
                                    onChange={(e) => setNouveauxHoraires({...nouveauxHoraires, disponibilite24h: e.target.checked})}
                                    className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                />
                                <label htmlFor="disponibilite24h" className="text-sm font-medium text-gray-700">
                                    🌙 Disponible 24h/24
                                </label>
                            </div>

                            {/* Horaires (si pas 24h/24) */}
                            {!nouveauxHoraires.disponibilite24h && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">🕐 Heure d'ouverture</label>
                                        <input
                                            type="time"
                                            value={nouveauxHoraires.heureOuverture}
                                            onChange={(e) => setNouveauxHoraires({...nouveauxHoraires, heureOuverture: e.target.value})}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">🕐 Heure de fermeture</label>
                                        <input
                                            type="time"
                                            value={nouveauxHoraires.heureFermeture}
                                            onChange={(e) => setNouveauxHoraires({...nouveauxHoraires, heureFermeture: e.target.value})}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Jours disponibles */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-3">📅 Jours disponibles</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((jour) => (
                                        <label key={jour} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={nouveauxHoraires.joursDisponibles.includes(jour)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setNouveauxHoraires({
                                                            ...nouveauxHoraires,
                                                            joursDisponibles: [...nouveauxHoraires.joursDisponibles, jour]
                                                        });
                                                    } else {
                                                        setNouveauxHoraires({
                                                            ...nouveauxHoraires,
                                                            joursDisponibles: nouveauxHoraires.joursDisponibles.filter(j => j !== jour)
                                                        });
                                                    }
                                                }}
                                                className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                            />
                                            <span className="text-sm text-gray-700">{jour}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={sauvegarderPlanning}
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition"
                                >
                                    ✅ Sauvegarder le planning
                                </button>
                                <button
                                    onClick={() => setModifierPlanning(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition"
                                >
                                    ❌ Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Liste des réservations */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Mes Rendez-vous</h2>

                    {mesReservations.length === 0 ? (
                        /* Si pas de réservations */
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📅</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucune réservation</h3>
                            <p className="text-gray-600 mb-6">Vous n'avez pas encore de rendez-vous programmés</p>
                            <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition">
                                📢 Promouvoir mes services
                            </button>
                        </div>
                    ) : (
                        /* Liste des réservations */
                        <div className="space-y-4">
                            {mesReservations.map((reservation, index) => (
                                <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-pink-300 transition">
                                    {/* Informations principales de la réservation */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800">
                                                👤 {reservation.clientNom || 'Client inconnu'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                💇 {reservation.serviceNom || 'Service demandé'}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            reservation.statut === 'confirmée'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                            {reservation.statut === 'confirmée' ? '✅ Confirmée' : '⏳ En attente'}
                                        </span>
                                    </div>

                                    {/* Détails de la réservation */}
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-600">📅 Date:</span>
                                            <p>{new Date(reservation.date).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">🕐 Heure:</span>
                                            <p>{reservation.heure}</p>
                                        </div>
                                    </div>

                                    {/* Prix et actions */}
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                                        <span className="text-xl font-bold text-pink-600">
                                            {reservation.prix ? reservation.prix.toLocaleString() : 'Prix à définir'} FCFA
                                        </span>
                                        <div className="flex gap-2">
                                            {reservation.statut === 'en_attente' && (
                                                <>
                                                    <button 
                                                        onClick={() => gererReservation(index, 'accepter')}
                                                        className="bg-green-100 text-green-600 px-3 py-2 rounded-lg text-sm hover:bg-green-200 transition"
                                                    >
                                                        ✅ Accepter
                                                    </button>
                                                    <button 
                                                        onClick={() => gererReservation(index, 'refuser')}
                                                        className="bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-200 transition"
                                                    >
                                                        ❌ Refuser
                                                    </button>
                                                </>
                                            )}
                                            {reservation.statut === 'confirmée' && (
                                                <button className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm hover:bg-blue-200 transition">
                                                    📝 Modifier
                                                </button>
                                            )}
                                            {reservation.statut === 'refusée' && (
                                                <span className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm">
                                                    ❌ Refusée
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Exporter le composant
export default DashboardPrestataire;
