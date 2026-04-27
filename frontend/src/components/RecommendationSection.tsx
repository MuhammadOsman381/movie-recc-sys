import React, { useEffect, useState } from 'react';
import api from '../services/api';
import MovieGrid from './MovieGrid';

interface RecommendationSectionProps {
  type: 'content' | 'user';
  id?: string;
  title: string;
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({ type, id, title }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const endpoint = type === 'content' 
          ? `/api/recommendations/content/${id}` 
          : '/api/recommendations/user';
        const response = await api.get(endpoint);
        setMovies(response.data);
      } catch (error) {
        console.error('Failed to fetch recommendations', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [type, id]);

  if (!loading && movies.length === 0) return null;

  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold outfit">{title}</h2>
        <div className="h-1 flex-1 bg-gradient-to-r from-indigo-500/20 to-transparent ml-6 rounded-full"></div>
      </div>
      <MovieGrid movies={movies} loading={loading} />
    </section>
  );
};

export default RecommendationSection;
