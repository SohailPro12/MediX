# Diagrammes de Séquence - Application MediX

## ADMIN - Scénarios Principaux

### 1. Gestion des Médecins - Ajout d'un nouveau médecin

```mermaid
sequenceDiagram
    participant A as Admin
    participant S as System

    A->>S: Se connecte au dashboard admin
    S->>S: Vérification authentification (JWT)
    S->>S: Validation des droits admin
    S-->>A: Affiche dashboard admin
    
    A->>S: Clique sur "Gérer les médecins"
    S->>S: Récupération liste des médecins
    Note over S: Collection: medecins
    S-->>A: Affiche liste des médecins
    
    A->>S: Clique sur "Ajouter médecin"
    S-->>A: Affiche formulaire d'ajout
    
    A->>S: Remplit et soumet le formulaire
    Note over A,S: {nom, email, specialite, telephone, etc.}
    
    S->>S: Vérification autorisation admin
    S->>S: Validation données et email unique
    S->>S: Hash du mot de passe par défaut
    S->>S: Création du médecin en base
    Note over S: Collections: medecins, authentification
    S->>S: Mise à jour de l'interface
    
    S-->>A: Affiche message de succès et liste mise à jour
```

### 2. Résolution de Problèmes - Traitement des signalements

```mermaid
sequenceDiagram
    participant A as Admin
    participant S as System

    A->>S: Accède à la liste des problèmes
    S->>S: Vérification autorisation admin
    S->>S: Récupération des problèmes signalés
    Note over S: Collection: problems + détails utilisateurs
    S-->>A: Affiche liste des problèmes
    
    A->>S: Sélectionne un problème
    S->>S: Récupération détails du problème
    S-->>A: Affiche détails du problème
    
    A->>S: Choisit une action (résoudre/fermer)
    A->>S: Ajoute commentaire de résolution
    
    S->>S: Vérification autorisation admin
    S->>S: Mise à jour statut du problème
    Note over S: SET status="resolved", resolvedAt=Date.now()
    S->>S: Envoi notification à l'utilisateur concerné
    
    S-->>A: Affiche confirmation et liste mise à jour
```

### 3. Consultation des Statistiques - Monitoring de la plateforme

```mermaid
sequenceDiagram
    participant A as Admin
    participant S as System

    A->>S: Accède au dashboard principal
    S->>S: Vérification autorisation admin
    
    par Récupération des statistiques
        S->>S: COUNT medecins actifs
        Note over S: Collection: medecins
    and
        S->>S: COUNT patients inscrits
        Note over S: Collection: patients
    and
        S->>S: COUNT rendez-vous aujourd'hui
        Note over S: Collection: rendez-vous
    and
        S->>S: COUNT problèmes non résolus
        Note over S: Collection: problems
    end
    
    S->>S: AGGREGATE revenus mensuels
    Note over S: Pipeline MongoDB pour calculs
    
    S->>S: AGGREGATE consultations par spécialité
    Note over S: Calcul répartition des consultations
    
    S-->>A: Affiche graphiques et KPIs
    Note over S,A: {doctors: X, patients: Y, appointments: Z, problems: W, revenue: [...], consultations: [...]}
    
    A->>S: Sélectionne période (semaine/mois)
    S->>S: Calcul statistiques avec filtre temporel
    S-->>A: Affiche nouveaux graphiques
```

## DOCTEUR - Scénarios Principaux

### 1. Gestion des Rendez-vous - Confirmation d'un rendez-vous

```mermaid
sequenceDiagram
    participant D as Docteur
    participant S as System
    participant P as Patient

    D->>S: Se connecte au dashboard
    S->>S: Vérification authentification docteur (JWT)
    S-->>D: Affiche dashboard avec RDV en attente
    
    D->>S: Sélectionne un rendez-vous
    D->>S: Clique sur "Confirmer"
    Note over D,S: {status: "confirmed", doctorNotes: "..."}
    
    S->>S: Vérification autorisation docteur
    S->>S: Mise à jour status du RDV
    Note over S: SET status="confirmed", confirmedAt, doctorNotes
    S->>S: Récupération des détails patient
    S->>P: Envoi notification push
    Note over S,P: "Votre RDV avec Dr. X est confirmé"
    
    S-->>D: Affiche message de succès et dashboard mis à jour
```

### 2. Consultation Patient avec Prescription - Consultation complète

