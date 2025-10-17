class Admin {
    constructor(id = 1, nom = "Admin", prenom = "Admin", email = "admin@admin.com") {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.role = "admin";
        this.motDePasse = "admin123";
    }

    // ========== GESTION DES UTILISATEURS ==========

    /**
     * Récupérer tous les utilisateurs (clients + prestataires)
     */
    getTousLesUtilisateurs() {
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        const prestataires = JSON.parse(localStorage.getItem('prestataires') || '[]');
        
        return [
            ...clients.map(c => ({ ...c, type: 'client' })),
            ...prestataires.map(p => ({ ...p, type: 'prestataire' }))
        ];
    }

    /**
     * Ajouter un nouvel utilisateur
     */
    ajouterUtilisateur(utilisateur, type) {
        try {
            const key = type === 'client' ? 'clients' : 'prestataires';
            const utilisateurs = JSON.parse(localStorage.getItem(key) || '[]');
            
            const emailExiste = utilisateurs.some(u => u.email === utilisateur.email);
            if (emailExiste) {
                return { success: false, message: "Cet email existe déjà" };
            }

            const nouveauId = utilisateurs.length > 0 
                ? Math.max(...utilisateurs.map(u => u.id)) + 1 
                : 1;

            const nouvelUtilisateur = {
                ...utilisateur,
                id: nouveauId,
                role: type,
                dateInscription: new Date().toISOString(),
                actif: true,
                restrictions: []
            };

            utilisateurs.push(nouvelUtilisateur);
            localStorage.setItem(key, JSON.stringify(utilisateurs));

            this.enregistrerActivite('ajout_utilisateur', {
                utilisateurId: nouveauId,
                type: type,
                email: utilisateur.email
            });

            return { 
                success: true, 
                message: "Utilisateur ajouté avec succès",
                utilisateur: nouvelUtilisateur
            };
        } catch (error) {
            return { success: false, message: "Erreur: " + error.message };
        }
    }

    /**
     * Supprimer un utilisateur
     */
    supprimerUtilisateur(utilisateurId, type) {
        try {
            const key = type === 'client' ? 'clients' : 'prestataires';
            let utilisateurs = JSON.parse(localStorage.getItem(key) || '[]');
            
            const utilisateurIndex = utilisateurs.findIndex(u => u.id === utilisateurId);
            if (utilisateurIndex === -1) {
                return { success: false, message: "Utilisateur introuvable" };
            }

            const utilisateurSupprime = utilisateurs[utilisateurIndex];
            utilisateurs = utilisateurs.filter(u => u.id !== utilisateurId);
            localStorage.setItem(key, JSON.stringify(utilisateurs));

            this.enregistrerActivite('suppression_utilisateur', {
                utilisateurId: utilisateurId,
                type: type,
                email: utilisateurSupprime.email
            });

            return { 
                success: true, 
                message: "Utilisateur supprimé avec succès"
            };
        } catch (error) {
            return { success: false, message: "Erreur: " + error.message };
        }
    }

    /**
     * Modifier un utilisateur
     */
    modifierUtilisateur(utilisateurId, type, modifications) {
        try {
            const key = type === 'client' ? 'clients' : 'prestataires';
            const utilisateurs = JSON.parse(localStorage.getItem(key) || '[]');
            
            const utilisateurIndex = utilisateurs.findIndex(u => u.id === utilisateurId);
            if (utilisateurIndex === -1) {
                return { success: false, message: "Utilisateur introuvable" };
            }

            utilisateurs[utilisateurIndex] = {
                ...utilisateurs[utilisateurIndex],
                ...modifications,
                id: utilisateurId,
                role: type
            };

            localStorage.setItem(key, JSON.stringify(utilisateurs));

            this.enregistrerActivite('modification_utilisateur', {
                utilisateurId: utilisateurId,
                type: type,
                modifications: Object.keys(modifications)
            });

            return { 
                success: true, 
                message: "Utilisateur modifié avec succès",
                utilisateur: utilisateurs[utilisateurIndex]
            };
        } catch (error) {
            return { success: false, message: "Erreur: " + error.message };
        }
    }

    // ========== GESTION DES RESTRICTIONS ==========

    /**
     * Ajouter une restriction à un utilisateur
     */
    ajouterRestriction(utilisateurId, type, restriction) {
        try {
            const key = type === 'client' ? 'clients' : 'prestataires';
            const utilisateurs = JSON.parse(localStorage.getItem(key) || '[]');
            
            const utilisateurIndex = utilisateurs.findIndex(u => u.id === utilisateurId);
            if (utilisateurIndex === -1) {
                return { success: false, message: "Utilisateur introuvable" };
            }

            if (!utilisateurs[utilisateurIndex].restrictions) {
                utilisateurs[utilisateurIndex].restrictions = [];
            }

            const nouvelleRestriction = {
                id: Date.now(),
                type: restriction.type,
                raison: restriction.raison,
                dateDebut: new Date().toISOString(),
                dateFin: restriction.dateFin || null,
                actif: true
            };

            utilisateurs[utilisateurIndex].restrictions.push(nouvelleRestriction);
            
            if (restriction.type === 'suspension') {
                utilisateurs[utilisateurIndex].actif = false;
            }

            localStorage.setItem(key, JSON.stringify(utilisateurs));

            this.enregistrerActivite('ajout_restriction', {
                utilisateurId: utilisateurId,
                type: type,
                restriction: restriction.type,
                raison: restriction.raison
            });

            return { 
                success: true, 
                message: "Restriction ajoutée avec succès",
                restriction: nouvelleRestriction
            };
        } catch (error) {
            return { success: false, message: "Erreur: " + error.message };
        }
    }

    /**
     * Supprimer une restriction
     */
    supprimerRestriction(utilisateurId, type, restrictionId) {
        try {
            const key = type === 'client' ? 'clients' : 'prestataires';
            const utilisateurs = JSON.parse(localStorage.getItem(key) || '[]');
            
            const utilisateurIndex = utilisateurs.findIndex(u => u.id === utilisateurId);
            if (utilisateurIndex === -1) {
                return { success: false, message: "Utilisateur introuvable" };
            }

            if (!utilisateurs[utilisateurIndex].restrictions) {
                return { success: false, message: "Aucune restriction trouvée" };
            }

            utilisateurs[utilisateurIndex].restrictions = utilisateurs[utilisateurIndex].restrictions
                .filter(r => r.id !== restrictionId);

            const aSuspension = utilisateurs[utilisateurIndex].restrictions
                .some(r => r.type === 'suspension' && r.actif);
            
            if (!aSuspension) {
                utilisateurs[utilisateurIndex].actif = true;
            }

            localStorage.setItem(key, JSON.stringify(utilisateurs));

            this.enregistrerActivite('suppression_restriction', {
                utilisateurId: utilisateurId,
                type: type,
                restrictionId: restrictionId
            });

            return { 
                success: true, 
                message: "Restriction supprimée avec succès"
            };
        } catch (error) {
            return { success: false, message: "Erreur: " + error.message };
        }
    }

    // ========== SUIVI DES ACTIVITÉS ==========

    /**
     * Enregistrer une activité admin
     */
    enregistrerActivite(action, details) {
        const activites = JSON.parse(localStorage.getItem('activites_admin') || '[]');
        
        const nouvelleActivite = {
            id: Date.now(),
            adminId: this.id,
            action: action,
            details: details,
            date: new Date().toISOString()
        };

        activites.push(nouvelleActivite);
        
        if (activites.length > 1000) {
            activites.shift();
        }

        localStorage.setItem('activites_admin', JSON.stringify(activites));
    }

    /**
     * Voir les activités d'un utilisateur
     */
    voirActivitesUtilisateur(utilisateurId, type) {
        const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
        const reservationsUtilisateur = reservations.filter(r => 
            (type === 'client' && r.clientId === utilisateurId) ||
            (type === 'prestataire' && r.prestataireId === utilisateurId)
        );

        const avis = JSON.parse(localStorage.getItem('avis') || '[]');
        const avisUtilisateur = avis.filter(a => 
            (type === 'client' && a.clientId === utilisateurId) ||
            (type === 'prestataire' && a.prestataireId === utilisateurId)
        );

        const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
        const conversationsUtilisateur = conversations.filter(c => 
            c.participants.includes(utilisateurId)
        );

        return {
            reservations: reservationsUtilisateur,
            avis: avisUtilisateur,
            conversations: conversationsUtilisateur.length,
            derniereConnexion: this.getDerniereConnexion(utilisateurId, type)
        };
    }

    /**
     * Voir toutes les activités admin
     */
    voirActivitesAdmin(limite = 100) {
        const activites = JSON.parse(localStorage.getItem('activites_admin') || '[]');
        return activites.slice(-limite).reverse();
    }

    /**
     * Obtenir la dernière connexion
     */
    getDerniereConnexion(utilisateurId, type) {
        const key = type === 'client' ? 'clients' : 'prestataires';
        const utilisateurs = JSON.parse(localStorage.getItem(key) || '[]');
        const utilisateur = utilisateurs.find(u => u.id === utilisateurId);
        
        return utilisateur?.derniereConnexion || null;
    }

    // ========== STATISTIQUES ==========

    /**
     * Obtenir des statistiques globales
     */
    getStatistiques() {
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        const prestataires = JSON.parse(localStorage.getItem('prestataires') || '[]');
        const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
        const avis = JSON.parse(localStorage.getItem('avis') || '[]');

        return {
            totalClients: clients.length,
            totalPrestataires: prestataires.length,
            totalReservations: reservations.length,
            totalAvis: avis.length,
            clientsActifs: clients.filter(c => c.actif !== false).length,
            prestatairesActifs: prestataires.filter(p => p.actif !== false).length,
            reservationsConfirmees: reservations.filter(r => r.statut === 'confirmée').length,
            reservationsEnAttente: reservations.filter(r => r.statut === 'en attente').length,
            moyenneAvis: avis.length > 0 
                ? (avis.reduce((sum, a) => sum + a.note, 0) / avis.length).toFixed(1)
                : 0
        };
    }

    // ========== AUTHENTIFICATION ==========

    /**
     * Connexion admin
     */
    static seConnecter(email, motDePasse) {
        if (email === "admin@admin.com" && motDePasse === "admin123") {
            const admin = new Admin();
            localStorage.setItem('utilisateurConnecte', JSON.stringify(admin));
            
            admin.enregistrerActivite('connexion_admin', {
                email: email,
                date: new Date().toISOString()
            });

            return {
                success: true,
                message: "Connexion admin réussie",
                admin: admin
            };
        }

        return {
            success: false,
            message: "Identifiants admin incorrects"
        };
    }
}

export default Admin;
