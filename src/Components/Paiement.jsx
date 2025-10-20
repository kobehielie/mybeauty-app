// Importer les outils React nécessaires
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Composant pour la page de paiement
function Paiement() {
    // Pour naviguer vers d'autres pages
    const navigate = useNavigate();
    
    // Pour récupérer les données de la page précédente
    const location = useLocation();
    
    // Variable pour stocker les infos de la réservation
    const [donneesReservation, setDonneesReservation] = useState(null);
    
    // Variable pour le mode de paiement choisi (MTN, Orange, etc.)
    const [modePaiementChoisi, setModePaiementChoisi] = useState('');
    
    // Variable pour le numéro de téléphone
    const [numeroTelephone, setNumeroTelephone] = useState('');
    
    // Variable pour le lieu (salon ou domicile)
    const [lieuChoisi, setLieuChoisi] = useState('');
    
    // Variable pour savoir si le paiement est en cours
    const [paiementEnCours, setPaiementEnCours] = useState(false);
    
    // Variable pour afficher des messages à l'utilisateur
    const [message, setMessage] = useState('');
    
    // Variable pour l'utilisateur connecté
    const [utilisateurConnecte, setUtilisateurConnecte] = useState(null);

    // useEffect s'exécute quand la page se charge
    useEffect(() => {
        // Étape 1 : Vérifier si un utilisateur est connecté
        const utilisateurTexte = localStorage.getItem('utilisateurConnecte');
        if (utilisateurTexte) {
            // Si oui, on récupère ses infos
            setUtilisateurConnecte(JSON.parse(utilisateurTexte));
        } else {
            // Si non, on le redirige vers la connexion
            navigate('/connexion');
            return;
        }

        // Étape 2 : Récupérer les données de la réservation
        if (location.state && location.state.service && location.state.prestataire) {
            // Si les données viennent de la page précédente
            setDonneesReservation({
                service: location.state.service,
                prestataire: location.state.prestataire,
                date: location.state.date || new Date().toLocaleDateString('fr-FR'),
                heure: location.state.heure || '10:00'
            });
        } else {
            // Sinon, on essaie de les récupérer depuis la mémoire du navigateur
            const reservationSauvegardee = localStorage.getItem('reservationEnCours');
            if (reservationSauvegardee) {
                setDonneesReservation(JSON.parse(reservationSauvegardee));
            } else {
                // Si on ne trouve rien, on affiche une erreur
                setMessage("❌ Aucune réservation en cours. Veuillez d'abord sélectionner un service.");
                setTimeout(() => navigate('/services'), 2000);
            }
        }
    }, [navigate, location]);

    // Fonction appelée quand on soumet le formulaire de paiement
    function effectuerPaiement(e) {
        // Empêcher le rechargement de la page
        e.preventDefault();
        
        // Vérification 1 : Un mode de paiement est-il sélectionné ?
        if (!modePaiementChoisi) {
            setMessage("❌ Veuillez sélectionner un mode de paiement");
            return;
        }

        // Vérification 2 : Un lieu est-il sélectionné ?
        if (!lieuChoisi) {
            setMessage("❌ Veuillez sélectionner un lieu de prestation");
            return;
        }
        
        // Vérification 3 : Si ce n'est pas une carte, il faut un numéro
        if (modePaiementChoisi !== 'carte' && !numeroTelephone) {
            setMessage("❌ Veuillez entrer un numéro de téléphone");
            return;
        }

        // Vérification 4 : Le numéro doit avoir 10 chiffres
        if (modePaiementChoisi !== 'carte' && numeroTelephone.length !== 10) {
            setMessage("❌ Le numéro doit contenir 10 chiffres");
            return;
        }

        // Commencer le traitement du paiement
        setPaiementEnCours(true);
        setMessage("⏳ Traitement du paiement en cours...");

        // Simuler le temps de traitement (2 secondes)
        setTimeout(() => {
            // Arrêter le traitement
            setPaiementEnCours(false);
            setMessage("✅ Paiement effectué avec succès ! Votre réservation est confirmée.");
            
            // Créer une nouvelle réservation avec les bonnes informations
            const nouvelleReservation = {
                id: Date.now(),
                clientId: utilisateurConnecte.id,
                clientNom: `${utilisateurConnecte.prenom} ${utilisateurConnecte.nom}`,
                prestataireId: donneesReservation.prestataire.id,
                prestataire: {
                    id: donneesReservation.prestataire.id,
                    nom: donneesReservation.prestataire.nom,
                    prenom: donneesReservation.prestataire.prenom,
                    specialite: donneesReservation.prestataire.specialite || 'Coiffure'
                },
                serviceId: donneesReservation.service.id,
                service: {
                    id: donneesReservation.service.id,
                    nom: donneesReservation.service.nom,
                    prix: donneesReservation.service.prix,
                    duree: donneesReservation.service.duree || 60
                },
                prix: donneesReservation.service.prix,
                date: donneesReservation.date,
                heure: donneesReservation.heure,
                lieuPrestation: lieuChoisi,
                statut: 'confirmée'
            };

            // Créer un nouveau paiement
            const nouveauPaiement = {
                id: Date.now() + 1,
                reservationId: nouvelleReservation.id,
                montant: donneesReservation.service.prix,
                modePaiement: modePaiementChoisi,
                statut: 'confirmé'
            };

            // Récupérer les réservations générales (pour tous les utilisateurs)
            const reservationsGenerales = JSON.parse(localStorage.getItem('reservations') || '[]');

            // Récupérer les réservations spécifiques au client
            const reservationsClient = JSON.parse(localStorage.getItem(`reservations_${utilisateurConnecte.id}`) || '[]');

            // Récupérer les réservations spécifiques au prestataire
            const reservationsPrestataire = JSON.parse(localStorage.getItem(`reservations_prestataire_${donneesReservation.prestataire.id}`) || '[]');

            // Ajouter la réservation à toutes les listes appropriées
            reservationsGenerales.push(nouvelleReservation);
            reservationsClient.push(nouvelleReservation);
            reservationsPrestataire.push(nouvelleReservation);

            // Récupérer les paiements existants
            const paiementsExistants = JSON.parse(localStorage.getItem('paiements') || '[]');

            // Ajouter le paiement
            paiementsExistants.push(nouveauPaiement);

            // Sauvegarder toutes les données
            localStorage.setItem('reservations', JSON.stringify(reservationsGenerales));
            localStorage.setItem(`reservations_${utilisateurConnecte.id}`, JSON.stringify(reservationsClient));
            localStorage.setItem(`reservations_prestataire_${donneesReservation.prestataire.id}`, JSON.stringify(reservationsPrestataire));
            localStorage.setItem('paiements', JSON.stringify(paiementsExistants));
            
            // Supprimer la réservation temporaire
            localStorage.removeItem('reservationEnCours');
            
            // Rediriger vers le tableau de bord après 3 secondes
            setTimeout(() => {
                navigate('/dashboard-client');
            }, 3000);
        }, 2000);
    }

    // Liste des modes de paiement disponibles
    const listeDesPaiements = [
        { id: 'mtn_money', nom: 'MTN Mobile Money', icon: '/images/MTN.png', color: 'yellow', isImage: true },
        { id: 'orange_money', nom: 'Orange Money', icon: '/images/orange.jpg', color: 'orange', isImage: true },
        { id: 'wave', nom: 'Wave', icon: '/images/wave.png', color: 'blue', isImage: true },
        { id: 'moov_money', nom: 'Moov Money', icon: '📞', color: 'purple', isImage: false },
        { id: 'carte', nom: 'Carte Bancaire', icon: '💳', color: 'gray', isImage: false }
    ];

    // Si les données ne sont pas encore chargées, afficher un loader
    if (!utilisateurConnecte || !donneesReservation) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement...</p>
            </div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
            <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
                        💅 MyBeauty
                    </h1>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-white text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-100 transition"
                    >
                        ← Retour
                    </button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto p-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-full mb-4">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Paiement sécurisé</h2>
                        <p className="text-gray-600 mt-2">Choisissez votre mode de paiement préféré</p>
                    </div>

                    {message && (
                        <div className={`p-4 mb-6 rounded-lg text-center font-medium ${
                            message.includes('✅') 
                                ? 'bg-green-100 text-green-700 border border-green-300' 
                                : message.includes('⏳')
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-red-100 text-red-700 border border-red-300'
                        }`}>
                            {message}
                        </div>
                    )}

                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl mb-8">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">📋 Résumé de la réservation</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Service:</span>
                                <span className="font-semibold">{donneesReservation.service.nom}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Prestataire:</span>
                                <span className="font-semibold">{donneesReservation.prestataire.prenom} {donneesReservation.prestataire.nom}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Spécialité:</span>
                                <span className="font-semibold text-purple-600">{donneesReservation.prestataire.specialite}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Durée:</span>
                                <span className="font-semibold">⏱️ {donneesReservation.service.duree} min</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Date:</span>
                                <span className="font-semibold">📅 {donneesReservation.date} à {donneesReservation.heure}</span>
                            </div>
                            <div className="border-t border-gray-300 pt-3 mt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-gray-800">Total:</span>
                                    <span className="text-3xl font-bold text-pink-600">
                                        {donneesReservation.service.prix.toLocaleString()} FCFA
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={effectuerPaiement}>
                        {/* Sélection du lieu de prestation */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-4 text-gray-700">
                                📍 Lieu de prestation
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {donneesReservation.prestataire.serviceSalon && (
                                    <div 
                                        onClick={() => setLieuChoisi('salon')}
                                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                            lieuChoisi === 'salon' 
                                                ? 'border-purple-500 bg-purple-50 shadow-md' 
                                                : 'border-gray-200 hover:border-purple-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">🏢</span>
                                            <div className="flex-1">
                                                <span className="font-semibold text-gray-800 block">Au salon</span>
                                                <span className="text-xs text-gray-600">{donneesReservation.prestataire.quartier}, {donneesReservation.prestataire.ville}</span>
                                            </div>
                                            {lieuChoisi === 'salon' && (
                                                <span className="text-purple-600">✓</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {donneesReservation.prestataire.serviceDomicile && (
                                    <div 
                                        onClick={() => setLieuChoisi('domicile')}
                                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                            lieuChoisi === 'domicile' 
                                                ? 'border-blue-500 bg-blue-50 shadow-md' 
                                                : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">🏠</span>
                                            <div className="flex-1">
                                                <span className="font-semibold text-gray-800 block">À domicile</span>
                                                <span className="text-xs text-gray-600">Service à votre adresse</span>
                                            </div>
                                            {lieuChoisi === 'domicile' && (
                                                <span className="text-blue-600">✓</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sélection du mode de paiement */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-4 text-gray-700">
                                💳 Mode de paiement
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {listeDesPaiements.map((mode) => (
                                    <div 
                                        key={mode.id}
                                        onClick={() => setModePaiementChoisi(mode.id)}
                                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                            modePaiementChoisi === mode.id 
                                                ? 'border-pink-500 bg-pink-50 shadow-md' 
                                                : 'border-gray-200 hover:border-pink-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {mode.isImage ? (
                                                <img src={mode.icon} alt={mode.nom} className="w-10 h-10 object-contain rounded" />
                                            ) : (
                                                <span className="text-3xl">{mode.icon}</span>
                                            )}
                                            <span className="font-semibold text-gray-800">{mode.nom}</span>
                                            {modePaiementChoisi === mode.id && (
                                                <span className="ml-auto text-pink-600">✓</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Numéro Mobile Money */}
                        {modePaiementChoisi !== 'carte' && modePaiementChoisi && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    📱 Numéro {listeDesPaiements.find(m => m.id === modePaiementChoisi)?.nom}
                                </label>
                                <input 
                                    type="tel"
                                    value={numeroTelephone}
                                    onChange={(e) => setNumeroTelephone(e.target.value)}
                                    className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                                    placeholder="Ex: 0707070707"
                                    maxLength="10"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    💡 Vous recevrez un code de confirmation sur ce numéro
                                </p>
                            </div>
                        )}

                        {/* Carte bancaire */}
                        {modePaiementChoisi === 'carte' && (
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Numéro de carte
                                    </label>
                                    <input 
                                        type="text"
                                        className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="19"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            Date d'expiration
                                        </label>
                                        <input 
                                            type="text"
                                            className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                                            placeholder="MM/AA"
                                            maxLength="5"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            CVV
                                        </label>
                                        <input 
                                            type="text"
                                            className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                                            placeholder="123"
                                            maxLength="3"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bouton de paiement */}
                        <button 
                            type="submit"
                            disabled={paiementEnCours}
                            className={`w-full py-4 rounded-lg font-bold text-lg transition shadow-lg hover:shadow-xl ${
                                paiementEnCours 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
                            }`}
                        >
                            {paiementEnCours ? '⏳ Traitement en cours...' : `💳 Payer ${donneesReservation.service.prix.toLocaleString()} FCFA`}
                        </button>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            🔒 Paiement sécurisé - Vos informations sont protégées
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Paiement;
