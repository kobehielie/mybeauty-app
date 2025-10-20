import { useState, useEffect } from 'react';
import dataLoader from '../data/dataLoader';

/**
 * Hook personnalisé pour charger les données de manière optimisée
 * Utilise le chargement asynchrone pour ne pas bloquer l'interface
 */
export const useDataLoader = (dataKeys = []) => {
  // Initialiser avec des tableaux vides pour éviter les erreurs
  const initialData = {};
  dataKeys.forEach(key => {
    initialData[key] = [];
  });
  
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Simuler un chargement asynchrone pour ne pas bloquer l'UI
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const loadedData = {};
        
        if (dataKeys.length === 0) {
          // Si aucune clé spécifiée, charger tout
          Object.assign(loadedData, dataLoader.loadAll());
        } else {
          // Charger uniquement les données demandées
          dataKeys.forEach(key => {
            loadedData[key] = dataLoader.load(key) || [];
          });
        }
        
        setData(loadedData);
        setError(null);
      } catch (err) {
        setError(err);
        console.error('Erreur lors du chargement des données:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataKeys.join(',')]); // Recharger si les clés changent

  return { data, loading, error };
};

/**
 * Hook pour charger un prestataire spécifique
 */
export const usePrestataire = (id) => {
  const [prestataire, setPrestataire] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrestataire = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 0));
      const data = dataLoader.getPrestataireById(parseInt(id));
      setPrestataire(data);
      setLoading(false);
    };

    if (id) {
      loadPrestataire();
    }
  }, [id]);

  return { prestataire, loading };
};

/**
 * Hook pour charger les prestataires avec pagination
 */
export const usePrestataires = (limit = null) => {
  const [prestataires, setPrestataires] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrestataires = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 0));
      let data = dataLoader.getPrestataires();
      if (limit) {
        data = data.slice(0, limit);
      }
      setPrestataires(data);
      setLoading(false);
    };

    loadPrestataires();
  }, [limit]);

  return { prestataires, loading };
};
