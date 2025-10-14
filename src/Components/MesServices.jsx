// Composant pour gérer les services d'un prestataire
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dataLoader from '../data/dataLoader';

function MesServices() {
    const navigate = useNavigate();
    const [prestataire, setPrestataire] = useState(null);
    const [services, setServices] = useState([]);
    const [tousLesServices, setTousLesServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modeEdition, setModeEdition] = useState(false);
    const [serviceEnEdition, setServiceEnEdition] = useState(null);
    const [showModal, setShowModal] = useState(false);

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
        setTousLesServices(data.services);
        
        // Récupérer les services du prestataire
        const mesServices = data.services.filter(s => 
            prestataireData.servicesProposed?.includes(s.id)
        );
        setServices(mesServices);
        setLoading(false);
    }, [navigate]);

    const seDeconnecter = () => {
        localStorage.removeItem('utilisateurConnecte');
        navigate('/connexion');
    };

    const ouvrirModalEdition = (service) => {
        setServiceEnEdition({...service});
        setModeEdition(true);
        setShowModal(true);
    };

    const ouvrirModalAjout = () => {
        setServiceEnEdition({
            nom: '',
            description: '',
            prix: '',
            duree: '',
            image: ''
        });
        setModeEdition(false);
        setShowModal(true);
    };

    const fermerModal = () => {
        setShowModal(false);
        setServiceEnEdition(null);
    };

    const sauvegarderService = () => {
        // Ici, vous pouvez ajouter la logique pour sauvegarder dans une base de données
        // Pour l'instant, on met à jour le localStorage
        
        if (modeEdition) {
            // Modifier un service existant
            const servicesUpdated = services.map(s => 
                s.id === serviceEnEdition.id ? serviceEnEdition : s
            );
            setServices(servicesUpdated);
        } else {
            // Ajouter un nouveau service
            const nouveauService = {
                ...serviceEnEdition,
                id: Date.now(), // ID temporaire
            };
            setServices([...services, nouveauService]);
        }
        
        fermerModal();
    };

    const supprimerService = (serviceId) => {
        if (window.confirm('Êtes-vous sûr de vouloir retirer ce service de votre catalogue ?')) {
            const servicesUpdated = services.filter(s => s.id !== serviceId);
            setServices(servicesUpdated);
        }
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
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/profil')}
                                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition"
                            >
                                ←
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold">📋 Mes Services</h1>
                                <p className="text-pink-100 mt-1">
                                    Gérez votre catalogue de services
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
                {/* Bouton d'ajout */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {services.length} service{services.length > 1 ? 's' : ''} dans votre catalogue
                        </h2>
                        <p className="text-gray-600 text-sm mt-1">
                            Cliquez sur un service pour le modifier
                        </p>
                    </div>
                    <button
                        onClick={ouvrirModalAjout}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition flex items-center gap-2"
                    >
                        ➕ Ajouter un service
                    </button>
                </div>

                {/* Liste des services */}
                {services.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Aucun service dans votre catalogue
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Commencez par ajouter vos premiers services
                        </p>
                        <button
                            onClick={ouvrirModalAjout}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition"
                        >
                            ➕ Ajouter mon premier service
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map(service => (
                            <div 
                                key={service.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
                            >
                                {/* Image du service */}
                                <div className="relative h-48">
                                    <img
                                        src={service.image || 'https://via.placeholder.com/400'}
                                        alt={service.nom}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        {service.prix?.toLocaleString()} FCFA
                                    </div>
                                </div>

                                {/* Informations du service */}
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                                        {service.nom}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {service.description}
                                    </p>
                                    
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                        <span>⏱️ {service.duree} min</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => ouvrirModalEdition(service)}
                                            className="flex-1 bg-blue-100 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-200 transition text-sm font-semibold"
                                        >
                                            ✏️ Modifier
                                        </button>
                                        <button
                                            onClick={() => supprimerService(service.id)}
                                            className="flex-1 bg-red-100 text-red-600 py-2 px-4 rounded-lg hover:bg-red-200 transition text-sm font-semibold"
                                        >
                                            🗑️ Retirer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal d'édition/ajout */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {modeEdition ? '✏️ Modifier le service' : '➕ Ajouter un service'}
                                </h2>
                                <button
                                    onClick={fermerModal}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Nom du service */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nom du service *
                                    </label>
                                    <input
                                        type="text"
                                        value={serviceEnEdition?.nom || ''}
                                        onChange={(e) => setServiceEnEdition({...serviceEnEdition, nom: e.target.value})}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                                        placeholder="Ex: Coupe femme"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        value={serviceEnEdition?.description || ''}
                                        onChange={(e) => setServiceEnEdition({...serviceEnEdition, description: e.target.value})}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                                        rows="3"
                                        placeholder="Décrivez votre service..."
                                    />
                                </div>

                                {/* Prix et Durée */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Prix (FCFA) *
                                        </label>
                                        <input
                                            type="number"
                                            value={serviceEnEdition?.prix || ''}
                                            onChange={(e) => setServiceEnEdition({...serviceEnEdition, prix: parseInt(e.target.value)})}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                                            placeholder="15000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Durée (minutes) *
                                        </label>
                                        <input
                                            type="number"
                                            value={serviceEnEdition?.duree || ''}
                                            onChange={(e) => setServiceEnEdition({...serviceEnEdition, duree: parseInt(e.target.value)})}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                                            placeholder="45"
                                        />
                                    </div>
                                </div>

                                {/* URL de l'image */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        URL de l'image
                                    </label>
                                    <input
                                        type="text"
                                        value={serviceEnEdition?.image || ''}
                                        onChange={(e) => setServiceEnEdition({...serviceEnEdition, image: e.target.value})}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                                        placeholder="https://..."
                                    />
                                </div>

                                {/* Aperçu de l'image */}
                                {serviceEnEdition?.image && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Aperçu
                                        </label>
                                        <img
                                            src={serviceEnEdition.image}
                                            alt="Aperçu"
                                            className="w-full h-48 object-cover rounded-lg"
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/400'}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={fermerModal}
                                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition font-semibold"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={sauvegarderService}
                                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition font-semibold"
                                >
                                    {modeEdition ? 'Sauvegarder' : 'Ajouter'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MesServices;
