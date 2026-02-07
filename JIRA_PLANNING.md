# BookNest Frontend - Planification JIRA

## Vue d'ensemble du projet
Application de réservation d'événements avec gestion des participants et administrateurs.

**Stack technique**: Next.js 16, TypeScript, Axios, Docker
**Durée estimée**: 5 sprints (10 semaines)
**Points totaux**: 152 points

---

## Epic 1: Système d'Authentification (21 points)

### BOOK-11: Créer le Context API pour l'authentification
**Type**: Story  
**Points**: 5  
**Priorité**: Highest  
**Description**: Implémenter le contexte React pour gérer l'état d'authentification global

**Critères d'acceptation**:
- Créer AuthContext avec Provider
- State: user, token, isAuthenticated, isLoading
- Actions: login, logout, register, updateProfile
- Hook useAuth() pour accès facile
- Wrapper dans app/layout.tsx

**Tâches techniques**:
- Créer contexts/AuthContext.tsx
- Implémenter le Provider avec state management
- Créer le hook personnalisé useAuth()
- Gérer le localStorage pour persistance
- Ajouter loading states et error handling

---

### BOOK-12: Créer la page de connexion
**Type**: Story  
**Points**: 5  
**Priorité**: Highest  
**Description**: Page de connexion avec validation et redirection

**Critères d'acceptation**:
- Formulaire email + password
- Validation côté client (email format, password min 6 chars)
- Affichage des erreurs API
- Redirection selon rôle après login
- Bouton "Se souvenir de moi"
- Lien vers page inscription

**Tâches techniques**:
- Créer app/auth/login/page.tsx
- Utiliser useAuth() pour login
- Implémenter validation avec Zod ou Yup
- Gérer les états: loading, error, success
- Redirect: admin → /admin, participant → /events

---

### BOOK-13: Créer la page d'inscription
**Type**: Story  
**Points**: 5  
**Priorité**: Highest  
**Description**: Page d'inscription avec validation complète

**Critères d'acceptation**:
- Formulaire: nom, prénom, email, password, confirm password
- Validation stricte (passwords match, email unique)
- Affichage erreurs
- Auto-login après inscription
- Redirection vers /events

**Tâches techniques**:
- Créer app/auth/register/page.tsx
- Validation avec schéma Zod
- Utiliser authService.register()
- Gérer les doublons email
- Auto-login après succès

---

### BOOK-14: Implémenter la protection des routes
**Type**: Story  
**Points**: 3  
**Priorité**: Highest  
**Description**: Middleware et composants pour sécuriser les routes

**Critères d'acceptation**:
- Routes protégées redirigent vers /login si non authentifié
- Routes admin bloquées pour participants
- Affichage loading pendant vérification
- Page 403 pour accès interdit

**Tâches techniques**:
- Créer components/ProtectedRoute.tsx
- Créer components/AdminRoute.tsx
- Implémenter middleware Next.js pour auth
- Créer app/403/page.tsx

---

### BOOK-15: Ajouter la gestion du profil utilisateur
**Type**: Story  
**Points**: 3  
**Priorité**: Medium  
**Description**: Page pour modifier les informations du profil

**Critères d'acceptation**:
- Affichage infos actuelles
- Modification: nom, prénom, email
- Validation avant soumission
- Message de confirmation
- Gestion erreurs

**Tâches techniques**:
- Créer app/profile/page.tsx
- Utiliser authService.updateProfile()
- Formulaire pré-rempli
- Validation Zod
- Success/error notifications

---

## Epic 2: Pages Publiques avec SSR (13 points)

### BOOK-20: Créer la page liste des événements (SSR)
**Type**: Story  
**Points**: 5  
**Priorité**: High  
**Status**: ✅ DONE  
**Description**: Page publique listant tous les événements publiés avec SSR