```mermaid
sequenceDiagram
    participant D as Docteur
    participant S as System
    participant P as Patient

    D->>S: Accède au suivi patient
    S->>S: Vérification autorisation docteur
    S->>S: Récupération dossier médical complet
    Note over S: Collections: dossier_medical, patient, ordonnances
    S-->>D: Affiche historique et données patient
    
    D->>S: Consulte les antécédents
    D->>S: Clique sur "Nouvelle prescription"
    S-->>D: Affiche formulaire de prescription
    
    D->>S: Ajoute médicaments, posologie et durée
    D->>S: Ajoute instructions spéciales
    D->>S: Clique sur "Créer ordonnance"
    Note over D,S: {patientId, medications: [...], instructions, duration}
    
    S->>S: Vérification autorisation docteur
    S->>S: Début transaction
    S->>S: Création nouvelle ordonnance
    Note over S: Collection: ordonnances
    S->>S: Mise à jour dossier médical
    Note over S: Ajout référence ordonnance
    S->>S: Enregistrement traitement
    Note over S: Collection: traitements
    S->>S: Validation transaction
    
    S->>S: Génération PDF ordonnance
    S-->>D: Affiche ordonnance générée
    
    D->>S: Confirme et envoie au patient
    S->>P: Notification ordonnance disponible
    S-->>D: Confirmation d'envoi
```

### 3. Configuration de Disponibilité - Gestion du calendrier

```mermaid
sequenceDiagram
    participant D as Docteur
    participant S as System

    D->>S: Accède au calendrier
    S->>S: Vérification autorisation docteur
    S->>S: Récupération disponibilités actuelles
    Note over S: Collection: medecins.availability
    S-->>D: Affiche calendrier avec disponibilités
    
    D->>S: Clique sur "Modifier disponibilités"
    S->>S: Récupération planning détaillé
    S-->>D: Affiche interface de configuration
    
    D->>S: Modifie créneaux horaires
    D->>S: Définit jours de travail
    D->>S: Configure pauses et congés
    D->>S: Clique sur "Sauvegarder"
    Note over D,S: {workingDays: [...], timeSlots: [...], breaks: [...]}
    
    S->>S: Vérification autorisation docteur
    S->>S: Validation des créneaux
    Note over S: Vérification conflits RDV existants
    S->>S: Mise à jour disponibilités du médecin
    Note over S: Collection: medecins
    S->>S: Recalcul des créneaux dans le calendrier
    Note over S: Recalcul des slots disponibles
    
    S-->>D: Message de succès et calendrier actualisé
```

## PATIENT - Scénarios Principaux

### 1. Recherche et Prise de Rendez-vous - Booking complet

```mermaid
sequenceDiagram
    participant P as Patient
    participant S as System
    participant D as Docteur

    P->>S: Accède à la recherche de médecins
    S->>S: Vérification autorisation patient (JWT)
    S->>S: Récupération médecins actifs
    Note over S: Collection: medecins, status: "active"
    S-->>P: Affiche liste des médecins disponibles
    
    P->>S: Applique filtres (spécialité, localisation)
    S->>S: Recherche avec filtres
    S-->>P: Affiche médecins filtrés
    
    P->>S: Sélectionne un médecin
    S->>S: Récupération profil médecin + avis
    S-->>P: Affiche profil et disponibilités
    
    P->>S: Clique sur "Prendre RDV"
    S->>S: Calcul des créneaux disponibles
    Note over S: Calcul des slots libres
    S-->>P: Affiche calendrier des créneaux disponibles
    
    P->>S: Sélectionne date et heure
    P->>S: Ajoute motif de consultation
    P->>S: Confirme la réservation
    Note over P,S: {doctorId, date, time, reason, patientNotes}
    
    S->>S: Vérification autorisation patient
    S->>S: Vérification disponibilité slot
    S->>S: Création nouveau rendez-vous
    Note over S: Collection: rendez-vous
    S->>S: Mise à jour calendrier médecin
    S->>D: Notification nouveau RDV
    Note over S,D: "Nouveau RDV de Patient X"
    
    S-->>P: Affiche confirmation et détails du RDV
```

### 2. Consultation du Dossier Médical - Accès aux données médicales

