# Dating App CRM + Gamification

A dating app that combines CRM functionality with gamification to help users track their dating experiences, set goals, and compete with friends.

## Features

### User Onboarding
- Sign Up / Login with email or OAuth
- Set display name, weekly quota, and personal goals

### CRM — Date Logging & Management
- Dashboard with upcoming dates and stats
- Date logging with name, date/time, location, notes, and ratings
- Contact management with tags and status tracking
- Reminders and nudges for follow-ups

### Gamification & Accountability
- Leaderboard for dates logged, new numbers, and completion %
- Weekly quotas with progress tracking
- Weekly summary of goal progress and rankings

## Tech Stack

- Frontend: React + Material UI
- Backend: Node.js with Express
- Database: PostgreSQL
- Auth: JWT
- Deployment: Railway

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file based on the `.env.example`
4. Set up the PostgreSQL database
5. Run the development server
   ```
   npm run dev
   ```

## Deployment to Railway

### 1. Sign up for Railway

If you don't have an account, sign up at [Railway](https://railway.app/).

### 2. Install Railway CLI (Optional)

```
npm i -g @railway/cli
```

### 3. Deploy from GitHub

1. Push your code to GitHub
2. Log in to Railway Dashboard
3. Click "New Project" > "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically detect your Node.js app

### 4. Add PostgreSQL Database

1. In your project dashboard, click "New"
2. Select "Database" > "PostgreSQL"
3. Wait for it to provision

### 5. Configure Environment Variables

1. Go to your project settings
2. Add the following variables:
   - `NODE_ENV=production`
   - `JWT_SECRET` (generate a secure random string)
   - `FRONTEND_URL` (your frontend URL or same as backend for single deployment)
   - Railway will automatically set `DATABASE_URL` and `PORT`

### 6. Deploy

Railway will automatically deploy your app when you push to your GitHub repository. You can also trigger a manual deployment from the Railway dashboard.

### 7. Custom Domain (Optional)

1. Go to your project settings
2. Navigate to "Settings" > "Domains"
3. Add your custom domain
4. Update DNS settings as instructed

## License

ISC