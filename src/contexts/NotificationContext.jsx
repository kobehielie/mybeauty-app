// Système de notifications temps réel pour MyBeauty
import { createContext, useContext, useState, useEffect } from 'react';

// Créer le contexte de notifications
const NotificationContext = createContext();

// Hook personnalisé pour utiliser le contexte de notifications
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications doit être utilisé dans un NotificationProvider');
    }
    return context;
};

// Types de notifications
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    BOOKING: 'booking',
    PAYMENT: 'payment',
    MESSAGE: 'message'
};

// Composant Provider pour les notifications
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Charger les notifications depuis le localStorage au démarrage
    useEffect(() => {
        const savedNotifications = localStorage.getItem('mybeauty_notifications');
        if (savedNotifications) {
            const parsed = JSON.parse(savedNotifications);
            setNotifications(parsed);
            setUnreadCount(parsed.filter(n => !n.read).length);
        }
    }, []);

    // Sauvegarder les notifications dans le localStorage
    useEffect(() => {
        localStorage.setItem('mybeauty_notifications', JSON.stringify(notifications));
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);

    // Fonction pour ajouter une notification
    const addNotification = (notification) => {
        const newNotification = {
            id: Date.now() + Math.random(),
            type: notification.type || NOTIFICATION_TYPES.INFO,
            title: notification.title || 'Notification',
            message: notification.message || '',
            timestamp: new Date().toISOString(),
            read: false,
            persistent: notification.persistent || false,
            action: notification.action || null,
            ...notification
        };

        setNotifications(prev => [newNotification, ...prev]);

        // Auto-supprimer les notifications non persistantes après 5 secondes
        if (!newNotification.persistent) {
            setTimeout(() => {
                removeNotification(newNotification.id);
            }, 5000);
        }

        return newNotification.id;
    };

    // Fonction pour supprimer une notification
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // Fonction pour marquer une notification comme lue
    const markAsRead = (id) => {
        setNotifications(prev => 
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    // Fonction pour marquer toutes les notifications comme lues
    const markAllAsRead = () => {
        setNotifications(prev => 
            prev.map(n => ({ ...n, read: true }))
        );
    };

    // Fonction pour supprimer toutes les notifications
    const clearAll = () => {
        setNotifications([]);
    };

    // Fonctions de convenance pour différents types de notifications
    const notifySuccess = (title, message, options = {}) => {
        return addNotification({
            type: NOTIFICATION_TYPES.SUCCESS,
            title,
            message,
            ...options
        });
    };

    const notifyError = (title, message, options = {}) => {
        return addNotification({
            type: NOTIFICATION_TYPES.ERROR,
            title,
            message,
            persistent: true, // Les erreurs sont persistantes par défaut
            ...options
        });
    };

    const notifyWarning = (title, message, options = {}) => {
        return addNotification({
            type: NOTIFICATION_TYPES.WARNING,
            title,
            message,
            ...options
        });
    };

    const notifyInfo = (title, message, options = {}) => {
        return addNotification({
            type: NOTIFICATION_TYPES.INFO,
            title,
            message,
            ...options
        });
    };

    const notifyBooking = (title, message, options = {}) => {
        return addNotification({
            type: NOTIFICATION_TYPES.BOOKING,
            title,
            message,
            persistent: true,
            ...options
        });
    };

    const notifyPayment = (title, message, options = {}) => {
        return addNotification({
            type: NOTIFICATION_TYPES.PAYMENT,
            title,
            message,
            persistent: true,
            ...options
        });
    };

    const notifyMessage = (title, message, options = {}) => {
        return addNotification({
            type: NOTIFICATION_TYPES.MESSAGE,
            title,
            message,
            persistent: true,
            ...options
        });
    };

    // Valeurs fournies par le contexte
    const value = {
        notifications,
        unreadCount,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        notifySuccess,
        notifyError,
        notifyWarning,
        notifyInfo,
        notifyBooking,
        notifyPayment,
        notifyMessage
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

// Composant de notification individuelle
export const NotificationItem = ({ notification, onClose, onMarkAsRead }) => {
    const getIcon = () => {
        switch (notification.type) {
            case NOTIFICATION_TYPES.SUCCESS:
                return '✅';
            case NOTIFICATION_TYPES.ERROR:
                return '❌';
            case NOTIFICATION_TYPES.WARNING:
                return '⚠️';
            case NOTIFICATION_TYPES.INFO:
                return 'ℹ️';
            case NOTIFICATION_TYPES.BOOKING:
                return '📅';
            case NOTIFICATION_TYPES.PAYMENT:
                return '💳';
            case NOTIFICATION_TYPES.MESSAGE:
                return <img src="/images/chat-a-bulles.png" alt="Message" className="w-5 h-5 inline" />;
            default:
                return '📢';
        }
    };

    const getColorClasses = () => {
        switch (notification.type) {
            case NOTIFICATION_TYPES.SUCCESS:
                return 'bg-green-50 border-green-200 text-green-800';
            case NOTIFICATION_TYPES.ERROR:
                return 'bg-red-50 border-red-200 text-red-800';
            case NOTIFICATION_TYPES.WARNING:
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case NOTIFICATION_TYPES.INFO:
                return 'bg-blue-50 border-blue-200 text-blue-800';
            case NOTIFICATION_TYPES.BOOKING:
                return 'bg-purple-50 border-purple-200 text-purple-800';
            case NOTIFICATION_TYPES.PAYMENT:
                return 'bg-indigo-50 border-indigo-200 text-indigo-800';
            case NOTIFICATION_TYPES.MESSAGE:
                return 'bg-pink-50 border-pink-200 text-pink-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const formatTimestamp = (timestamp) => {
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

    return (
        <div className={`p-4 rounded-lg border-l-4 ${getColorClasses()} ${!notification.read ? 'opacity-100' : 'opacity-75'}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                    <span className="text-lg">{getIcon()}</span>
                    <div className="flex-1">
                        <h4 className="font-semibold text-sm">{notification.title}</h4>
                        <p className="text-sm mt-1">{notification.message}</p>
                        <p className="text-xs mt-2 opacity-75">{formatTimestamp(notification.timestamp)}</p>
                        {notification.action && (
                            <button
                                onClick={notification.action.onClick}
                                className="mt-2 text-xs underline hover:no-underline"
                            >
                                {notification.action.label}
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {!notification.read && (
                        <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="text-xs underline hover:no-underline"
                        >
                            Marquer comme lu
                        </button>
                    )}
                    <button
                        onClick={() => onClose(notification.id)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
};

// Composant de liste des notifications
export const NotificationList = () => {
    const { notifications, removeNotification, markAsRead, markAllAsRead, clearAll } = useNotifications();

    if (notifications.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📭</div>
                <p>Aucune notification</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:underline"
                    >
                        Tout marquer comme lu
                    </button>
                    <button
                        onClick={clearAll}
                        className="text-xs text-red-600 hover:underline"
                    >
                        Tout supprimer
                    </button>
                </div>
            </div>
            {notifications.map(notification => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClose={removeNotification}
                    onMarkAsRead={markAsRead}
                />
            ))}
        </div>
    );
};

// Composant de badge de notification
export const NotificationBadge = ({ className = "" }) => {
    const { unreadCount } = useNotifications();

    if (unreadCount === 0) return null;

    return (
        <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full ${className}`}>
            {unreadCount > 99 ? '99+' : unreadCount}
        </span>
    );
};

// Hook pour les notifications de réservation
export const useBookingNotifications = () => {
    const { notifyBooking, notifySuccess, notifyError } = useNotifications();

    const notifyBookingCreated = (bookingDetails) => {
        notifyBooking(
            'Nouvelle réservation',
            `Réservation créée pour ${bookingDetails.service} le ${bookingDetails.date}`,
            {
                action: {
                    label: 'Voir les détails',
                    onClick: () => {
                        // Navigation vers les détails de la réservation
                        console.log('Aller aux détails de la réservation');
                    }
                }
            }
        );
    };

    const notifyBookingConfirmed = (bookingDetails) => {
        notifySuccess(
            'Réservation confirmée',
            `Votre réservation du ${bookingDetails.date} a été confirmée par ${bookingDetails.prestataire}`
        );
    };

    const notifyBookingCancelled = (bookingDetails) => {
        notifyError(
            'Réservation annulée',
            `Votre réservation du ${bookingDetails.date} a été annulée`
        );
    };

    return {
        notifyBookingCreated,
        notifyBookingConfirmed,
        notifyBookingCancelled
    };
};

export default {
    NotificationProvider,
    useNotifications,
    NotificationItem,
    NotificationList,
    NotificationBadge,
    useBookingNotifications,
    NOTIFICATION_TYPES
};
