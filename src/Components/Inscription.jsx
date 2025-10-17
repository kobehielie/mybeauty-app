// Importer les outils React nécessaires
import { useState } from 'react'; // useState = boîte magique pour se souvenir des informations
import { useNavigate } from 'react-router-dom'; // useNavigate = GPS pour naviguer entre les pages
import dataLoader from '../data/dataLoader'; // dataLoader = livre qui contient toutes les données
import Client from '../models/Client'; // Client = modèle pour créer un utilisateur client
import Prestataire from '../models/Prestataire'; // Prestataire = modèle pour créer un utilisateur prestataire

// Composant pour la page d'inscription
function Inscription() {
    // Pour naviguer vers d'autres pages (comme un GPS)
    const navigate = useNavigate();

    // Variables pour les champs communs à tous les utilisateurs (boîtes pour se souvenir)
    const [nomSaisi, setNomSaisi] = useState(''); // Boîte "Nom" - vide au début
    const [prenomSaisi, setPrenomSaisi] = useState(''); // Boîte "Prénom" - vide au début
    const [emailSaisi, setEmailSaisi] = useState(''); // Boîte "Email" - vide au début
    const [telephoneSaisi, setTelephoneSaisi] = useState(''); // Boîte "Téléphone" - vide au début
    const [motDePasseSaisi, setMotDePasseSaisi] = useState(''); // Boîte "Mot de passe" - vide au début
    const [confirmMotDePasseSaisi, setConfirmMotDePasseSaisi] = useState(''); // Boîte "Confirmer mot de passe" - vide au début
    const [roleChoisi, setRoleChoisi] = useState('client'); // Boîte "Rôle" - par défaut "client"
    const [imageSaisie, setImageSaisie] = useState(''); // Boîte "Photo" - vide au début

    // Variable pour afficher des messages (succès ou erreur) - panneau d'affichage
    const [messageAffiche, setMessageAffiche] = useState(''); // Boîte "Message" - vide au début

    // Variables spécifiques aux Clients (seulement pour les clients)
    const [preferencePaiementClient, setPreferencePaiementClient] = useState('carte'); // Boîte "Mode de paiement" - par défaut "carte"

    // Variables spécifiques aux Prestataires (seulement pour les prestataires)
    const [specialiteChoisie, setSpecialiteChoisie] = useState(''); // Boîte "Spécialité" - vide au début
    const [adresseSaisie, setAdresseSaisie] = useState(''); // Boîte "Adresse" - vide au début
    const [villeSaisie, setVilleSaisie] = useState('Abidjan'); // Boîte "Ville" - par défaut "Abidjan"
    const [quartierSaisi, setQuartierSaisi] = useState(''); // Boîte "Quartier" - vide au début
    const [mobileMonkeySaisi, setMobileMonkeySaisi] = useState(''); // Boîte "Mobile Money" - vide au début
    const [joursDisponiblesChoisis, setJoursDisponiblesChoisis] = useState([]); // Boîte "Jours disponibles" - liste vide au début
    const [heureOuvertureSaisie, setHeureOuvertureSaisie] = useState('09:00'); // Boîte "Heure d'ouverture" - par défaut "09:00"
    const [heureFermetureSaisie, setHeureFermetureSaisie] = useState('18:00'); // Boîte "Heure de fermeture" - par défaut "18:00"
    const [disponibilite24hChoisie, setDisponibilite24hChoisie] = useState(false); // Boîte "24h/24" - par défaut "non"
    const [serviceDomicileChoisi, setServiceDomicileChoisi] = useState(false); // Boîte "Service à domicile" - par défaut "non"
    const [serviceSalonChoisi, setServiceSalonChoisi] = useState(true); // Boîte "Service au salon" - par défaut "oui"

    // Liste des jours de la semaine (calendrier avec tous les jours)
    const joursSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

    // Fonction pour gérer le changement de jour disponible (cocher/décocher les jours)
    function gererChangementJour(jour) {
        if (joursDisponiblesChoisis.includes(jour)) { // Si le jour est déjà choisi
            setJoursDisponiblesChoisis(joursDisponiblesChoisis.filter(j => j !== jour)); // On l'enlève de la liste
        } else { // Si le jour n'est pas choisi
            setJoursDisponiblesChoisis([...joursDisponiblesChoisis, jour]); // On l'ajoute à la liste
        }
    }

    // Fonction appelée quand l'utilisateur soumet le formulaire d'inscription (bouton "S'inscrire")
    function sInscrire(e) {
        // Empêcher le rechargement de la page (ne pas recharger la page)
        e.preventDefault();

        // Étape 1 : Vérifier que les mots de passe correspondent (sécurité)
        if (motDePasseSaisi !== confirmMotDePasseSaisi) { // Si les deux mots de passe sont différents
            setMessageAffiche("❌ Les mots de passe ne correspondent pas"); // Afficher erreur
            return; // S'arrêter ici
        }

        // Étape 2 : Vérifier que le mot de passe fait au moins 6 caractères (sécurité)
        if (motDePasseSaisi.length < 6) { // Si le mot de passe a moins de 6 lettres
            setMessageAffiche("❌ Le mot de passe doit contenir au moins 6 caractères"); // Afficher erreur
            return; // S'arrêter ici
        }

        // Étape 3 : Créer l'utilisateur selon son rôle (client ou prestataire)
        const nouvelId = Date.now(); // Créer un numéro unique (comme un numéro de carte d'identité)
        let nouvelUtilisateur; // Variable pour stocker le nouvel utilisateur

        if (roleChoisi === 'client') { // Si c'est un client
            nouvelUtilisateur = new Client( // Créer un objet Client
                nouvelId, // Numéro unique
                nomSaisi, // Nom saisi
                prenomSaisi, // Prénom saisi
                emailSaisi, // Email saisi
                telephoneSaisi, // Téléphone saisi
                motDePasseSaisi, // Mot de passe saisi
                preferencePaiementClient, // Mode de paiement préféré
                imageSaisie || null // Photo ou null si pas d'image
            );
        } else { // Si c'est un prestataire
            // Étape 4 : Validations spécifiques aux prestataires (vérifier les champs obligatoires)
            if (!specialiteChoisie || !quartierSaisi || joursDisponiblesChoisis.length === 0) { // Si des champs manquent
                setMessageAffiche("❌ Veuillez remplir tous les champs obligatoires (spécialité, quartier, jours disponibles)"); // Afficher erreur
                return; // S'arrêter ici
            }

            nouvelUtilisateur = new Prestataire( // Créer un objet Prestataire
                nouvelId, // Numéro unique
                nomSaisi, // Nom saisi
                prenomSaisi, // Prénom saisi
                emailSaisi, // Email saisi
                telephoneSaisi, // Téléphone saisi
                motDePasseSaisi, // Mot de passe saisi
                mobileMonkeySaisi, // Numéro Mobile Money
                imageSaisie || `https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400`, // Photo ou photo automatique
                { // Informations professionnelles (objet avec toutes les infos)
                    specialite: specialiteChoisie, // Spécialité choisie
                    adresse: adresseSaisie, // Adresse saisie
                    ville: villeSaisie, // Ville saisie
                    quartier: quartierSaisi, // Quartier saisi
                    joursDisponibles: joursDisponiblesChoisis, // Jours disponibles
                    heureOuverture: heureOuvertureSaisie, // Heure d'ouverture
                    heureFermeture: heureFermetureSaisie, // Heure de fermeture
                    disponibilite24h: disponibilite24hChoisie, // Disponible 24h/24
                    serviceDomicile: serviceDomicileChoisi, // Service à domicile
                    serviceSalon: serviceSalonChoisi // Service au salon
                }
            );
        }

        // Étape 5 : Inscription réussie ! (tout s'est bien passé)
        console.log("✅ Nouvel utilisateur créé:", nouvelUtilisateur); // Afficher dans la console (pour le développeur)
        setMessageAffiche(`✅ Inscription réussie ! Redirection vers la connexion...`); // Afficher message de succès

        // Étape 6 : Rediriger vers la page de connexion après 2 secondes (attendre 2 secondes puis aller à la page de connexion)
        setTimeout(() => { // Attendre 2 secondes
            navigate('/connexion'); // Aller à la page de connexion
        }, 2000); // 2000 millisecondes = 2 secondes
    }

    return ( // Retourner l'interface utilisateur (ce qu'on voit à l'écran)
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4"> {/* Conteneur principal - fond dégradé rose-violet, centré */}
            {/* Conteneur principal du formulaire */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full"> {/* Boîte blanche arrondie avec ombre */}
                {/* En-tête avec titre */}
                <div className="text-center mb-4 md:mb-6"> {/* Titre centré avec espace en bas */}
                    <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600"> {/* Titre gros, gras, avec dégradé de couleur */}
                        💅 Inscription MyBeauty
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 mt-2">Rejoignez notre communauté beauté</p> {/* Sous-titre gris */}
                </div>

                {/* Afficher le message de succès ou d'erreur (panneau d'affichage) */}
                {messageAffiche && ( // Si il y a un message à afficher
                    <div className={`p-4 mb-6 rounded-lg text-center font-medium ${ // Boîte avec espacement et style
                        messageAffiche.includes('✅') // Si le message contient ✅ (succès)
                            ? 'bg-green-100 text-green-700 border border-green-300' // Fond vert pour succès
                            : 'bg-red-100 text-red-700 border border-red-300' // Fond rouge pour erreur
                    }`}>
                        {messageAffiche} {/* Afficher le message */}
                    </div>
                )}

                {/* Formulaire d'inscription (le formulaire principal) */}
                <form onSubmit={sInscrire} className="space-y-5"> {/* Formulaire qui appelle sInscrire quand on clique "Envoyer", espace de 5 entre chaque élément */}
                    {/* Sélection du type d'utilisateur (choisir entre Client ou Prestataire) */}
                    <div className="bg-purple-50 p-4 rounded-lg"> {/* Boîte violette claire */}
                        <label className="block text-sm font-bold mb-3 text-purple-900">Je suis *</label> {/* Question "Je suis" */}
                        <div className="grid grid-cols-2 gap-3"> {/* Grille de 2 colonnes avec espace de 3 */}
                            <button // Bouton "Client"
                                type="button" // Type bouton (ne pas envoyer le formulaire)
                                onClick={() => setRoleChoisi('client')} // Quand on clique, choisir "client"
                                className={`p-4 rounded-lg font-semibold transition ${ // Style du bouton
                                    roleChoisi === 'client' // Si "client" est choisi
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' // Bouton coloré
                                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-pink-300' // Bouton blanc
                                }`}
                            >
                                👤 Client {/* Texte du bouton */}
                            </button>
                            <button // Bouton "Prestataire"
                                type="button" // Type bouton (ne pas envoyer le formulaire)
                                onClick={() => setRoleChoisi('prestataire')} // Quand on clique, choisir "prestataire"
                                className={`p-4 rounded-lg font-semibold transition ${ // Style du bouton
                                    roleChoisi === 'prestataire' // Si "prestataire" est choisi
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' // Bouton coloré
                                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-pink-300' // Bouton blanc
                                }`}
                            >
                                💼 Prestataire {/* Texte du bouton */}
                            </button>
                        </div>
                    </div>

                    {/* Informations personnelles (communes à tous) - champs que tout le monde doit remplir */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Grille de 2 colonnes avec espace de 4 */}
                        <div> {/* Champ "Nom" */}
                            <label className="block text-sm font-medium mb-1">Nom *</label> {/* Étiquette "Nom" (obligatoire) */}
                            <input // Champ de saisie
                                type="text" // Type texte
                                value={nomSaisi} // Valeur actuelle (ce qui est affiché)
                                onChange={(e) => setNomSaisi(e.target.value)} // Quand on tape, changer la valeur
                                className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" // Style du champ
                                placeholder="Votre nom" // Texte gris qui disparaît quand on tape
                                required // Champ obligatoire
                            />
                        </div>

                        <div> {/* Champ "Prénom" */}
                            <label className="block text-sm font-medium mb-1">Prénom *</label> {/* Étiquette "Prénom" (obligatoire) */}
                            <input // Champ de saisie
                                type="text" // Type texte
                                value={prenomSaisi} // Valeur actuelle (ce qui est affiché)
                                onChange={(e) => setPrenomSaisi(e.target.value)} // Quand on tape, changer la valeur
                                className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" // Style du champ
                                placeholder="Votre prénom" // Texte gris qui disparaît quand on tape
                                required // Champ obligatoire
                            />
                        </div>
                    </div>

                    <div> {/* Champ "Email" */}
                        <label className="block text-sm font-medium mb-1">Email *</label> {/* Étiquette "Email" (obligatoire) */}
                        <input // Champ de saisie
                            type="email" // Type email (vérification automatique)
                            value={emailSaisi} // Valeur actuelle (ce qui est affiché)
                            onChange={(e) => setEmailSaisi(e.target.value)} // Quand on tape, changer la valeur
                            className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" // Style du champ
                            placeholder="exemple@email.com" // Texte gris qui disparaît quand on tape
                            required // Champ obligatoire
                        />
                    </div>

                    <div> {/* Champ "Téléphone" */}
                        <label className="block text-sm font-medium mb-1">Téléphone *</label> {/* Étiquette "Téléphone" (obligatoire) */}
                        <input // Champ de saisie
                            type="tel" // Type téléphone (clavier numérique sur mobile)
                            value={telephoneSaisi} // Valeur actuelle (ce qui est affiché)
                            onChange={(e) => setTelephoneSaisi(e.target.value)} // Quand on tape, changer la valeur
                            className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" // Style du champ
                            placeholder="0712345678" // Texte gris qui disparaît quand on tape
                            required // Champ obligatoire
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Grille de 2 colonnes pour les mots de passe */}
                        <div> {/* Champ "Mot de passe" */}
                            <label className="block text-sm font-medium mb-1">Mot de passe *</label> {/* Étiquette "Mot de passe" (obligatoire) */}
                            <input // Champ de saisie
                                type="password" // Type mot de passe (texte caché)
                                value={motDePasseSaisi} // Valeur actuelle (ce qui est affiché)
                                onChange={(e) => setMotDePasseSaisi(e.target.value)} // Quand on tape, changer la valeur
                                className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" // Style du champ
                                placeholder="Min. 6 caractères" // Texte gris qui disparaît quand on tape
                                required // Champ obligatoire
                            />
                        </div>

                        <div> {/* Champ "Confirmer mot de passe" */}
                            <label className="block text-sm font-medium mb-1">Confirmer *</label> {/* Étiquette "Confirmer" (obligatoire) */}
                            <input // Champ de saisie
                                type="password" // Type mot de passe (texte caché)
                                value={confirmMotDePasseSaisi} // Valeur actuelle (ce qui est affiché)
                                onChange={(e) => setConfirmMotDePasseSaisi(e.target.value)} // Quand on tape, changer la valeur
                                className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" // Style du champ
                                placeholder="Confirmer mot de passe" // Texte gris qui disparaît quand on tape
                                required // Champ obligatoire
                            />
                        </div>
                    </div>

                    <div> {/* Champ "Photo de profil" */}
                        <label className="block text-sm font-medium mb-1">Photo de profil (URL)</label> {/* Étiquette "Photo de profil" (optionnel) */}
                        <input // Champ de saisie
                            type="url" // Type URL (vérification automatique)
                            value={imageSaisie} // Valeur actuelle (ce qui est affiché)
                            onChange={(e) => setImageSaisie(e.target.value)} // Quand on tape, changer la valeur
                            className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" // Style du champ
                            placeholder="https://exemple.com/photo.jpg (optionnel)" // Texte gris qui disparaît quand on tape
                        />
                    </div>

                    {/* Champs spécifiques aux Clients (seulement si "Client" est choisi) */}
                    {roleChoisi === 'client' && ( // Si le rôle choisi est "client", alors afficher cette section
                        <div className="bg-blue-50 p-4 rounded-lg"> {/* Boîte bleue claire */}
                            <label className="block text-sm font-medium mb-2">Mode de paiement préféré</label> {/* Étiquette "Mode de paiement" */}
                            <select // Liste déroulante
                                value={preferencePaiementClient} // Valeur actuelle (ce qui est sélectionné)
                                onChange={(e) => setPreferencePaiementClient(e.target.value)} // Quand on change, changer la valeur
                                className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500" // Style de la liste
                            >
                                <option value="carte">💳 Carte bancaire</option> {/* Option "Carte bancaire" */}
                                <option value="mtn_money">📱 MTN Money</option> {/* Option "MTN Money" */}
                                <option value="orange_money">🍊 Orange Money</option> {/* Option "Orange Money" */}
                                <option value="wave">🌊 Wave</option> {/* Option "Wave" */}
                                <option value="moov_money">📞 Moov Money</option> {/* Option "Moov Money" */}
                            </select>
                        </div>
                    )}

                    {/* Champs spécifiques aux Prestataires (seulement si "Prestataire" est choisi) */}
                    {roleChoisi === 'prestataire' && ( // Si le rôle choisi est "prestataire", alors afficher cette section
                        <div className="space-y-4 bg-purple-50 p-5 rounded-lg"> {/* Boîte violette claire avec espace entre les éléments */}
                            <h3 className="font-bold text-purple-900 mb-3">📋 Informations professionnelles</h3> {/* Titre de la section */}

                            <div> {/* Champ "Spécialité" */}
                                <label className="block text-sm font-medium mb-1">Spécialité *</label> {/* Étiquette "Spécialité" (obligatoire) */}
                                <select // Liste déroulante
                                    value={specialiteChoisie} // Valeur actuelle (ce qui est sélectionné)
                                    onChange={(e) => setSpecialiteChoisie(e.target.value)} // Quand on change, changer la valeur
                                    className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500" // Style de la liste
                                    required // Champ obligatoire
                                >
                                    <option value="">Choisir une spécialité</option> {/* Option par défaut */}
                                    <option value="Coiffeuse">💇 Coiffeuse</option> {/* Option "Coiffeuse" */}
                                    <option value="Maquilleuse">💄 Maquilleuse</option> {/* Option "Maquilleuse" */}
                                    <option value="Esthéticienne">✨ Esthéticienne</option> {/* Option "Esthéticienne" */}
                                    <option value="Spa & Bien-être">🧖 Spa & Bien-être</option> {/* Option "Spa & Bien-être" */}
                                    <option value="Organisatrice de mariages">💍 Organisatrice de mariages</option> {/* Option "Organisatrice de mariages" */}
                                    <option value="Manucure/Pédicure">💅 Manucure/Pédicure</option> {/* Option "Manucure/Pédicure" */}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4"> {/* Grille de 2 colonnes pour Ville et Quartier */}
                                <div> {/* Champ "Ville" */}
                                    <label className="block text-sm font-medium mb-1">Ville</label> {/* Étiquette "Ville" */}
                                    <input // Champ de saisie
                                        type="text" // Type texte
                                        value={villeSaisie} // Valeur actuelle (ce qui est affiché)
                                        onChange={(e) => setVilleSaisie(e.target.value)} // Quand on tape, changer la valeur
                                        className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500" // Style du champ
                                        placeholder="Abidjan" // Texte gris qui disparaît quand on tape
                                    />
                                </div>

                                <div> {/* Champ "Quartier" */}
                                    <label className="block text-sm font-medium mb-1">Quartier *</label> {/* Étiquette "Quartier" (obligatoire) */}
                                    <input // Champ de saisie
                                        type="text" // Type texte
                                        value={quartierSaisi} // Valeur actuelle (ce qui est affiché)
                                        onChange={(e) => setQuartierSaisi(e.target.value)} // Quand on tape, changer la valeur
                                        className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500" // Style du champ
                                        placeholder="Ex: Cocody, Plateau..." // Texte gris qui disparaît quand on tape
                                        required // Champ obligatoire
                                    />
                                </div>
                            </div>

                            <div> {/* Champ "Adresse complète" */}
                                <label className="block text-sm font-medium mb-1">Adresse complète</label> {/* Étiquette "Adresse complète" */}
                                <input // Champ de saisie
                                    type="text" // Type texte
                                    value={adresseSaisie} // Valeur actuelle (ce qui est affiché)
                                    onChange={(e) => setAdresseSaisie(e.target.value)} // Quand on tape, changer la valeur
                                    className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500" // Style du champ
                                    placeholder="Rue, immeuble..." // Texte gris qui disparaît quand on tape
                                />
                            </div>

                            <div> {/* Champ "Numéro Mobile Money" */}
                                <label className="block text-sm font-medium mb-1">Numéro Mobile Money</label> {/* Étiquette "Numéro Mobile Money" */}
                                <input // Champ de saisie
                                    type="tel" // Type téléphone (clavier numérique sur mobile)
                                    value={mobileMonkeySaisi} // Valeur actuelle (ce qui est affiché)
                                    onChange={(e) => setMobileMonkeySaisi(e.target.value)} // Quand on tape, changer la valeur
                                    className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500" // Style du champ
                                    placeholder="0707070707" // Texte gris qui disparaît quand on tape
                                />
                            </div>

                            <div> {/* Section "Jours disponibles" */}
                                <label className="block text-sm font-medium mb-2">Jours disponibles *</label> {/* Étiquette "Jours disponibles" (obligatoire) */}
                                <div className="grid grid-cols-4 gap-2"> {/* Grille de 4 colonnes pour les jours */}
                                    {joursSemaine.map(jour => ( // Pour chaque jour de la semaine
                                        <button // Bouton pour chaque jour
                                            key={jour} // Clé unique pour React
                                            type="button" // Type bouton (ne pas envoyer le formulaire)
                                            onClick={() => gererChangementJour(jour)} // Quand on clique, appeler la fonction
                                            className={`py-2 px-3 rounded-lg text-sm font-medium transition ${ // Style du bouton
                                                joursDisponiblesChoisis.includes(jour) // Si le jour est choisi
                                                    ? 'bg-pink-500 text-white' // Bouton rose (choisi)
                                                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-pink-300' // Bouton blanc (non choisi)
                                            }`}
                                        >
                                            {jour.slice(0, 3)} {/* Afficher les 3 premières lettres du jour */}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 bg-white p-3 rounded-lg"> {/* Boîte blanche pour la case à cocher */}
                                <input // Case à cocher
                                    type="checkbox" // Type case à cocher
                                    id="disponibilite24h" // Identifiant unique
                                    checked={disponibilite24hChoisie} // État de la case (cochée ou non)
                                    onChange={(e) => setDisponibilite24hChoisie(e.target.checked)} // Quand on clique, changer l'état
                                    className="w-5 h-5 text-pink-500" // Style de la case
                                />
                                <label htmlFor="disponibilite24h" className="font-medium"> {/* Étiquette liée à la case */}
                                    🌙 Disponible 24h/24 (comme Mme Sofi) {/* Texte de la case */}
                                </label>
                            </div>

                            {!disponibilite24hChoisie && ( // Si "24h/24" n'est pas coché, alors afficher les horaires
                                <div className="grid grid-cols-2 gap-4"> {/* Grille de 2 colonnes pour les horaires */}
                                    <div> {/* Champ "Heure d'ouverture" */}
                                        <label className="block text-sm font-medium mb-1">Heure d'ouverture</label> {/* Étiquette "Heure d'ouverture" */}
                                        <input // Champ de saisie
                                            type="time" // Type heure (sélecteur d'heure)
                                            value={heureOuvertureSaisie} // Valeur actuelle (ce qui est affiché)
                                            onChange={(e) => setHeureOuvertureSaisie(e.target.value)} // Quand on change, changer la valeur
                                            className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500" // Style du champ
                                        />
                                    </div>

                                    <div> {/* Champ "Heure de fermeture" */}
                                        <label className="block text-sm font-medium mb-1">Heure de fermeture</label> {/* Étiquette "Heure de fermeture" */}
                                        <input // Champ de saisie
                                            type="time" // Type heure (sélecteur d'heure)
                                            value={heureFermetureSaisie} // Valeur actuelle (ce qui est affiché)
                                            onChange={(e) => setHeureFermetureSaisie(e.target.value)} // Quand on change, changer la valeur
                                            className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pink-500" // Style du champ
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2"> {/* Section des services avec espace entre les éléments */}
                                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg"> {/* Boîte blanche pour "Service au salon" */}
                                    <input // Case à cocher
                                        type="checkbox" // Type case à cocher
                                        id="serviceSalon" // Identifiant unique
                                        checked={serviceSalonChoisi} // État de la case (cochée ou non)
                                        onChange={(e) => setServiceSalonChoisi(e.target.checked)} // Quand on clique, changer l'état
                                        className="w-5 h-5 text-pink-500" // Style de la case
                                    />
                                    <label htmlFor="serviceSalon" className="font-medium"> {/* Étiquette liée à la case */}
                                        🏢 Service au salon {/* Texte de la case */}
                                    </label>
                                </div>

                                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg"> {/* Boîte blanche pour "Service à domicile" */}
                                    <input // Case à cocher
                                        type="checkbox" // Type case à cocher
                                        id="serviceDomicile" // Identifiant unique
                                        checked={serviceDomicileChoisi} // État de la case (cochée ou non)
                                        onChange={(e) => setServiceDomicileChoisi(e.target.checked)} // Quand on clique, changer l'état
                                        className="w-5 h-5 text-pink-500" // Style de la case
                                    />
                                    <label htmlFor="serviceDomicile" className="font-medium"> {/* Étiquette liée à la case */}
                                        🏠 Service à domicile (comme pour Mme Soro) {/* Texte de la case */}
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bouton d'inscription (bouton principal) */}
                    <button // Bouton principal
                        type="submit" // Type submit (envoie le formulaire)
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition shadow-lg hover:shadow-xl" // Style du bouton (dégradé, effet hover, ombre)
                    >
                        🎉 S'inscrire {/* Texte du bouton */}
                    </button>
                </form>

                {/* Lien vers la connexion (pour ceux qui ont déjà un compte) */}
                <p className="text-center text-sm text-gray-500 mt-6"> {/* Paragraphe centré avec espace en haut */}
                    Déjà inscrit ? <button onClick={() => navigate('/connexion')} className="text-pink-600 font-semibold hover:underline">Se connecter</button> {/* Bouton pour aller à la page de connexion */}
                </p>
            </div> {/* Fin de la boîte blanche */}
        </div> 
    ); // Fin du return
} // Fin de la fonction Inscription

// Exporter le composant (pour qu'il puisse être utilisé ailleurs)
export default Inscription;