**Critères d'acceptation**:
- ✅ Server-Side Rendering pour SEO
- ✅ Affichage événements publiés uniquement
- ✅ Filtres: date, statut, recherche par titre
- ✅ Pagination (10 événements par page)
- ✅ Cards cliquables vers détails
- ✅ Responsive mobile

**Tâches techniques**:
- ✅ Créer app/events/page.tsx avec async function (Next.js 16)
- ✅ Utiliser axios pour fetch SSR (évite dépendances client)
- ✅ Implémenter composant EventCard
- ✅ Ajouter filtres avec query params (search, startDate)
- ✅ Pagination côté serveur (10 événements/page)
- ✅ Configuration Docker avec host.docker.internal pour accès API

---

### BOOK-21: Créer la page détails d'un événement (SSR)
**Type**: Story  
**Points**: 5  
**Priorité**: High  
**Description**: Page publique affichant les détails complets d'un événement

**Critères d'acceptation**:
- SSR avec metadata pour SEO
- Affichage: titre, description, date, lieu, prix, places disponibles
- Bouton "Réserver" (redirect login si non authentifié)
- 404 si événement non trouvé
- Image de l'événement
- Responsive

**Tâches techniques**:
- Créer app/events/[id]/page.tsx
- Utiliser eventsService.getById(id)
- Gérer cas événement non trouvé
- generateMetadata() pour SEO
- Bouton réservation conditionnel

---

### BOOK-22: Ajouter le système de recherche et filtres
**Type**: Story  
**Points**: 3  
**Priorité**: Medium  
**Description**: Améliorer la recherche d'événements

**Critères d'acceptation**:
- Recherche par mot-clé (titre)
- Filtres: date future, statut
- Résultats en temps réel
- Clear filters button
- URL params pour partage

**Tâches techniques**:
- Composant SearchBar
- Composant Filters
- useSearchParams de Next.js
- Debounce pour recherche
- Update URL avec filtres

---

## Epic 3: Dashboard Participant (CSR) (21 points)

### BOOK-30: Créer la page dashboard participant
**Type**: Story  
**Points**: 5  
**Priorité**: High  
**Description**: Page principale du participant avec vue d'ensemble

**Critères d'acceptation**:
- Route protégée (/dashboard/participant)
- Affichage stats: réservations totales, confirmées, en attente
- Liste événements à venir
- Accès rapide aux actions
- Responsive

**Tâches techniques**:
- Créer app/dashboard/participant/page.tsx
- Utiliser dashboardService.getParticipantStats()
- Composant StatsCard
- Client-side rendering
- ProtectedRoute wrapper

---

### BOOK-31: Créer la page "Mes Réservations"
**Type**: Story  
**Points**: 8  
**Priorité**: High  
**Description**: Liste complète des réservations du participant

**Critères d'acceptation**:
- Affichage toutes réservations (pending, confirmed, refused, canceled)
- Filtres par statut
- Badges de couleur selon statut
- Action: annuler réservation (si confirmed/pending)
- Action: télécharger ticket (si confirmed)
- Pagination

**Tâches techniques**:
- Créer app/dashboard/participant/reservations/page.tsx
- Utiliser reservationsService.getMyReservations()
- Composant ReservationCard
- Modal confirmation annulation
- Gestion téléchargement PDF

---

### BOOK-32: Implémenter le formulaire de réservation
**Type**: Story  
**Points**: 5  
**Priorité**: High  
**Description**: Formulaire pour réserver un événement

**Critères d'acceptation**:
- Accès depuis page détail événement
- Affichage infos événement
- Confirmation avant soumission
- Vérification places disponibles
- Redirection vers mes réservations après succès

**Tâches techniques**:
- Créer app/events/[id]/reserve/page.tsx
- Utiliser reservationsService.create()
- Validation côté client
- Gestion erreurs (places épuisées)
- Success notification

---

### BOOK-33: Ajouter la fonctionnalité de téléchargement de ticket
**Type**: Story  
**Points**: 3  
**Priorité**: Medium  
**Description**: Permettre téléchargement du ticket PDF

