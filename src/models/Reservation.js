class Reservation {
  constructor(id, clientId, prestataireId, serviceId, date, statut = "en_attente", options = {}) {
    this.id = id;
    this.clientId = clientId;
    this.prestataireId = prestataireId;
    this.serviceId = serviceId;
    this.date = date;
    this.statut = statut;
    
    // Pour Mme Soro (service à domicile)
    this.lieuService = options.lieuService || "salon"; // "salon" ou "domicile"
    this.adresseDomicile = options.adresseDomicile || null; // Si service à domicile
  }

  confirmer() {
    if (this.statut === "annulée") {
      return { success: false, message: "Impossible de confirmer une réservation annulée" };
    }

    this.statut = "confirmée";
    this.notifier("Votre réservation a été confirmée");
    return { success: true, message: "Réservation confirmée" };
  }

  annuler() {
    if (this.statut === "terminée") {
      return { success: false, message: "Impossible d'annuler une réservation terminée" };
    }

    this.statut = "annulée";
    this.notifier("Votre réservation a été annulée");
    return { success: true, message: "Réservation annulée" };
  }

  notifier(message) {
    console.log(`Notification pour réservation ${this.id}: ${message}`);
    return { success: true, message: "Notification envoyée" };
  }

  terminer() {
    if (this.statut !== "confirmée") {
      return { success: false, message: "La réservation doit être confirmée" };
    }

    this.statut = "terminée";
    return { success: true, message: "Réservation terminée" };
  }

  getStatut() {
    return this.statut;
  }
}

export default Reservation;