```mermaid
sequenceDiagram
    participant P as Patient
    participant S as System

    P->>S: Accède à son dossier médical
    S->>S: Vérification autorisation patient (JWT)
    
    par Récupération du dossier complet
        S->>S: FIND dossier médical
        Note over S: Collection: dossier_medical
    and
        S->>S: FIND ordonnances du patient
        Note over S: Collection: ordonnances
    and
        S->>S: FIND analyses médicales
        Note over S: Collection: analyses
    and
        S->>S: FIND traitements en cours
        Note over S: Collection: traitements
    end
    
    S->>S: FIND historique consultations
    Note over S: Collection: rendez-vous (status: completed)
    
    S-->>P: Affiche dossier médical complet
    Note over S,P: {infos: {...}, prescriptions: [...], analyses: [...], treatments: [...], consultations: [...]}
    
    P->>S: Navigue dans les sections
    P->>S: Clique sur "Ordonnances"
    S-->>P: Affiche liste des prescriptions
    
    P->>S: Sélectionne une ordonnance
    S->>S: Vérification propriété ordonnance
    S->>S: FIND ordonnance détaillée
    S-->>P: Affiche détails de l'ordonnance
    
    P->>S: Clique sur "Télécharger PDF"
    S->>S: FIND ordonnance et génération PDF
    S-->>P: Télécharge l'ordonnance
```

### 3. Gestion des Rendez-vous - Suivi des appointments

```mermaid
sequenceDiagram
    participant P as Patient
    participant S as System
    participant D as Docteur

    P->>S: Accède à ses rendez-vous
    S->>S: Vérification autorisation patient (JWT)
    S->>S: FIND tous les RDV du patient
    Note over S: Collection: rendez-vous + JOIN medecins
    S-->>P: Affiche RDV par statut
    Note over S,P: À venir, Confirmés, Passés, Annulés
    
    P->>S: Sélectionne un RDV à venir
    P->>S: Clique sur "Modifier"
    S->>S: Vérification propriété RDV
    S->>S: FIND détails du RDV
    S-->>P: Affiche détails du rendez-vous
    
    S->>S: FIND créneaux libres du médecin
    Note over S: Nouveaux créneaux disponibles
    S-->>P: Affiche options de reprogrammation
    
    P->>S: Sélectionne nouvelle date/heure
    P->>S: Ajoute raison du changement
    P->>S: Confirme la modification
    Note over P,S: {newDate, newTime, reason}
    
    S->>S: Vérification autorisation patient
    S->>S: Vérification nouveau slot disponible
    S->>S: BEGIN Transaction
    S->>S: UPDATE ancien RDV (annulé)
    S->>S: INSERT nouveau RDV
    Note over S: Avec nouveau créneau
    S->>S: UPDATE disponibilités médecin
    S->>S: COMMIT Transaction
    
    S->>D: Notification de reprogrammation
    Note over S,D: "RDV reprogrammé par Patient X"
    
    S-->>P: Affiche nouveau RDV confirmé et liste mise à jour
```

## Architecture Technique Générale

### Authentification JWT
```mermaid
sequenceDiagram
    participant User as Utilisateur
    participant S as System

    User->>S: Saisit identifiants
    S->>S: Vérification utilisateur en base
    S->>S: Génération JWT token
    S->>S: Stockage token côté client
    S-->>User: Affiche dashboard utilisateur
    
    Note over User,S: Pour chaque requête authentifiée:
    User->>S: Requête avec token d'autorisation
    S->>S: Vérification et validation JWT
    S->>S: Exécution requête autorisée
    S-->>User: Réponse avec données
```

## Résumé des Fonctionnalités

### Points Clés de l'Architecture MediX

**🏗️ Architecture Simplifiée (2 acteurs) :**
- **Utilisateur** : Admin, Docteur ou Patient interagissant avec l'application
- **System** : Ensemble consolidé incluant :
  - Interface utilisateur (React Native)
  - Backend API (Express.js)
  - Base de données (MongoDB)
  - Authentification (JWT)
  - Notifications push
  - Génération de fichiers (PDF)

**🔐 Sécurité :**
- Authentification JWT pour tous les acteurs
- Autorisation basée sur les rôles (Admin, Docteur, Patient)
- Validation des données et vérification des propriétés

**📊 Fonctionnalités Principales :**
- **Admin** : Gestion des médecins, résolution de problèmes, statistiques
- **Docteur** : Confirmation RDV, prescriptions, gestion du calendrier  
- **Patient** : Recherche médecins, prise de RDV, dossier médical

**💾 Gestion des Données :**
- Transactions MongoDB pour l'intégrité des données
- Collections : medecins, patients, rendez-vous, ordonnances, problems
- Génération de PDF pour les ordonnances
- Système de notifications push entre utilisateurs

**🔄 Flux Simplifiés :**
Tous les diagrammes montrent désormais une architecture à 2 acteurs uniquement :
- L'**Utilisateur** (Admin/Docteur/Patient) qui initie les actions
- Le **System** qui traite toutes les opérations (interface, logique métier, stockage)

Cette simplification permet une meilleure lisibilité des processus métier tout en conservant la complexité technique nécessaire dans les notes explicatives.