**Critères d'acceptation**:
- Bouton disponible si réservation confirmée
- Génération PDF côté backend
- Download automatique
- Gestion erreurs

**Tâches techniques**:
- Utiliser reservationsService.downloadTicket()
- Bouton avec loading state
- Gérer download blob
- Error handling

---

## Epic 4: Dashboard Admin (CSR) (34 points)

### BOOK-40: Créer le dashboard admin principal
**Type**: Story  
**Points**: 5  
**Priorité**: High  
**Description**: Vue d'ensemble des statistiques administrateur

**Critères d'acceptation**:
- Route protégée admin uniquement (/admin)
- KPIs: total événements, réservations, participants
- Graphiques: réservations par statut, événements par mois
- Accès rapides: créer événement, réservations en attente

**Tâches techniques**:
- Créer app/admin/page.tsx
- Utiliser dashboardService.getAdminStats()
- Composants: StatCard, Chart (recharts)
- AdminRoute protection
- Responsive layout

---

### BOOK-41: Créer la page de gestion des événements
**Type**: Story  
**Points**: 8  
**Priorité**: High  
**Description**: CRUD complet pour les événements

**Critères d'acceptation**:
- Liste tous événements (draft, published, canceled)
- Actions: créer, modifier, supprimer, publier, annuler
- Filtres et recherche
- Pagination
- Confirmation avant suppression

**Tâches techniques**:
- Créer app/admin/events/page.tsx
- Tableau avec actions
- Modals: create, edit, delete confirm
- Utiliser eventsService (create, update, delete, updateStatus)
- Gestion états formulaires

---

### BOOK-42: Créer le formulaire de création/modification d'événement
**Type**: Story  
**Points**: 8  
**Priorité**: High  
**Description**: Formulaire complet pour gérer les événements

**Critères d'acceptation**:
- Champs: titre, description, date, lieu, prix, maxParticipants, image
- Validation stricte (date future, prix >= 0, etc.)
- Preview avant soumission
- Mode création ET édition
- Upload image

**Tâches techniques**:
- Créer app/admin/events/new/page.tsx
- Créer app/admin/events/[id]/edit/page.tsx
- Validation Zod complète
- Upload image (si backend support)
- Rich text editor pour description
- Date picker

---

### BOOK-43: Créer la page de validation des réservations
**Type**: Story  
**Points**: 8  
**Priorité**: High  
**Description**: Interface admin pour gérer les réservations

**Critères d'acceptation**:
- Liste toutes réservations
- Filtres: statut, événement, participant
- Actions: confirmer, refuser, annuler
- Recherche par nom participant
- Historique des actions

**Tâches techniques**:
- Créer app/admin/reservations/page.tsx
- Utiliser reservationsService.getAll()
- Actions: confirm(), refuse(), adminCancel()
- Modals de confirmation
- Notifications après action

---

### BOOK-44: Ajouter la gestion des participants
**Type**: Story  
**Points**: 5  
**Priorité**: Medium  
**Description**: Vue admin pour gérer les utilisateurs

**Critères d'acceptation**:
- Liste tous participants
- Affichage: nom, email, réservations count
- Recherche et filtres
- Pagination

**Tâches techniques**:
- Créer app/admin/users/page.tsx
- API: GET /api/users (à vérifier avec backend)
- Tableau avec infos utilisateur
- Liens vers réservations de l'utilisateur

---

## Epic 5: Composants UI Réutilisables (13 points)

### BOOK-60: Créer la bibliothèque de composants de base
**Type**: Story  
**Points**: 8  
**Priorité**: High  
**Description**: Composants UI réutilisables pour toute l'app

**Critères d'acceptation**:
- Button (variants: primary, secondary, danger)
- Input (text, email, password, number, date)
- Card
- Modal
- Badge
- Loader/Spinner
- Alert/Notification
- Pagination

