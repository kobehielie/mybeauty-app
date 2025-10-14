/**
 * Script pour optimiser les images du projet
 * 
 * Ce script réduit la taille des images tout en maintenant une bonne qualité
 * 
 * Installation des dépendances :
 * npm install --save-dev sharp
 * 
 * Utilisation :
 * node scripts/optimizeImages.js
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const IMAGE_DIR = './public/images';
const MAX_WIDTH = 800;
const MAX_HEIGHT = 800;
const QUALITY = 85;

async function optimizeImage(filePath) {
    try {
        const ext = extname(filePath).toLowerCase();
        
        if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
            console.log(`⏭️  Ignoré (format non supporté): ${filePath}`);
            return;
        }

        const stats = await stat(filePath);
        const originalSize = stats.size;
        
        console.log(`\n🔄 Optimisation de: ${filePath}`);
        console.log(`   Taille originale: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);

        // Créer un backup
        const backupPath = filePath.replace(ext, `.backup${ext}`);
        
        // Optimiser l'image
        await sharp(filePath)
            .resize(MAX_WIDTH, MAX_HEIGHT, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: QUALITY })
            .toFile(filePath.replace(ext, '.optimized.jpg'));

        const newStats = await stat(filePath.replace(ext, '.optimized.jpg'));
        const newSize = newStats.size;
        const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(2);

        console.log(`   Nouvelle taille: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Réduction: ${reduction}%`);
        console.log(`   ✅ Optimisé avec succès!`);

    } catch (error) {
        console.error(`❌ Erreur lors de l'optimisation de ${filePath}:`, error.message);
    }
}

async function processDirectory(dir) {
    try {
        const files = await readdir(dir);
        
        for (const file of files) {
            const filePath = join(dir, file);
            const stats = await stat(filePath);
            
            if (stats.isDirectory()) {
                await processDirectory(filePath);
            } else {
                await optimizeImage(filePath);
            }
        }
    } catch (error) {
        console.error(`❌ Erreur lors du traitement du dossier ${dir}:`, error.message);
    }
}

console.log('🖼️  Optimisation des images du projet MyBeauty\n');
console.log(`📁 Dossier: ${IMAGE_DIR}`);
console.log(`📐 Dimensions max: ${MAX_WIDTH}x${MAX_HEIGHT}px`);
console.log(`🎨 Qualité: ${QUALITY}%\n`);

processDirectory(IMAGE_DIR)
    .then(() => {
        console.log('\n✅ Optimisation terminée!');
        console.log('\n⚠️  Note: Les images optimisées ont l\'extension .optimized.jpg');
        console.log('   Vérifiez la qualité avant de remplacer les originales.');
    })
    .catch(error => {
        console.error('\n❌ Erreur:', error);
    });
