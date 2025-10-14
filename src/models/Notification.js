class Notification {
  constructor(id, utilisateurId, type, message) {
    this.id = id;
    this.utilisateurId = utilisateurId;
    this.type = type;
    this.message = message;
    this.lu = false;
    this.dateCreation = new Date();
  }

  envoyerNotification() {
    console.log(`Envoi notification à l'utilisateur ${this.utilisateurId}: ${this.message}`);
    return { success: true, message: "Notification envoyée" };
  }

  marquerCommeLu() {
    this.lu = true;
    return { success: true, message: "Notification marquée comme lue" };
  }

  estLu() {
    return this.lu;
  }

  getType() {
    return this.type;
  }

  getMessage() {
    return this.message;
  }
}

export default Notification;
