class Paiement {
  constructor(id, reservationId, montant, modePaiement, statut = "en_attente") {
    this.id = id;
    this.reservationId = reservationId;
    this.montant = montant;
    // Modes acceptés: "carte", "mtn_money", "orange_money", "wave", "moov_money"
    this.modePaiement = modePaiement;
    this.statut = statut;
    this.dateCreation = new Date();
    this.dateConfirmation = null;
    this.numeroMobileMoney = null; // Pour stocker le numéro si Mobile Money
  }

  initierPaiement() {
    if (this.statut !== "en_attente") {
      return { success: false, message: "Le paiement a déjà été initié" };
    }

    this.statut = "en_cours";
    return { 
      success: true, 
      message: "Paiement initié", 
      montant: this.montant,
      modePaiement: this.modePaiement
    };
  }

  confirmerPaiement() {
    if (this.statut !== "en_cours") {
      return { success: false, message: "Le paiement n'est pas en cours" };
    }

    this.statut = "confirmé";
    this.dateConfirmation = new Date();
    return { 
      success: true, 
      message: "Paiement confirmé",
      montant: this.montant
    };
  }

  echouer() {
    this.statut = "échoué";
    return { success: true, message: "Paiement marqué comme échoué" };
  }

  rembourser() {
    if (this.statut !== "confirmé") {
      return { success: false, message: "Seuls les paiements confirmés peuvent être remboursés" };
    }

    this.statut = "remboursé";
    return { success: true, message: "Paiement remboursé" };
  }

  getStatut() {
    return this.statut;
  }
}

export default Paiement;
