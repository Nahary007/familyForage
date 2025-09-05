import { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Map from './components/Map';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import DashboardApp from './dashboard/App';
import AdminApp from './admin/App';
import AuthWrapper from './components/auth/AuthWrapper';
import { useAuth } from './context/AuthContext';

type AppView = 'main' | 'auth' | 'dashboard' | 'admin';

function App() {
  const { authState, login, logout } = useAuth();
  const { user, isAuthenticated, loading } = authState;

  const [currentView, setCurrentView] = useState<AppView>('main');
  const [authError, setAuthError] = useState<string | null>(null);

  // Redirection automatique selon rôle
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role === 'admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('dashboard');
      }
    }
  }, [loading, isAuthenticated, user]);

  const handleShowAuth = () => {
    setCurrentView('auth');
    setAuthError(null);
  };

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      await login(credentials.email, credentials.password);
    } catch (error: any) {
      setAuthError(error.message || "Erreur de connexion");
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentView('main');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setAuthError(null);
  };

  // Render en fonction du rôle
  if (loading) return <div>Chargement...</div>;

  switch (currentView) {
    case 'auth':
      return (
        <AuthWrapper
          onLogin={handleLogin}
          onBack={handleBackToMain}
          isLoading={loading}
          error={authError ?? undefined}
        />
      );

    case 'admin':
      return user?.role === 'admin' ? <AdminApp onLogout={handleLogout} /> : null;

    case 'dashboard':
      return user ? <DashboardApp onLogout={handleLogout} /> : null;

    default:
      return (
        <div className="font-sans">
          <Header />
          <Hero />
          <About />
          <Services />
          <Gallery />
          <Map />
          <Testimonials />
          <Contact />
          <Footer />

          {/* Client Space Access Button */}
          {!isAuthenticated && (
            <div className="fixed bottom-4 right-4 z-50">
              <button
                onClick={handleShowAuth}
                className="bg-[#0D6EFD] hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg transition-colors text-sm"
              >
                🔐 Espace Client
              </button>
            </div>
          )}
        </div>
      );
  }
}

export default App;
