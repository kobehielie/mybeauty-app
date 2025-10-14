// Composant pour afficher le profil détaillé d'un client (vue prestataire)
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dataLoader from '../data/dataLoader';
import UserAvatar from './UserAvatar';

function ProfilClient() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [client, setClient] = useState(null);
    const [prestataire, setPrestataire] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Vérifier si un prestataire est connecté
        const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte'));
        
        if (!utilisateurConnecte || utilisateurConnecte.role !== 'prestataire') {
            navigate('/connexion');
            return;
        }

        // Charger les données
        const data = dataLoader.loadAll();
        const prestataireData = data.prestataires.find(p => p.id === utilisateurConnecte.id);
        const clientData = data.clients.find(c => c.id === parseInt(id));
        
        if (!prestataireData || !clientData) {
            navigate('/mes-clients');
            return;
        }

        setPrestataire(prestataireData);
        setClient(clientData);
        
        // Récupérer les réservations du client avec ce prestataire
        const reservationsClient = data.reservations.filter(
            r => r.clientId === clientData.id && r.prestataireId === prestataireData.id
        );
        setReservations(reservationsClient);
        setServices(data.services);
        setLoading(false);
    }, [id, navigate]);

    const seDeconnecter = () => {
        localStorage.removeItem('utilisateurConnecte');
        navigate('/connexion');
    };

    const getServiceById = (serviceId) => {
        return services.find(s => s.id === serviceId);
    };

    const getStatutBadge = (statut) => {
        const badges = {
            'confirmée': 'bg-green-100 text-green-700',
            'en_attente': 'bg-yellow-100 text-yellow-700',
            'annulée': 'bg-red-100 text-red-700',
            'terminée': 'bg-blue-100 text-blue-700'
        };
        return badges[statut] || 'bg-gray-100 text-gray-700';
    };

    const calculerStatistiques = () => {
        const montantTotal = reservations.reduce((total, res) => {
            const service = getServiceById(res.serviceId);
            return total + (service ? service.prix : 0);
        }, 0);

        const reservationsConfirmees = reservations.filter(r => r.statut === 'confirmée').length;
        const reservationsEnAttente = reservations.filter(r => r.statut === 'en_attente').length;

        return {
            montantTotal,
            reservationsConfirmees,
            reservationsEnAttente
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">⏳</div>
                    <p className="text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    const stats = calculerStatistiques();

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
            {/* En-tête */}
            <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/mes-clients')}
                                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition"
                            >
                                ←
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold">Profil Client</h1>
                                <p className="text-pink-100 mt-1">
                                    Informations détaillées
                                </p>
                            </div>
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

            {/* Contenu principal */}
            <main className="max-w-7xl mx-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Colonne gauche - Informations du client */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Carte profil */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="text-center mb-6">
                                <UserAvatar user={client} size="xl" className="mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {client.prenom} {client.nom}
                                </h2>
                                <p className="text-gray-600 text-sm mt-1">{client.email}</p>
                                {client.telephone && (
                                    <p className="text-gray-600 text-sm">📞 {client.telephone}</p>
                                )}
                            </div>

                            {/* Statistiques */}
                            <div className="space-y-3">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-1">📅 Réservations totales</div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {reservations.length}
                                    </div>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-1">💰 Montant total</div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {stats.montantTotal.toLocaleString()} FCFA
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-yellow-50 p-3 rounded-lg">
                                        <div className="text-xs text-gray-600 mb-1">⏳ En attente</div>
                                        <div className="text-xl font-bold text-yellow-600">
                                            {stats.reservationsEnAttente}
                                        </div>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded-lg">
                                        <div className="text-xs text-gray-600 mb-1">✅ Confirmées</div>
                                        <div className="text-xl font-bold text-purple-600">
                                            {stats.reservationsConfirmees}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={() => {
                                        const clientInfo = {
                                            id: client.id,
                                            nom: client.nom,
                                            prenom: client.prenom,
                                            email: client.email,
                                            image: client.image
                                        };
                                        localStorage.setItem('clientPourChat', JSON.stringify(clientInfo));
                                        navigate('/chat');
                                    }}
                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition flex items-center justify-center gap-2"
                                >
                                    <img src="/images/chat-a-bulles.png" alt="Chat" className="w-5 h-5" />
                                    Contacter le client
                                </button>

                                {client.preferencePaiement && (
                                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                                        <div className="text-xs text-gray-600 mb-1">Préférence de paiement</div>
                                        <div className="text-sm font-semibold text-gray-800">
                                            {client.preferencePaiement.replace('_', ' ').toUpperCase()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Colonne droite - Historique des réservations */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">
                                📋 Historique des réservations
                            </h3>

                            {reservations.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📅</div>
                                    <p className="text-gray-600">Aucune réservation pour le moment</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reservations
                                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                                        .map((reservation, index) => {
                                            const service = getServiceById(reservation.serviceId);
                                            return (
                                                <div 
                                                    key={index}
                                                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-pink-300 transition"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-lg text-gray-800">
                                                                {service ? service.nom : 'Service inconnu'}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {service ? service.description : ''}
                                                            </p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatutBadge(reservation.statut)}`}>
                                                            {reservation.statut}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <span className="font-medium text-gray-600">📅 Date:</span>
                                                            <p className="text-gray-800">
                                                                {new Date(reservation.date).toLocaleDateString('fr-FR', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">🕐 Heure:</span>
                                                            <p className="text-gray-800">
                                                                {new Date(reservation.date).toLocaleTimeString('fr-FR', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                                                        <span className="text-xl font-bold text-pink-600">
                                                            {service ? service.prix.toLocaleString() : '0'} FCFA
                                                        </span>
                                                        {service && (
                                                            <span className="text-sm text-gray-600">
                                                                ⏱️ {service.duree} min
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ProfilClient;
