# 📋 JIRA Planning - BookNest Front-End

## 🎯 Configuration du Projet JIRA

**Nom du projet:** BookNest
**Clé du projet:** BKN
**Type:** Scrum

---

## 📊 EPICS Structure

### Epic 1: BKN-1 - 🔐 Authentification & Autorisation
**Description:** Système complet d'authentification JWT avec gestion des rôles (Admin/Participant)
**Priority:** Highest
**Story Points:** 21

### Epic 2: BKN-2 - 📅 Gestion des Événements (Front-End)
**Description:** Interface pour afficher, créer, modifier et gérer les événements
**Priority:** High
**Story Points:** 34

### Epic 3: BKN-3 - 🎫 Système de Réservations
**Description:** Fonctionnalités complètes de réservation pour les participants
**Priority:** High
**Story Points:** 21

### Epic 4: BKN-4 - 👨‍💼 Dashboard Admin
**Description:** Interface d'administration pour gérer événements, réservations et indicateurs
**Priority:** High
**Story Points:** 21

### Epic 5: BKN-5 - 👤 Dashboard Participant
**Description:** Espace personnel pour consulter et gérer ses réservations
**Priority:** Medium
**Story Points:** 13

### Epic 6: BKN-6 - 🎨 UI/UX Components
**Description:** Bibliothèque de composants réutilisables et design system
**Priority:** Medium
**Story Points:** 13

### Epic 7: BKN-7 - 🧪 Tests Front-End
**Description:** Tests unitaires et d'intégration avec React Testing Library
**Priority:** Medium
**Story Points:** 13

### Epic 8: BKN-8 - 🐳 Docker & Déploiement
**Description:** Containerisation et configuration Docker
**Priority:** Medium
**Story Points:** 8

### Epic 9: BKN-9 - 🚀 CI/CD Pipeline
**Description:** GitHub Actions pour lint, tests, build et déploiement
**Priority:** High
**Story Points:** 8

---

## 📝 USER STORIES & TASKS

### EPIC 1: 🔐 Authentification & Autorisation

#### **BKN-10** [Story] - Configuration de l'API Client
**En tant que** développeur  
**Je veux** configurer Axios avec intercepteurs JWT  
**Afin de** gérer l'authentification sur toutes les requêtes API  
**Story Points:** 5  
**Priority:** Highest

**Acceptance Criteria:**
- [ ] Axios configuré avec baseURL
- [ ] Intercepteur request ajoute le token JWT
- [ ] Intercepteur response gère les erreurs 401
- [ ] Refresh automatique du token si nécessaire

**Sub-tasks:**
- BKN-10.1: Créer `/lib/axios.ts` avec configuration Axios
- BKN-10.2: Implémenter intercepteur d'authentification
- BKN-10.3: Créer service API `/services/api.service.ts`
- BKN-10.4: Gérer les erreurs globales (401, 403, 500)

---

#### **BKN-11** [Story] - Context API pour l'Authentification
**En tant que** développeur  
**Je veux** créer un Context API pour gérer l'état d'authentification  
**Afin de** partager les données utilisateur dans toute l'application  
**Story Points:** 5  
**Priority:** Highest

**Acceptance Criteria:**
- [ ] AuthContext créé avec Provider
- [ ] State: user, token, isAuthenticated, isLoading
- [ ] Actions: login, logout, register, updateProfile
- [ ] Persistance du token dans localStorage
- [ ] Hook useAuth() pour accéder au context

**Sub-tasks:**
- BKN-11.1: Créer `/contexts/AuthContext.tsx`
- BKN-11.2: Créer types TypeScript pour User et Auth
- BKN-11.3: Implémenter actions login/logout/register
- BKN-11.4: Créer hook personnalisé `useAuth()`
- BKN-11.5: Wrapper l'app dans AuthProvider

---

#### **BKN-12** [Story] - Page d'Inscription (Register)
**En tant qu'** utilisateur  
**Je veux** créer un compte  
**Afin de** pouvoir réserver des événements  
**Story Points:** 3  
**Priority:** Highest