**Tâches techniques**:
- Créer components/ui/Button.tsx
- Créer components/ui/Input.tsx
- Créer components/ui/Card.tsx
- Créer components/ui/Modal.tsx
- Créer components/ui/Badge.tsx
- Créer components/ui/Loader.tsx
- Créer components/ui/Alert.tsx
- Créer components/ui/Pagination.tsx
- Styles avec Tailwind CSS
- TypeScript props avec types stricts

---

### BOOK-61: Créer les composants métier
**Type**: Story  
**Points**: 5  
**Priorité**: Medium  
**Description**: Composants spécifiques au domaine

**Critères d'acceptation**:
- EventCard (pour liste événements)
- ReservationCard (pour réservations)
- UserMenu (dropdown profil)
- Navbar (avec auth state)
- Footer
- SearchBar

**Tâches techniques**:
- Créer components/EventCard.tsx
- Créer components/ReservationCard.tsx
- Créer components/UserMenu.tsx
- Créer components/Navbar.tsx
- Créer components/Footer.tsx
- Créer components/SearchBar.tsx
- Utiliser useAuth() dans Navbar/UserMenu

---

## Epic 6: Tests (21 points)

### BOOK-70: Configurer l'environnement de tests
**Type**: Task  
**Points**: 3  
**Priorité**: Medium  
**Description**: Setup Jest, React Testing Library, MSW

**Tâches techniques**:
- Installer dependencies: jest, @testing-library/react, @testing-library/jest-dom, msw
- Configurer jest.config.js
- Créer setupTests.ts
- Configurer MSW pour mock API
- Scripts package.json

---

### BOOK-71: Écrire les tests unitaires pour services et hooks
**Type**: Story  
**Points**: 8  
**Priorité**: Medium  
**Description**: Tests pour la logique métier

**Critères d'acceptation**:
- Tests authService: login, register, logout
- Tests useAuth hook
- Tests eventsService
- Tests reservationsService
- Coverage > 80%

**Tâches techniques**:
- Créer __tests__/services/auth.service.test.ts
- Créer __tests__/hooks/useAuth.test.ts
- Mock axios responses
- Tests cas succès et erreurs

---

### BOOK-72: Écrire les tests d'intégration pour les composants
**Type**: Story  
**Points**: 10  
**Priorité**: Medium  
**Description**: Tests des composants et flux utilisateur

**Critères d'acceptation**:
- Tests pages: login, register, events list, event detail
- Tests composants UI: Button, Modal, Card
- Tests flux: login → events → reservation
- Tests interactions utilisateur

