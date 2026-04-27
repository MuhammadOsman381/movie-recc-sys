import React from 'react';
import MovieCard from './MovieCard';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchX } from 'lucide-react';

interface Movie {
  id: number | string;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genres?: {name: string}[];
}

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[2/3] bg-white/5 rounded-md mb-3 border border-white/5"></div>
            <div className="h-3 bg-white/10 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-white/5 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!movies.length && !loading) {
     return (
       <div className="py-24 text-center flex flex-col items-center justify-center">
         <motion.div 
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, type: 'spring' }}
           className="text-gray-600 mb-6 bg-gray-900/50 p-6 rounded-full"
         >
           <SearchX className="w-16 h-16" />
         </motion.div>
         <h3 className="text-2xl font-bold text-gray-200 outfit">No movies found</h3>
         <p className="text-gray-500 mt-2 max-w-md">We couldn't find any movies matching your criteria. Try adjusting your search terms.</p>
       </div>
     );
  }

  return (
    <motion.div 
      layout
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8"
    >
      <AnimatePresence>
        {movies.map((movie, index) => (
          <MovieCard key={`${movie.id}-${index}`} movie={movie} index={index % 20} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default MovieGrid;
