// Importer les outils React nécessaires pour créer un composant
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Importer le composant UserAvatar pour afficher l'avatar de l'utilisateur
import UserAvatar from './UserAvatar.jsx';
// Importer le composant pour laisser un avis (illimité)
import LaisserAvis from './LaisserAvis.jsx';

// Composant pour le tableau de bord du client - comme une page personnelle
function DashboardClient() {
    // Hook pour naviguer vers d'autres pages (comme un GPS pour les pages)
    const navigate = useNavigate();

    // Variable pour stocker les informations du client connecté
    // useState = une boîte qui garde en mémoire les infos du client
    const [clientConnecte, setClientConnecte] = useState(null);

    // Variable pour stocker les réservations du client
    const [mesReservations, setMesReservations] = useState([]);
    
    // Variables pour le modal d'avis (illimité)
    const [modalAvisOuvert, setModalAvisOuvert] = useState(false);
    const [prestataireSelectionne, setPrestataireSelectionne] = useState(null);

    // useEffect = quelque chose qui se lance automatiquement quand la page charge
    useEffect(() => {
        // Étape 1 : Récupérer les données du client depuis la mémoire du navigateur
        const donneesClient = localStorage.getItem('utilisateurConnecte');

        if (donneesClient) {
            // Étape 2 : Convertir le texte en objet JavaScript
            const infosClient = JSON.parse(donneesClient);
            setClientConnecte(infosClient);

            // Étape 3 : Récupérer ou créer la liste des réservations du client
            const reservationsSauvegardees = localStorage.getItem(`reservations_${infosClient.id}`);
            if (reservationsSauvegardees) {
                setMesReservations(JSON.parse(reservationsSauvegardees));
            } else {
                // Créer une liste vide si pas de réservations
                setMesReservations([]);
            }
        } else {
            // Étape 4 : Si pas de client connecté, rediriger vers la connexion
            navigate('/connexion');
        }
    }, [navigate]); // Le [navigate] dit à React de relancer ça si navigate change

    // Fonction pour se déconnecter - comme fermer la session
    function seDeconnecter() {
        // Étape 1 : Supprimer le client de la mémoire du navigateur
        localStorage.removeItem('utilisateurConnecte');

        // Étape 2 : Rediriger vers la page d'accueil
        navigate('/');
    }

    // Fonction pour annuler une réservation
    function annulerReservation(reservationId) {
        // Demander confirmation avant d'annuler
        const confirmation = window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?');
        
        if (confirmation) {
            // Filtrer les réservations pour supprimer celle annulée
            const reservationsMisesAJour = mesReservations.filter(r => r.id !== reservationId);
            
            // Mettre à jour l'état local
            setMesReservations(reservationsMisesAJour);
            
            // Sauvegarder dans localStorage
            localStorage.setItem(`reservations_${clientConnecte.id}`, JSON.stringify(reservationsMisesAJour));
            
            // Afficher un message de confirmation
            alert('✅ Réservation annulée avec succès !');
        }
    }

    // Fonction pour ouvrir le chat avec le prestataire
    function ouvrirChat(reservation) {
        // Sauvegarder les infos du prestataire pour le chat
        const prestataireInfo = {
            id: reservation.prestataireId,
            nom: reservation.prestataireNom,
            prenom: reservation.prestatairePrenom || '',
            specialite: reservation.service,
            reservationId: reservation.id
        };
        
        localStorage.setItem('prestatairePourChat', JSON.stringify(prestataireInfo));
        
        // Naviguer vers la page de chat
        navigate('/chat');
    }

    // Fonction pour ouvrir le modal d'avis (ILLIMITÉ - pas de vérification)
    function ouvrirModalAvis(reservation) {
        setPrestataireSelectionne({
            id: reservation.prestataireId,
            nom: reservation.prestataireNom
        });
        setModalAvisOuvert(true);
    }

    // Fonction appelée après l'envoi d'un avis
    function apresEnvoiAvis(nouvelAvis) {
        // Fermer le modal
        setModalAvisOuvert(false);
        setPrestataireSelectionne(null);
    }

    // Si les données ne sont pas encore chargées, afficher un loader
    if (!clientConnecte) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* En-tête avec informations du client */}
            <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/profil')}
                            className="text-white hover:text-pink-200 transition"
                        >
                            ← Retour au profil
                        </button>
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">📅 Mes Réservations</h1>
                            <p className="text-sm opacity-90">Gérez vos rendez-vous beauté</p>
                        </div>
                    </div>

                    {/* Informations du client connecté */}
                    <div className="flex items-center gap-3">
                        <UserAvatar user={clientConnecte} size="md" />
                        <div className="text-right">
                            <p className="font-semibold text-sm">{clientConnecte.prenom} {clientConnecte.nom}</p>
                            <p className="text-xs opacity-90">{clientConnecte.email}</p>
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
            </header>

            <div className="max-w-7xl mx-auto p-4 md:p-8">
                {/* Statistiques rapides */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                    {/* Nombre total de réservations */}
                    <div className="bg-white p-6 rounded-xl shadow-md text-center">
                        <div className="text-2xl md:text-3xl mb-2">📋</div>
                        <h3 className="font-bold text-2xl text-gray-800 mb-1">{mesReservations.length}</h3>
                        <p className="text-sm text-gray-600">Réservations totales</p>
                    </div>

                    {/* Réservations confirmées */}
                    <div className="bg-white p-6 rounded-xl shadow-md text-center">
                        <div className="text-3xl mb-2">✅</div>
                        <h3 className="font-bold text-2xl text-green-600 mb-1">
                            {mesReservations.filter(r => r.statut === 'confirmée').length}
                        </h3>
                        <p className="text-sm text-gray-600">Confirmées</p>
                    </div>

                    {/* Réservations en attente */}
                    <div className="bg-white p-6 rounded-xl shadow-md text-center">
                        <div className="text-3xl mb-2">⏳</div>
                        <h3 className="font-bold text-2xl text-yellow-600 mb-1">
                            {mesReservations.filter(r => r.statut === 'en_attente').length}
                        </h3>
                        <p className="text-sm text-gray-600">En attente</p>
                    </div>
                </div>

                {/* Liste des réservations */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Mes Rendez-vous</h2>

                    {mesReservations.length === 0 ? (
                        /* Si pas de réservations */
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📅</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucune réservation</h3>
                            <p className="text-gray-600 mb-6">Vous n'avez pas encore de rendez-vous programmés</p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => navigate('/services')}
                                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition"
                                >
                                    🌟 Découvrir les services
                                </button>
                                <button
                                    onClick={() => navigate('/chat')}
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition flex items-center justify-center gap-2"
                                >
                                    <img src="/images/chat-a-bulles.png" alt="Chat" className="w-5 h-5" />
                                    Chat avec mes prestataires
                                </button>
                            </div>
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
                                                💇 {reservation.serviceNom || 'Service demandé'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Chez {reservation.prestataireNom || 'Prestataire'}
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-xl font-bold text-pink-600">
                                            {reservation.prix ? reservation.prix.toLocaleString() : 'Prix à définir'} FCFA
                                        </span>
                                        <div className="flex gap-2 flex-wrap">
                                            {reservation.statut === 'confirmée' && (
                                                <>
                                                    <button
                                                        onClick={() => ouvrirChat(reservation)}
                                                        className="bg-green-100 text-green-600 px-3 py-2 rounded-lg text-sm hover:bg-green-200 transition flex items-center gap-1"
                                                    >
                                                        <img src="/images/chat-a-bulles.png" alt="Chat" className="w-4 h-4" />
                                                        <span className="font-semibold">Chat</span>
                                                    </button>
                                                    <button
                                                        onClick={() => ouvrirModalAvis(reservation)}
                                                        className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm hover:bg-yellow-200 transition flex items-center gap-1"
                                                    >
                                                        ⭐
                                                        <span className="font-semibold">Laisser un avis</span>
                                                    </button>
                                                </>
                                            )}
                                            {reservation.statut === 'en_attente' && (
                                                <button className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm hover:bg-blue-200 transition">
                                                    <span className="font-semibold">Modifier</span>
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => annulerReservation(reservation.id)}
                                                className="bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-200 transition font-semibold"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal pour laisser un avis (ILLIMITÉ) */}
            {modalAvisOuvert && prestataireSelectionne && (
                <LaisserAvis
                    prestataireId={prestataireSelectionne.id}
                    prestataireNom={prestataireSelectionne.nom}
                    onAvisEnvoye={apresEnvoiAvis}
                    onFermer={() => {
                        setModalAvisOuvert(false);
                        setPrestataireSelectionne(null);
                    }}
                />
            )}
        </div>
    );
}

// Exporter le composant pour qu'il soit utilisé ailleurs
export default DashboardClient;