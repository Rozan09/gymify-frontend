import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Loader/Loader';

const ArticleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [suggestedArticles, setSuggestedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [articleResponse, allArticlesResponse] = await Promise.all([
          axios.get(`http://localhost:3000/api/v1/articles/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:3000/api/v1/articles', {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        const currentArticle = articleResponse.data.data || articleResponse.data;
        setArticle(currentArticle);

        // Get all articles and filter for suggestions
        let allArticles = allArticlesResponse.data.data || allArticlesResponse.data;
        
        // Get the category of current article
        const currentCategory = currentArticle.title.match(/\[(.*?)\]/)?.[1];
        
        // Filter articles by same category and exclude current article
        const sameCategory = allArticles.filter(a => 
          a.id !== currentArticle.id && 
          a.title.includes(`[${currentCategory}]`)
        );

        // Sort by date and take latest 3
        const latest = sameCategory
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);

        setSuggestedArticles(latest);
      } catch (err) {
        if (!localStorage.getItem('token')) {
          setError('Please log in to view this article');
        } else if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to view this article');
        } else if (err.response?.status === 404) {
          setError('Article not found');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch article');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getArticleCategory = (title) => {
    if (title.includes('[NUTRITION]')) return { name: 'NUTRITION', emoji: '🥗', color: 'green' };
    if (title.includes('[MOVEMENT]')) return { name: 'MOVEMENT', emoji: '💪', color: 'blue' };
    if (title.includes('[RECOVERY]')) return { name: 'RECOVERY', emoji: '🧘‍♀️', color: 'purple' };
    if (title.includes('[MINDSET]')) return { name: 'MINDSET', emoji: '🧠', color: 'orange' };
    return { name: 'GENERAL', emoji: '📝', color: 'gray' };
  };

  const getCategoryStyles = (color) => {
    const styles = {
      green: {
        badge: 'bg-green-50 text-green-600',
        title: 'from-green-600 to-green-400',
        border: 'border-green-100',
        button: 'bg-green-50 text-green-600 hover:bg-green-100'
      },
      blue: {
        badge: 'bg-blue-50 text-blue-600',
        title: 'from-blue-600 to-blue-400',
        border: 'border-blue-100',
        button: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
      },
      purple: {
        badge: 'bg-purple-50 text-purple-600',
        title: 'from-purple-600 to-purple-400',
        border: 'border-purple-100',
        button: 'bg-purple-50 text-purple-600 hover:bg-purple-100'
      },
      orange: {
        badge: 'bg-orange-50 text-orange-600',
        title: 'from-orange-600 to-orange-400',
        border: 'border-orange-100',
        button: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
      },
      gray: {
        badge: 'bg-gray-50 text-gray-600',
        title: 'from-gray-600 to-gray-400',
        border: 'border-gray-100',
        button: 'bg-gray-50 text-gray-600 hover:bg-gray-100'
      }
    };
    return styles[color];
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h2 className="text-xl font-semibold text-red-600 mb-2">{error}</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Article not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const category = getArticleCategory(article.title);
  const styles = getCategoryStyles(category.color);

  return (
    <div className="max-w-4xl pt-30 mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Articles
      </button>

      {/* Article Content */}
      <article className={`bg-white rounded-2xl shadow-sm border ${styles.border} overflow-hidden`}>
        <div className="p-8">
          {/* Category Badge */}
          <div className={`inline-flex items-center gap-2 ${styles.badge} text-sm font-semibold px-3 py-1.5 rounded-full mb-6`}>
            <span className="text-lg">{category.emoji}</span>
            <span>{category.name}</span>
          </div>

          {/* Title */}
          <h1 className={`text-4xl font-bold bg-gradient-to-r ${styles.title} bg-clip-text text-transparent mb-6`}>
            {article.title.replace(/\[[^\]]*\]\s*/, '')}
          </h1>

          {/* Metadata */}
          <div className="flex items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(article.createdAt)}</span>
            </div>
            {article.Admin?.User?.name && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{article.Admin.User.name}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {article.content}
            </p>
          </div>

          {/* Author Info */}
          {article.Admin?.User?.email && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">About the Author</h3>
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{article.Admin.User.name}</h4>
                  <p className="text-gray-500">{article.Admin.User.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Suggested Articles */}
      {suggestedArticles.length > 0 && (
        <div className="mt-24 relative">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white -z-10 rounded-3xl"></div>
          
          {/* Section header with decorative elements */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">More Articles Like This</h2>
            <p className="text-gray-500">Discover more content in the same category</p>
          </div>

          {/* Articles grid with enhanced styling */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-8">
            {suggestedArticles.map((suggested, index) => {
              const suggestedCategory = getArticleCategory(suggested.title);
              const suggestedStyles = getCategoryStyles(suggestedCategory.color);
              
              return (
                <Link
                  key={suggested.id}
                  to={`/article/${suggested.id}`}
                  className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transform hover:-translate-y-1 overflow-hidden transition-all duration-300 border border-gray-100 hover:border-gray-200`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <div className="p-8">
                    {/* Category badge with enhanced styling */}
                    <div className={`inline-flex items-center gap-2 ${suggestedStyles.badge} text-sm font-semibold px-4 py-2 rounded-full mb-6 transform transition-transform duration-300 group-hover:scale-105`}>
                      <span className="text-xl">{suggestedCategory.emoji}</span>
                      <span>{suggestedCategory.name}</span>
                    </div>

                    {/* Article title with gradient effect on hover */}
                    <h3 className={`text-xl font-bold mb-4 bg-gradient-to-r ${suggestedStyles.title} bg-clip-text group-hover:text-transparent transition-all duration-300`}>
                      {suggested.title.replace(/\[[^\]]*\]\s*/, '')}
                    </h3>

                    {/* Content preview with better typography */}
                    <p className="text-gray-600 text-base mb-6 line-clamp-3 leading-relaxed">
                      {truncateContent(suggested.content, 180)}
                    </p>

                    {/* Footer with metadata and read more button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(suggested.createdAt)}</span>
                      </div>
                      
                      <div className={`${suggestedStyles.button} px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                        Read More →
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Add keyframe animation styles */}
      <style jsx="true">{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ArticleDetails;