**Acceptance Criteria:**
- [ ] Formulaire avec email, password, firstName, lastName
- [ ] Validation côté client (email format, password strength)
- [ ] Affichage des erreurs de validation
- [ ] Redirection vers dashboard après inscription
- [ ] Gestion des erreurs backend (email déjà utilisé)

**Sub-tasks:**
- BKN-12.1: Créer page `/app/auth/register/page.tsx`
- BKN-12.2: Créer composant `RegisterForm`
- BKN-12.3: Implémenter validation avec Zod ou Yup
- BKN-12.4: Connecter au service auth API
- BKN-12.5: Ajouter UI pour messages d'erreur

---

#### **BKN-13** [Story] - Page de Connexion (Login)
**En tant qu'** utilisateur  
**Je veux** me connecter  
**Afin d'** accéder à mon espace personnel  
**Story Points:** 3  
**Priority:** Highest

**Acceptance Criteria:**
- [ ] Formulaire avec email et password
- [ ] Validation côté client
- [ ] Redirection selon le rôle (admin/participant)
- [ ] Gestion des erreurs (credentials incorrects)
- [ ] Option "Se souvenir de moi"

**Sub-tasks:**
- BKN-13.1: Créer page `/app/auth/login/page.tsx`
- BKN-13.2: Créer composant `LoginForm`
- BKN-13.3: Implémenter validation
- BKN-13.4: Connecter au service auth API
- BKN-13.5: Gérer redirection conditionnelle

---

#### **BKN-14** [Story] - Protection des Routes
**En tant que** système  
**Je veux** protéger les routes selon le rôle utilisateur  
**Afin de** sécuriser l'accès aux pages  
**Story Points:** 5  
**Priority:** Highest

**Acceptance Criteria:**
- [ ] Middleware pour vérifier l'authentification
- [ ] HOC ou composant ProtectedRoute
- [ ] Redirection vers /login si non authentifié
- [ ] Vérification du rôle (ADMIN/PARTICIPANT)
- [ ] Affichage 403 si rôle insuffisant

**Sub-tasks:**
- BKN-14.1: Créer composant `ProtectedRoute`
- BKN-14.2: Créer composant `AdminRoute`
- BKN-14.3: Créer middleware Next.js pour auth
- BKN-14.4: Implémenter page 403 Forbidden
- BKN-14.5: Tester protection sur toutes les routes

---

### EPIC 2: 📅 Gestion des Événements (Front-End)

#### **BKN-20** [Story] - Liste Publique des Événements (SSR)
**En tant qu'** utilisateur (public)  
**Je veux** voir la liste des événements publiés  
**Afin de** découvrir les événements disponibles  
**Story Points:** 8  
**Priority:** High

**Acceptance Criteria:**
- [ ] Page SSR avec getServerSideProps
- [ ] Affichage des événements PUBLISHED uniquement
- [ ] Filtres: date, statut, recherche par titre
- [ ] Pagination (10 événements par page)
- [ ] Indicateur places disponibles
- [ ] Design responsive (mobile-first)

**Sub-tasks:**
- BKN-20.1: Créer page `/app/events/page.tsx` avec SSR
- BKN-20.2: Créer service `/services/events.service.ts`
- BKN-20.3: Créer composant `EventCard`
- BKN-20.4: Implémenter filtres et recherche
- BKN-20.5: Ajouter pagination
- BKN-20.6: Optimiser performance (images, lazy loading)

---

#### **BKN-21** [Story] - Détails d'un Événement (SSR)
**En tant qu'** utilisateur  
**Je veux** voir les détails complets d'un événement  
**Afin de** décider si je souhaite réserver  
**Story Points:** 5  
**Priority:** High

**Acceptance Criteria:**
- [ ] Page dynamique `/events/[id]` avec SSR
- [ ] Affichage: titre, description, date, lieu, places
- [ ] Bouton "Réserver" si authentifié
- [ ] Indicateur si événement complet
- [ ] Redirection vers login si non authentifié
- [ ] Gestion 404 si événement inexistant

