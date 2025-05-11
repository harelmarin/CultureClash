# 📱 Culture Clash

Culture Clash est une application mobile de quiz en ligne 1 contre 1 sur des questions de culture générale. Les utilisateurs peuvent s'affronter en temps réel et tester leurs connaissances dans différents domaines. Le backend repose sur **NestJS** avec **Prisma** pour la gestion de base de données, et le frontend est développé avec **React Native**.

---

## 🧠 Fonctionnalités principales

- 🔐 Authentification des utilisateurs
- 🧾 Système de quiz 1v1 en temps réel
- 📊 Statistiques utilisateur
- 🏆 Classement et score
- 🌱 Fichier de seeds pour peupler la base de données avec des questions

---

## 🛠️ Stack Technique

- **Backend**: [NestJS](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/), Mysql
- **Frontend**: [React Native](https://reactnative.dev/)
- **Gestion de versions**: Git + GitHub

---

## 🚀 Lancer le projet

### 📦 Prérequis

- Node.js (>= 18.x)
- Mysql
- Yarn ou npm
- Expo CLI (pour le frontend mobile)
- Simulateur IOS

---

### ⚙️ Installation du backend

```bash
git https://github.com/harelmarin/CultureClash.git
cd backend
npm install
```

Créer un fichier `.env` dans le dossier `backend/` avec les variables du .env.example (à adapter selon votre configuration locale)

```
DATABASE_URL="mysql://root@localhost:3306/cultureclash"
SESSION_SECRET=RomainTetedeNeuilFrère

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cultureclash
```

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

npm run start:dev
```

### 📱 Installation du frontend

```bash
cd frontend
npm install
npm run start
```

👥 Auteurs

- Yulan : https://github.com/yulannn
- Marin : https://github.com/harelmarin
