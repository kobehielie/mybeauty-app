// Importer les outils React nécessaires
import { createContext, useContext, useState, useEffect } from 'react';
import Client from '../models/Client';
import Prestataire from '../models/Prestataire';

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

    // Fonction de connexion
    const login = async (email, password) => {
        try {
            setLoading(true);
            
            // Simulation d'une API - remplacer par un vrai appel API
            const users = JSON.parse(localStorage.getItem('utilisateurs') || '[]');
            const foundUser = users.find(u => u.email === email && u.motDePasse === password);
            
            if (!foundUser) {
                throw new Error('Email ou mot de passe incorrect');
            }

            // Créer l'instance appropriée selon le rôle
            let userInstance;
            if (foundUser.role === 'client') {
                userInstance = new Client(
                    foundUser.id,
                    foundUser.nom,
                    foundUser.prenom,
                    foundUser.email,
                    foundUser.telephone,
                    foundUser.motDePasse,
                    foundUser.preferencePaiement || 'carte',
                    foundUser.image
                );
            } else {
                userInstance = new Prestataire(
                    foundUser.id,
                    foundUser.nom,
                    foundUser.prenom,
                    foundUser.email,
                    foundUser.telephone,
                    foundUser.motDePasse,
                    foundUser.mobileMonkey || '',
                    foundUser.image,
                    foundUser.options || {}
                );
            }

            // Sauvegarder dans le localStorage
            const userToSave = {
                ...foundUser,
                estConnecte: true
            };
            
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

    // Fonction d'inscription
    const register = async (userData) => {
        try {
            setLoading(true);
            
            // Générer un ID unique
            const newId = Date.now();
            
            // Créer l'utilisateur selon son rôle
            let newUser;
            if (userData.role === 'client') {
                newUser = new Client(
                    newId,
                    userData.nom,
                    userData.prenom,
                    userData.email,
                    userData.telephone,
                    userData.motDePasse,
                    userData.preferencePaiement || 'carte',
                    userData.image
                );
            } else {
                newUser = new Prestataire(
                    newId,
                    userData.nom,
                    userData.prenom,
                    userData.email,
                    userData.telephone,
                    userData.motDePasse,
                    userData.mobileMonkey || '',
                    userData.image,
                    {
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
                    }
                );
            }

            // Sauvegarder dans le localStorage
            const users = JSON.parse(localStorage.getItem('utilisateurs') || '[]');
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
                    options: {
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
                    }
                } : {})
            };

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
        // La redirection sera gérée par les composants qui utilisent logout
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