**Sub-tasks:**
- BKN-21.1: Créer page `/app/events/[id]/page.tsx`
- BKN-21.2: Implémenter getServerSideProps avec ID dynamique
- BKN-21.3: Créer composant `EventDetails`
- BKN-21.4: Ajouter bouton réservation conditionnel
- BKN-21.5: Gérer cas d'erreur (404, event non publié)

---

#### **BKN-22** [Story] - Formulaire de Création d'Événement (Admin)
**En tant qu'** admin  
**Je veux** créer un nouvel événement  
**Afin de** l'ajouter au catalogue  
**Story Points:** 5  
**Priority:** High

**Acceptance Criteria:**
- [ ] Formulaire: titre, description, date, lieu, capacité
- [ ] Validation: date future, capacité > 0
- [ ] Sauvegarde en mode DRAFT par défaut
- [ ] Redirection vers détails de l'événement créé
- [ ] Gestion des erreurs backend

**Sub-tasks:**
- BKN-22.1: Créer page `/app/admin/events/new/page.tsx`
- BKN-22.2: Créer composant `EventForm`
- BKN-22.3: Implémenter validation avec schema Zod
- BKN-22.4: Connecter au service API
- BKN-22.5: Ajouter datepicker pour date/heure

---

#### **BKN-23** [Story] - Modification d'un Événement (Admin)
**En tant qu'** admin  
**Je veux** modifier un événement existant  
**Afin de** corriger ou mettre à jour les informations  
**Story Points:** 5  
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Formulaire pré-rempli avec données existantes
- [ ] Validation identique à la création
- [ ] Modification impossible si événement passé
- [ ] Confirmation avant modification
- [ ] Message de succès après modification

**Sub-tasks:**
- BKN-23.1: Créer page `/app/admin/events/[id]/edit/page.tsx`
- BKN-23.2: Réutiliser composant `EventForm` en mode edit
- BKN-23.3: Charger données existantes
- BKN-23.4: Implémenter logique de mise à jour
- BKN-23.5: Gérer cas spéciaux (événement passé)

---

#### **BKN-24** [Story] - Gestion du Statut d'un Événement
**En tant qu'** admin  
**Je veux** changer le statut d'un événement (DRAFT/PUBLISHED/CANCELED)  
**Afin de** contrôler sa visibilité publique  
**Story Points:** 3  
**Priority:** High

**Acceptance Criteria:**
- [ ] Boutons pour changer statut: Publier, Annuler, Mettre en brouillon
- [ ] Confirmation avant changement de statut
- [ ] Indicateur visuel du statut actuel
- [ ] Mise à jour en temps réel après changement
- [ ] Gestion des restrictions (ex: pas de publication si événement passé)

**Sub-tasks:**
- BKN-24.1: Créer composant `EventStatusManager`
- BKN-24.2: Implémenter actions de changement de statut
- BKN-24.3: Ajouter confirmations modales
- BKN-24.4: Gérer messages de succès/erreur
- BKN-24.5: Mettre à jour UI après changement

---

#### **BKN-25** [Story] - Suppression d'un Événement (Admin)
**En tant qu'** admin  
**Je veux** supprimer un événement  
**Afin de** retirer les événements obsolètes  
**Story Points:** 3  
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Bouton de suppression avec confirmation
- [ ] Message d'avertissement si réservations existantes
- [ ] Redirection vers liste après suppression
- [ ] Gestion des erreurs
- [ ] Impossibilité de supprimer si réservations confirmées

**Sub-tasks:**
- BKN-25.1: Ajouter bouton suppression dans EventDetails
- BKN-25.2: Créer modal de confirmation
- BKN-25.3: Implémenter logique de suppression
- BKN-25.4: Gérer cas avec réservations existantes
- BKN-25.5: Ajouter feedback utilisateur

---

#### **BKN-26** [Story] - Liste des Événements avec Filtres (Admin)
**En tant qu'** admin  
**Je veux** voir tous les événements (tous statuts)  
**Afin de** gérer l'ensemble du catalogue  
**Story Points:** 5  
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Affichage de tous les événements (DRAFT, PUBLISHED, CANCELED)
- [ ] Filtres: statut, date, recherche
- [ ] Tri: date, titre, places disponibles
- [ ] Actions rapides: publier, annuler, modifier, supprimer
- [ ] Indicateurs visuels par statut

