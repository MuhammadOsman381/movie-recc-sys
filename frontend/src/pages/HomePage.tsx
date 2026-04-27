import React, { useEffect, useState } from 'react';
import api from '../services/api';
import MovieGrid from '../components/MovieGrid';
import RecommendationSection from '../components/RecommendationSection';
import { useAuthStore } from '../store/useAuthStore';
import { Search, Loader2, Play, Info, Plus } from 'lucide-react';
import debounce from 'lodash-es/debounce';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    const [movies, setMovies] = useState<any[]>([]);
    const [heroMovie, setHeroMovie] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { isAuthenticated } = useAuthStore();

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchMovies = async (query = '', pageNum = 1) => {
        if (pageNum === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const endpoint = query
                ? `/api/movies/search?query=${encodeURIComponent(query)}&page=${pageNum}`
                : `/api/movies/popular?page=${pageNum}`;
            const response = await api.get(endpoint);

            if (pageNum === 1) {
                setMovies(response.data);
                // Set the first popular movie as the hero movie
                if (!query && response.data.length > 0) {
                    setHeroMovie(response.data[0]);
                } else if (query) {
                    setHeroMovie(null);
                }
            } else {
                setMovies(prev => [...prev, ...response.data]);
            }

            setHasMore(response.data.length > 0);
        } catch (error) {
            console.error('Failed to fetch movies', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const debouncedSearch = debounce((query: string) => {
        setPage(1);
        fetchMovies(query, 1);
    }, 500);

    useEffect(() => {
        fetchMovies('', 1);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    const handleLoadMore = () => {
        if (loadingMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchMovies(searchQuery, nextPage);
    };

    // Derived backdrop for Hero (using poster if backdrop isn't available from OMDB realistically, OMDB doesn't have good backdrops, but we can style the poster)
    const heroImage = heroMovie?.poster_path && heroMovie.poster_path.startsWith('http')
        ? heroMovie.poster_path
        : 'https://via.placeholder.com/1920x1080/111111/444444?text=Welcome+to+CineMatch';

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Cinematic Hero Section */}
            {!searchQuery && heroMovie && (
                <div className="relative h-[80vh] w-full mb-10 overflow-hidden">
                    <div className="absolute inset-0">
                        <img 
                            src={heroImage} 
                            alt={heroMovie.title} 
                            className="w-full h-full object-cover opacity-60 scale-105"
                            style={{ filter: 'blur(10px) brightness(0.6)' }}
                        />
                        {/* Gradient overlays to blend into the background */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-black/60"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent"></div>
                    </div>

                    <div className="relative h-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="max-w-2xl pt-24"
                        >
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 outfit drop-shadow-2xl tracking-tight">
                                {heroMovie.title}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-300 mb-8 line-clamp-3 font-medium drop-shadow-md">
                                {heroMovie.overview || "Explore this trending title on CineMatch today."}
                            </p>
                            <div className="flex flex-wrap items-center gap-4">
                                <Link to={`/movie/${heroMovie.id}`} className="px-8 py-3 bg-white text-black rounded font-bold flex items-center gap-2 hover:bg-white/80 transition-colors">
                                    <Info className="w-6 h-6 fill-transparent" />
                                    <span>More Info</span>
                                </Link>
                                <button className="px-8 py-3 bg-gray-500/50 backdrop-blur-md text-white rounded font-bold flex items-center gap-2 hover:bg-gray-500/70 transition-colors">
                                    <Plus className="w-6 h-6" />
                                    <span>My List</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-20">
                <header className={`mb-12 ${searchQuery || !heroMovie ? 'pt-32 text-center' : '-mt-8 relative z-20'}`}>
                    {/* Only show welcome text if searching or no hero */}
                    {(searchQuery || !heroMovie) && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
                            <h1 className="text-4xl md:text-5xl font-black mb-4 outfit text-white">
                                Discover Your Next Favorite
                            </h1>
                        </motion.div>
                    )}

                    <div className={`relative max-w-2xl ${searchQuery || !heroMovie ? 'mx-auto' : 'mr-auto'} group`}>
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white w-6 h-6 transition-colors" />
                        <input
                            type="text"
                            placeholder="Titles, people, genres..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full bg-[#333]/60 border border-white/10 rounded-sm py-4 pl-14 pr-6 focus:outline-none focus:ring-1 focus:ring-white transition-all text-white placeholder-gray-400 text-lg backdrop-blur-md shadow-2xl"
                        />
                    </div>
                </header>

                {isAuthenticated && !searchQuery && (
                    <div className="mb-14">
                        <RecommendationSection type="user" title="Top Picks for You" />
                    </div>
                )}

                <section className="pb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold outfit text-gray-200">
                            {searchQuery ? `Exploring "${searchQuery}"` : 'Trending Now'}
                        </h2>
                    </div>
                    
                    {/* Render movies starting from the 2nd one if hero is active and no search */}
                    <MovieGrid 
                        movies={(!searchQuery && heroMovie) ? movies.slice(1) : movies} 
                        loading={loading && page === 1} 
                    />

                    {hasMore && movies.length > 0 && (
                        <div className="flex flex-col items-center justify-center mt-16 gap-4">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="group relative px-10 py-3 bg-transparent border border-white/30 rounded font-semibold text-white overflow-hidden transition-all hover:border-white hover:bg-white/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {loadingMore ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        'Load More'
                                    )}
                                </span>
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default HomePage;
