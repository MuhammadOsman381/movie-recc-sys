import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Star, Clock, Calendar, Heart, Share2, ArrowLeft, Play, Plus, ThumbsUp } from 'lucide-react';
import RecommendationSection from '../components/RecommendationSection';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/movies/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error('Failed to fetch movie', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
    window.scrollTo(0, 0);
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated) return;
    try {
      await api.post(`/api/movies/${id}/like`);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to like movie', error);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!movie) return <div className="text-center py-32 text-white text-2xl font-bold bg-[var(--bg-primary)] min-h-screen">Movie not found</div>;

  const posterUrl = movie.poster_path && movie.poster_path.startsWith('http')
    ? movie.poster_path
    : 'https://via.placeholder.com/500x750/111111/444444?text=No+Poster';
    
  const backDropUrl = posterUrl; // Using poster as backdrop since OMDB usually gives posters
  const isHighRated = movie.vote_average >= 8.0;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20">
      {/* Cinematic Hero Section */}
      <div className="relative min-h-[85vh] md:min-h-[90vh] w-full overflow-hidden flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
          <img
            src={backDropUrl}
            alt={movie.title}
            className="w-full h-full object-cover opacity-30 blur-2xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center md:items-end gap-12 pb-20 pt-36">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-48 md:w-80 flex-shrink-0 shadow-2xl rounded-xl overflow-hidden border border-white/5 relative group"
          >
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-auto object-cover"
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 text-center md:text-left"
          >
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4 text-sm font-bold tracking-wider mt-4 md:mt-0">
               <span className="text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 rounded">MOVIE</span>
               {isHighRated && <span className="text-green-500 border border-green-500 px-2 py-1 rounded">MATCH</span>}
               <span className="text-gray-300">{movie.release_date}</span>
               {movie.vote_average > 0 && (
                   <span className="flex items-center gap-1 text-yellow-500">
                     <Star className="w-4 h-4 fill-yellow-500" /> {movie.vote_average.toFixed(1)}
                   </span>
               )}
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 outfit text-white drop-shadow-2xl">{movie.title}</h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl leading-relaxed drop-shadow-md">
              {movie.overview}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              {isAuthenticated && (
                <button 
                  onClick={handleLike}
                  className="btn-primary flex items-center gap-2"
                >
                  {isLiked ? (
                    <><Heart className="w-6 h-6 fill-white text-white" /> Liked</>
                  ) : (
                    <><Plus className="w-6 h-6" /> Add to List</>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-12">
        <RecommendationSection type="content" id={id} title="More Like This" />
      </div>
    </div>
  );
};

export default MovieDetailPage;
