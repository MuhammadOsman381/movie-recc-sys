import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import LoginPage from './pages/LoginPage';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        // Request to root endpoint as requested
        await axios.get(apiUrl);
        // Artificial delay for better UX (so the animation can be seen)
        setTimeout(() => setIsInitialized(true), 2000);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        // Even if it fails, we show the app to allow manual retry or error states in pages
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        
        <footer className="border-t border-white/5 py-10 text-center text-[var(--text-secondary)] text-sm">
          <p>© 2026 CineMatch. All rights reserved.</p>
          <p className="mt-2">Built with React, FastAPI & Recommendation Algorithms</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
