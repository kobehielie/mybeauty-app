class Utilisateur {
  constructor(id, nom, prenom, email, telephone, motDePasse, role, image = null) {
    this.id = id;
    this.nom = nom;
    this.prenom = prenom;
    this.email = email;
    this.telephone = telephone;
    this.motDePasse = motDePasse;
    this.role = role;
    this.image = image;
    this.estConnecte = false;
  }

  seConnecter(email, motDePasse) {
    if (this.email === email && this.motDePasse === motDePasse) {
      this.estConnecte = true;
      return { success: true, message: "Connexion réussie" };
    }
    return { success: false, message: "Identifiants incorrects" };
  }

  seDeconnecter() {
    this.estConnecte = false;
    return { success: true, message: "Déconnexion réussie" };
  }

  modifierProfil(nouvelleDonnees) {
    if (!this.estConnecte) {
      return { success: false, message: "Veuillez vous connecter" };
    }

    if (nouvelleDonnees.nom) this.nom = nouvelleDonnees.nom;
    if (nouvelleDonnees.prenom) this.prenom = nouvelleDonnees.prenom;
    if (nouvelleDonnees.email) this.email = nouvelleDonnees.email;
    if (nouvelleDonnees.telephone) this.telephone = nouvelleDonnees.telephone;
    if (nouvelleDonnees.motDePasse) this.motDePasse = nouvelleDonnees.motDePasse;

    return { success: true, message: "Profil modifié avec succès" };
  }
}

export default Utilisateur;
