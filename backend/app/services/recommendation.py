import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.models import models

class Recommender:
    async def get_content_recommendations(self, movie_id: str, n=10):
        all_movies = await models.Movie.all()
        if not all_movies:
            return []
        
        df = pd.DataFrame([{
            'id': m.id,
            'title': m.title,
            'overview': m.overview if m.overview else ""
        } for m in all_movies])
        
        # Filter out movies with empty overview
        df = df[df['overview'] != ""]
        
        if movie_id not in df['id'].values or len(df) < 2:
            return []
        
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(df['overview'])
        
        cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
        
        try:
            idx = df.index[df['id'] == movie_id].tolist()[0]
            sim_scores = list(enumerate(cosine_sim[idx]))
            sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
            sim_scores = sim_scores[1:n+1]
            
            movie_indices = [i[0] for i in sim_scores]
            return df.iloc[movie_indices]['id'].tolist()
        except Exception:
            return []

    async def get_collaborative_recommendations(self, user_id: int, n=10):
        user_likes = await models.Like.filter(user_id=user_id).values_list("movie_id", flat=True)
        
        if not user_likes:
            return []
        
        # Try collaborative first
        other_user_likes = await models.Like.filter(
            movie_id__in=user_likes,
            user_id__not=user_id
        ).values_list("user_id", flat=True)
        
        if other_user_likes:
            recommended_movies = await models.Like.filter(
                user_id__in=other_user_likes,
                movie_id__not_in=user_likes
            ).values_list("movie_id", flat=True)
            
            if recommended_movies:
                movie_counts = {}
                for m_id in recommended_movies:
                    movie_counts[m_id] = movie_counts.get(m_id, 0) + 1
                    
                sorted_recommendations = sorted(movie_counts.items(), key=lambda x: x[1], reverse=True)
                return [m[0] for m in sorted_recommendations[:n]]
        
        # Fallback: Content-based filtering from the movies the user liked
        # This solves the "cold start" problem for new systems
        fallback_recommendations = []
        for movie_id in user_likes[:3]: # Take last 3 liked movies to find similar ones
            rec_ids = await self.get_content_recommendations(movie_id, n=n)
            fallback_recommendations.extend(rec_ids)
            
        # Remove duplicates and already liked movies
        unique_recs = []
        for r_id in fallback_recommendations:
            if r_id not in user_likes and r_id not in unique_recs:
                unique_recs.append(r_id)
                
        return unique_recs[:n]

recommender = Recommender()
