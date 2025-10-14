import { useEffect } from 'react';

/**
 * Composant pour gérer les métadonnées SEO dynamiques
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.title - Le titre de la page
 * @param {string} props.description - La description de la page
 * @param {string} props.keywords - Les mots-clés de la page
 * @param {string} props.canonical - L'URL canonique
 * @param {Object} props.ogImage - L'image Open Graph
 */
function SEOHead({ 
    title = "MyBeauty - Services de beauté en Côte d'Ivoire",
    description = "Plateforme de réservation de services de beauté en Côte d'Ivoire",
    keywords = "beauté, coiffure, esthétique, réservation, Côte d'Ivoire, Abidjan",
    canonical = "https://mybeauty.ci",
    ogImage = "/og-image.jpg"
}) {
    useEffect(() => {
        // Mettre à jour le titre de la page
        document.title = title;
        
        // Mettre à jour la meta description
        updateMetaTag('name', 'description', description);
        
        // Mettre à jour les mots-clés
        updateMetaTag('name', 'keywords', keywords);
        
        // Mettre à jour l'URL canonique
        updateCanonical(canonical);
        
        // Mettre à jour Open Graph
        updateMetaTag('property', 'og:title', title);
        updateMetaTag('property', 'og:description', description);
        updateMetaTag('property', 'og:url', canonical);
        updateMetaTag('property', 'og:image', ogImage);
        
        // Mettre à jour Twitter Card
        updateMetaTag('name', 'twitter:title', title);
        updateMetaTag('name', 'twitter:description', description);
        updateMetaTag('name', 'twitter:image', ogImage);
        
    }, [title, description, keywords, canonical, ogImage]);

    return null; // Ce composant ne rend rien visuellement
}

/**
 * Met à jour ou crée une balise meta
 * @param {string} attribute - L'attribut de la balise meta (name ou property)
 * @param {string} value - La valeur de l'attribut
 * @param {string} content - Le contenu de la balise
 */
function updateMetaTag(attribute, value, content) {
    let metaTag = document.querySelector(`meta[${attribute}="${value}"]`);
    
    if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute(attribute, value);
        document.head.appendChild(metaTag);
    }
    
    metaTag.setAttribute('content', content);
}

/**
 * Met à jour l'URL canonique
 * @param {string} url - L'URL canonique
 */
function updateCanonical(url) {
    let canonical = document.querySelector('link[rel="canonical"]');
    
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    
    canonical.setAttribute('href', url);
}

export default SEOHead;
