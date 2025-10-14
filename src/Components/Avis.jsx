// Importer les outils React nécessaires
import React, { useState, useEffect } from 'react';
import dataLoader from '../data/dataLoader';
// Importer le composant UserAvatar pour afficher l'avatar de l'utilisateur
import UserAvatar from './UserAvatar.jsx';

const Avis = ({ prestataireId }) => {
    // État pour les données
    const [avis, setAvis] = useState([]);
    const [nouvelAvis, setNouvelAvis] = useState('');
    const [nouvelleNote, setNouvelleNote] = useState(5);
    const [utilisateurConnecte, setUtilisateurConnecte] = useState(null);
    const [aDejaCommente, setADejaCommente] = useState(false);
    const [clients, setClients] = useState([]);

    // Charger les avis et les données des clients au montage du composant
    useEffect(() => {
        chargerAvis();
        const utilisateur = localStorage.getItem('utilisateurConnecte');
        if (utilisateur) {
            setUtilisateurConnecte(JSON.parse(utilisateur));
        }

        // Charger les données des clients
        try {
            const data = dataLoader.loadAll();
            setClients(data.clients || []);
        } catch (error) {
            console.error('Erreur lors du chargement des clients:', error);
        }
    }, [prestataireId]);

    // Vérifier si l'utilisateur a déjà commenté ce prestataire
    useEffect(() => {
        if (utilisateurConnecte && avis.length > 0) {
            const dejaCommente = avis.some(avis => avis.clientId === utilisateurConnecte.id);
            setADejaCommente(dejaCommente);
        }
    }, [utilisateurConnecte, avis]);

    // Fonction pour récupérer les informations du client
    const getClientInfo = (clientId) => {
        return clients.find(client => client.id === clientId);
    };

    const chargerAvis = () => {
        try {
            const data = dataLoader.loadAll();

            // Avis du fichier JSON
            const avisMockData = data.avis.filter(a => a.prestataireId === prestataireId);

            // Avis du localStorage
            const avisLocaux = JSON.parse(localStorage.getItem('avis') || '[]');
            const avisLocauxPrestataire = avisLocaux.filter(a => a.prestataireId === prestataireId);

            // Combiner les deux sources
            const tousLesAvis = [...avisMockData, ...avisLocauxPrestataire];
            setAvis(tousLesAvis);
        } catch (error) {
            console.error('Erreur lors du chargement des avis:', error);
        }
    };

    const ajouterAvis = () => {
        if (!utilisateurConnecte) {
            alert('Vous devez être connecté pour laisser un avis');
            return;
        }

        if (!nouvelAvis.trim()) {
            alert('Veuillez saisir un commentaire');
            return;
        }

        const nouvelAvisObj = {
            id: Date.now(), // ID unique basé sur le timestamp
            clientId: utilisateurConnecte.id,
            prestataireId: prestataireId,
            note: nouvelleNote,
            commentaire: nouvelAvis.trim(),
            date: new Date().toISOString()
        };

        try {
            // Récupérer les avis existants du localStorage
            const avisExistants = JSON.parse(localStorage.getItem('avis') || '[]');

            // Ajouter le nouvel avis
            avisExistants.push(nouvelAvisObj);

            // Sauvegarder dans localStorage
            localStorage.setItem('avis', JSON.stringify(avisExistants));

            // Recharger les avis
            chargerAvis();

            // Réinitialiser le formulaire
            setNouvelAvis('');
            setNouvelleNote(5);

            alert('Merci pour votre avis !');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'avis:', error);
            alert('Erreur lors de la sauvegarde de l\'avis');
        }
    };

    const calculerMoyenne = () => {
        if (avis.length === 0) return 0;
        const somme = avis.reduce((acc, avis) => acc + avis.note, 0);
        return (somme / avis.length).toFixed(1);
    };

    const renderEtoiles = (note, interactive = false, onChange = null) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((etoile) => (
                    <button
                        key={etoile}
                        type="button"
                        className={`text-2xl ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform ${
                            etoile <= note ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        onClick={() => interactive && onChange && onChange(etoile)}
                        disabled={!interactive}
                    >
                        ⭐
                    </button>
                ))}
            </div>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Avis et Commentaires</h3>

            {/* Statistiques des avis */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{calculerMoyenne()}</div>
                    <div className="text-sm text-gray-600">Note moyenne</div>
                </div>
                <div className="flex-1">
                    {renderEtoiles(parseFloat(calculerMoyenne()))}
                    <div className="text-sm text-gray-600 mt-1">{avis.length} avis</div>
                </div>
            </div>

            {/* Formulaire d'ajout d'avis */}
            {utilisateurConnecte && !aDejaCommente && (
                <div className="mb-8 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <h4 className="text-lg font-semibold mb-3 text-gray-700">Laissez votre avis</h4>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                            Votre note :
                        </label>
                        {renderEtoiles(nouvelleNote, true, setNouvelleNote)}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                            Votre commentaire :
                        </label>
                        <textarea
                            value={nouvelAvis}
                            onChange={(e) => setNouvelAvis(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            rows="4"
                            placeholder="Partagez votre expérience avec ce prestataire..."
                        />
                    </div>

                    <button
                        onClick={ajouterAvis}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-700 transition shadow-md hover:shadow-lg"
                    >
                        Publier l'avis
                    </button>
                </div>
            )}

            {/* Message si déjà commenté */}
            {aDejaCommente && (
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
                    Vous avez déjà laissé un avis pour ce prestataire.
                </div>
            )}

            {/* Liste des avis */}
            <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-700">
                    Avis ({avis.length})
                </h4>

                {avis.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        Aucun avis pour le moment. Soyez le premier à donner votre avis !
                    </p>
                ) : (
                    avis.map((avis) => {
                        const clientInfo = getClientInfo(avis.clientId);
                        return (
                            <div key={avis.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <UserAvatar user={clientInfo} size="md" />
                                        <div>
                                            <div className="font-semibold text-gray-800">
                                                {clientInfo ? `${clientInfo.prenom} ${clientInfo.nom}` : `Client #${avis.clientId}`}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {formatDate(avis.date)}
                                            </div>
                                        </div>
                                    </div>
                                    {renderEtoiles(avis.note)}
                                </div>
                                <p className="text-gray-700 ml-13">{avis.commentaire}</p>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Avis;
