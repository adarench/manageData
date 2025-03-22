# Deploying the Dating App to Railway

Railway is a platform that enables you to deploy your applications easily. This guide will walk you through deploying your Dating App to Railway.

## Prerequisites

1. Create a Railway account at [railway.app](https://railway.app/)
2. Install the Railway CLI:
   ```
   npm i -g @railway/cli
   ```
3. Login to your Railway account via CLI:
   ```
   railway login
   ```

## Deployment Steps

### 1. Create a New Project on Railway

1. Push your code to a GitHub repository
2. Go to [railway.app](https://railway.app/) dashboard
3. Click on "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway will detect the Node.js app automatically

### 2. Add PostgreSQL Database

1. In your project dashboard, click "New"
2. Select "PostgreSQL" from the database options
3. Railway will provision a new PostgreSQL database for your app
4. The `DATABASE_URL` environment variable will be automatically added to your project

### 3. Configure Environment Variables

1. Click on your main service in the Railway dashboard
2. Go to the "Variables" tab
3. Add the following environment variables:
   - `NODE_ENV`: Set to `production`
   - `JWT_SECRET`: Generate a secure random string for JWT tokens
   - Note: `DATABASE_URL` is automatically set by Railway

### 4. Deploy

1. Railway will automatically deploy your app
2. You can trigger a new deployment by pushing to your GitHub repository
3. To deploy manually, you can use the CLI:
   ```
   railway up
   ```

### 5. Add Custom Domain (Optional)

1. Go to your project settings
2. Navigate to "Settings" > "Domains"
3. Add your custom domain
4. Update your DNS settings as instructed

## Viewing Your Deployed App

1. Click on your service in the Railway dashboard
2. Look for the "Deployments" section
3. Click on the latest deployment
4. Copy the URL provided by Railway
5. Open the URL in your browser to access your app

## Troubleshooting

If you encounter issues during deployment:

1. Check the deployment logs in the Railway dashboard
2. Ensure all required environment variables are set
3. Check the app's log output for any errors
4. Make sure your PostgreSQL credentials are correct

## Updating Your App

To update your app:

1. Make changes to your code locally
2. Commit and push to GitHub
3. Railway will automatically detect changes and redeploy
4. Monitor the deployment logs for any issues

## Database Migrations

For database schema changes:

1. Railway runs your `start` command from package.json
2. In production environment, the server will start without syncing models
3. For manual database migrations, use the Railway CLI to run:
   ```
   railway run npx sequelize-cli db:migrate
   ```

## Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway CLI Reference](https://docs.railway.app/reference/cli)
- [PostgreSQL on Railway](https://docs.railway.app/reference/postgres)