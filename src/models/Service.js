class Service {
  constructor(id, nom, description, prix, duree, image = null) {
    this.id = id;
    this.nom = nom;
    this.description = description;
    this.prix = prix;
    this.duree = duree;
    this.image = image;
    this.actif = true;
  }

  ajouterService() {
    this.actif = true;
    return { success: true, message: "Service activé" };
  }

  modifierService(nouvelleDonnees) {
    if (nouvelleDonnees.nom) this.nom = nouvelleDonnees.nom;
    if (nouvelleDonnees.description) this.description = nouvelleDonnees.description;
    if (nouvelleDonnees.prix !== undefined) this.prix = nouvelleDonnees.prix;
    if (nouvelleDonnees.duree !== undefined) this.duree = nouvelleDonnees.duree;

    return { success: true, message: "Service modifié" };
  }

  supprimerService() {
    this.actif = false;
    return { success: true, message: "Service désactivé" };
  }

  estActif() {
    return this.actif;
  }

  getPrix() {
    return this.prix;
  }

  getDuree() {
    return this.duree;
  }

  getDetails() {
    return {
      id: this.id,
      nom: this.nom,
      description: this.description,
      prix: this.prix,
      duree: this.duree,
      actif: this.actif
    };
  }
}

export default Service;
