// Importer les outils pour la navigation entre les pages
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Importer les contextes nécessaires
import { ChatProvider } from './contexts/ChatContext';           // Contexte pour le chat
import { NotificationProvider } from './contexts/NotificationContext'; // Contexte pour les notifications
import { AuthProvider } from './contexts/SimpleAuthContext';      // Contexte pour l'authentification

// Importer toutes les pages de notre application
import Home from './Components/Home';                           // Page d'accueil
import Inscription from './Components/Inscription';             // Page pour créer un compte
import Connexion from './Components/Connexion';                 // Page pour se connecter
import Profil from './Components/Profil';                       // Page du profil utilisateur
import Services from './Components/Services';                   // Page liste des services
import PrestataireDetails from './Components/PrestataireDetails'; // Page détails d'un prestataire
import LocalisationPrestataire from './Components/LocalisationPrestataire'; // Page carte du prestataire
import Paiement from './Components/Paiement';                   // Page de paiement
import DashboardClient from './Components/DashboardClient';     // Tableau de bord client
import DashboardPrestataire from './Components/DashboardPrestataire'; // Tableau de bord prestataire
import MesClients from './Components/MesClients';               // Page liste des clients du prestataire
import ProfilClient from './Components/ProfilClient';           // Page profil détaillé d'un client
import MesServices from './Components/MesServices';             // Page gestion des services du prestataire
import GestionPlanning from './Components/GestionPlanning.jsx';     // Page gestion planning
import ChatInterface from './Components/ChatInterface';         // Page de chat dynamique
import DebugApp from './Components/DebugApp';                   // Page de débogage temporaire

// Composant principal de l'application
function App() {
  return (
    // Envelopper l'application avec les contextes nécessaires
    <AuthProvider>
      <NotificationProvider>
        <ChatProvider>
          {/* Router permet la navigation entre les pages */}
          <Router>
          <Routes>
        {/* Route pour la page d'accueil */}
        <Route path="/" element={<Home />} />

        {/* Routes pour l'authentification */}
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />

        {/* Routes pour les utilisateurs */}
        <Route path="/profil" element={<Profil />} />
        <Route path="/services" element={<Services />} />

        {/* Routes pour les prestataires */}
        <Route path="/prestataire/:id" element={<PrestataireDetails />} />
        <Route path="/localisation" element={<LocalisationPrestataire />} />

        {/* Route pour le paiement */}
        <Route path="/paiement" element={<Paiement />} />

        {/* Routes pour les tableaux de bord */}
        <Route path="/dashboard-client" element={<DashboardClient />} />
        <Route path="/dashboard-prestataire" element={<DashboardPrestataire />} />
        <Route path="/mes-clients" element={<MesClients />} />
        <Route path="/client/:id" element={<ProfilClient />} />
        <Route path="/mes-services" element={<MesServices />} />
        <Route path="/gestion-planning" element={<GestionPlanning />} />

        {/* Route pour le chat dynamique */}
        <Route path="/chat" element={<ChatInterface />} />

        {/* Route temporaire pour le débogage */}
        <Route path="/debug" element={<DebugApp />} />

        {/*
          Pour ajouter une nouvelle page :
          1. Créer le fichier dans src/Components/
          2. L'importer en haut de ce fichier
          3. Ajouter une Route ici avec le chemin souhaité
          Exemple : <Route path="/ma-nouvelle-page" element={<MaNouvellePageComponent />} />
        */}
          </Routes>
        </Router>
        </ChatProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

// Exporter le composant pour qu'il soit utilisé dans index.js
export default App;
