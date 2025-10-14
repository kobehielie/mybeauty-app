// Système de chat intégré pour MyBeauty
import { createContext, useContext, useState, useEffect } from 'react';

// Créer le contexte de chat
const ChatContext = createContext();

// Hook personnalisé pour utiliser le contexte de chat
export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat doit être utilisé dans un ChatProvider');
    }
    return context;
};

// Types de messages
export const MESSAGE_TYPES = {
    TEXT: 'text',
    IMAGE: 'image',
    BOOKING_REQUEST: 'booking_request',
    BOOKING_CONFIRMATION: 'booking_confirmation',
    PAYMENT_REQUEST: 'payment_request',
    SYSTEM: 'system'
};

// Statuts des conversations
export const CONVERSATION_STATUS = {
    ACTIVE: 'active',
    ARCHIVED: 'archived',
    BLOCKED: 'blocked'
};

// Composant Provider pour le chat
export const ChatProvider = ({ children }) => {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOnline, setIsOnline] = useState(true);

    // Charger les conversations depuis le localStorage au démarrage
    useEffect(() => {
        const savedConversations = localStorage.getItem('mybeauty_conversations');
        const savedMessages = localStorage.getItem('mybeauty_messages');
        
        if (savedConversations) {
            setConversations(JSON.parse(savedConversations));
        }
        
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }

        // Calculer le nombre de messages non lus
        calculateUnreadCount();
    }, []);

    // Sauvegarder les conversations et messages dans le localStorage
    useEffect(() => {
        localStorage.setItem('mybeauty_conversations', JSON.stringify(conversations));
        localStorage.setItem('mybeauty_messages', JSON.stringify(messages));
        calculateUnreadCount();
    }, [conversations, messages]);

    // Calculer le nombre de messages non lus
    const calculateUnreadCount = () => {
        const unread = messages.filter(msg => !msg.read && msg.senderId !== getCurrentUserId()).length;
        setUnreadCount(unread);
    };

    // Fonction pour obtenir l'ID de l'utilisateur actuel (simulation)
    const getCurrentUserId = () => {
        const user = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        return user.id || null;
    };

    // Fonction pour créer ou récupérer une conversation
    const getOrCreateConversation = (participantId, participantInfo) => {
        const currentUserId = getCurrentUserId();
        if (!currentUserId) return null;

        // Chercher une conversation existante
        let conversation = conversations.find(conv => 
            conv.participants.includes(currentUserId) && 
            conv.participants.includes(participantId)
        );

        // Créer une nouvelle conversation si elle n'existe pas
        if (!conversation) {
            conversation = {
                id: Date.now(),
                participants: [currentUserId, participantId],
                participantInfo: participantInfo,
                status: CONVERSATION_STATUS.ACTIVE,
                createdAt: new Date().toISOString(),
                lastMessageAt: new Date().toISOString(),
                lastMessage: null
            };
            setConversations(prev => [conversation, ...prev]);
        }

        return conversation;
    };

    // Fonction pour envoyer un message
    const sendMessage = (conversationId, content, type = MESSAGE_TYPES.TEXT, metadata = {}) => {
        const currentUserId = getCurrentUserId();
        if (!currentUserId) return null;

        const message = {
            id: Date.now() + Math.random(),
            conversationId,
            senderId: currentUserId,
            content,
            type,
            metadata,
            timestamp: new Date().toISOString(),
            read: false,
            delivered: true
        };

        setMessages(prev => [...prev, message]);

        // Mettre à jour la conversation
        setConversations(prev => 
            prev.map(conv => 
                conv.id === conversationId 
                    ? { 
                        ...conv, 
                        lastMessageAt: message.timestamp,
                        lastMessage: content.substring(0, 50) + (content.length > 50 ? '...' : '')
                      }
                    : conv
            )
        );

        return message;
    };

    // Fonction pour marquer les messages comme lus
    const markMessagesAsRead = (conversationId) => {
        setMessages(prev => 
            prev.map(msg => 
                msg.conversationId === conversationId && !msg.read
                    ? { ...msg, read: true }
                    : msg
            )
        );
    };

    // Fonction pour obtenir les messages d'une conversation
    const getMessagesForConversation = (conversationId) => {
        return messages
            .filter(msg => msg.conversationId === conversationId)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    };

    // Fonction pour obtenir les conversations de l'utilisateur
    const getUserConversations = () => {
        const currentUserId = getCurrentUserId();
        if (!currentUserId) return [];

        return conversations
            .filter(conv => conv.participants.includes(currentUserId))
            .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
    };

    // Fonction pour archiver une conversation
    const archiveConversation = (conversationId) => {
        setConversations(prev => 
            prev.map(conv => 
                conv.id === conversationId 
                    ? { ...conv, status: CONVERSATION_STATUS.ARCHIVED }
                    : conv
            )
        );
    };

    // Fonction pour bloquer un utilisateur
    const blockUser = (conversationId) => {
        setConversations(prev => 
            prev.map(conv => 
                conv.id === conversationId 
                    ? { ...conv, status: CONVERSATION_STATUS.BLOCKED }
                    : conv
            )
        );
    };

    // Fonction pour supprimer une conversation
    const deleteConversation = (conversationId) => {
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        setMessages(prev => prev.filter(msg => msg.conversationId !== conversationId));
    };

    // Fonction pour envoyer un message de réservation
    const sendBookingRequest = (conversationId, bookingDetails) => {
        return sendMessage(conversationId, `Demande de réservation pour ${bookingDetails.service}`, MESSAGE_TYPES.BOOKING_REQUEST, bookingDetails);
    };

    // Fonction pour confirmer une réservation
    const confirmBooking = (conversationId, bookingDetails) => {
        return sendMessage(conversationId, `Réservation confirmée pour ${bookingDetails.service}`, MESSAGE_TYPES.BOOKING_CONFIRMATION, bookingDetails);
    };

    // Fonction pour envoyer une demande de paiement
    const requestPayment = (conversationId, paymentDetails) => {
        return sendMessage(conversationId, `Demande de paiement de ${paymentDetails.amount} FCFA`, MESSAGE_TYPES.PAYMENT_REQUEST, paymentDetails);
    };

    // Valeurs fournies par le contexte
    const value = {
        conversations,
        activeConversation,
        setActiveConversation,
        messages,
        unreadCount,
        isOnline,
        setIsOnline,
        getOrCreateConversation,
        sendMessage,
        markMessagesAsRead,
        getMessagesForConversation,
        getUserConversations,
        archiveConversation,
        blockUser,
        deleteConversation,
        sendBookingRequest,
        confirmBooking,
        requestPayment
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

// Composant de message individuel
export const MessageBubble = ({ message, isOwn, showAvatar = true }) => {
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const getMessageIcon = () => {
        switch (message.type) {
            case MESSAGE_TYPES.BOOKING_REQUEST:
                return '📅';
            case MESSAGE_TYPES.BOOKING_CONFIRMATION:
                return '✅';
            case MESSAGE_TYPES.PAYMENT_REQUEST:
                return '💳';
            case MESSAGE_TYPES.SYSTEM:
                return 'ℹ️';
            default:
                return null;
        }
    };

    const getMessageStyle = () => {
        if (message.type === MESSAGE_TYPES.SYSTEM) {
            return 'bg-gray-100 text-gray-600 text-center text-sm py-2 px-4 rounded-lg mx-auto max-w-xs';
        }
        
        if (isOwn) {
            return 'bg-pink-500 text-white ml-auto max-w-xs lg:max-w-md px-4 py-2 rounded-lg rounded-br-sm';
        } else {
            return 'bg-white text-gray-800 mr-auto max-w-xs lg:max-w-md px-4 py-2 rounded-lg rounded-bl-sm border border-gray-200';
        }
    };

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
            <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-xs lg:max-w-md`}>
                {showAvatar && !isOwn && (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                )}
                <div className={getMessageStyle()}>
                    {getMessageIcon() && (
                        <span className="mr-2">{getMessageIcon()}</span>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${isOwn ? 'text-pink-100' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                        {isOwn && (
                            <span className="ml-1">
                                {message.read ? '✓✓' : '✓'}
                            </span>
                        )}
                    </p>
                </div>
                {showAvatar && isOwn && (
                    <div className="w-8 h-8 bg-pink-300 rounded-full flex-shrink-0"></div>
                )}
            </div>
        </div>
    );
};

// Composant de liste des conversations
export const ConversationList = ({ onSelectConversation }) => {
    const { getUserConversations, unreadCount } = useChat();
    const conversations = getUserConversations();

    const formatLastMessageTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // Moins d'une minute
            return 'À l\'instant';
        } else if (diff < 3600000) { // Moins d'une heure
            return `Il y a ${Math.floor(diff / 60000)} min`;
        } else if (diff < 86400000) { // Moins d'un jour
            return `Il y a ${Math.floor(diff / 3600000)}h`;
        } else {
            return date.toLocaleDateString('fr-FR');
        }
    };

    const getUnreadCountForConversation = (conversationId) => {
        // Cette fonction devrait être implémentée pour compter les messages non lus par conversation
        return 0;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Messages</h3>
                {unreadCount > 0 && (
                    <span className="text-xs text-pink-600 font-medium">
                        {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
                    </span>
                )}
            </div>
            
            <div className="max-h-96 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        <div className="mb-2">
                            <img src="/images/chat-a-bulles.png" alt="Chat" className="w-12 h-12 mx-auto" />
                        </div>
                        <p className="text-sm">Aucune conversation</p>
                        <p className="text-xs">Commencez une conversation avec un prestataire</p>
                    </div>
                ) : (
                    conversations.map(conversation => (
                        <div
                            key={conversation.id}
                            onClick={() => onSelectConversation(conversation)}
                            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    {conversation.participantInfo?.prenom?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-gray-800 truncate">
                                            {conversation.participantInfo?.prenom} {conversation.participantInfo?.nom}
                                        </h4>
                                        <span className="text-xs text-gray-500">
                                            {formatLastMessageTime(conversation.lastMessageAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">
                                        {conversation.lastMessage || 'Aucun message'}
                                    </p>
                                    {getUnreadCountForConversation(conversation.id) > 0 && (
                                        <span className="inline-block bg-pink-500 text-white text-xs px-2 py-1 rounded-full mt-1">
                                            {getUnreadCountForConversation(conversation.id)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default {
    ChatProvider,
    useChat,
    MessageBubble,
    ConversationList,
    MESSAGE_TYPES,
    CONVERSATION_STATUS
};
