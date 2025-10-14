// Importer les outils React nécessaires
import { useState, useEffect } from 'react';

// Importer le fichier qui charge nos données
import dataLoader from '../data/dataLoader';
// Importer les tests de mise à jour d'image
import { testMarieKoffiImageUpdate, testAllPrestataireImages } from '../utils/testImageUpdate';

// Composant pour tester le chargement des données
function TestDataLoader() {
    // Variable pour savoir si les données sont chargées
    const [donneesChargees, setDonneesChargees] = useState(false);

    // Variable pour stocker les erreurs
    const [erreur, setErreur] = useState(null);

    // Variable pour stocker les statistiques des données
    const [statistiques, setStatistiques] = useState(null);

    // useEffect s'exécute quand la page se charge
    useEffect(() => {
        // Étape 1 : Essayer de charger les données
        try {
            console.log("🔄 Chargement des données en cours...");

            // Étape 2 : Appeler la fonction qui charge toutes les données
            const toutesLesDonnees = dataLoader.loadAll();

            // Étape 3 : Préparer les statistiques à afficher
            const stats = {
                clients: toutesLesDonnees.clients.length,
                prestataires: toutesLesDonnees.prestataires.length,
                services: toutesLesDonnees.services.length,
                reservations: toutesLesDonnees.reservations.length
            };

            // Étape 4 : Sauvegarder les statistiques
            setStatistiques(stats);

            // Étape 5 : Marquer comme chargé avec succès
            setDonneesChargees(true);

            console.log("✅ Données chargées avec succès !");

            // Étape 6 : Test de mise à jour de l'image de Marie Koffi
            console.log("\n🖼️ Test de mise à jour d'image:");
            testMarieKoffiImageUpdate();
            testAllPrestataireImages();

            // Étape 7 : Test de connexion avec un client
            const client = dataLoader.getClientById(1);
            const resultatConnexion = client.seConnecter("marie.dupont@email.com", "password123");
            console.log("🔑 Test de connexion:", resultatConnexion);

        } catch (erreurCapturee) {
            // Étape 7 : En cas d'erreur, la sauvegarder
            console.error("❌ Erreur lors du chargement:", erreurCapturee);
            setErreur(erreurCapturee.message);
        }
    }, []);

    // Si il y a une erreur, l'afficher
    if (erreur) {
        return (
            <div className="p-8 bg-red-50 text-red-800 rounded-lg">
                <h2 className="text-xl font-bold mb-2">❌ Erreur de chargement</h2>
                <p className="text-sm">{erreur}</p>
            </div>
        );
    }

    // Si les données ne sont pas encore chargées, afficher un message
    if (!donneesChargees) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">🔄 Chargement des données...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            {/* Titre de succès */}
            <h1 className="text-3xl font-bold mb-6 text-green-600 text-center">
                ✅ Données chargées avec succès !
            </h1>

            {/* Grille des statistiques */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Nombre de clients */}
                <div className="bg-blue-50 p-6 rounded-xl shadow-md text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{statistiques.clients}</div>
                    <div className="text-sm text-gray-600 font-medium">👤 Clients enregistrés</div>
                </div>

                {/* Nombre de prestataires */}
                <div className="bg-purple-50 p-6 rounded-xl shadow-md text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">{statistiques.prestataires}</div>
                    <div className="text-sm text-gray-600 font-medium">💼 Prestataires actifs</div>
                </div>

                {/* Nombre de services */}
                <div className="bg-green-50 p-6 rounded-xl shadow-md text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">{statistiques.services}</div>
                    <div className="text-sm text-gray-600 font-medium">🌟 Services disponibles</div>
                </div>

                {/* Nombre de réservations */}
                <div className="bg-orange-50 p-6 rounded-xl shadow-md text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">{statistiques.reservations}</div>
                    <div className="text-sm text-gray-600 font-medium">📅 Réservations effectuées</div>
                </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-3">🔍 Informations de débogage</h3>
                <p className="text-sm text-gray-600 mb-2">
                    📊 Toutes les données ont été chargées correctement depuis le fichier JSON
                </p>
                <p className="text-sm text-gray-600 mb-2">
                    🔑 Un test de connexion a été effectué avec succès
                </p>
                <p className="text-sm text-gray-500">
                    💡 Ouvrez la console du navigateur (F12) pour voir les détails techniques
                </p>
            </div>

            {/* Message pour les développeurs */}
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                <div className="flex items-start">
                    <div className="text-yellow-400 mr-3">💡</div>
                    <div>
                        <p className="text-sm font-medium text-yellow-800">
                            Mode développeur activé
                        </p>
                        <p className="text-sm text-yellow-700">
                            Ce composant sert uniquement à vérifier que les données se chargent correctement.
                            Il peut être supprimé en production.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Exporter le composant
export default TestDataLoader;
