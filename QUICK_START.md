# Quick Start Guide

Get your Cricket League Auction application up and running in minutes!

## Step 1: Install Dependencies

```bash
cd PPL
npm install
```

This will install:
- React and React DOM
- Firebase SDK
- React Router DOM
- TypeScript and development tools

## Step 2: Set Up Firebase

1. **Create a Firebase project** at https://console.firebase.google.com
2. **Enable services**:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
3. **Get your config** from Project Settings > Your apps > Web app
4. **Create `.env` file** in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. **Set up security rules**:
   - Copy `firestore.rules` content to Firestore > Rules
   - Copy `storage.rules` content to Storage > Rules
   - Click "Publish" for both

6. **Create admin user**:
   - Go to Authentication > Users > Add user
   - Enter email and password
   - Save these credentials!

## Step 3: Run the Application

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Step 4: Test the Application

### Test Player Registration (Public)
1. Go to http://localhost:5173
2. Fill out the registration form
3. Upload a photo (max 5MB)
4. Submit and verify success message

### Test Admin Dashboard
1. Go to http://localhost:5173/admin/login
2. Login with admin credentials
3. Test features:
   - Search for players
   - View player details
   - Create a category
   - Add players to category
   - Remove players from category
   - Delete category

## Common Issues

**"Module not found" errors**
- Run `npm install` again
- Make sure you're in the `PPL` directory

**Firebase connection errors**
- Check `.env` file exists and has correct values
- Verify Firebase services are enabled
- Check browser console for specific error messages

**Authentication errors**
- Verify Email/Password provider is enabled
- Check authorized domains include `localhost`
- Ensure admin user is created in Firebase Console

**Permission denied errors**
- Verify Firestore and Storage rules are published
- Check rules match the files in the project

## Next Steps

- Read [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed Firebase setup
- Read [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy to production
- Read [README.md](./README.md) for full documentation

## Need Help?

Check the detailed documentation:
- `README.md` - Full project documentation
- `FIREBASE_SETUP.md` - Step-by-step Firebase setup
- `DEPLOYMENT.md` - Production deployment guide

