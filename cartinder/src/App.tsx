import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage.tsx';
import BottomBar from './components/BottomBar.tsx';
import SideBar from './components/SideBar.tsx';
import LoginPage from './pages/auth/LoginPage.tsx';
import RegisterPage from './pages/auth/RegisterPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import LikesPage from './pages/LikesPage.tsx';
import DealerDashboard from './pages/DealerDashboard.tsx';
import MessagesPage from './pages/MessagesPage.tsx';
import ChatDetail from './pages/ChatDetail.tsx';
import BookingPage from './pages/BookingPage.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { NotificationProvider } from './context/NotificationContext.tsx';
import React from 'react';

const Layout = ({ children, onFilterClick }: { children: React.ReactNode, onFilterClick?: () => void }) => {
  return (
    <>
      <SideBar onFilterClick={onFilterClick} />
      <div className="main-content">
        {children}
      </div>
      <BottomBar />
    </>
  );
};

const AuthenticatedRoute = ({ children, onFilterClick }: { children: React.ReactNode, onFilterClick?: () => void }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  return <Layout onFilterClick={onFilterClick}>{children}</Layout>;
};

const AppContent = () => {
  const { user, loading } = useAuth();
  const [filterTrigger, setFilterTrigger] = React.useState(0);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
      
      <Route
        path="/"
        element={
          <AuthenticatedRoute onFilterClick={() => setFilterTrigger(prev => prev + 1)}>
            <HomePage filterTrigger={filterTrigger} />
          </AuthenticatedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <AuthenticatedRoute>
            <ProfilePage />
          </AuthenticatedRoute>
        }
      />

      <Route
        path="/likes"
        element={
          <AuthenticatedRoute>
            <LikesPage />
          </AuthenticatedRoute>
        }
      />

      <Route
        path="/messages"
        element={
          <AuthenticatedRoute>
            <MessagesPage />
          </AuthenticatedRoute>
        }
      />

      <Route
        path="/chat/:chatId"
        element={
          user ? (
            <div className="main-content">
              <ChatDetail />
            </div>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/book/:carId"
        element={
          user ? (
            <div className="main-content">
              <BookingPage />
            </div>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/dealer"
        element={
          user && user.roles.includes('dealer') ? (
            <AuthenticatedRoute>
              <DealerDashboard />
            </AuthenticatedRoute>
          ) : (
            <Navigate to="/" />
          )
        }
      />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
