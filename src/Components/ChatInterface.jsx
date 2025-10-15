// Composant de chat principal pour MyBeauty - Chat dynamique avec historique des services
import React, { useState, useEffect, useRef } from 'react'; // Importer React et ses hooks
import { useChat, MessageBubble, ConversationList } from '../contexts/ChatContext'; // Importer le système de chat
import { useAuth } from '../contexts/SimpleAuthContext'; // Importer l'authentification
import { useNotifications } from '../contexts/NotificationContext'; // Importer les notifications
import dataLoader from '../data/dataLoader'; // Importer les données de l'application


function ChatInterface() {
    // Récupérer les informations de l'utilisateur connecté
    const { user } = useAuth(); // Utilisateur actuellement connecté
    const { notifyMessage } = useNotifications(); // Fonction pour envoyer des notifications
    
    // Récupérer les fonctions du système de chat
    const {
        activeConversation, // Conversation actuellement sélectionnée
        setActiveConversation, // Fonction pour changer de conversation
        messages, // Tous les messages
        sendMessage, // Fonction pour envoyer un message
        markMessagesAsRead, // Fonction pour marquer les messages comme lus
        getMessagesForConversation, // Fonction pour récupérer les messages d'une conversation
        getOrCreateConversation, // Fonction pour créer ou récupérer une conversation
        sendBookingRequest, // Fonction pour envoyer une demande de réservation
        confirmBooking, // Fonction pour confirmer une réservation
        requestPayment // Fonction pour demander un paiement
    } = useChat();

    // Variables d'état pour l'interface
    const [newMessage, setNewMessage] = useState(''); // Message en cours de saisie
    const [isTyping, setIsTyping] = useState(false); // Indicateur de frappe
    const [prestatairesAvecHistorique, setPrestatairesAvecHistorique] = useState([]); // Liste des prestataires ayant déjà servi le client
    const messagesEndRef = useRef(null); // Référence pour le scroll automatique
    const inputRef = useRef(null); // Référence pour le champ de saisie

    // Messages de la conversation active
    const activeMessages = activeConversation ? getMessagesForConversation(activeConversation.id) : [];

    // Fonction pour récupérer les prestataires ayant déjà servi ce client
    const chargerPrestatairesAvecHistorique = async () => {
        if (!user || user.role !== 'client') return; // Seulement pour les clients

        try {
            // Charger toutes les données
            const data = dataLoader.loadAll(); // Charger les données depuis le fichier JSON
            
            // Trouver les réservations de ce client
            const reservationsClient = data.reservations.filter(reservation => 
                reservation.clientId === user.id && 
                reservation.statut === 'confirmée' // Seulement les réservations confirmées
            );

            // Récupérer les informations des prestataires ayant servi ce client
            const prestatairesUniques = new Map(); // Map pour éviter les doublons
            
            reservationsClient.forEach(reservation => {
                const prestataire = data.prestataires.find(p => p.id === reservation.prestataireId);
                const service = data.services.find(s => s.id === reservation.serviceId);
                
                if (prestataire && service) {
                    // Si le prestataire n'est pas encore dans la map, l'ajouter
                    if (!prestatairesUniques.has(prestataire.id)) {
                        prestatairesUniques.set(prestataire.id, {
                            ...prestataire,
                            servicesRendus: [], // Liste des services rendus
                            derniereReservation: reservation.date // Date de la dernière réservation
                        });
                    }
                    
                    // Ajouter le service à la liste des services rendus
                    const prestataireData = prestatairesUniques.get(prestataire.id);
                    prestataireData.servicesRendus.push({
                        service: service.nom,
                        date: reservation.date,
                        prix: service.prix
                    });
                }
            });

            // Convertir la Map en tableau et trier par date de dernière réservation
            const prestatairesAvecHistorique = Array.from(prestatairesUniques.values())
                .sort((a, b) => new Date(b.derniereReservation) - new Date(a.derniereReservation));

            setPrestatairesAvecHistorique(prestatairesAvecHistorique);
            
            // Créer automatiquement des conversations avec ces prestataires
            prestatairesAvecHistorique.forEach(prestataire => {
                getOrCreateConversation(prestataire.id, {
                    nom: prestataire.nom,
                    prenom: prestataire.prenom,
                    specialite: prestataire.specialite,
                    image: prestataire.image,
                    servicesRendus: prestataire.servicesRendus,
                    derniereReservation: prestataire.derniereReservation
                });
            });

        } catch (error) {
            console.error('Erreur lors du chargement des prestataires:', error);
        }
    };

    // Charger les prestataires au montage du composant
    useEffect(() => {
        chargerPrestatairesAvecHistorique();
        
        // Vérifier si un prestataire spécifique a été sélectionné depuis la page de détails
        const prestataireSelectionne = localStorage.getItem('prestatairePourChat');
        if (prestataireSelectionne) {
            const prestataireInfo = JSON.parse(prestataireSelectionne);
            
            // Créer une conversation avec ce prestataire
            const conversation = getOrCreateConversation(prestataireInfo.id, prestataireInfo);
            setActiveConversation(conversation);
            
            // Nettoyer le localStorage
            localStorage.removeItem('prestatairePourChat');
        }
    }, [user]);

    // Scroll automatique vers le bas
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeMessages]);

    // Marquer les messages comme lus quand on ouvre une conversation
    useEffect(() => {
        if (activeConversation) {
            markMessagesAsRead(activeConversation.id);
        }
    }, [activeConversation, markMessagesAsRead]);

    // Fonction pour envoyer un message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation) return;

        const message = sendMessage(activeConversation.id, newMessage.trim());
        if (message) {
            setNewMessage('');
            setIsTyping(false);
            
            // Notification pour le destinataire (simulation)
            notifyMessage(
                'Nouveau message',
                `Message de ${user.prenom}: ${newMessage.substring(0, 30)}...`
            );
        }
    };

    // Fonction pour gérer le changement de message
    const handleMessageChange = (e) => {
        setNewMessage(e.target.value);
        setIsTyping(e.target.value.length > 0);
    };

    // Fonction pour envoyer une demande de réservation
    const handleBookingRequest = () => {
        if (!activeConversation) return;

        const bookingDetails = {
            service: 'Coiffure',
            date: '2025-01-20',
            time: '14:00',
            duration: 60,
            price: 5000
        };

        sendBookingRequest(activeConversation.id, bookingDetails);
    };

    // Fonction pour confirmer une réservation
    const handleConfirmBooking = () => {
        if (!activeConversation) return;

        const bookingDetails = {
            service: 'Coiffure',
            date: '2025-01-20',
            time: '14:00',
            duration: 60,
            price: 5000
        };

        confirmBooking(activeConversation.id, bookingDetails);
    };

    // Fonction pour demander un paiement
    const handlePaymentRequest = () => {
        if (!activeConversation) return;

        const paymentDetails = {
            amount: 5000,
            service: 'Coiffure',
            method: 'Mobile Money'
        };

        requestPayment(activeConversation.id, paymentDetails);
    };

    return (
        <div className="h-screen bg-gray-50 flex">
            {/* Liste des conversations avec historique des services */}
            <div className="w-1/3 border-r border-gray-200 bg-white">
                <ConversationListAvecHistorique 
                    onSelectConversation={setActiveConversation}
                    prestatairesAvecHistorique={prestatairesAvecHistorique}
                />
            </div>

            {/* Zone de chat principale */}
            <div className="flex-1 flex flex-col">
                {activeConversation ? (
                    <>
                        {/* Header de la conversation */}
                        <div className="bg-white border-b border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                        {activeConversation.participantInfo?.prenom?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">
                                            {activeConversation.participantInfo?.prenom} {activeConversation.participantInfo?.nom}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {activeConversation.participantInfo?.specialite}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleBookingRequest}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition"
                                    >
                                        📅 Réservation
                                    </button>
                                    <button
                                        onClick={handlePaymentRequest}
                                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition"
                                    >
                                        💳 Paiement
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {activeMessages.map((message, index) => {
                                const isOwn = message.senderId === user?.id;
                                const showAvatar = index === 0 || 
                                    activeMessages[index - 1]?.senderId !== message.senderId;
                                
                                return (
                                    <MessageBubble
                                        key={message.id}
                                        message={message}
                                        isOwn={isOwn}
                                        showAvatar={showAvatar}
                                    />
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Zone de saisie */}
                        <div className="bg-white border-t border-gray-200 p-4">
                            <form onSubmit={handleSendMessage} className="flex space-x-3">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={newMessage}
                                    onChange={handleMessageChange}
                                    placeholder="Tapez votre message..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                                >
                                    Envoyer
                                </button>
                            </form>
                            
                            {/* Indicateur de frappe */}
                            {isTyping && (
                                <div className="mt-2 text-xs text-gray-500">
                                    {user?.prenom} est en train d'écrire...
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* Aucune conversation sélectionnée */
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <div className="mb-4">
                                <img src="/images/chat-a-bulles.png" alt="Chat" className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Sélectionnez une conversation
                            </h3>
                            <p className="text-gray-600">
                                Choisissez une conversation dans la liste pour commencer à discuter
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Composant personnalisé pour la liste des conversations avec historique des services
const ConversationListAvecHistorique = ({ onSelectConversation, prestatairesAvecHistorique }) => {
    const { getUserConversations, getOrCreateConversation } = useChat(); // Récupérer les conversations existantes et la fonction de création
    const conversations = getUserConversations(); // Liste des conversations de l'utilisateur

    // Fonction pour formater la date de dernière réservation
    const formaterDateReservation = (dateString) => {
        const date = new Date(dateString);
        const maintenant = new Date();
        const diff = maintenant - date;
        
        if (diff < 86400000) { // Moins d'un jour
            return 'Aujourd\'hui';
        } else if (diff < 604800000) { // Moins d'une semaine
            return `Il y a ${Math.floor(diff / 86400000)} jour${Math.floor(diff / 86400000) > 1 ? 's' : ''}`;
        } else {
            return date.toLocaleDateString('fr-FR');
        }
    };

    // Fonction pour obtenir le nombre de services rendus
    const obtenirNombreServices = (prestataire) => {
        return prestataire.servicesRendus ? prestataire.servicesRendus.length : 0;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
            {/* En-tête de la liste */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <img src="/images/chat-a-bulles.png" alt="Chat" className="w-5 h-5" />
                    Mes Prestataires
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                    Prestataires ayant déjà rendu des services
                </p>
            </div>
            
            {/* Liste des prestataires */}
            <div className="max-h-full overflow-y-auto">
                {prestatairesAvecHistorique.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        <div className="text-4xl mb-3">💅</div>
                        <p className="text-sm font-medium">Aucun service rendu</p>
                        <p className="text-xs mt-1">
                            Réservez votre premier service pour commencer à discuter avec vos prestataires
                        </p>
                    </div>
                ) : (
                    prestatairesAvecHistorique.map(prestataire => (
                        <div
                            key={prestataire.id}
                            onClick={() => {
                                // Créer ou récupérer la conversation avec ce prestataire
                                const conversation = getOrCreateConversation(prestataire.id, {
                                    nom: prestataire.nom,
                                    prenom: prestataire.prenom,
                                    specialite: prestataire.specialite,
                                    image: prestataire.image,
                                    servicesRendus: prestataire.servicesRendus,
                                    derniereReservation: prestataire.derniereReservation
                                });
                                onSelectConversation(conversation);
                            }}
                            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-sm"
                        >
                            <div className="flex items-start space-x-3">
                                {/* Photo du prestataire */}
                                <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                                    {prestataire.prenom?.charAt(0) || 'U'}
                                </div>
                                
                                {/* Informations du prestataire */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-medium text-gray-800 truncate">
                                            {prestataire.prenom} {prestataire.nom}
                                        </h4>
                                        <span className="text-xs text-gray-500">
                                            {formaterDateReservation(prestataire.derniereReservation)}
                                        </span>
                                    </div>
                                    
                                    {/* Spécialité */}
                                    <p className="text-sm text-purple-600 font-medium mb-2">
                                        {prestataire.specialite}
                                    </p>
                                    
                                    {/* Historique des services */}
                                    <div className="space-y-1">
                                        <div className="flex items-center text-xs text-gray-600">
                                            <span className="mr-1">📋</span>
                                            <span>{obtenirNombreServices(prestataire)} service{obtenirNombreServices(prestataire) > 1 ? 's' : ''} rendu{obtenirNombreServices(prestataire) > 1 ? 's' : ''}</span>
                                        </div>
                                        
                                        {/* Derniers services */}
                                        {prestataire.servicesRendus && prestataire.servicesRendus.slice(0, 2).map((service, index) => (
                                            <div key={index} className="text-xs text-gray-500 flex items-center">
                                                <span className="mr-1">✨</span>
                                                <span className="truncate">{service.service}</span>
                                                <span className="ml-1 text-green-600 font-medium">
                                                    {service.prix.toLocaleString()} FCFA
                                                </span>
                                            </div>
                                        ))}
                                        
                                        {/* Indicateur de plus de services */}
                                        {obtenirNombreServices(prestataire) > 2 && (
                                            <div className="text-xs text-gray-400">
                                                +{obtenirNombreServices(prestataire) - 2} autre{obtenirNombreServices(prestataire) - 2 > 1 ? 's' : ''} service{obtenirNombreServices(prestataire) - 2 > 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatInterface;