**Sub-tasks:**
- BKN-26.1: Créer page `/app/admin/events/page.tsx`
- BKN-26.2: Créer composant `AdminEventList`
- BKN-26.3: Implémenter filtres et recherche
- BKN-26.4: Ajouter actions rapides
- BKN-26.5: Créer badges de statut

---

### EPIC 3: 🎫 Système de Réservations

#### **BKN-30** [Story] - Réserver un Événement
**En tant que** participant  
**Je veux** réserver une place sur un événement  
**Afin d'** y participer  
**Story Points:** 8  
**Priority:** High

**Acceptance Criteria:**
- [ ] Bouton "Réserver" sur page détails événement
- [ ] Formulaire: nombre de places (1-10)
- [ ] Vérification disponibilité en temps réel
- [ ] Confirmation de réservation (statut PENDING)
- [ ] Email de confirmation (backend)
- [ ] Redirection vers mes réservations

**Sub-tasks:**
- BKN-30.1: Créer composant `ReservationForm`
- BKN-30.2: Implémenter validation (places disponibles)
- BKN-30.3: Créer service `/services/reservations.service.ts`
- BKN-30.4: Gérer états de chargement
- BKN-30.5: Afficher message de succès
- BKN-30.6: Gérer erreurs (événement complet, déjà réservé)

---

#### **BKN-31** [Story] - Mes Réservations (Participant)
**En tant que** participant  
**Je veux** voir la liste de mes réservations  
**Afin de** suivre leur statut  
**Story Points:** 5  
**Priority:** High

**Acceptance Criteria:**
- [ ] Liste de toutes mes réservations
- [ ] Filtres: statut (PENDING, CONFIRMED, REFUSED, CANCELED)
- [ ] Affichage: événement, date, nombre de places, statut
- [ ] Badges colorés par statut
- [ ] Actions: annuler, télécharger ticket (si CONFIRMED)
- [ ] Message si aucune réservation

**Sub-tasks:**
- BKN-31.1: Créer page `/app/participant/reservations/page.tsx`
- BKN-31.2: Créer composant `ReservationCard`
- BKN-31.3: Implémenter filtres par statut
- BKN-31.4: Ajouter actions (annulation, téléchargement)
- BKN-31.5: Gérer états vides

---

#### **BKN-32** [Story] - Annuler une Réservation
**En tant que** participant  
**Je veux** annuler ma réservation  
**Afin de** libérer ma place  
**Story Points:** 3  
**Priority:** High

**Acceptance Criteria:**
- [ ] Bouton "Annuler" sur réservations PENDING ou CONFIRMED
- [ ] Confirmation avant annulation
- [ ] Mise à jour du statut vers CANCELED
- [ ] Places restituées à l'événement
- [ ] Message de confirmation

**Sub-tasks:**
- BKN-32.1: Ajouter bouton annulation dans ReservationCard
- BKN-32.2: Créer modal de confirmation
- BKN-32.3: Implémenter logique d'annulation
- BKN-32.4: Mettre à jour UI après annulation
- BKN-32.5: Gérer cas d'erreur

---

#### **BKN-33** [Story] - Télécharger Ticket PDF
**En tant que** participant  
**Je veux** télécharger mon ticket PDF  
**Afin d'** avoir une preuve de ma réservation  
**Story Points:** 5  
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Bouton "Télécharger" visible uniquement si statut CONFIRMED
- [ ] Génération PDF avec infos: événement, participant, QR code
- [ ] Format professionnel
- [ ] Nom de fichier: ticket-{eventTitle}-{date}.pdf
- [ ] Gestion des erreurs

**Sub-tasks:**
- BKN-33.1: Intégrer bibliothèque PDF (jsPDF ou backend)
- BKN-33.2: Créer template de ticket
- BKN-33.3: Implémenter génération QR code
- BKN-33.4: Ajouter bouton téléchargement
- BKN-33.5: Gérer téléchargement automatique

