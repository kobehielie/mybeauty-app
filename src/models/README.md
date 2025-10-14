# Documentation des Classes - MyBeauty App

## Architecture

Ce projet implémente un système de gestion de rendez-vous pour services de beauté basé sur le diagramme UML fourni.

### Structure des dossiers

```
src/
├── models/              # Classes du domaine
│   ├── Utilisateur.js
│   ├── Client.js
│   ├── Prestataire.js
│   ├── Reservation.js
│   ├── Notification.js
│   ├── Paiement.js
│   ├── Service.js
│   ├── Planning.js
│   ├── Avis.js
│   └── index.js
├── data/                # Données mockées
│   ├── mockData.json
│   └── dataLoader.js
└── examples/            # Exemples d'utilisation
    └── usageExample.js
```

## Classes

### 1. Utilisateur (Classe de base)

Classe parente pour Client et Prestataire.

**Attributs:**
- `id`: int
- `nom`: string
- `prenom`: string
- `email`: string
- `telephone`: string
- `motDePasse`: string
- `role`: string

**Méthodes:**
- `seConnecter(email, motDePasse)`: Authentifie l'utilisateur
- `seDeconnecter()`: Déconnecte l'utilisateur
- `modifierProfil(nouvelleDonnees)`: Met à jour les informations

### 2. Client (hérite de Utilisateur)

Représente un client qui réserve des services.

**Attributs additionnels:**
- `preferencePaiement`: string
- `historiqueReservations`: List<Reservation>

**Méthodes:**
- `rechercherPrestataires(criteres)`: Recherche des prestataires
- `reserverService(prestataire, service, date)`: Crée une réservation

### 3. Prestataire (hérite de Utilisateur)

Représente un prestataire de services.

**Attributs additionnels:**
- `servicesProposed`: List<Service>
- `planning`: Planning
- `avis`: List<Avis>
- `catalogue`: List<Service>
- `mobileMonkey`: string

**Méthodes:**
- `publierPlanning(planning)`: Publie le planning
- `gererService(action, service)`: Ajoute/modifie/supprime un service
- `recevoirPaiement(paiement)`: Reçoit un paiement

### 4. Reservation

Gère les réservations de services.

**Attributs:**
- `id`: int
- `clientId`: int
- `prestataireId`: int
- `serviceId`: int
- `date`: DateTime
- `statut`: string

**Méthodes:**
- `confirmer()`: Confirme la réservation
- `annuler()`: Annule la réservation
- `notifier(message)`: Envoie une notification

### 5. Service

Représente un service proposé.

**Attributs:**
- `id`: int
- `nom`: string
- `description`: string
- `prix`: float
- `duree`: int (en minutes)

**Méthodes:**
- `ajouterService()`: Active le service
- `modifierService(nouvelleDonnees)`: Modifie le service
- `supprimerService()`: Désactive le service

### 6. Planning

Gère la disponibilité des prestataires.

**Attributs:**
- `id`: int
- `prestataireId`: int
- `creneauHoraire`: string
- `disponibilite`: bool
- `creneaux`: List

**Méthodes:**
- `ajouterCreneau(creneau)`: Ajoute un créneau
- `modifierCreneau(id, nouvelleDonnees)`: Modifie un créneau
- `supprimerCreneau(id)`: Supprime un créneau
- `reserverCreneau(id)`: Réserve un créneau
- `libererCreneau(id)`: Libère un créneau

### 7. Paiement

Gère les transactions.

**Attributs:**
- `id`: int
- `reservationId`: int
- `montant`: float
- `modePaiement`: string
- `statut`: string

**Méthodes:**
- `initierPaiement()`: Lance le processus de paiement
- `confirmerPaiement()`: Confirme le paiement
- `echouer()`: Marque comme échoué
- `rembourser()`: Effectue un remboursement

### 8. Avis

Gère les avis clients.

**Attributs:**
- `id`: int
- `clientId`: int
- `prestataireId`: int
- `note`: float
- `commentaire`: string
- `date`: DateTime

**Méthodes:**
- `publierAvis()`: Publie l'avis
- `modifierAvis(note, commentaire)`: Modifie l'avis

### 9. Notification

Gère les notifications utilisateurs.

**Attributs:**
- `id`: int
- `utilisateurId`: int
- `type`: string
- `message`: string
- `lu`: bool

**Méthodes:**
- `envoyerNotification()`: Envoie la notification
- `marquerCommeLu()`: Marque comme lue

## Utilisation

### Charger les données

```javascript
import dataLoader from './data/dataLoader.js';

// Charger toutes les données
const instances = dataLoader.loadAll();

// Accéder aux instances
const clients = instances.clients;
const prestataires = instances.prestataires;
const services = instances.services;
```

### Exemple de flux complet

```javascript
// 1. Client se connecte
const client = dataLoader.getClientById(1);
client.seConnecter("marie.dupont@email.com", "password123");

// 2. Rechercher un prestataire
const prestataire = dataLoader.getPrestataireById(4);

// 3. Consulter les services
const service = dataLoader.getServiceById(1);

// 4. Réserver
const reservation = client.reserverService(prestataire, service, new Date());

// 5. Confirmer la réservation
reservation.reservation.confirmer();

// 6. Effectuer le paiement
const paiement = new Paiement(1, reservation.reservation.id, service.prix, "carte");
paiement.initierPaiement();
paiement.confirmerPaiement();

// 7. Laisser un avis
const avis = new Avis(1, client.id, prestataire.id, 5, "Excellent !");
avis.publierAvis();
```

### Méthodes utiles du DataLoader

```javascript
// Récupérer par ID
dataLoader.getClientById(id)
dataLoader.getPrestataireById(id)
dataLoader.getServiceById(id)

// Récupérer par relation
dataLoader.getReservationsByClient(clientId)
dataLoader.getReservationsByPrestataire(prestataireId)
dataLoader.getAvisByPrestataire(prestataireId)
dataLoader.getNotificationsByUser(utilisateurId)
dataLoader.getPlanningByPrestataire(prestataireId)
```

## Données JSON

Le fichier `mockData.json` contient:
- **3 clients** avec leurs préférences
- **3 prestataires** (salon de coiffure, institut de beauté, spa)
- **9 services** variés
- **4 réservations** avec différents statuts
- **3 plannings** avec créneaux
- **3 paiements**
- **3 avis**
- **4 notifications**

## Statuts

### Réservation
- `en_attente`: Créée, attend confirmation
- `confirmée`: Acceptée par le prestataire
- `annulée`: Annulée
- `terminée`: Service effectué

### Paiement
- `en_attente`: En attente d'initialisation
- `en_cours`: Paiement initié
- `confirmé`: Paiement validé
- `échoué`: Paiement échoué
- `remboursé`: Remboursement effectué

## Utilisation dans React

### Dans un composant

```javascript
import { useEffect, useState } from 'react';
import dataLoader from '../data/dataLoader';

function MonComposant() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // Charger les données
    const data = dataLoader.loadAll();
    setClients(data.clients);
  }, []);

  const handleConnexion = () => {
    const client = dataLoader.getClientById(1);
    const result = client.seConnecter("marie.dupont@email.com", "password123");
    
    if (result.success) {
      // Client connecté
      console.log("Connecté:", client.nom);
    }
  };

  return (
    <div>
      {clients.map(c => (
        <div key={c.id}>{c.nom} {c.prenom}</div>
      ))}
    </div>
  );
}
```
