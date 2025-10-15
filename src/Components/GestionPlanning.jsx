// Importer les outils React nécessaires
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEOHead from './SEOHead.jsx';

const GestionPlanning = () => {
    const navigate = useNavigate();
    const [utilisateurConnecte, setUtilisateurConnecte] = useState(null);
    const [creneaux, setCreneaux] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [showModal, setShowModal] = useState(false);
    const [nouveauCreneau, setNouveauCreneau] = useState({
        date: '',
        heureDebut: '',
        heureFin: '',
        disponible: true
    });

    const mois = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    useEffect(() => {
        const userString = localStorage.getItem('utilisateurConnecte');
        if (userString) {
            const user = JSON.parse(userString);
            setUtilisateurConnecte(user);

            if (user.role !== 'prestataire') {
                navigate('/dashboard-client');
                return;
            }

            // Charger les créneaux depuis localStorage
            const creneauxSauvegardes = JSON.parse(localStorage.getItem(`planning_${user.id}`) || '[]');
            setCreneaux(creneauxSauvegardes);
        } else {
            navigate('/connexion');
        }
    }, [navigate]);

    // Fonction pour fermer le modal avec la touche Échap
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && showModal) {
                setShowModal(false);
            }
        };

        if (showModal) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [showModal]);

    const ajouterCreneau = () => {
        if (!nouveauCreneau.date || !nouveauCreneau.heureDebut || !nouveauCreneau.heureFin) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        const creneauAvecId = {
            ...nouveauCreneau,
            id: Date.now(),
            prestataireId: utilisateurConnecte.id
        };

        const nouveauxCreneaux = [...creneaux, creneauAvecId];
        setCreneaux(nouveauxCreneaux);
        localStorage.setItem(`planning_${utilisateurConnecte.id}`, JSON.stringify(nouveauxCreneaux));

        // Changer automatiquement vers le mois/année du créneau ajouté
        const dateAjoutee = new Date(nouveauCreneau.date);
        setSelectedMonth(dateAjoutee.getMonth());
        setSelectedYear(dateAjoutee.getFullYear());

        setNouveauCreneau({
            date: '',
            heureDebut: '',
            heureFin: '',
            disponible: true
        });
        setShowModal(false);
        
        alert('✅ Créneau ajouté avec succès !');
    };

    const supprimerCreneau = (creneauId) => {
        const nouveauxCreneaux = creneaux.filter(c => c.id !== creneauId);
        setCreneaux(nouveauxCreneaux);
        localStorage.setItem(`planning_${utilisateurConnecte.id}`, JSON.stringify(nouveauxCreneaux));
    };

    const toggleDisponibilite = (creneauId) => {
        const nouveauxCreneaux = creneaux.map(c => 
            c.id === creneauId ? { ...c, disponible: !c.disponible } : c
        );
        setCreneaux(nouveauxCreneaux);
        localStorage.setItem(`planning_${utilisateurConnecte.id}`, JSON.stringify(nouveauxCreneaux));
    };

    const getCreneauxDuMois = () => {
        return creneaux.filter(c => {
            const creneauDate = new Date(c.date);
            return creneauDate.getMonth() === selectedMonth && 
                   creneauDate.getFullYear() === selectedYear;
        });
    };

    const creneauxDuMois = getCreneauxDuMois();

    if (!utilisateurConnecte) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <SEOHead 
                title="Gestion du Planning - MyBeauty | Organisez vos créneaux"
                description="Gérez votre planning de prestations beauté. Ajoutez, modifiez et organisez vos créneaux disponibles. Planning mensuel interactif pour prestataires."
                keywords="planning, créneaux, disponibilités, agenda, prestataire beauté, réservation, gestion temps"
                canonical="https://mybeauty.ci/gestion-planning"
            />
            {/* Header */}
            <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 shadow-lg" role="banner">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">📅 Gestion du Planning</h1>
                        <p className="text-sm mt-1">Organisez vos disponibilités</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => navigate('/dashboard-prestataire')}
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg transition font-semibold"
                        >
                            ← Retour au Dashboard
                        </button>
                        <button 
                            onClick={() => navigate('/profil')}
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg transition font-semibold"
                        >
                            👤 Mon Profil
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-8" role="main">
                {/* Contrôles */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="sr-only">Contrôles du planning</h2>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-4">
                            <select 
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                {mois.map((m, index) => (
                                    <option key={index} value={index}>{m}</option>
                                ))}
                            </select>
                            <select 
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                {[2024, 2025, 2026].map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <button 
                            onClick={() => setShowModal(true)}
                            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-600 transition shadow-lg"
                        >
                            ➕ Ajouter un créneau
                        </button>
                    </div>
                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <h3 className="sr-only">Statistiques du planning</h3>
                        <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                            <p className="text-sm text-blue-600">Créneaux ce mois</p>
                            <p className="text-2xl font-bold text-red-600">{creneauxDuMois.length}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl border-l-4 border-green-500">
                            <p className="text-sm text-green-600">Disponibles</p>
                            <p className="text-3xl font-bold text-green-700">
                                {creneauxDuMois.filter(c => c.disponible).length}
                            </p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-xl border-l-4 border-red-500">
                            <p className="text-sm text-red-600">Réservés</p>
                            <p className="text-3xl font-bold text-red-700">
                                {creneauxDuMois.filter(c => !c.disponible).length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Liste des créneaux */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Créneaux de {mois[selectedMonth]} {selectedYear}
                    </h2>

                    {creneauxDuMois.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📅</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun créneau pour ce mois</h3>
                            <p className="text-gray-500 mb-6">Commencez par ajouter vos premiers créneaux disponibles</p>
                            <button 
                                onClick={() => setShowModal(true)}
                                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition shadow-lg"
                            >
                                ➕ Ajouter votre premier créneau
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3" aria-label="Liste des créneaux disponibles">
                            {creneauxDuMois
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                .map((creneau) => (
                                    <div 
                                        key={creneau.id} 
                                        className={`border-2 rounded-xl p-5 transition ${
                                            creneau.disponible 
                                                ? 'border-green-200 bg-green-50' 
                                                : 'border-red-200 bg-red-50'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-2">
                                                    <span className="text-lg font-bold text-gray-800">
                                                        📅 {new Date(creneau.date).toLocaleDateString('fr-FR', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-600">
                                                        🕐 {creneau.heureDebut} - {creneau.heureFin}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        creneau.disponible 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {creneau.disponible ? '✅ Disponible' : '❌ Réservé'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => toggleDisponibilite(creneau.id)}
                                                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                                                        creneau.disponible 
                                                            ? 'bg-red-500 text-white hover:bg-red-600' 
                                                            : 'bg-green-500 text-white hover:bg-green-600'
                                                    }`}
                                                >
                                                    {creneau.disponible ? '🔒 Bloquer' : '✅ Libérer'}
                                                </button>
                                                <button 
                                                    onClick={() => supprimerCreneau(creneau.id)}
                                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                                                >
                                                    🗑️ Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal d'ajout */}
            {showModal && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
                    role="dialog" 
                    aria-modal="true"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowModal(false);
                        }
                    }}
                >
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Nouveau créneau</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    📅 Date
                                </label>
                                <input 
                                    type="date"
                                    value={nouveauCreneau.date}
                                    onChange={(e) => setNouveauCreneau({...nouveauCreneau, date: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    🕐 Heure de début
                                </label>
                                <input 
                                    type="time"
                                    value={nouveauCreneau.heureDebut}
                                    onChange={(e) => setNouveauCreneau({...nouveauCreneau, heureDebut: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    🕐 Heure de fin
                                </label>
                                <input 
                                    type="time"
                                    value={nouveauCreneau.heureFin}
                                    onChange={(e) => setNouveauCreneau({...nouveauCreneau, heureFin: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button 
                                onClick={ajouterCreneau}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-600 transition"
                            >
                                ✅ Ajouter
                            </button>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-400 transition"
                            >
                                ❌ Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionPlanning;