---

### EPIC 4: 👨‍💼 Dashboard Admin

#### **BKN-40** [Story] - Dashboard Admin - Vue d'Ensemble
**En tant qu'** admin  
**Je veux** voir les indicateurs clés  
**Afin de** suivre l'activité de la plateforme  
**Story Points:** 8  
**Priority:** High

**Acceptance Criteria:**
- [ ] KPIs: événements totaux, réservations totales, événements à venir
- [ ] Taux de remplissage moyen
- [ ] Répartition des réservations par statut (graphique)
- [ ] Liste des prochains événements
- [ ] Réservations récentes (10 dernières)
- [ ] Design avec cartes et graphiques

**Sub-tasks:**
- BKN-40.1: Créer page `/app/admin/dashboard/page.tsx`
- BKN-40.2: Créer composant `StatsCard`
- BKN-40.3: Intégrer bibliothèque graphiques (Chart.js ou Recharts)
- BKN-40.4: Créer service pour récupérer statistiques
- BKN-40.5: Implémenter graphiques (taux remplissage, répartition)
- BKN-40.6: Ajouter rafraîchissement automatique

---

#### **BKN-41** [Story] - Gestion des Réservations (Admin)
**En tant qu'** admin  
**Je veux** gérer toutes les réservations  
**Afin de** les confirmer, refuser ou annuler  
**Story Points:** 8  
**Priority:** High

**Acceptance Criteria:**
- [ ] Liste de toutes les réservations (tous utilisateurs)
- [ ] Filtres: statut, événement, participant, date
- [ ] Actions: confirmer, refuser, annuler
- [ ] Recherche par nom/email participant
- [ ] Tri par date, statut, événement
- [ ] Pagination

**Sub-tasks:**
- BKN-41.1: Créer page `/app/admin/reservations/page.tsx`
- BKN-41.2: Créer composant `AdminReservationTable`
- BKN-41.3: Implémenter filtres et recherche
- BKN-41.4: Ajouter actions bulk (confirmer plusieurs)
- BKN-41.5: Créer modals de confirmation
- BKN-41.6: Gérer pagination côté serveur

---

#### **BKN-42** [Story] - Confirmer une Réservation (Admin)
**En tant qu'** admin  
**Je veux** confirmer une réservation  
**Afin de** valider la participation  
**Story Points:** 3  
**Priority:** High

**Acceptance Criteria:**
- [ ] Bouton "Confirmer" sur réservations PENDING
- [ ] Confirmation rapide sans modal (ou avec confirmation)
- [ ] Mise à jour statut vers CONFIRMED
- [ ] Notification utilisateur (optionnel)
- [ ] Feedback visuel immédiat

**Sub-tasks:**
- BKN-42.1: Ajouter action confirmer dans table
- BKN-42.2: Implémenter appel API
- BKN-42.3: Mettre à jour UI optimiste
- BKN-42.4: Gérer cas d'erreur
- BKN-42.5: Ajouter toast de succès

---

#### **BKN-43** [Story] - Refuser une Réservation (Admin)
**En tant qu'** admin  
**Je veux** refuser une réservation  
**Afin de** gérer la capacité  
**Story Points:** 2  
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Bouton "Refuser" sur réservations PENDING
- [ ] Modal avec raison du refus (optionnel)
- [ ] Mise à jour statut vers REFUSED
- [ ] Places restituées
- [ ] Notification utilisateur

**Sub-tasks:**
- BKN-43.1: Ajouter action refuser
- BKN-43.2: Créer modal pour raison (optionnel)
- BKN-43.3: Implémenter appel API
- BKN-43.4: Mettre à jour UI
- BKN-43.5: Gérer feedback

---

### EPIC 5: 👤 Dashboard Participant

