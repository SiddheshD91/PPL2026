# Deployment Instructions

This application can be deployed to either **GitHub Pages** or **Firebase Hosting**. Choose the option that best fits your needs.

## Option 1: Firebase Hosting (Recommended)

Firebase Hosting is recommended as it integrates seamlessly with Firebase services.

### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Logged into Firebase: `firebase login`

### Steps

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project**:
   ```bash
   cd PPL
   firebase init hosting
   ```
   
   When prompted:
   - Select "Use an existing project" and choose your Firebase project
   - Public directory: `dist`
   - Configure as single-page app: **Yes**
   - Set up automatic builds: **No** (or Yes if using CI/CD)
   - Overwrite index.html: **No**

4. **Update `vite.config.ts`** to set the correct base path:
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     base: '/', // For Firebase Hosting, use '/'
   })
   ```

5. **Build the application**:
   ```bash
   npm run build
   ```

6. **Deploy to Firebase Hosting**:
   ```bash
   firebase deploy --only hosting
   ```

7. **Access your app**: The deployment URL will be shown in the terminal (e.g., `https://your-project-id.web.app`)

### Update Firebase Authorized Domains

After deployment, add your Firebase Hosting domain to authorized domains:
1. Go to Firebase Console > Authentication > Settings
2. Under "Authorized domains", add your hosting domain (e.g., `your-project-id.web.app`)

---

## Option 2: GitHub Pages

GitHub Pages is free and works well for static sites, but requires additional configuration for routing.

### Prerequisites
- A GitHub account
- Git installed

### Steps

1. **Update `vite.config.ts`** for GitHub Pages:
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/', // Replace with your GitHub repo name
   })
   ```

2. **Install GitHub Pages plugin** (optional, for easier deployment):
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Update `package.json`** scripts:
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "tsc -b && vite build",
       "preview": "vite preview",
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

4. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

5. **Create GitHub repository** and push:
   ```bash
   git remote add origin https://github.com/your-username/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

6. **Build and deploy**:
   ```bash
   npm run deploy
   ```

7. **Enable GitHub Pages**:
   - Go to your GitHub repository > Settings > Pages
   - Source: Select "gh-pages" branch
   - Click Save

8. **Access your app**: `https://your-username.github.io/your-repo-name/`

### Important Notes for GitHub Pages

- Update Firebase authorized domains to include your GitHub Pages domain
- The base path in `vite.config.ts` must match your repository name
- For custom domains, update the base path accordingly

---

## Environment Variables for Production

For production deployment, you have two options:

### Option A: Environment Variables (Recommended for Firebase Hosting)

1. In Firebase Console, go to **Hosting** > **Environment variables**
2. Add your Firebase config as environment variables
3. Update `firebase.json` to include environment variable configuration

### Option B: Build-time Variables

1. Create `.env.production` file:
   ```env
   VITE_FIREBASE_API_KEY=your_production_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

2. Build with production mode:
   ```bash
   npm run build
   ```

**Note**: Never commit `.env` files with real credentials to version control. Use `.env.example` as a template.

---

## Post-Deployment Checklist

- [ ] Verify Firebase authorized domains include your hosting URL
- [ ] Test player registration from the public URL
- [ ] Test admin login and dashboard access
- [ ] Verify Firestore and Storage rules are published
- [ ] Test image upload functionality
- [ ] Verify category creation and player assignment
- [ ] Check that all routes work correctly (including direct URL access)

---

## Continuous Deployment (Optional)

### Firebase Hosting with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

---

## Troubleshooting

### Routes not working (404 errors)
- For GitHub Pages: Ensure base path in `vite.config.ts` matches your repo name
- For Firebase Hosting: Ensure "Configure as single-page app" was set to Yes

### Firebase errors after deployment
- Verify environment variables are set correctly
- Check Firebase authorized domains include your hosting URL
- Ensure Firestore and Storage rules are published

### Build fails
- Check that all dependencies are installed: `npm install`
- Verify TypeScript compilation: `npm run build`
- Check for linting errors: `npm run lint`

