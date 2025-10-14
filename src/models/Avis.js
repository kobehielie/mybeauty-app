class Avis {
  constructor(id, clientId, prestataireId, note, commentaire = "") {
    this.id = id;
    this.clientId = clientId;
    this.prestataireId = prestataireId;
    this.note = note;
    this.commentaire = commentaire;
    this.date = new Date();
    this.reponse = null; // Réponse du prestataire
    this.dateReponse = null;
  }

  // Ajouter une réponse du prestataire
  ajouterReponse(reponse) {
    this.reponse = reponse;
    this.dateReponse = new Date();
    return { success: true, message: "Réponse ajoutée avec succès" };
  }

  publierAvis() {
    if (this.note < 0 || this.note > 5) {
      return { success: false, message: "La note doit être entre 0 et 5" };
    }

    return { success: true, message: "Avis publié avec succès" };
  }

  modifierAvis(nouvelleNote, nouveauCommentaire) {
    if (nouvelleNote !== undefined) {
      if (nouvelleNote < 0 || nouvelleNote > 5) {
        return { success: false, message: "La note doit être entre 0 et 5" };
      }
      this.note = nouvelleNote;
    }

    if (nouveauCommentaire !== undefined) {
      this.commentaire = nouveauCommentaire;
    }

    return { success: true, message: "Avis modifié" };
  }

  getNote() {
    return this.note;
  }

  getCommentaire() {
    return this.commentaire;
  }

  getDate() {
    return this.date;
  }

  getDetails() {
    return {
      id: this.id,
      clientId: this.clientId,
      prestataireId: this.prestataireId,
      note: this.note,
      commentaire: this.commentaire,
      date: this.date
    };
  }
}

export default Avis;
