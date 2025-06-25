import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from '../Loader/Loader';

const MindsetArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/v1/articles', {
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

        // Filter only mindset articles
        const mindsetArticles = articleData.filter(article => 
          article.title.includes('[MINDSET]')
        );
        setArticles(mindsetArticles);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col items-start gap-4 mb-12">
        <div className="flex items-center mt-20 gap-3">
          <span className="text-5xl filter drop-shadow-md">🧠</span>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Mindset Articles
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl">
          Discover strategies for mental strength, focus, and psychological well-being.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <div 
            key={article.id} 
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 border border-gray-100 hover:border-orange-100 flex flex-col"
          >
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center gap-2 text-orange-600 text-sm font-semibold mb-4 bg-orange-50 w-fit px-3 py-1.5 rounded-full">
                <span className="text-lg">🧠</span>
                <span>MINDSET</span>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                {article.title.replace(/\[[^\]]*\]\s*/, '')}
              </h2>

              <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                {truncateContent(article.content)}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-500">{formatDate(article.createdAt)}</span>
                </div>
                <Link 
                  to={`/article/${article.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-orange-600 hover:text-orange-700 transition-colors duration-300 group-hover:bg-orange-50"
                >
                  Read More
                  <svg 
                    className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center mt-12 py-12 bg-gray-50 rounded-2xl">
          <span className="text-4xl mb-4 block">🎯</span>
          <p className="text-gray-500 text-lg">No mindset articles found. Please check back later.</p>
        </div>
      )}
    </div>
  );
};

export default MindsetArticles; 