// Importer les outils React dont on a besoin
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Importer les composants de la carte Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Importer le fichier qui charge les données
import dataLoader from '../data/dataLoader';

// Importer le style CSS pour la carte
import 'leaflet/dist/leaflet.css';

// Configuration des icônes de la carte
// (Leaflet a besoin qu'on lui dise où trouver les images des marqueurs)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Composant qui affiche la carte avec la localisation du prestataire
function LocalisationPrestataire() {
    // Pour naviguer vers d'autres pages
    const navigate = useNavigate();
    
    // Pour récupérer les données passées depuis la page précédente
    const location = useLocation();
    
    // Variable pour stocker les infos de la réservation (service + prestataire)
    const [reservationData, setReservationData] = useState(null);
    
    // Variable pour afficher des messages d'erreur
    const [messageErreur, setMessageErreur] = useState('');

    // useEffect s'exécute quand la page se charge
    useEffect(() => {
        // D'abord, on essaie de récupérer les données depuis la navigation
        if (location.state && location.state.service && location.state.prestataire) {
            // Si on a les données, on les met dans notre variable
            const donnees = {
                service: location.state.service,
                prestataire: location.state.prestataire,
                date: location.state.date || new Date().toLocaleDateString('fr-FR'),
                heure: location.state.heure || '10:00'
            };
            setReservationData(donnees);
        } else {
            // Sinon, on essaie de les récupérer depuis la mémoire du navigateur
            const reservationSauvegardee = localStorage.getItem('reservationEnCours');
            
            if (reservationSauvegardee) {
                // On transforme le texte en objet JavaScript
                const donnees = JSON.parse(reservationSauvegardee);
                setReservationData(donnees);
            } else {
                // Si on ne trouve rien, on retourne à l'accueil
                setMessageErreur('Veuillez d\'abord sélectionner un service');
                navigate('/');
            }
        }
    }, [location, navigate]);

    // Fonction appelée quand on clique sur "Continuer vers le paiement"
    function allerAuPaiement() {
        navigate('/paiement', {
            state: reservationData
        });
    }

    // Si les données ne sont pas encore chargées, on affiche un loader
    if (!reservationData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto"></div>
                    {messageErreur && <p className="mt-4 text-gray-600">{messageErreur}</p>}
                </div>
            </div>
        );
    }

    // Récupérer le prestataire et le service
    let prestataire = reservationData.prestataire;
    let service = reservationData.service;
    
    // Si le prestataire n'a pas de coordonnées GPS, on essaie de les récupérer depuis le fichier de données
    if (!prestataire.latitude || !prestataire.longitude) {
        const toutesLesDonnees = dataLoader.loadAll();
        const prestataireComplet = toutesLesDonnees.prestataires.find(p => p.id === prestataire.id);
        
        if (prestataireComplet) {
            prestataire = prestataireComplet;
        }
    }

    // Préparer les coordonnées GPS pour la carte
    let latitude = prestataire.latitude;
    let longitude = prestataire.longitude;
    
    // Si la latitude ou longitude est un texte, on la convertit en nombre
    if (typeof latitude === 'string') {
        latitude = parseFloat(latitude);
    }
    if (typeof longitude === 'string') {
        longitude = parseFloat(longitude);
    }
    
    // Vérifier que les coordonnées sont valides
    let coordonneesValides = false;
    if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
        coordonneesValides = true;
    }
    
    // Position par défaut (centre d'Abidjan) si le prestataire n'a pas de coordonnées
    let centreAbidjan = [5.3600, -4.0083];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
                        💅 MyBeauty
                    </h1>
                    <button 
                        onClick={() => navigate(-1)}
                        className="bg-white text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-100 transition"
                    >
                        ← Retour
                    </button>
                </div>
            </header>

            <div className="max-w-6xl mx-auto p-8">
                {/* Carte d'information */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                        🗺️ Localisation du prestataire
                    </h2>
                    
                    {/* Info prestataire */}
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl mb-6">
                        <div className="flex items-center gap-4 mb-4">
                            <img 
                                src={prestataire.image} 
                                alt={`${prestataire.prenom} ${prestataire.nom}`}
                                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {prestataire.prenom} {prestataire.nom}
                                </h3>
                                <p className="text-purple-600 font-semibold">{prestataire.specialite}</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-gray-700">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">📍 Adresse:</span>
                                <span>{prestataire.adresse}, {prestataire.quartier}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">🏙️ Ville:</span>
                                <span>{prestataire.ville}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">💇 Service:</span>
                                <span>{service.nom} - {service.prix.toLocaleString()} FCFA</span>
                            </div>
                        </div>
                    </div>

                    {/* Afficher un message si les coordonnées GPS manquent */}
                    {!coordonneesValides && (
                        <div className="p-4 mb-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl text-yellow-800">
                            <p className="font-semibold">Coordonnées manquantes pour ce prestataire.</p>
                            <p className="text-sm">Carte centrée sur Abidjan par défaut.</p>
                        </div>
                    )}
                    
                    {/* La carte interactive */}
                    <div className="rounded-xl overflow-hidden shadow-lg border-4 border-purple-200" style={{ height: '500px' }}>
                        <MapContainer 
                            center={coordonneesValides ? [latitude, longitude] : centreAbidjan} 
                            zoom={coordonneesValides ? 15 : 12} 
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={true}
                        >
                            {/* Couche de tuiles (les images de la carte) */}
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            
                            {/* Marqueur sur la carte (seulement si on a les coordonnées) */}
                            {coordonneesValides && (
                                <Marker position={[latitude, longitude]}>
                                    <Popup>
                                        <div className="text-center p-2">
                                            <h3 className="font-bold text-lg">
                                                {prestataire.prenom} {prestataire.nom}
                                            </h3>
                                            <p className="text-purple-600 text-sm">{prestataire.specialite}</p>
                                            <p className="text-xs text-gray-600 mt-2">
                                                {prestataire.adresse}
                                            </p>
                                            <a
                                                href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block mt-2 bg-pink-500 text-white px-3 py-1 rounded text-xs hover:bg-pink-600"
                                            >
                                                🗺️ Itinéraire
                                            </a>
                                        </div>
                                    </Popup>
                                </Marker>
                            )}
                        </MapContainer>
                    </div>

                    {/* Afficher les horaires et le contact du prestataire */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Carte des horaires */}
                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                            <h4 className="font-bold text-gray-800 mb-2">🕐 Horaires</h4>
                            <p className="text-sm text-gray-700">
                                {prestataire.disponibilite24h 
                                    ? '24h/24, 7j/7' 
                                    : `${prestataire.heureOuverture} - ${prestataire.heureFermeture}`
                                }
                            </p>
                        </div>
                        
                        {/* Carte du contact */}
                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                            <h4 className="font-bold text-gray-800 mb-2">📞 Contact</h4>
                            <p className="text-sm text-gray-700">{prestataire.telephone}</p>
                        </div>
                    </div>

                    {/* Bouton pour aller à la page de paiement */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={allerAuPaiement}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            Continuer vers le paiement 💳
                        </button>
                        <p className="text-sm text-gray-500 mt-3">
                            Vous serez redirigé vers la page de paiement sécurisé
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Exporter le composant pour pouvoir l'utiliser ailleurs
export default LocalisationPrestataire;
