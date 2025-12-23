# Cricket League Auction Web Application

A production-ready web application for managing a local cricket league auction, built with React, TypeScript, Vite, and Firebase.

## Features

### Public Features
- **Player Registration**: Public registration page where players can register with:
  - Full name
  - Profile photo upload
  - T-shirt size selection
  - Date of birth
  - Automatic age calculation

### Admin Features
- **Secure Authentication**: Firebase Email/Password authentication
- **Player Management**:
  - Real-time player search by name
  - View detailed player information (photo, DOB, age, t-shirt size)
- **Category Management**:
  - Create player categories (e.g., "A1 Batsman", "A1 All-Rounder")
  - Add players to categories (maximum 8 players per category)
  - Remove players from categories
  - Delete categories
  - View category player count

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: CSS Modules
- **Backend**: Firebase
  - Firestore (Database)
  - Authentication (Email/Password)
  - Storage (Image uploads)
- **Routing**: React Router DOM
- **Hosting**: Firebase Hosting or GitHub Pages

## Project Structure

```
PPL/
├── src/
│   ├── components/
│   │   ├── AdminDashboard/       # Admin dashboard with player & category management
│   │   ├── AdminLogin/            # Admin authentication page
│   │   ├── PlayerRegistration/    # Public player registration form
│   │   └── ProtectedRoute/        # Route protection component
│   ├── config/
│   │   └── firebase.ts           # Firebase configuration
│   ├── services/
│   │   ├── authService.ts        # Authentication service
│   │   ├── playerService.ts      # Player CRUD operations
│   │   └── categoryService.ts    # Category management
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── App.tsx                   # Main app component with routing
│   └── main.tsx                  # Entry point
├── firestore.rules               # Firestore security rules
├── storage.rules                 # Firebase Storage security rules
├── FIREBASE_SETUP.md            # Detailed Firebase setup instructions
└── DEPLOYMENT.md                # Deployment guide
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd PPL
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase**:
   - Follow the instructions in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Create a `.env` file with your Firebase configuration (see `.env.example`)

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   - Navigate to `http://localhost:5173` (or the port shown in terminal)

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Security

### Firestore Rules
- **Public**: Can create player documents (for registration)
- **Admin only**: Can read, update, and delete players and manage categories

### Storage Rules
- **Public**: Can upload images (max 5MB, image files only)
- **Public**: Can read images

### Authentication
- Only authenticated admin users can access admin routes
- Admin credentials must be created manually in Firebase Console

## Data Models

### Player
```typescript
{
  id: string;
  name: string;
  photoUrl: string;
  tshirtSize: 'XS' | 'S' | 'M' | 'L' | 'XL';
  dob: string;
  age: number;
  createdAt: Date;
}
```

### Category
```typescript
{
  id: string;
  name: string;
  players: string[]; // Array of player IDs (max 8)
  createdAt: Date;
}
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Firebase Hosting (Recommended)
- GitHub Pages

## Usage Guide

### For Players (Public)
1. Navigate to the home page
2. Fill out the registration form:
   - Enter full name
   - Upload profile photo (max 5MB)
   - Select t-shirt size
   - Enter date of birth
3. Click "Register"
4. Wait for success confirmation

### For Admins
1. Navigate to `/admin/login`
2. Enter admin credentials (created in Firebase Console)
3. Access the dashboard at `/admin/dashboard`
4. **Search Players**: Type in the search box to find players
5. **View Player Details**: Click on a player from search results
6. **Create Category**: Enter category name and click "Create"
7. **Add Players to Category**: 
   - Click "+ Add Player" in a category
   - Search and select a player
   - Maximum 8 players per category
8. **Remove Players**: Click the "✕" button next to a player in a category
9. **Delete Category**: Click the "🗑️" button in the category header

## Troubleshooting

### Common Issues

**"Firebase: Error (auth/unauthorized-domain)"**
- Add your domain to Firebase authorized domains (Authentication > Settings)

**"Permission denied" errors**
- Verify Firestore and Storage rules are published
- Ensure you're logged in as admin for admin routes

**Image upload fails**
- Check file size is under 5MB
- Ensure file is a valid image format
- Verify Storage rules are published

**Routes return 404**
- For GitHub Pages: Update base path in `vite.config.ts`
- For Firebase Hosting: Ensure "single-page app" is configured

## Contributing

This is a production-ready application. When making changes:
1. Follow TypeScript best practices
2. Maintain component structure and CSS Modules
3. Update security rules if data models change
4. Test all functionality before deployment

## License

This project is private and proprietary.

## Support

For setup and deployment issues, refer to:
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase configuration
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions
