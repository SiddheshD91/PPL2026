# Firebase Setup Instructions

## Prerequisites
- A Firebase account (sign up at https://firebase.google.com)
- Node.js and npm installed

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name (e.g., "cricket-league-auction")
   - Enable/disable Google Analytics (optional)
   - Click "Create project"

## Step 2: Enable Firebase Services

### Enable Authentication
1. In Firebase Console, go to **Authentication** > **Get started**
2. Click on **Sign-in method** tab
3. Enable **Email/Password** provider
4. Click **Save**

### Enable Firestore Database
1. Go to **Firestore Database** > **Create database**
2. Choose **Start in test mode** (we'll update rules later)
3. Select a location for your database
4. Click **Enable**

### Enable Storage
1. Go to **Storage** > **Get started**
2. Click **Next** through the setup
3. Use default security rules for now (we'll update later)
4. Click **Done**

## Step 3: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "Cricket League Web")
5. Copy the Firebase configuration object

## Step 4: Configure Environment Variables

1. In your project root, create a `.env` file (copy from `.env.example`)
2. Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the values with your actual Firebase config values.

## Step 5: Set Up Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** > **Rules**
2. Copy the contents of `firestore.rules` from this project
3. Paste into the rules editor
4. Click **Publish**

## Step 6: Set Up Storage Security Rules

1. In Firebase Console, go to **Storage** > **Rules**
2. Copy the contents of `storage.rules` from this project
3. Paste into the rules editor
4. Click **Publish**

## Step 7: Create Admin User

1. In Firebase Console, go to **Authentication** > **Users**
2. Click **Add user**
3. Enter admin email and password
4. Click **Add user**
5. **Important**: Save these credentials securely - you'll need them to log into the admin dashboard

## Step 8: Install Dependencies and Run

```bash
npm install
npm run dev
```

## Security Notes

- The Firestore rules allow anyone to create player documents (for public registration)
- Only authenticated admin users can read/update/delete players and manage categories
- Storage rules allow public uploads for player photos (with size and type restrictions)
- Make sure to keep your admin credentials secure
- Consider implementing additional security measures for production (e.g., IP whitelisting, rate limiting)

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
- Go to **Authentication** > **Settings** > **Authorized domains**
- Add your domain (localhost is usually already there for development)

### "Permission denied" errors
- Check that Firestore and Storage rules are published correctly
- Verify that you're logged in as admin when accessing admin routes

### Image upload fails
- Check Storage rules are published
- Verify file size is under 5MB
- Ensure file is a valid image format

