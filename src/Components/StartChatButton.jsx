// Composant pour démarrer une conversation avec un prestataire
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/SimpleAuthContext';
import { useNotifications } from '../contexts/NotificationContext';

function StartChatButton({ prestataire }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getOrCreateConversation } = useChat();
    const { notifySuccess } = useNotifications();

    const handleStartChat = () => {
        if (!user) {
            navigate('/connexion');
            return;
        }

        if (user.id === prestataire.id) {
            alert('Vous ne pouvez pas vous envoyer un message à vous-même !');
            return;
        }

        // Créer ou récupérer la conversation
        const conversation = getOrCreateConversation(prestataire.id, {
            id: prestataire.id,
            nom: prestataire.nom,
            prenom: prestataire.prenom,
            specialite: prestataire.specialite,
            image: prestataire.image
        });

        if (conversation) {
            notifySuccess(
                'Conversation démarrée',
                `Vous pouvez maintenant discuter avec ${prestataire.prenom} ${prestataire.nom}`
            );
            navigate('/chat');
        }
    };

    return (
        <button
            onClick={handleStartChat}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition font-semibold flex items-center justify-center space-x-2"
        >
            <img src="/images/chat-a-bulles.png" alt="Chat" className="w-5 h-5" />
            <span>Envoyer un message</span>
        </button>
    );
}

export default StartChatButton;
