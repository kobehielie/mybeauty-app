import Utilisateur from './Utilisateur.js';
import Reservation from './Reservation.js';

class Client extends Utilisateur {
  constructor(id, nom, prenom, email, telephone, motDePasse, preferencePaiement = "carte", image = null) {
    super(id, nom, prenom, email, telephone, motDePasse, "client", image);
    this.preferencePaiement = preferencePaiement;
    this.historiqueReservations = [];
  }

  rechercherPrestataires(criteres) {
    if (!this.estConnecte) {
      return { success: false, message: "Veuillez vous connecter", prestataires: [] };
    }

    const prestatairesDisponibles = this._filtrerPrestataires(criteres);
    return { success: true, prestataires: prestatairesDisponibles };
  }

  reserverService(prestataire, service, date) {
    if (!this.estConnecte) {
      return { success: false, message: "Veuillez vous connecter" };
    }

    const reservation = new Reservation(
      Date.now(),
      this.id,
      prestataire.id,
      service.id,
      date,
      "en_attente"
    );

    this.historiqueReservations.push(reservation);
    return { success: true, message: "Réservation créée", reservation };
  }

  _filtrerPrestataires(criteres) {
    return [];
  }

  getHistoriqueReservations() {
    return this.historiqueReservations;
  }
}

export default Client;
