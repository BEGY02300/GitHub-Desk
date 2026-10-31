# Journal des changements

Les releases incluent aussi des notes automatiquement générées à partir des
pull requests et changements GitHub. Les entrées ci-dessous résument les
fonctionnalités du projet.

## [Non publié] — 2026-10-31

### Ajouté

- Publication automatique du site GitHub Pages après les changements dans
  `docs/`, avec vérification de ses fichiers avant déploiement.
- Présentation du produit, aperçu illustré, documentation et feuille de route.
- Génération des notes de release classées par nouveautés, corrections,
  documentation et maintenance.
- Builds Windows, macOS et Linux déclenchés automatiquement depuis `main` ou
  depuis un tag SemVer.
- Archives de versions avec nom versionné et somme SHA-256.

## Fonctionnalités de l'application

### Dépôts et travail d'équipe

- Gestion des dépôts GitHub publics et privés, création à partir de modèles et
  édition des réglages.
- Organisation des branches et gestion des pull requests et issues.
- Consultation des workflows GitHub Actions et relance ou annulation d'une
  exécution.
- Plan d'archivage vérifiable avant exécution, avec confirmation avant les
  opérations destructives.

### Expérience et intégration

- Interface de bureau en français, navigation intégrée et identité visuelle.
- Copie locale des informations consultées, synchronisation à la demande et
  cache d'avatar.
- Commandes Git et GitHub CLI sans fenêtre de terminal sur Windows.
- Client MCP et serveur MCP intégré en lecture seule.
- Packaging sans console pour le système de build courant.
