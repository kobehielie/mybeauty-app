# Images du projet MyBeauty

Ce dossier contient toutes les images locales utilisées dans l'application.

## Structure

- **prestataires/** : Photos des prestataires de services
  - `marie-koffi.jpg` : Photo de Marie Koffi (Coiffeuse)

## Utilisation

Les images dans ce dossier sont accessibles via des chemins relatifs :
```
/images/prestataires/marie-koffi.jpg
```

## Ajout de nouvelles images

1. Placez l'image dans le sous-dossier approprié
2. Utilisez un nom descriptif en minuscules avec des tirets
3. Mettez à jour le fichier `src/data/mockData.json` avec le chemin relatif

## Formats recommandés

- **Format** : JPG, PNG, WebP
- **Taille maximale** : 2 MB (optimisez les images avant de les ajouter)
- **Dimensions recommandées** : 800x800px pour les photos de profil