#### **BKN-50** [Story] - Dashboard Participant
**En tant que** participant  
**Je veux** voir mon profil et mes réservations à venir  
**Afin d'** avoir une vue rapide  
**Story Points:** 5  
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Affichage infos profil: nom, email
- [ ] Nombre de réservations (total, confirmées, en attente)
- [ ] Prochaines réservations (3 prochaines)
- [ ] Liens rapides: mes réservations, parcourir événements
- [ ] Bouton modifier profil

**Sub-tasks:**
- BKN-50.1: Créer page `/app/participant/dashboard/page.tsx`
- BKN-50.2: Créer composant `ProfileCard`
- BKN-50.3: Créer composant `UpcomingReservations`
- BKN-50.4: Implémenter récupération des données
- BKN-50.5: Ajouter liens de navigation

---

#### **BKN-51** [Story] - Modifier son Profil
**En tant qu'** utilisateur  
**Je veux** modifier mes informations personnelles  
**Afin de** garder mon profil à jour  
**Story Points:** 3  
**Priority:** Low

**Acceptance Criteria:**
- [ ] Formulaire: firstName, lastName, email
- [ ] Validation des champs
- [ ] Mise à jour en base
- [ ] Gestion erreur (email déjà utilisé)
- [ ] Message de succès

**Sub-tasks:**
- BKN-51.1: Créer page `/app/profile/edit/page.tsx`
- BKN-51.2: Créer composant `ProfileForm`
- BKN-51.3: Implémenter validation
- BKN-51.4: Connecter API
- BKN-51.5: Mettre à jour context après modification

---

### EPIC 6: 🎨 UI/UX Components

#### **BKN-60** [Story] - Bibliothèque de Composants UI
**En tant que** développeur  
**Je veux** une bibliothèque de composants réutilisables  
**Afin de** maintenir la cohérence visuelle  
**Story Points:** 13  
**Priority:** Medium

**Composants à créer:**
- [ ] Button (primary, secondary, danger)
- [ ] Input / TextArea
- [ ] Select / Dropdown
- [ ] Card
- [ ] Modal / Dialog
- [ ] Toast / Notification
- [ ] Badge
- [ ] Spinner / Loading
- [ ] Pagination
- [ ] Tabs
- [ ] DatePicker

**Sub-tasks:**
- BKN-60.1: Créer dossier `/components/ui/`
- BKN-60.2: Créer composants de base avec TypeScript
- BKN-60.3: Ajouter variants et props conditionnels
- BKN-60.4: Styliser avec Tailwind CSS
- BKN-60.5: Documenter chaque composant
- BKN-60.6: Créer Storybook (optionnel)

---

### EPIC 7: 🧪 Tests Front-End

#### **BKN-70** [Story] - Configuration des Tests
**En tant que** développeur  
**Je veux** configurer l'environnement de test  
**Afin de** pouvoir écrire des tests  
**Story Points:** 3  
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Jest configuré
- [ ] React Testing Library installé
- [ ] Configuration TypeScript pour tests
- [ ] Scripts npm: test, test:watch, test:coverage
- [ ] Mock des appels API

**Sub-tasks:**
- BKN-70.1: Installer dependencies (@testing-library/react, jest)
- BKN-70.2: Créer fichier `jest.config.js`
- BKN-70.3: Créer `setupTests.ts`
- BKN-70.4: Configurer mock d'Axios
- BKN-70.5: Ajouter scripts dans package.json

---

#### **BKN-71** [Story] - Tests des Composants UI
**En tant que** développeur  
**Je veux** tester les composants UI  
**Afin de** garantir leur bon fonctionnement  
**Story Points:** 5  
**Priority:** Medium

**Composants à tester:**
- [ ] Button (clicks, disabled state)
- [ ] Input (onChange, validation)
- [ ] Modal (open/close)
- [ ] Card (rendering)
- [ ] EventCard (props, actions)

**Sub-tasks:**
- BKN-71.1: Créer tests pour Button
- BKN-71.2: Créer tests pour Input/Form
- BKN-71.3: Créer tests pour Modal
- BKN-71.4: Créer tests pour EventCard
- BKN-71.5: Atteindre 80% de couverture

---

