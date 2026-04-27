import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface Movie {
  id: number | string;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genres?: {name: string}[];
}

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index = 0 }) => {
  const imageUrl = movie.poster_path && movie.poster_path.startsWith('http')
    ? movie.poster_path
    : 'https://via.placeholder.com/500x750/111111/444444?text=No+Poster';

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const isHighRated = movie.vote_average >= 8.0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      layout
      className="group relative movie-card rounded-md bg-[var(--card-bg)]"
    >
      <Link to={`/movie/${movie.id}`} className="block h-full cursor-pointer">
        <div className="aspect-[2/3] relative overflow-hidden rounded-md">
          <img
            src={imageUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
          {movie.vote_average > 0 && (
            <div className="absolute top-2 right-2 flex items-center justify-center bg-black/70 backdrop-blur-md px-2 py-1 rounded border border-white/10 shadow-lg">
              <Star className={`w-3 h-3 mr-1 ${isHighRated ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400 fill-gray-400'}`} />
              <span className="text-[11px] font-bold text-white shadow-sm">{movie.vote_average.toFixed(1)}</span>
            </div>
          )}
          
          {/* Cinematic Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
             <div className="flex items-center gap-2 mb-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                <div className="flex-1"></div>
                <button className="p-1.5 border-2 border-white/40 hover:border-white rounded-full bg-black/50 text-white transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
             </div>
             
             <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150">
               <h3 className="font-bold text-white text-sm line-clamp-1 mb-1">{movie.title}</h3>
               <div className="flex items-center gap-2 text-[10px] text-gray-400 font-semibold">
                 {isHighRated && <span className="text-green-500 font-bold border border-green-500/30 px-1 rounded bg-green-500/10">Match</span>}
                 <span>{year}</span>
                 {movie.genres && movie.genres.length > 0 && (
                   <>
                     <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                     <span className="line-clamp-1">{movie.genres[0].name}</span>
                   </>
                 )}
               </div>
             </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
