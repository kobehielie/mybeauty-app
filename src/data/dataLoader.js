import mockData from './mockData.json';

class DataLoader {
  constructor() {
    this.data = mockData;
  }

  loadAll() {
    return {
      utilisateurs: this.data.utilisateurs || [],
      clients: this.data.clients || [],
      prestataires: this.data.prestataires || [],
      services: this.data.services || [],
      reservations: this.data.reservations || [],
      plannings: this.data.plannings || [],
      paiements: this.data.paiements || [],
      avis: this.data.avis || [],
      notifications: this.data.notifications || []
    };
  }

  getClientById(id) {
    const clients = this.loadAll().clients;
    return clients.find(c => c.id === id) || null;
  }

  getPrestataireById(id) {
    const prestataires = this.loadAll().prestataires;
    return prestataires.find(p => p.id === id) || null;
  }

  getServiceById(id) {
    const services = this.loadAll().services;
    return services.find(s => s.id === id) || null;
  }

  getReservationById(id) {
    const reservations = this.loadAll().reservations;
    return reservations.find(r => r.id === id) || null;
  }
}

// Singleton
const dataLoader = new DataLoader();

export default dataLoader;
