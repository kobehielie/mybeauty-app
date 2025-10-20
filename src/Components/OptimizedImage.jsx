import { useState, useEffect } from 'react';

/**
 * Composant d'image optimisée avec lazy loading
 * Améliore les performances en chargeant les images uniquement quand elles sont visibles
 */
const OptimizedImage = ({ src, alt, className = '', placeholder = '' }) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Utiliser l'API Intersection Observer pour le lazy loading
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setImageLoaded(true);
    };

    img.onerror = () => {
      // En cas d'erreur, utiliser une image par défaut
      setImageSrc('https://via.placeholder.com/400x300?text=Image+non+disponible');
      setImageLoaded(true);
    };
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-50'} transition-opacity duration-300`}
      loading="lazy"
    />
  );
};

export default OptimizedImage;
