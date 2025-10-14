// Composant pour afficher la liste des clients d'un prestataire
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dataLoader from '../data/dataLoader';
import UserAvatar from './UserAvatar';

function MesClients() {
    const navigate = useNavigate();
    const [prestataire, setPrestataire] = useState(null);
    const [clients, setClients] = useState([]);
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
        
        if (!prestataireData) {
            navigate('/');
            return;
        }

        setPrestataire(prestataireData);
        
        // Récupérer les réservations du prestataire
        const mesReservations = data.reservations.filter(r => r.prestataireId === prestataireData.id);
        setReservations(mesReservations);
        
        // Récupérer les clients uniques qui ont réservé
        const clientIds = [...new Set(mesReservations.map(r => r.clientId))];
        const mesClients = data.clients.filter(c => clientIds.includes(c.id));
        
        // Ajouter les statistiques pour chaque client
        const clientsAvecStats = mesClients.map(client => {
            const reservationsClient = mesReservations.filter(r => r.clientId === client.id);
            const montantTotal = reservationsClient.reduce((total, res) => {
                const service = data.services.find(s => s.id === res.serviceId);
                return total + (service ? service.prix : 0);
            }, 0);
            
            return {
                ...client,
                nombreReservations: reservationsClient.length,
                montantTotal: montantTotal,
                derniereReservation: reservationsClient.sort((a, b) => 
                    new Date(b.date) - new Date(a.date)
                )[0]
            };
        });
        
        setClients(clientsAvecStats);
        setServices(data.services);
        setLoading(false);
    }, [navigate]);

    const seDeconnecter = () => {
        localStorage.removeItem('utilisateurConnecte');
        navigate('/connexion');
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
            {/* En-tête */}
            <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">👥 Mes Clients</h1>
                            <p className="text-pink-100 mt-1">
                                {clients.length} client{clients.length > 1 ? 's' : ''} au total
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/dashboard-prestataire')}
                                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
                            >
                                ← Retour au dashboard
                            </button>
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

            {/* Contenu principal */}
            <main className="max-w-7xl mx-auto p-8">
                {clients.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">👥</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Aucun client pour le moment
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Vous n'avez pas encore de réservations confirmées
                        </p>
                        <button
                            onClick={() => navigate('/dashboard-prestataire')}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition"
                        >
                            Retour au dashboard
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clients.map(client => (
                            <div 
                                key={client.id}
                                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
                            >
                                {/* Avatar et nom du client */}
                                <div className="flex items-center gap-4 mb-4">
                                    <UserAvatar user={client} size="lg" />
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">
                                            {client.prenom} {client.nom}
                                        </h3>
                                        <p className="text-sm text-gray-600">{client.email}</p>
                                    </div>
                                </div>

                                {/* Statistiques du client */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <span className="text-sm text-gray-600">📅 Réservations</span>
                                        <span className="font-bold text-blue-600">
                                            {client.nombreReservations}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="text-sm text-gray-600">💰 Total dépensé</span>
                                        <span className="font-bold text-green-600">
                                            {client.montantTotal.toLocaleString()} FCFA
                                        </span>
                                    </div>

                                    {client.derniereReservation && (
                                        <div className="p-3 bg-purple-50 rounded-lg">
                                            <span className="text-sm text-gray-600 block mb-1">
                                                🕐 Dernière réservation
                                            </span>
                                            <span className="text-xs text-purple-600">
                                                {new Date(client.derniereReservation.date).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            // Préparer les infos pour le chat
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
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition flex items-center justify-center gap-2"
                                    >
                                        <img src="/images/chat-a-bulles.png" alt="Chat" className="w-4 h-4" />
                                        Contacter
                                    </button>
                                    
                                    <button
                                        onClick={() => navigate(`/client/${client.id}`)}
                                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition"
                                    >
                                        Voir profil
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default MesClients;
