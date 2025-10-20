// Importer les outils pour la navigation entre les pages
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Importer les contextes nécessaires
import { ChatProvider } from './contexts/ChatContext';           // Contexte pour le chat
import { NotificationProvider } from './contexts/NotificationContext'; // Contexte pour les notifications
import { AuthProvider } from './contexts/SimpleAuthContext';      // Contexte pour l'authentification

// Importer uniquement les pages critiques (chargement immédiat)
import Home from './Components/Home';                           // Page d'accueil
import Connexion from './Components/Connexion';                 // Page pour se connecter
import Inscription from './Components/Inscription';             // Page pour créer un compte

// Lazy loading pour les autres pages (chargement à la demande)
const Profil = lazy(() => import('./Components/Profil'));
const Services = lazy(() => import('./Components/Services'));
const PrestataireDetails = lazy(() => import('./Components/PrestataireDetails'));
const LocalisationPrestataire = lazy(() => import('./Components/LocalisationPrestataire'));
const Paiement = lazy(() => import('./Components/Paiement'));
const DashboardClient = lazy(() => import('./Components/DashboardClient'));
const DashboardPrestataire = lazy(() => import('./Components/DashboardPrestataire'));
const MesClients = lazy(() => import('./Components/MesClients'));
const ProfilClient = lazy(() => import('./Components/ProfilClient'));
const MesServices = lazy(() => import('./Components/MesServices'));
const GestionPlanning = lazy(() => import('./Components/GestionPlanning.jsx'));
const ChatInterface = lazy(() => import('./Components/ChatInterface'));
const DashboardAdmin = lazy(() => import('./Components/DashboardAdmin'));

// Composant de chargement élégant
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-pink-600 mx-auto"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="text-3xl">💅</span>
        </div>
      </div>
      <p className="text-gray-600 mt-4 font-medium">Chargement...</p>
    </div>
  </div>
);

// Composant principal de l'application
function App() {
  return (
    // Envelopper l'application avec les contextes nécessaires
    <AuthProvider>
      <NotificationProvider>
        <ChatProvider>
          {/* Router permet la navigation entre les pages */}
          <Router>
          <Suspense fallback={<LoadingFallback />}>
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

        {/* Route pour le dashboard admin */}
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />

        {/*
          Pour ajouter une nouvelle page :
          1. Créer le fichier dans src/Components/
          2. L'importer en haut de ce fichier
          3. Ajouter une Route ici avec le chemin souhaité
          Exemple : <Route path="/ma-nouvelle-page" element={<MaNouvellePageComponent />} />
        */}
          </Routes>
          </Suspense>
        </Router>
        </ChatProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

// Exporter le composant pour qu'il soit utilisé dans index.js
export default App;
