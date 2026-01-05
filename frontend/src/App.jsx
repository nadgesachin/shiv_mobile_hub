import React from "react";
import { HelmetProvider } from 'react-helmet-async';
import Routes from "./Routes";
import { AuthProvider } from "./contexts/AuthContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
import ScrollToTop from "./components/ui/ScrollToTop";
import OfflineIndicator from "./components/ui/OfflineIndicator";

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '255944288247-770cak9jhh6q847j8i2u70plndavcdt5.apps.googleusercontent.com';
  
  return (
    <HelmetProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <OfflineIndicator />
          <Routes />
          <ScrollToTop />
        </AuthProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  );
}

export default App;