#### **BKN-72** [Story] - Tests d'Intégration
**En tant que** développeur  
**Je veux** tester les flux utilisateur complets  
**Afin de** valider les fonctionnalités  
**Story Points:** 5  
**Priority:** Medium

**Flux à tester:**
- [ ] Inscription → Connexion → Dashboard
- [ ] Parcourir événements → Réserver → Mes réservations
- [ ] Admin: Créer événement → Publier → Confirmer réservation

**Sub-tasks:**
- BKN-72.1: Test flux authentification
- BKN-72.2: Test flux réservation participant
- BKN-72.3: Test flux admin (création événement)
- BKN-72.4: Test flux annulation réservation
- BKN-72.5: Mock des appels API pour chaque test

---

### EPIC 8: 🐳 Docker & Déploiement

#### **BKN-80** [Story] - Dockerfile Front-End
**En tant que** DevOps  
**Je veux** créer une image Docker pour le front-end  
**Afin de** le déployer facilement  
**Story Points:** 5  
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Dockerfile multi-stage (build + production)
- [ ] Image optimisée (taille minimale)
- [ ] Variables d'environnement configurables
- [ ] Port 3000 exposé
- [ ] Build réussi sans erreur

**Sub-tasks:**
- BKN-80.1: Créer `Dockerfile`
- BKN-80.2: Créer `.dockerignore`
- BKN-80.3: Optimiser layers (cache npm)
- BKN-80.4: Tester build local
- BKN-80.5: Documenter commandes Docker

---

#### **BKN-81** [Story] - Docker Compose
**En tant que** développeur  
**Je veux** orchestrer front + back + DB avec docker-compose  
**Afin de** lancer tout le projet facilement  
**Story Points:** 3  
**Priority:** Medium

**Acceptance Criteria:**
- [ ] `docker-compose.yml` avec 3 services (front, back, db)
- [ ] Réseau partagé entre services
- [ ] Variables d'environnement gérées
- [ ] Volumes pour persistance
- [ ] Commande unique: `docker-compose up`

**Sub-tasks:**
- BKN-81.1: Créer `docker-compose.yml`
- BKN-81.2: Configurer services (frontend, backend, db)
- BKN-81.3: Créer fichier `.env.example`
- BKN-81.4: Tester lancement complet
- BKN-81.5: Documenter dans README

---

### EPIC 9: 🚀 CI/CD Pipeline

#### **BKN-90** [Story] - GitHub Actions - CI Pipeline
**En tant que** développeur  
**Je veux** une pipeline CI automatisée  
**Afin de** valider chaque commit  
**Story Points:** 5  
**Priority:** High

**Acceptance Criteria:**
- [ ] Workflow déclenché sur push et pull_request
- [ ] Jobs: install, lint, test, build
- [ ] Cache des node_modules
- [ ] Échec si lint ou tests échouent
- [ ] Badge GitHub Actions dans README

**Sub-tasks:**
- BKN-90.1: Créer `.github/workflows/ci.yml`
- BKN-90.2: Configurer job Install & Cache
- BKN-90.3: Configurer job Lint
- BKN-90.4: Configurer job Tests
- BKN-90.5: Configurer job Build
- BKN-90.6: Optimiser avec cache et parallélisation

---

#### **BKN-91** [Story] - Publication Docker Hub
**En tant que** DevOps  
**Je veux** publier automatiquement l'image sur Docker Hub  
**Afin de** faciliter le déploiement  
**Story Points:** 3  
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Build et push automatique après merge sur main
- [ ] Tags: latest et version (ex: v1.0.0)
- [ ] Secrets GitHub pour Docker Hub credentials
- [ ] Image accessible publiquement
- [ ] Documentation des commandes pull

**Sub-tasks:**
- BKN-91.1: Ajouter job Deploy dans workflow
- BKN-91.2: Configurer secrets GitHub (DOCKER_USERNAME, DOCKER_TOKEN)
- BKN-91.3: Implémenter build et push
- BKN-91.4: Tester déploiement
- BKN-91.5: Documenter procédure

---

## 🔗 Règles d'Automatisation JIRA

