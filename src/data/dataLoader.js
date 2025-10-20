import mockData from './mockData.json';

class DataLoader {
  constructor() {
    this.data = mockData;
    // Cache pour éviter de recharger les données à chaque fois
    this.cache = {};
  }

  // Chargement sélectif avec cache
  load(key) {
    if (!this.cache[key]) {
      this.cache[key] = this.data[key] || [];
    }
    return this.cache[key];
  }

  // Méthode optimisée - charge uniquement ce qui est demandé
  loadAll() {
    return {
      utilisateurs: this.load('utilisateurs'),
      clients: this.load('clients'),
      prestataires: this.load('prestataires'),
      services: this.load('services'),
      reservations: this.load('reservations'),
      plannings: this.load('plannings'),
      paiements: this.load('paiements'),
      avis: this.load('avis'),
      notifications: this.load('notifications')
    };
  }

  // Méthodes optimisées avec cache
  getClientById(id) {
    return this.load('clients').find(c => c.id === id) || null;
  }

  getPrestataireById(id) {
    return this.load('prestataires').find(p => p.id === id) || null;
  }

  getServiceById(id) {
    return this.load('services').find(s => s.id === id) || null;
  }

  getReservationById(id) {
    return this.load('reservations').find(r => r.id === id) || null;
  }

  // Méthodes pour charger uniquement ce qui est nécessaire
  getPrestataires() {
    return this.load('prestataires');
  }

  getServices() {
    return this.load('services');
  }

  getClients() {
    return this.load('clients');
  }

  // Invalider le cache si nécessaire
  clearCache(key = null) {
    if (key) {
      delete this.cache[key];
    } else {
      this.cache = {};
    }
  }
}

// Singleton
const dataLoader = new DataLoader();

export default dataLoader;
