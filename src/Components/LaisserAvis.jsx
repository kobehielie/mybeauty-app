// Composant pour laisser un avis - ILLIMITÉ (plusieurs avis possibles)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LaisserAvis({ prestataireId, prestataireNom, onAvisEnvoye, onFermer }) {
    const navigate = useNavigate();
    
    // États pour le formulaire d'avis
    const [note, setNote] = useState(0); // Note de 1 à 5 étoiles
    const [noteHover, setNoteHover] = useState(0); // Pour l'effet hover sur les étoiles
    const [commentaire, setCommentaire] = useState('');
    const [envoiEnCours, setEnvoiEnCours] = useState(false);

    // Fonction pour soumettre l'avis
    const soumettreAvis = (e) => {
        e.preventDefault();
        
        // Validation
        if (note === 0) {
            alert('⚠️ Veuillez sélectionner une note (étoiles)');
            return;
        }
        
        if (commentaire.trim().length < 10) {
            alert('⚠️ Votre commentaire doit contenir au moins 10 caractères');
            return;
        }

        setEnvoiEnCours(true);

        // Récupérer l'utilisateur connecté
        const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte'));
        
        // Créer le nouvel avis
        const nouvelAvis = {
            id: Date.now(), // ID unique basé sur le timestamp
            clientId: utilisateurConnecte.id,
            clientNom: utilisateurConnecte.nom,
            clientPrenom: utilisateurConnecte.prenom,
            prestataireId: prestataireId,
            note: note,
            commentaire: commentaire.trim(),
            date: new Date().toISOString(),
            reponsePrestataire: null // Le prestataire pourra répondre plus tard
        };

        // Récupérer les avis existants
        const avisExistants = JSON.parse(localStorage.getItem('avis') || '[]');
        
        // Ajouter le nouvel avis (SANS LIMITE - le client peut laisser autant d'avis qu'il veut)
        avisExistants.push(nouvelAvis);
        
        // Sauvegarder dans localStorage
        localStorage.setItem('avis', JSON.stringify(avisExistants));

        setEnvoiEnCours(false);
        
        // Notification de succès
        alert('✅ Votre avis a été publié avec succès !');
        
        // Callback pour mettre à jour le parent
        if (onAvisEnvoye) {
            onAvisEnvoye(nouvelAvis);
        }
        
        // Fermer le modal
        if (onFermer) {
            onFermer();
        }
    };

    // Fonction pour afficher les étoiles
    const afficherEtoiles = () => {
        const etoiles = [];
        for (let i = 1; i <= 5; i++) {
            etoiles.push(
                <button
                    key={i}
                    type="button"
                    onClick={() => setNote(i)}
                    onMouseEnter={() => setNoteHover(i)}
                    onMouseLeave={() => setNoteHover(0)}
                    className="text-4xl transition-transform hover:scale-110 focus:outline-none"
                >
                    {i <= (noteHover || note) ? '⭐' : '☆'}
                </button>
            );
        }
        return etoiles;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">✍️ Laisser un avis</h2>
                            <p className="text-sm opacity-90 mt-1">Partagez votre expérience avec {prestataireNom}</p>
                        </div>
                        <button
                            onClick={onFermer}
                            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Formulaire d'avis */}
                <form onSubmit={soumettreAvis} className="p-6 space-y-6">
                    {/* Note avec étoiles */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Votre note <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2 justify-center bg-gray-50 p-4 rounded-lg">
                            {afficherEtoiles()}
                        </div>
                        {note > 0 && (
                            <p className="text-center mt-2 text-sm text-gray-600">
                                {note === 1 && '😞 Très décevant'}
                                {note === 2 && '😐 Décevant'}
                                {note === 3 && '🙂 Correct'}
                                {note === 4 && '😊 Très bien'}
                                {note === 5 && '🤩 Excellent !'}
                            </p>
                        )}
                    </div>

                    {/* Commentaire */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Votre commentaire <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={commentaire}
                            onChange={(e) => setCommentaire(e.target.value)}
                            placeholder="Décrivez votre expérience... (minimum 10 caractères)"
                            rows="5"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {commentaire.length} caractères
                        </p>
                    </div>

                    {/* Info : Avis illimités */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-green-800 mb-2">💡 Avis illimités :</p>
                        <ul className="text-xs text-green-700 space-y-1">
                            <li>✓ Vous pouvez laisser autant d'avis que vous voulez</li>
                            <li>✓ Partagez votre expérience après chaque visite</li>
                            <li>✓ Aidez les autres clients à faire leur choix</li>
                            <li>✓ Soyez honnête et constructif</li>
                        </ul>
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onFermer}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition font-semibold"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={envoiEnCours || note === 0 || commentaire.trim().length < 10}
                            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                        >
                            {envoiEnCours ? '⏳ Envoi...' : '✅ Publier mon avis'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LaisserAvis;
