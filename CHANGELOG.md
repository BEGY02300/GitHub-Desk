# Journal des changements

Les releases incluent aussi des notes automatiquement générées à partir des
pull requests et changements GitHub. Les entrées ci-dessous résument les
fonctionnalités du projet.

## [Non publié] — 2026-10-31

### Ajouté

- Fil de releases et d’activité GitHub synchronisé au chargement du site, avec
  liens directs vers les archives Windows, macOS, Linux et leurs SHA-256.
- Page « Mentions légales & confidentialité » avec transparence sur les données
  du site et champs éditeur à compléter.
- Feuille de route recentrée sur les essais de lancement, l’installation et la
  confiance autour des releases.
- Navigation pour suivre le dépôt sur GitHub ou s’abonner au flux RSS des releases.
- Guide d'installation pour Windows, macOS, Debian/Ubuntu, Fedora, Arch et
  openSUSE.
- Détail des prérequis WebView2, GTK 3, WebKitGTK et GitHub CLI par système.
- Activation de GitHub Pages pour le dépôt et premier déploiement réussi du site.
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

### Déploiement et documentation

- Activation initiale de GitHub Pages pour le dépôt ; le workflow de
  déploiement a ensuite terminé avec succès.
- Vérification des pages et illustrations du site avant leur publication.

### Expérience et intégration

- Interface de bureau en français, navigation intégrée et identité visuelle.
- Copie locale des informations consultées, synchronisation à la demande et
  cache d'avatar.
- Commandes Git et GitHub CLI sans fenêtre de terminal sur Windows.
- Client MCP et serveur MCP intégré en lecture seule.
- Packaging sans console pour le système de build courant.