**Tâches techniques**:
- Créer __tests__/pages/*.test.tsx
- Créer __tests__/components/*.test.tsx
- Mock AuthContext
- Tests avec user-event
- Assertions sur DOM et navigation

---

## Epic 7: Configuration Docker & Déploiement (8 points)

### BOOK-75: Créer la configuration Docker
**Type**: Story  
**Points**: 5  
**Priorité**: High  
**Status**: ✅ DONE  
**Description**: Containeriser l'application frontend

**Critères d'acceptation**:
- Dockerfile multi-stage optimisé
- docker-compose.yml
- Variables d'environnement
- Build production fonctionnel
- Documentation

**Tâches techniques**:
- ✅ Créer Dockerfile (deps, builder, runner)
- ✅ Créer docker-compose.yml
- ✅ Créer .dockerignore
- ✅ Configurer next.config.ts (output: standalone)
- ✅ .env.docker.example
- ✅ Documentation README_DOCKER.md

---

### BOOK-76: Optimiser les images Docker
**Type**: Task  
**Points**: 3  
**Priorité**: Low  
**Description**: Réduire taille des images et temps de build

**Tâches techniques**:
- Cache layers Docker
- .dockerignore complet
- Multi-stage optimal
- Alpine images
- Compression assets

---

## Epic 8: CI/CD Pipeline (13 points)

### BOOK-90: Configurer GitHub Actions pour CI
**Type**: Story  
**Points**: 5  
**Priorité**: Medium  
**Description**: Pipeline d'intégration continue

**Critères d'acceptation**:
- Workflow sur push/PR
- Jobs: lint, test, build
- Runs on: ubuntu-latest
- Cache dependencies
- Fail si tests échouent

**Tâches techniques**:
- Créer .github/workflows/ci.yml
- Jobs: install → lint → test → build
- Cache npm
- Matrix strategy (Node versions)

---

### BOOK-91: Configurer le déploiement automatique
**Type**: Story  
**Points**: 8  
**Priorité**: Low  
**Description**: CD vers environnement de production

**Critères d'acceptation**:
- Deploy sur merge to main
- Environnements: staging, production
- Variables d'env secrets
- Rollback possible
- Notifications Discord/Slack

**Tâches techniques**:
- Créer .github/workflows/deploy.yml
- Setup secrets GitHub
- Deploy Vercel/Railway/AWS
- Conditional deploy (staging vs prod)

---

## Epic 9: Documentation & Optimisation (8 points)

### BOOK-100: Rédiger la documentation technique
**Type**: Task  
**Points**: 3  
**Priorité**: Medium  
**Description**: Documentation complète du projet

**Tâches techniques**:
- README.md complet
- Architecture diagram
- API integration guide
- Setup instructions
- Contribution guidelines

---

### BOOK-101: Optimiser les performances
**Type**: Task  
**Points**: 5  
**Priorité**: Low  
**Description**: Améliorer vitesse et SEO

**Tâches techniques**:
- Lazy loading composants
- Image optimization (next/image)
- Code splitting
- SEO metadata
- Lighthouse score > 90

---

## Planification des Sprints

### Sprint 1 (2 semaines) - Authentification et Base UI
- Epic 1: Système d'Authentification (21 pts)
- BOOK-60: Composants UI de base (8 pts)
- **Total**: 29 points

### Sprint 2 (2 semaines) - Pages Publiques et Dashboard Participant
- Epic 2: Pages Publiques SSR (13 pts)
- Epic 3: Dashboard Participant (21 pts)
- **Total**: 34 points

### Sprint 3 (2 semaines) - Dashboard Admin (Partie 1)
- BOOK-40: Dashboard admin principal (5 pts)
- BOOK-41: Gestion événements (8 pts)
- BOOK-42: Formulaire événement (8 pts)
- **Total**: 21 points

### Sprint 4 (2 semaines) - Dashboard Admin (Partie 2) + Tests
- BOOK-43: Validation réservations (8 pts)
- BOOK-44: Gestion participants (5 pts)
- BOOK-61: Composants métier (5 pts)
- Epic 6: Tests (21 pts)
- **Total**: 39 points

### Sprint 5 (2 semaines) - CI/CD et Finalisation
- Epic 7: Docker (8 pts)
- Epic 8: CI/CD (13 pts)
- Epic 9: Documentation (8 pts)
- **Total**: 29 points

---

## Récapitulatif

**Epics**: 9  
**User Stories**: 43  
**Story Points Total**: 152  
**Durée**: 10 semaines (5 sprints de 2 semaines)

**Priorités**:
- **Highest**: Authentification (BOOK-11 à BOOK-14)
- **High**: Pages publiques, Dashboards, Composants UI
- **Medium**: Tests, Documentation, Gestion utilisateurs
- **Low**: Optimisations, CI/CD avancé

**Dépendances critiques**:
1. BOOK-11 (AuthContext) doit être complété en premier
2. BOOK-60 (Composants UI) requis pour toutes les pages
3. Epic 1 bloque Epic 3 et Epic 4
4. Epic 6 (Tests) peut être parallèle au développement

**Métriques de succès**:
- ✅ Authentification sécurisée avec JWT
- ✅ SEO optimisé (SSR pour pages publiques)
- ✅ UX fluide et responsive
- ✅ Coverage tests > 80%
- ✅ Build Docker < 500MB
- ✅ CI/CD automatisé