### Règle 1: Auto-transition "In Progress"
**Trigger:** Pull Request créée avec référence ticket (ex: BKN-12)  
**Action:** Déplacer ticket vers "In Progress"

### Règle 2: Auto-transition "Code Review"
**Trigger:** PR prête pour review (label "ready-for-review")  
**Action:** Déplacer ticket vers "Code Review"

### Règle 3: Auto-transition "Done"
**Trigger:** Pull Request mergée avec référence ticket  
**Action:** Déplacer ticket vers "Done"

### Règle 4: Notification Assignee
**Trigger:** Ticket assigné à quelqu'un  
**Action:** Envoyer notification Slack/Email

### Règle 5: Label automatique
**Trigger:** Issue créée avec Epic "Tests"  
**Action:** Ajouter label "testing"

---

## 📊 Workflow JIRA

```
TODO → In Progress → Code Review → Testing → Done
   ↓         ↓             ↓           ↓       
 Backlog   Sprint      PR Review    QA      Closed
```

---

## 📝 Convention de Commit

```
<type>(<scope>): <subject> [TICKET-ID]

Exemples:
feat(auth): add login page [BKN-13]
fix(events): resolve date filter bug [BKN-20]
test(reservations): add unit tests [BKN-71]
docs(readme): update setup instructions [BKN-91]
```

**Types:**
- `feat`: nouvelle fonctionnalité
- `fix`: correction de bug
- `test`: ajout/modification de tests
- `docs`: documentation
- `style`: formatage, CSS
- `refactor`: refactoring de code
- `chore`: tâches de maintenance

---

## 🎯 Sprint Planning Suggestion

### Sprint 1 (2 semaines) - Fondations
- Epic 1: Authentification (BKN-10 à BKN-14)
- Epic 6: Composants UI de base (BKN-60)
**Goal:** Système d'auth fonctionnel + UI library

### Sprint 2 (2 semaines) - Événements
- Epic 2: Gestion Événements (BKN-20 à BKN-26)
**Goal:** Affichage et CRUD événements

### Sprint 3 (2 semaines) - Réservations
- Epic 3: Réservations (BKN-30 à BKN-33)
- Epic 5: Dashboard Participant (BKN-50, BKN-51)
**Goal:** Système de réservation complet

### Sprint 4 (2 semaines) - Admin & Tests
- Epic 4: Dashboard Admin (BKN-40 à BKN-43)
- Epic 7: Tests (BKN-70 à BKN-72)
**Goal:** Interface admin + tests

### Sprint 5 (1 semaine) - Docker & CI/CD
- Epic 8: Docker (BKN-80, BKN-81)
- Epic 9: CI/CD (BKN-90, BKN-91)
**Goal:** Déploiement automatisé

---

## 📈 Metrics & Reports

**Vélocité cible:** 21-34 points par sprint  
**Total Story Points:** 152  
**Durée estimée:** 5 sprints (10-11 semaines)

**KPIs à suivre:**
- Vélocité par sprint
- Burndown chart
- Taux de complétion
- Bugs ouverts vs résolus
- Couverture de tests

---

## 🎓 Soutenance - Points Clés

**À présenter:**
1. Architecture du projet (modules, structure)
2. Planification JIRA (épics, sprints, vélocité)
3. Intégration GitHub ↔ JIRA (commits, PR, automatisations)
4. Démonstration des fonctionnalités
5. Tests et couverture
6. Pipeline CI/CD
7. Docker et déploiement

**Préparer:**
- Capture d'écran du board JIRA
- Exemples de commits avec références
- Démonstration de l'automatisation JIRA
- Métriques et rapports

---

## 📚 Documentation Complémentaire

**À créer:**
- [ ] README.md détaillé
- [ ] CONTRIBUTING.md (guidelines)
- [ ] API_DOCUMENTATION.md (pour frontend)
- [ ] DEPLOYMENT.md (guide déploiement)
- [ ] TESTING.md (stratégie de tests)

---

**Planification créée le:** 09/02/2026  
**Version:** 1.0  
**Projet:** BookNest Front-End  
**Framework:** Next.js + TypeScript
