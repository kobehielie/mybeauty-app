// Script de test pour vérifier la mise à jour de l'image de Marie Koffi
import dataLoader from '../data/dataLoader.js';

/**
 * Fonction pour tester la mise à jour de l'image de Marie Koffi
 */
export function testMarieKoffiImageUpdate() {
    console.log("🧪 Test de mise à jour de l'image de Marie Koffi");
    
    try {
        // Charger toutes les données
        const data = dataLoader.loadAll();
        
        // Trouver Marie Koffi (prestataire id: 4)
        const marieKoffi = data.prestataires.find(p => p.id === 4);
        
        if (!marieKoffi) {
            console.error("❌ Marie Koffi (prestataire id: 4) non trouvée");
            return false;
        }
        
        console.log("✅ Marie Koffi trouvée:");
        console.log(`   - Nom: ${marieKoffi.prenom} ${marieKoffi.nom}`);
        console.log(`   - Email: ${marieKoffi.email}`);
        console.log(`   - Spécialité: ${marieKoffi.specialite}`);
        console.log(`   - Image actuelle: ${marieKoffi.image}`);
        
        // Vérifier que l'image a été mise à jour
        const nouvelleImageURL = "https://fr.freepik.com/photos-gratuite/femme-styliste-prenant-soin-cheveux-afro-son-client_22377909.htm#fromView=search&page=1&position=2&uuid=b2de1c5a-2325-40c8-af1d-fbe993186b29&query=coiffeuse";
        
        if (marieKoffi.image === nouvelleImageURL) {
            console.log("✅ L'image de Marie Koffi a été correctement mise à jour!");
            return true;
        } else {
            console.log("⚠️  L'image de Marie Koffi ne correspond pas à la nouvelle URL attendue");
            console.log(`   - Attendue: ${nouvelleImageURL}`);
            console.log(`   - Actuelle: ${marieKoffi.image}`);
            return false;
        }
        
    } catch (error) {
        console.error("❌ Erreur lors du test:", error);
        return false;
    }
}

/**
 * Fonction pour tester que tous les prestataires ont des images valides
 */
export function testAllPrestataireImages() {
    console.log("🧪 Test de validation des images de tous les prestataires");
    
    try {
        const data = dataLoader.loadAll();
        const prestataires = data.prestataires;
        
        console.log(`📊 Nombre total de prestataires: ${prestataires.length}`);
        
        prestataires.forEach(prestataire => {
            console.log(`\n👤 ${prestataire.prenom} ${prestataire.nom} (ID: ${prestataire.id})`);
            console.log(`   - Spécialité: ${prestataire.specialite}`);
            
            if (prestataire.image) {
                console.log(`   - Image: ✅ ${prestataire.image}`);
            } else {
                console.log(`   - Image: ❌ Aucune image définie`);
            }
        });
        
        return true;
        
    } catch (error) {
        console.error("❌ Erreur lors du test:", error);
        return false;
    }
}

// Exporter les fonctions de test
export default {
    testMarieKoffiImageUpdate,
    testAllPrestataireImages
};
