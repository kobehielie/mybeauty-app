import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Admin from '../models/Admin';
import dataLoader from '../data/dataLoader';

function DashboardAdmin() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [statistiques, setStatistiques] = useState(null);
    const [activitesAdmin, setActivitesAdmin] = useState([]);
    const [ongletActif, setOngletActif] = useState('statistiques');
    const [utilisateurSelectionne, setUtilisateurSelectionne] = useState(null);
    const [activitesUtilisateur, setActivitesUtilisateur] = useState(null);
    
    // Modal pour les restrictions
    const [showModalRestriction, setShowModalRestriction] = useState(false);
    const [restriction, setRestriction] = useState({
        type: 'avertissement',
        raison: '',
        dateFin: ''
    });

    // Modal pour ajouter un utilisateur
    const [showModalAjout, setShowModalAjout] = useState(false);
    const [nouvelUtilisateur, setNouvelUtilisateur] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        motDePasse: '',
        type: 'client'
    });

    // Filtres et recherche
    const [filtreType, setFiltreType] = useState('tous');
    const [rechercheTexte, setRechercheTexte] = useState('');

    useEffect(() => {
        // Vérifier si l'utilisateur connecté est un admin
        const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        
        if (utilisateurConnecte.role !== 'admin') {
            navigate('/connexion');
            return;
        }

        // Charger les données initiales depuis mockData si localStorage est vide
        const clientsExistants = localStorage.getItem('clients');
        const prestatairesExistants = localStorage.getItem('prestataires');
        
        if (!clientsExistants || !prestatairesExistants) {
            const data = dataLoader.loadAll();
            if (!clientsExistants) {
                localStorage.setItem('clients', JSON.stringify(data.clients));
            }
            if (!prestatairesExistants) {
                localStorage.setItem('prestataires', JSON.stringify(data.prestataires));
            }
        }

        const adminInstance = new Admin(
            utilisateurConnecte.id,
            utilisateurConnecte.nom,
            utilisateurConnecte.prenom,
            utilisateurConnecte.email
        );
        
        setAdmin(adminInstance);
        chargerDonnees(adminInstance);
    }, [navigate]);

    const chargerDonnees = (adminInstance) => {
        const tousLesUtilisateurs = adminInstance.getTousLesUtilisateurs();
        console.log('Utilisateurs chargés:', tousLesUtilisateurs);
        setUtilisateurs(tousLesUtilisateurs);
        setStatistiques(adminInstance.getStatistiques());
        setActivitesAdmin(adminInstance.voirActivitesAdmin(50));
    };

    const voirActivitesUtilisateur = (utilisateur) => {
        setUtilisateurSelectionne(utilisateur);
        const activites = admin.voirActivitesUtilisateur(utilisateur.id, utilisateur.type);
        setActivitesUtilisateur(activites);
        setOngletActif('activites-utilisateur');
    };

    const ouvrirModalRestriction = (utilisateur) => {
        setUtilisateurSelectionne(utilisateur);
        setShowModalRestriction(true);
    };

    const ajouterRestriction = () => {
        if (!restriction.raison) {
            alert('Veuillez saisir une raison');
            return;
        }

        const result = admin.ajouterRestriction(
            utilisateurSelectionne.id,
            utilisateurSelectionne.type,
            restriction
        );

        if (result.success) {
            alert(result.message);
            setShowModalRestriction(false);
            setRestriction({ type: 'avertissement', raison: '', dateFin: '' });
            chargerDonnees(admin);
        } else {
            alert(result.message);
        }
    };

    const supprimerUtilisateur = (utilisateur) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${utilisateur.prenom} ${utilisateur.nom} ?`)) {
            return;
        }

        const result = admin.supprimerUtilisateur(utilisateur.id, utilisateur.type);
        
        if (result.success) {
            alert(result.message);
            chargerDonnees(admin);
        } else {
            alert(result.message);
        }
    };

    const ajouterUtilisateur = () => {
        // Validation
        if (!nouvelUtilisateur.nom || !nouvelUtilisateur.prenom || !nouvelUtilisateur.email || !nouvelUtilisateur.motDePasse) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        const result = admin.ajouterUtilisateur(nouvelUtilisateur, nouvelUtilisateur.type);
        
        if (result.success) {
            alert(result.message);
            setShowModalAjout(false);
            setNouvelUtilisateur({
                nom: '',
                prenom: '',
                email: '',
                telephone: '',
                motDePasse: '',
                type: 'client'
            });
            chargerDonnees(admin);
        } else {
            alert(result.message);
        }
    };

    // Filtrer les utilisateurs
    const utilisateursFiltres = utilisateurs.filter(u => {
        const matchType = filtreType === 'tous' || u.type === filtreType;
        const matchRecherche = rechercheTexte === '' || 
            u.nom.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
            u.prenom.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
            u.email.toLowerCase().includes(rechercheTexte.toLowerCase());
        return matchType && matchRecherche;
    });

    const deconnexion = () => {
        localStorage.removeItem('utilisateurConnecte');
        navigate('/connexion');
    };

    if (!admin) {
        return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">🛡️ Dashboard Admin</h1>
                            <p className="text-purple-100 mt-1">Gestion de la plateforme MyBeauty</p>
                        </div>
                        <button
                            onClick={deconnexion}
                            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-8">
                {/* Onglets */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setOngletActif('statistiques')}
                        className={`px-6 py-3 rounded-lg font-semibold transition ${
                            ongletActif === 'statistiques'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        📊 Statistiques
                    </button>
                    <button
                        onClick={() => setOngletActif('utilisateurs')}
                        className={`px-6 py-3 rounded-lg font-semibold transition ${
                            ongletActif === 'utilisateurs'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        👥 Utilisateurs ({utilisateurs.length})
                    </button>
                    <button
                        onClick={() => setOngletActif('activites')}
                        className={`px-6 py-3 rounded-lg font-semibold transition ${
                            ongletActif === 'activites'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        📋 Activités Admin
                    </button>
                </div>

                {/* Contenu des onglets */}
                {ongletActif === 'statistiques' && statistiques && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                            <div className="text-sm text-gray-600">Clients</div>
                            <div className="text-3xl font-bold text-blue-600 mt-2">{statistiques.totalClients}</div>
                            <div className="text-xs text-gray-500 mt-1">{statistiques.clientsActifs} actifs</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                            <div className="text-sm text-gray-600">Prestataires</div>
                            <div className="text-3xl font-bold text-purple-600 mt-2">{statistiques.totalPrestataires}</div>
                            <div className="text-xs text-gray-500 mt-1">{statistiques.prestatairesActifs} actifs</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                            <div className="text-sm text-gray-600">Réservations</div>
                            <div className="text-3xl font-bold text-green-600 mt-2">{statistiques.totalReservations}</div>
                            <div className="text-xs text-gray-500 mt-1">{statistiques.reservationsConfirmees} confirmées</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
                            <div className="text-sm text-gray-600">Note moyenne</div>
                            <div className="text-3xl font-bold text-yellow-600 mt-2">{statistiques.moyenneAvis} ⭐</div>
                            <div className="text-xs text-gray-500 mt-1">{statistiques.totalAvis} avis</div>
                        </div>
                    </div>
                )}

                {ongletActif === 'utilisateurs' && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h2>
                            <button
                                onClick={() => setShowModalAjout(true)}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition shadow-lg flex items-center gap-2"
                            >
                                <span className="text-xl">➕</span>
                                Ajouter un utilisateur
                            </button>
                        </div>

                        {/* Filtres et recherche */}
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="🔍 Rechercher par nom, prénom ou email..."
                                    value={rechercheTexte}
                                    onChange={(e) => setRechercheTexte(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                value={filtreType}
                                onChange={(e) => setFiltreType(e.target.value)}
                                className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="tous">Tous ({utilisateurs.length})</option>
                                <option value="client">Clients ({utilisateurs.filter(u => u.type === 'client').length})</option>
                                <option value="prestataire">Prestataires ({utilisateurs.filter(u => u.type === 'prestataire').length})</option>
                            </select>
                        </div>

                        <div className="text-sm text-gray-600 mb-4">
                            {utilisateursFiltres.length} utilisateur(s) trouvé(s)
                        </div>

                        {utilisateursFiltres.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <div className="text-6xl mb-4">👥</div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun utilisateur trouvé</h3>
                                <p className="text-gray-500 mb-6">
                                    {rechercheTexte || filtreType !== 'tous' 
                                        ? 'Essayez de modifier vos filtres de recherche'
                                        : 'Commencez par ajouter des utilisateurs à la plateforme'
                                    }
                                </p>
                                <button
                                    onClick={() => setShowModalAjout(true)}
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition"
                                >
                                    ➕ Ajouter le premier utilisateur
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {utilisateursFiltres.map(utilisateur => (
                                        <tr key={`${utilisateur.type}-${utilisateur.id}`} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm">{utilisateur.id}</td>
                                            <td className="px-4 py-3 text-sm font-medium">{utilisateur.prenom} {utilisateur.nom}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{utilisateur.email}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    utilisateur.type === 'client' 
                                                        ? 'bg-blue-100 text-blue-700' 
                                                        : 'bg-purple-100 text-purple-700'
                                                }`}>
                                                    {utilisateur.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    utilisateur.actif !== false
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {utilisateur.actif !== false ? 'Actif' : 'Suspendu'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => voirActivitesUtilisateur(utilisateur)}
                                                        className="text-blue-600 hover:text-blue-800 font-semibold"
                                                    >
                                                        👁️ Voir
                                                    </button>
                                                    <button
                                                        onClick={() => ouvrirModalRestriction(utilisateur)}
                                                        className="text-orange-600 hover:text-orange-800 font-semibold"
                                                    >
                                                        🚫 Restreindre
                                                    </button>
                                                    <button
                                                        onClick={() => supprimerUtilisateur(utilisateur)}
                                                        className="text-red-600 hover:text-red-800 font-semibold"
                                                    >
                                                        🗑️ Supprimer
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {ongletActif === 'activites' && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Historique des activités admin</h2>
                        <div className="space-y-4">
                            {activitesAdmin.map(activite => (
                                <div key={activite.id} className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold text-gray-800">{activite.action.replace(/_/g, ' ')}</div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                {JSON.stringify(activite.details)}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(activite.date).toLocaleString('fr-FR')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {ongletActif === 'activites-utilisateur' && utilisateurSelectionne && activitesUtilisateur && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <button
                            onClick={() => setOngletActif('utilisateurs')}
                            className="mb-4 text-purple-600 hover:text-purple-800 font-semibold"
                        >
                            ← Retour à la liste
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Activités de {utilisateurSelectionne.prenom} {utilisateurSelectionne.nom}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="text-sm text-blue-600">Réservations</div>
                                <div className="text-2xl font-bold text-blue-700 mt-2">
                                    {activitesUtilisateur.reservations.length}
                                </div>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <div className="text-sm text-yellow-600">Avis laissés</div>
                                <div className="text-2xl font-bold text-yellow-700 mt-2">
                                    {activitesUtilisateur.avis.length}
                                </div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="text-sm text-green-600">Conversations</div>
                                <div className="text-2xl font-bold text-green-700 mt-2">
                                    {activitesUtilisateur.conversations}
                                </div>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600">
                            Dernière connexion : {activitesUtilisateur.derniereConnexion || 'Jamais'}
                        </div>
                    </div>
                )}
            </main>

            {/* Modal Restriction */}
            {showModalRestriction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Ajouter une restriction
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Type de restriction
                                </label>
                                <select
                                    value={restriction.type}
                                    onChange={(e) => setRestriction({...restriction, type: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="avertissement">Avertissement</option>
                                    <option value="limitation">Limitation</option>
                                    <option value="suspension">Suspension</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Raison
                                </label>
                                <textarea
                                    value={restriction.raison}
                                    onChange={(e) => setRestriction({...restriction, raison: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="Expliquez la raison de la restriction..."
                                />
                            </div>

                            {restriction.type === 'suspension' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Date de fin (optionnel)
                                    </label>
                                    <input
                                        type="date"
                                        value={restriction.dateFin}
                                        onChange={(e) => setRestriction({...restriction, dateFin: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => setShowModalRestriction(false)}
                                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={ajouterRestriction}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition"
                            >
                                Ajouter
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Ajout Utilisateur */}
            {showModalAjout && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            ➕ Ajouter un utilisateur
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Type d'utilisateur *
                                </label>
                                <select
                                    value={nouvelUtilisateur.type}
                                    onChange={(e) => setNouvelUtilisateur({...nouvelUtilisateur, type: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="client">Client</option>
                                    <option value="prestataire">Prestataire</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Nom *
                                </label>
                                <input
                                    type="text"
                                    value={nouvelUtilisateur.nom}
                                    onChange={(e) => setNouvelUtilisateur({...nouvelUtilisateur, nom: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Nom de famille"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Prénom *
                                </label>
                                <input
                                    type="text"
                                    value={nouvelUtilisateur.prenom}
                                    onChange={(e) => setNouvelUtilisateur({...nouvelUtilisateur, prenom: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Prénom"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={nouvelUtilisateur.email}
                                    onChange={(e) => setNouvelUtilisateur({...nouvelUtilisateur, email: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="email@exemple.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Téléphone
                                </label>
                                <input
                                    type="tel"
                                    value={nouvelUtilisateur.telephone}
                                    onChange={(e) => setNouvelUtilisateur({...nouvelUtilisateur, telephone: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="0123456789"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Mot de passe *
                                </label>
                                <input
                                    type="password"
                                    value={nouvelUtilisateur.motDePasse}
                                    onChange={(e) => setNouvelUtilisateur({...nouvelUtilisateur, motDePasse: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Mot de passe"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => {
                                    setShowModalAjout(false);
                                    setNouvelUtilisateur({
                                        nom: '',
                                        prenom: '',
                                        email: '',
                                        telephone: '',
                                        motDePasse: '',
                                        type: 'client'
                                    });
                                }}
                                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={ajouterUtilisateur}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition"
                            >
                                Ajouter
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashboardAdmin;
