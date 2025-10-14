import Utilisateur from './Utilisateur.js';

class Prestataire extends Utilisateur {
  constructor(id, nom, prenom, email, telephone, motDePasse, mobileMonkey = "", image = null, options = {}) {
    super(id, nom, prenom, email, telephone, motDePasse, "prestataire", image);
    this.servicesProposed = [];
    this.planning = null;
    this.avis = [];
    this.catalogue = [];
    this.mobileMonkey = mobileMonkey;
    
    // Nouvelles propriétés selon les personas
    this.specialite = options.specialite || ""; // coiffeuse, maquilleuse, spa, etc.
    this.adresse = options.adresse || "";
    this.ville = options.ville || "";
    this.quartier = options.quartier || "";
    this.joursDisponibles = options.joursDisponibles || []; // ["lundi", "mardi", ...]
    this.heureOuverture = options.heureOuverture || "09:00";
    this.heureFermeture = options.heureFermeture || "18:00";
    this.disponibilite24h = options.disponibilite24h || false; // Pour Mme Sofi
    this.serviceDomicile = options.serviceDomicile || false; // Service à domicile
    this.serviceSalon = options.serviceSalon || true; // Service au salon
  }

  publierPlanning(planning) {
    if (!this.estConnecte) {
      return { success: false, message: "Veuillez vous connecter" };
    }

    this.planning = planning;
    return { success: true, message: "Planning publié avec succès" };
  }

  gererService(action, service) {
    if (!this.estConnecte) {
      return { success: false, message: "Veuillez vous connecter" };
    }

    switch (action) {
      case "ajouter":
        this.catalogue.push(service);
        this.servicesProposed.push(service);
        return { success: true, message: "Service ajouté" };

      case "modifier":
        const indexModif = this.catalogue.findIndex(s => s.id === service.id);
        if (indexModif !== -1) {
          this.catalogue[indexModif] = service;
          return { success: true, message: "Service modifié" };
        }
        return { success: false, message: "Service non trouvé" };

      case "supprimer":
        this.catalogue = this.catalogue.filter(s => s.id !== service.id);
        this.servicesProposed = this.servicesProposed.filter(s => s.id !== service.id);
        return { success: true, message: "Service supprimé" };

      default:
        return { success: false, message: "Action non reconnue" };
    }
  }

  recevoirPaiement(paiement) {
    if (!this.estConnecte) {
      return { success: false, message: "Veuillez vous connecter" };
    }

    if (paiement.statut === "confirmé") {
      return { success: true, message: `Paiement de ${paiement.montant}€ reçu` };
    }

    return { success: false, message: "Paiement non confirmé" };
  }

  ajouterAvis(avis) {
    this.avis.push(avis);
  }

  getMoyenneAvis() {
    if (this.avis.length === 0) return 0;
    const total = this.avis.reduce((sum, avis) => sum + avis.note, 0);
    return total / this.avis.length;
  }

  estDisponible(jour, heure) {
    // Si disponible 24h/24
    if (this.disponibilite24h) {
      return true;
    }

    // Vérifier le jour
    if (!this.joursDisponibles.includes(jour.toLowerCase())) {
      return false;
    }

    // Vérifier l'heure
    const heureNum = parseInt(heure.split(':')[0]);
    const ouvertureNum = parseInt(this.heureOuverture.split(':')[0]);
    const fermetureNum = parseInt(this.heureFermeture.split(':')[0]);

    return heureNum >= ouvertureNum && heureNum < fermetureNum;
  }

  getHorairesAffichage() {
    if (this.disponibilite24h) {
      return "Disponible 24h/24";
    }
    return `${this.joursDisponibles.join(', ')} de ${this.heureOuverture} à ${this.heureFermeture}`;
  }
}

export default Prestataire;
