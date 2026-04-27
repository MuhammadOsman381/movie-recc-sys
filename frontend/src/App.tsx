import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import LoginPage from './pages/LoginPage';

function App() {
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
