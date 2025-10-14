// Système de recherche avancée pour MyBeauty
import { useState, useEffect, useMemo } from 'react';
import dataLoader from '../data/dataLoader';

// Hook personnalisé pour la recherche
export const useSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        specialite: '',
        quartier: '',
        ville: 'Abidjan',
        prixMin: 0,
        prixMax: 100000,
        disponibilite: 'tous', // 'tous', 'maintenant', 'aujourdhui', 'demain'
        serviceDomicile: false,
        serviceSalon: true,
        noteMin: 0,
        tri: 'distance' // 'distance', 'note', 'prix', 'nom'
    });
    
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(false);

    // Charger les données
    const data = useMemo(() => dataLoader.loadAll(), []);

    // Obtenir la géolocalisation de l'utilisateur
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.log('Géolocalisation non disponible:', error);
                    // Coordonnées par défaut pour Abidjan
                    setUserLocation({
                        lat: 5.3600,
                        lng: -4.0083
                    });
                }
            );
        } else {
            // Coordonnées par défaut pour Abidjan
            setUserLocation({
                lat: 5.3600,
                lng: -4.0083
            });
        }
    }, []);

    // Fonction pour calculer la distance entre deux points
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371; // Rayon de la Terre en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    // Fonction pour obtenir les coordonnées d'un quartier (simulation)
    const getQuartierCoordinates = (quartier) => {
        // Coordonnées simulées pour les quartiers d'Abidjan
        const quartiersCoords = {
            'Cocody': { lat: 5.3600, lng: -4.0083 },
            'Plateau': { lat: 5.3200, lng: -4.0200 },
            'Marcory': { lat: 5.2800, lng: -4.0100 },
            'Koumassi': { lat: 5.3000, lng: -4.0300 },
            'Yopougon': { lat: 5.3400, lng: -4.0500 },
            'Adjamé': { lat: 5.3600, lng: -4.0400 },
            'Treichville': { lat: 5.3000, lng: -4.0000 },
            'Bingerville': { lat: 5.3800, lng: -3.9000 }
        };
        return quartiersCoords[quartier] || { lat: 5.3600, lng: -4.0083 };
    };

    // Fonction de recherche principale
    const searchResults = useMemo(() => {
        if (!data.prestataires) return [];

        let results = [...data.prestataires];

        // Filtre par terme de recherche (nom, spécialité, quartier)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            results = results.filter(prestataire => 
                prestataire.nom.toLowerCase().includes(term) ||
                prestataire.prenom.toLowerCase().includes(term) ||
                prestataire.specialite?.toLowerCase().includes(term) ||
                prestataire.quartier?.toLowerCase().includes(term) ||
                prestataire.ville?.toLowerCase().includes(term)
            );
        }

        // Filtre par spécialité
        if (filters.specialite) {
            results = results.filter(prestataire => 
                prestataire.specialite === filters.specialite
            );
        }

        // Filtre par ville
        if (filters.ville) {
            results = results.filter(prestataire => 
                prestataire.ville === filters.ville
            );
        }

        // Filtre par quartier
        if (filters.quartier) {
            results = results.filter(prestataire => 
                prestataire.quartier === filters.quartier
            );
        }

        // Filtre par type de service
        if (filters.serviceDomicile && !filters.serviceSalon) {
            results = results.filter(prestataire => 
                prestataire.serviceDomicile === true
            );
        } else if (filters.serviceSalon && !filters.serviceDomicile) {
            results = results.filter(prestataire => 
                prestataire.serviceSalon === true
            );
        }

        // Filtre par disponibilité
        if (filters.disponibilite !== 'tous') {
            const maintenant = new Date();
            const aujourdhui = maintenant.toISOString().split('T')[0];
            const demain = new Date(maintenant.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            
            results = results.filter(prestataire => {
                if (filters.disponibilite === 'maintenant') {
                    return prestataire.disponibilite24h || 
                           (prestataire.joursDisponibles?.includes(maintenant.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase()) &&
                            prestataire.heureOuverture <= maintenant.toTimeString().slice(0, 5) &&
                            prestataire.heureFermeture >= maintenant.toTimeString().slice(0, 5));
                } else if (filters.disponibilite === 'aujourdhui') {
                    return prestataire.disponibilite24h || 
                           prestataire.joursDisponibles?.includes(maintenant.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase());
                } else if (filters.disponibilite === 'demain') {
                    const demainJour = new Date(maintenant.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
                    return prestataire.disponibilite24h || 
                           prestataire.joursDisponibles?.includes(demainJour);
                }
                return true;
            });
        }

        // Calculer la distance et ajouter aux résultats
        results = results.map(prestataire => {
            let distance = null;
            if (userLocation && prestataire.quartier) {
                const quartierCoords = getQuartierCoordinates(prestataire.quartier);
                distance = calculateDistance(
                    userLocation.lat, userLocation.lng,
                    quartierCoords.lat, quartierCoords.lng
                );
            }
            return { ...prestataire, distance };
        });

        // Trier les résultats
        results.sort((a, b) => {
            switch (filters.tri) {
                case 'distance':
                    if (a.distance === null && b.distance === null) return 0;
                    if (a.distance === null) return 1;
                    if (b.distance === null) return -1;
                    return a.distance - b.distance;
                case 'note':
                    const noteA = a.avis?.length > 0 ? a.avis.reduce((sum, avis) => sum + avis.note, 0) / a.avis.length : 0;
                    const noteB = b.avis?.length > 0 ? b.avis.reduce((sum, avis) => sum + avis.note, 0) / b.avis.length : 0;
                    return noteB - noteA;
                case 'prix':
                    const prixA = a.catalogue?.length > 0 ? Math.min(...a.catalogue.map(s => s.prix)) : 0;
                    const prixB = b.catalogue?.length > 0 ? Math.min(...b.catalogue.map(s => s.prix)) : 0;
                    return prixA - prixB;
                case 'nom':
                    return (a.prenom + ' ' + a.nom).localeCompare(b.prenom + ' ' + b.nom);
                default:
                    return 0;
            }
        });

        return results;
    }, [data.prestataires, searchTerm, filters, userLocation]);

    // Fonction pour mettre à jour les filtres
    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Fonction pour réinitialiser les filtres
    const resetFilters = () => {
        setFilters({
            specialite: '',
            quartier: '',
            ville: 'Abidjan',
            prixMin: 0,
            prixMax: 100000,
            disponibilite: 'tous',
            serviceDomicile: false,
            serviceSalon: true,
            noteMin: 0,
            tri: 'distance'
        });
        setSearchTerm('');
    };

    // Fonction pour obtenir les options de filtres
    const getFilterOptions = () => {
        const specialites = [...new Set(data.prestataires?.map(p => p.specialite).filter(Boolean))];
        const quartiers = [...new Set(data.prestataires?.map(p => p.quartier).filter(Boolean))];
        const villes = [...new Set(data.prestataires?.map(p => p.ville).filter(Boolean))];

        return {
            specialites,
            quartiers,
            villes
        };
    };

    return {
        searchTerm,
        setSearchTerm,
        filters,
        updateFilter,
        resetFilters,
        searchResults,
        loading,
        userLocation,
        getFilterOptions
    };
};

// Composant de barre de recherche
export const SearchBar = ({ onSearch }) => {
    const [localSearchTerm, setLocalSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(localSearchTerm);
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
            <div className="relative">
                <input
                    type="text"
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                    placeholder="Rechercher un prestataire, une spécialité, un quartier..."
                    className="w-full px-6 py-4 pr-12 border-2 border-gray-300 rounded-full focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>
        </form>
    );
};

// Composant de filtres avancés
export const AdvancedFilters = ({ filters, updateFilter, resetFilters, options }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">🔍 Filtres avancés</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                        {isOpen ? 'Masquer' : 'Afficher'}
                    </button>
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                    >
                        Réinitialiser
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Spécialité */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Spécialité</label>
                        <select
                            value={filters.specialite}
                            onChange={(e) => updateFilter('specialite', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                        >
                            <option value="">Toutes les spécialités</option>
                            {options.specialites.map(specialite => (
                                <option key={specialite} value={specialite}>{specialite}</option>
                            ))}
                        </select>
                    </div>

                    {/* Ville */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                        <select
                            value={filters.ville}
                            onChange={(e) => updateFilter('ville', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                        >
                            {options.villes.map(ville => (
                                <option key={ville} value={ville}>{ville}</option>
                            ))}
                        </select>
                    </div>

                    {/* Quartier */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quartier</label>
                        <select
                            value={filters.quartier}
                            onChange={(e) => updateFilter('quartier', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                        >
                            <option value="">Tous les quartiers</option>
                            {options.quartiers.map(quartier => (
                                <option key={quartier} value={quartier}>{quartier}</option>
                            ))}
                        </select>
                    </div>

                    {/* Disponibilité */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilité</label>
                        <select
                            value={filters.disponibilite}
                            onChange={(e) => updateFilter('disponibilite', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                        >
                            <option value="tous">Tous</option>
                            <option value="maintenant">Disponible maintenant</option>
                            <option value="aujourdhui">Disponible aujourd'hui</option>
                            <option value="demain">Disponible demain</option>
                        </select>
                    </div>

                    {/* Type de service */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type de service</label>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={filters.serviceSalon}
                                    onChange={(e) => updateFilter('serviceSalon', e.target.checked)}
                                    className="mr-2"
                                />
                                Service au salon
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={filters.serviceDomicile}
                                    onChange={(e) => updateFilter('serviceDomicile', e.target.checked)}
                                    className="mr-2"
                                />
                                Service à domicile
                            </label>
                        </div>
                    </div>

                    {/* Tri */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
                        <select
                            value={filters.tri}
                            onChange={(e) => updateFilter('tri', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                        >
                            <option value="distance">Distance</option>
                            <option value="note">Note</option>
                            <option value="prix">Prix</option>
                            <option value="nom">Nom</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

export default {
    useSearch,
    SearchBar,
    AdvancedFilters
};
