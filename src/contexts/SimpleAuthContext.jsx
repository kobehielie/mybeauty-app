// Version simplifiée de l'AuthContext pour diagnostiquer
import { createContext, useContext, useState, useEffect } from 'react';
import mockData from '../data/mockData.json';

// Créer le contexte d'authentification
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    return context;
};

// Composant Provider pour l'authentification
export const AuthProvider = ({ children }) => {
    // État pour l'utilisateur connecté
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Charger l'utilisateur depuis le localStorage au démarrage
    useEffect(() => {
        const loadUser = () => {
            try {
                const userData = localStorage.getItem('utilisateurConnecte');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error('Erreur lors du chargement de l\'utilisateur:', error);
                localStorage.removeItem('utilisateurConnecte');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // Fonction de connexion simplifiée
    const login = async (email, password) => {
        try {
            setLoading(true);
            
            // Chercher d'abord dans localStorage (utilisateurs ajoutés par admin)
            const clientsLocalStorage = JSON.parse(localStorage.getItem('clients') || '[]');
            const prestatairesLocalStorage = JSON.parse(localStorage.getItem('prestataires') || '[]');
            
            // Utiliser les données importées directement (pas de fetch)
            const data = mockData;
            
            // Combiner toutes les sources d'utilisateurs
            const allUsers = [
                ...data.utilisateurs, 
                ...data.clients, 
                ...data.prestataires,
                ...clientsLocalStorage,
                ...prestatairesLocalStorage
            ];
            
            const foundUser = allUsers.find(u => u.email === email && u.motDePasse === password);
            
            if (!foundUser) {
                throw new Error('Email ou mot de passe incorrect');
            }

            // Mettre à jour la dernière connexion
            const userToSave = {
                ...foundUser,
                estConnecte: true,
                derniereConnexion: new Date().toISOString()
            };
            
            // Mettre à jour dans localStorage si l'utilisateur vient de là
            if (foundUser.role === 'client') {
                const clients = JSON.parse(localStorage.getItem('clients') || '[]');
                const index = clients.findIndex(c => c.id === foundUser.id);
                if (index !== -1) {
                    clients[index].derniereConnexion = userToSave.derniereConnexion;
                    localStorage.setItem('clients', JSON.stringify(clients));
                }
            } else if (foundUser.role === 'prestataire') {
                const prestataires = JSON.parse(localStorage.getItem('prestataires') || '[]');
                const index = prestataires.findIndex(p => p.id === foundUser.id);
                if (index !== -1) {
                    prestataires[index].derniereConnexion = userToSave.derniereConnexion;
                    localStorage.setItem('prestataires', JSON.stringify(prestataires));
                }
            }
            
            localStorage.setItem('utilisateurConnecte', JSON.stringify(userToSave));
            setUser(userToSave);
            
            return { success: true, user: userToSave };
        } catch (error) {
            console.error('Erreur de connexion:', error);
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Fonction d'inscription simplifiée
    const register = async (userData) => {
        try {
            setLoading(true);
            
            // Générer un ID unique
            const newId = Date.now();
            
            // Créer l'utilisateur simple
            const userToSave = {
                id: newId,
                nom: userData.nom,
                prenom: userData.prenom,
                email: userData.email,
                telephone: userData.telephone,
                motDePasse: userData.motDePasse,
                role: userData.role,
                image: userData.image,
                estConnecte: true,
                ...(userData.role === 'client' ? { preferencePaiement: userData.preferencePaiement } : {}),
                ...(userData.role === 'prestataire' ? { 
                    mobileMonkey: userData.mobileMonkey,
                    specialite: userData.specialite,
                    adresse: userData.adresse,
                    ville: userData.ville,
                    quartier: userData.quartier,
                    joursDisponibles: userData.joursDisponibles,
                    heureOuverture: userData.heureOuverture,
                    heureFermeture: userData.heureFermeture,
                    disponibilite24h: userData.disponibilite24h,
                    serviceDomicile: userData.serviceDomicile,
                    serviceSalon: userData.serviceSalon
                } : {})
            };

            // Sauvegarder dans le localStorage
            const users = JSON.parse(localStorage.getItem('utilisateurs') || '[]');
            users.push(userToSave);
            localStorage.setItem('utilisateurs', JSON.stringify(users));
            localStorage.setItem('utilisateurConnecte', JSON.stringify(userToSave));
            
            setUser(userToSave);
            
            return { success: true, user: userToSave };
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Fonction de déconnexion
    const logout = () => {
        localStorage.removeItem('utilisateurConnecte');
        setUser(null);
    };

    // Fonction pour vérifier si l'utilisateur est connecté
    const isAuthenticated = () => {
        return user !== null && user.estConnecte;
    };

    // Fonction pour vérifier le rôle de l'utilisateur
    const hasRole = (role) => {
        return user && user.role === role;
    };

    // Fonction pour mettre à jour le profil utilisateur
    const updateProfile = async (updatedData) => {
        try {
            if (!user) throw new Error('Utilisateur non connecté');

            const users = JSON.parse(localStorage.getItem('utilisateurs') || '[]');
            const userIndex = users.findIndex(u => u.id === user.id);
            
            if (userIndex === -1) throw new Error('Utilisateur non trouvé');

            // Mettre à jour les données
            users[userIndex] = { ...users[userIndex], ...updatedData };
            const updatedUser = { ...user, ...updatedData };

            // Sauvegarder
            localStorage.setItem('utilisateurs', JSON.stringify(users));
            localStorage.setItem('utilisateurConnecte', JSON.stringify(updatedUser));
            setUser(updatedUser);

            return { success: true, user: updatedUser };
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            return { success: false, message: error.message };
        }
    };

    // Valeurs fournies par le contexte
    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        hasRole,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
