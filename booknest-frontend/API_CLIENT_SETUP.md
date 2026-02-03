# 🚀 Configuration API Client - BookNest Frontend

## 📝 Description

Configuration complète de l'API client avec Axios pour communiquer avec le backend BookNest.

## 📂 Structure des fichiers créés

```
booknest-frontend/
├── lib/
│   └── axios.ts                    # Configuration Axios avec intercepteurs JWT
├── services/
│   ├── auth.service.ts             # Service d'authentification
│   ├── events.service.ts           # Service de gestion des événements
│   ├── reservations.service.ts     # Service de gestion des réservations
│   ├── dashboard.service.ts        # Service pour les statistiques
│   └── index.ts                    # Exports centralisés
├── types/
│   └── index.ts                    # Définitions TypeScript (User, Event, Reservation, etc.)
├── .env.example                    # Template des variables d'environnement
└── .env.local                      # Variables d'environnement locales
```

## ✅ Fonctionnalités implémentées

### 1. Configuration Axios (`lib/axios.ts`)
- ✅ Instance Axios avec baseURL configurable
- ✅ Timeout de 15 secondes
- ✅ Intercepteur request : ajout automatique du token JWT
- ✅ Intercepteur response : gestion globale des erreurs (401, 403, 500)
- ✅ Redirection automatique vers `/auth/login` si non authentifié
- ✅ Helpers : `getAuthToken()`, `setAuthToken()`, `removeAuthToken()`, `isAuthenticated()`

### 2. Service d'Authentification (`services/auth.service.ts`)
- ✅ `register()` - Inscription d'un nouvel utilisateur
- ✅ `login()` - Connexion avec email/password
- ✅ `logout()` - Déconnexion et nettoyage du localStorage
- ✅ `getProfile()` - Récupération du profil utilisateur
- ✅ `updateProfile()` - Mise à jour du profil
- ✅ Sauvegarde automatique du token et user dans localStorage

### 3. Service Événements (`services/events.service.ts`)
- ✅ `getAll(filters?)` - Liste des événements avec filtres (status, dates, recherche)
- ✅ `getById(id)` - Détails d'un événement
- ✅ `create(data)` - Créer un événement (ADMIN)
- ✅ `update(id, data)` - Modifier un événement (ADMIN)
- ✅ `delete(id)` - Supprimer un événement (ADMIN)
- ✅ `updateStatus(id, status)` - Changer le statut (DRAFT/PUBLISHED/CANCELED)
- ✅ `getPublishedEvents()` - Événements publiés uniquement
- ✅ `getUpcomingEvents()` - Événements à venir

### 4. Service Réservations (`services/reservations.service.ts`)
- ✅ `create(data)` - Créer une réservation
- ✅ `getMyReservations()` - Mes réservations
- ✅ `getAll(filters?)` - Toutes les réservations (ADMIN)
- ✅ `cancel(id)` - Annuler ma réservation
- ✅ `confirm(id)` - Confirmer une réservation (ADMIN)
- ✅ `refuse(id)` - Refuser une réservation (ADMIN)
- ✅ `adminCancel(id)` - Annulation admin
- ✅ `downloadTicket(id)` - Télécharger le ticket PDF

### 5. Service Dashboard (`services/dashboard.service.ts`)
- ✅ `getAdminStats()` - Statistiques admin
- ✅ `getParticipantStats()` - Statistiques participant

### 6. Types TypeScript (`types/index.ts`)
- ✅ `User`, `UserRole`, `AuthResponse`, `LoginCredentials`, `RegisterData`
- ✅ `Event`, `EventStatus`, `CreateEventDto`, `UpdateEventDto`
- ✅ `Reservation`, `ReservationStatus`, `CreateReservationDto`
- ✅ `DashboardStats`, `ApiError`, `PaginatedResponse`
- ✅ `EventFilters`, `ReservationFilters`

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### Utilisation dans les composants

```typescript
import { authService, eventsService, reservationsService } from '@/services';

// Exemple : Connexion
const handleLogin = async (email: string, password: string) => {
  try {
    const { user, access_token } = await authService.login({ email, password });
    console.log('Connecté:', user);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Exemple : Récupérer les événements
const fetchEvents = async () => {
  try {
    const events = await eventsService.getPublishedEvents();
    console.log('Événements:', events);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Exemple : Créer une réservation
const createReservation = async (eventId: string, seats: number) => {
  try {
    const reservation = await reservationsService.create({
      eventId,
      numberOfSeats: seats,
    });
    console.log('Réservation créée:', reservation);
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

## 🔒 Gestion de l'authentification

### Flow automatique

1. L'utilisateur se connecte via `authService.login()`
2. Le token JWT est sauvegardé automatiquement dans localStorage
3. Toutes les requêtes suivantes incluent automatiquement le token dans l'en-tête `Authorization`
4. Si le token expire (401), l'utilisateur est redirigé vers `/auth/login`
5. À la déconnexion, le token est supprimé et l'utilisateur est redirigé

### Vérifier l'authentification

```typescript
import { isAuthenticated, getAuthToken } from '@/lib/axios';

if (isAuthenticated()) {
  console.log('Utilisateur authentifié');
  console.log('Token:', getAuthToken());
}
```

## 🛡️ Gestion des erreurs

Toutes les erreurs HTTP sont interceptées et formatées :

```typescript
{
  status: 401,
  message: "Token invalide",
  data: { /* données d'erreur du backend */ }
}
```

### Codes d'erreur gérés

- **401 Unauthorized** : Token invalide/expiré → Redirection automatique vers `/auth/login`
- **403 Forbidden** : Rôle insuffisant → Redirection vers `/403`
- **500 Internal Server Error** : Erreur serveur → Log console

## 📊 Logs de développement

En mode développement, chaque requête est loggée dans la console :

```
🚀 API Request: GET /events
✅ API Response: 200 /events
❌ Response Error: 401 /reservations
```

## 🎯 Prochaines étapes

- ✅ Configuration API Client (TERMINÉ)
- ⏭️ Créer le Context API pour l'authentification
- ⏭️ Créer les pages de login/register
- ⏭️ Implémenter la protection des routes

## 📚 Documentation Backend

Référez-vous à la collection Postman fournie pour tous les endpoints disponibles.

---

**Tâche JIRA:** BOOK-71  
**Développeur:** BookNest Team  
**Date:** 06/02/2026
