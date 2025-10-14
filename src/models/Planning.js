class Planning {
  constructor(id, prestataireId, creneauHoraire = "", disponibilite = true) {
    this.id = id;
    this.prestataireId = prestataireId;
    this.creneauHoraire = creneauHoraire;
    this.disponibilite = disponibilite;
    this.creneaux = [];
    this.joursOuvrables = []; // Jours de travail
    this.horaires = { // Horaires par défaut
      ouverture: "09:00",
      fermeture: "18:00"
    };
  }

  // Définir les jours ouvrables
  setJoursOuvrables(jours) {
    this.joursOuvrables = jours;
    return { success: true, message: "Jours ouvrables mis à jour" };
  }

  // Définir les horaires
  setHoraires(ouverture, fermeture) {
    if (ouverture >= fermeture) {
      return { success: false, message: "L'heure d'ouverture doit être avant l'heure de fermeture" };
    }
    this.horaires = { ouverture, fermeture };
    return { success: true, message: "Horaires mis à jour" };
  }

  ajouterCreneau(creneau) {
    const creneauExiste = this.creneaux.some(c => 
      c.date === creneau.date && c.heureDebut === creneau.heureDebut
    );

    if (creneauExiste) {
      return { success: false, message: "Ce créneau existe déjà" };
    }

    this.creneaux.push({
      ...creneau,
      disponible: true,
      id: Date.now()
    });

    return { success: true, message: "Créneau ajouté" };
  }

  modifierCreneau(creneauId, nouvelleDonnees) {
    const index = this.creneaux.findIndex(c => c.id === creneauId);

    if (index === -1) {
      return { success: false, message: "Créneau non trouvé" };
    }

    this.creneaux[index] = {
      ...this.creneaux[index],
      ...nouvelleDonnees
    };

    return { success: true, message: "Créneau modifié" };
  }

  supprimerCreneau(creneauId) {
    const index = this.creneaux.findIndex(c => c.id === creneauId);

    if (index === -1) {
      return { success: false, message: "Créneau non trouvé" };
    }

    this.creneaux.splice(index, 1);
    return { success: true, message: "Créneau supprimé" };
  }

  getCreneauxDisponibles() {
    return this.creneaux.filter(c => c.disponible);
  }

  // Obtenir les créneaux d'un mois spécifique
  getCreneauxParMois(mois, annee) {
    return this.creneaux.filter(c => {
      const creneauDate = new Date(c.date);
      return creneauDate.getMonth() === mois && creneauDate.getFullYear() === annee;
    });
  }

  // Obtenir les créneaux d'une date spécifique
  getCreneauxParDate(date) {
    return this.creneaux.filter(c => c.date === date);
  }

  reserverCreneau(creneauId) {
    const creneau = this.creneaux.find(c => c.id === creneauId);

    if (!creneau) {
      return { success: false, message: "Créneau non trouvé" };
    }

    if (!creneau.disponible) {
      return { success: false, message: "Créneau déjà réservé" };
    }

    creneau.disponible = false;
    return { success: true, message: "Créneau réservé" };
  }

  libererCreneau(creneauId) {
    const creneau = this.creneaux.find(c => c.id === creneauId);

    if (!creneau) {
      return { success: false, message: "Créneau non trouvé" };
    }

    creneau.disponible = true;
    return { success: true, message: "Créneau libéré" };
  }
}

export default Planning;
