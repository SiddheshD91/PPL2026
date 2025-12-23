import { ReactNode } from 'react';

const SetupCheck = ({ children }: { children: ReactNode }) => {
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          background: 'white',
          color: '#333',
          padding: '40px',
          borderRadius: '12px',
          maxWidth: '700px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}>
          <h1 style={{ color: '#e74c3c', marginTop: 0 }}>⚠️ Firebase Configuration Missing</h1>
          <p>The application requires Firebase configuration to run.</p>
          
          <div style={{ marginTop: '20px', padding: '15px', background: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
            <h3 style={{ marginTop: 0, color: '#856404' }}>Missing Environment Variables:</h3>
            <ul style={{ lineHeight: '1.8', color: '#856404' }}>
              {missingVars.map((varName) => (
                <li key={varName}><code>{varName}</code></li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0 }}>Quick Setup:</h3>
            <ol style={{ lineHeight: '1.8' }}>
              <li>Create a <code>.env</code> file in the <code>PPL</code> directory</li>
              <li>Add your Firebase configuration:
                <pre style={{
                  background: '#f1f1f1',
                  padding: '10px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '0.85rem',
                  marginTop: '10px'
                }}>
{`VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id`}
                </pre>
              </li>
              <li>Restart the development server (<code>npm run dev</code>)</li>
              <li>See <code>FIREBASE_SETUP.md</code> for detailed instructions</li>
            </ol>
          </div>

          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Reload After Setup
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SetupCheck;

