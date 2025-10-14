// Page de recherche avancée pour MyBeauty
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSearch, SearchBar, AdvancedFilters } from '../hooks/useSearch.jsx';
import { useAuth } from '../contexts/SimpleAuthContext';
import SEOHead from './SEOHead';

function SearchPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const {
        searchTerm,
        setSearchTerm,
        filters,
        updateFilter,
        resetFilters,
        searchResults,
        userLocation,
        getFilterOptions
    } = useSearch();

    const [showFilters, setShowFilters] = useState(false);
    const options = getFilterOptions();

    // Charger les paramètres de recherche depuis l'URL
    useEffect(() => {
        const queryParam = searchParams.get('q');
        if (queryParam) {
            setSearchTerm(queryParam);
        }
    }, [searchParams, setSearchTerm]);

    // Fonction pour aller aux détails d'un prestataire
    const goToPrestataireDetails = (prestataireId) => {
        navigate(`/prestataire/${prestataireId}`);
    };

    // Fonction pour formater la distance
    const formatDistance = (distance) => {
        if (distance === null) return 'Distance inconnue';
        if (distance < 1) return `${Math.round(distance * 1000)}m`;
        return `${distance.toFixed(1)}km`;
    };

    // Fonction pour calculer la note moyenne
    const getAverageRating = (avis) => {
        if (!avis || avis.length === 0) return 0;
        return (avis.reduce((sum, avis) => sum + avis.note, 0) / avis.length).toFixed(1);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <SEOHead 
                title="Recherche de prestataires beauté - MyBeauty"
                description="Trouvez les meilleurs prestataires de beauté près de chez vous. Recherche avancée par spécialité, quartier, disponibilité et plus."
                keywords="recherche, prestataires, beauté, coiffure, esthétique, Abidjan, quartier, disponibilité"
            />

            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">🔍 Recherche de prestataires</h1>
                            <p className="text-gray-600 mt-2">Trouvez le prestataire parfait pour vos besoins</p>
                        </div>
                        {user && (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">
                                    Bonjour {user.prenom} !
                                </span>
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                                >
                                    Retour à l'accueil
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Barre de recherche */}
                    <SearchBar onSearch={setSearchTerm} />

                    {/* Bouton pour afficher/masquer les filtres */}
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                            {showFilters ? 'Masquer les filtres' : 'Afficher les filtres avancés'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Filtres avancés */}
                {showFilters && (
                    <AdvancedFilters
                        filters={filters}
                        updateFilter={updateFilter}
                        resetFilters={resetFilters}
                        options={options}
                    />
                )}

                {/* Informations de recherche */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {searchResults.length} prestataire{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
                        </h2>
                        {userLocation && (
                            <span className="text-sm text-gray-600">
                                📍 Recherche depuis votre position
                            </span>
                        )}
                    </div>
                    
                    {(searchTerm || Object.values(filters).some(f => f !== '' && f !== false && f !== 0)) && (
                        <div className="mt-2">
                            <span className="text-sm text-gray-600">Filtres actifs : </span>
                            {searchTerm && (
                                <span className="inline-block bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs mr-2">
                                    "{searchTerm}"
                                </span>
                            )}
                            {filters.specialite && (
                                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2">
                                    {filters.specialite}
                                </span>
                            )}
                            {filters.quartier && (
                                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs mr-2">
                                    {filters.quartier}
                                </span>
                            )}
                            {filters.disponibilite !== 'tous' && (
                                <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs mr-2">
                                    {filters.disponibilite}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Résultats de recherche */}
                {searchResults.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun prestataire trouvé</h3>
                        <p className="text-gray-600 mb-6">
                            Essayez de modifier vos critères de recherche ou d'élargir les filtres.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchResults.map(prestataire => (
                            <div
                                key={prestataire.id}
                                onClick={() => goToPrestataireDetails(prestataire.id)}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
                            >
                                {/* Image du prestataire */}
                                <div className="relative">
                                    <img
                                        src={prestataire.image || 'https://via.placeholder.com/400'}
                                        alt={`${prestataire.prenom} ${prestataire.nom}`}
                                        className="w-full h-48 object-cover"
                                    />
                                    {prestataire.disponibilite24h && (
                                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                            24h/24
                                        </div>
                                    )}
                                    {prestataire.distance !== null && (
                                        <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-semibold">
                                            📍 {formatDistance(prestataire.distance)}
                                        </div>
                                    )}
                                </div>

                                {/* Informations du prestataire */}
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-800 mb-1">
                                        {prestataire.prenom} {prestataire.nom}
                                    </h3>
                                    <p className="text-sm text-purple-600 font-semibold mb-2">
                                        {prestataire.specialite}
                                    </p>
                                    <p className="text-xs text-gray-500 mb-2">
                                        📍 {prestataire.quartier}, {prestataire.ville}
                                    </p>
                                    
                                    {/* Services */}
                                    <div className="flex gap-2 mb-3">
                                        {prestataire.serviceSalon && (
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                                🏢 Salon
                                            </span>
                                        )}
                                        {prestataire.serviceDomicile && (
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                                🏠 Domicile
                                            </span>
                                        )}
                                    </div>

                                    {/* Note et avis */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="text-yellow-500 mr-1">⭐</span>
                                            <span className="text-sm font-semibold">
                                                {getAverageRating(prestataire.avis)}
                                            </span>
                                            <span className="text-xs text-gray-500 ml-1">
                                                ({prestataire.avis?.length || 0} avis)
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            📋 {prestataire.catalogue?.length || 0} services
                                        </div>
                                    </div>

                                    {/* Horaires */}
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <p className="text-xs text-gray-600">
                                            {prestataire.disponibilite24h 
                                                ? 'Disponible 24h/24' 
                                                : `${prestataire.heureOuverture || '08:00'} - ${prestataire.heureFermeture || '18:00'}`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bouton pour charger plus de résultats (si nécessaire) */}
                {searchResults.length > 0 && (
                    <div className="text-center mt-8">
                        <p className="text-sm text-gray-600">
                            Affichage de {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default SearchPage;
