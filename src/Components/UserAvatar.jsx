// Composant réutilisable pour afficher l'avatar d'un utilisateur avec sa première lettre
// Version: Affiche UNIQUEMENT la première lettre du prénom (jamais d'image)
import React from 'react';

// Composant UserAvatar - Affiche un avatar avec la première lettre du prénom de l'utilisateur
function UserAvatar({ 
    user,           // Objet utilisateur contenant prenom et nom
    size = 'md',    // Taille de l'avatar : 'sm', 'md', 'lg', 'xl'
    className = ''  // Classes CSS supplémentaires
}) {
    // Définir les tailles disponibles
    const sizeClasses = {
        sm: 'w-8 h-8 text-sm',      // Petit (32px)
        md: 'w-10 h-10 text-lg',   // Moyen (40px) - par défaut
        lg: 'w-12 h-12 text-xl',   // Grand (48px)
        xl: 'w-16 h-16 text-2xl',  // Très grand (64px)
        '2xl': 'w-32 h-32 text-4xl' // Énorme (128px) pour les profils
    };

    // Obtenir la première lettre du prénom, ou 'U' par défaut
    const firstLetter = user?.prenom?.charAt(0).toUpperCase() || 'U';
    
    // Classes de base pour l'avatar
    const baseClasses = 'rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold';
    
    // Combiner toutes les classes
    const finalClasses = `${baseClasses} ${sizeClasses[size]} ${className}`;

    // Ne jamais afficher l'image, toujours afficher la première lettre
    return (
        <div className={finalClasses}>
            {firstLetter}
        </div>
    );
}

// Exporter le composant pour qu'il puisse être utilisé dans d'autres fichiers
export default UserAvatar;
