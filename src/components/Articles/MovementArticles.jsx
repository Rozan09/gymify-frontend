import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from '../Loader/Loader';

const MovementArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/v1/Articles', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        let articleData = [];
        if (response.data && Array.isArray(response.data.data)) {
          articleData = response.data.data;
        } else if (response.data && Array.isArray(response.data)) {
          articleData = response.data;
        }

        // Filter only movement articles
        const movementArticles = articleData.filter(article => 
          article.title.includes('[MOVEMENT]')
        );
        setArticles(movementArticles);
      } catch (err) {
        if (!localStorage.getItem('token')) {
          setError('Please log in to view articles');
        } else if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to view articles');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch articles');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <Loader/>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 mt-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mt-20 gap-3 mb-8">
        <span className="text-4xl">💪</span>
        <h1 className="text-3xl font-bold text-gray-800">Movement Articles</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold mb-3">
                <span className="text-xl">💪</span>
                <span>MOVEMENT</span>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                {article.title.replace(/\[[^\]]*\]\s*/, '')}
              </h2>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {truncateContent(article.content)}
              </p>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="text-sm text-gray-500">
                  <span>{formatDate(article.createdAt)}</span>
                </div>
                <Link 
                  to={`/article/${article.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors duration-300"
                >
                  Read More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-500">No movement articles found. Please check back later.</p>
        </div>
      )}
    </div>
  );
};

export default MovementArticles; 