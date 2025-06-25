import React from 'react';
import { Link } from 'react-router-dom';
import nutrition from '../../assets/images/nutrition.jpg';
import movement from '../../assets/images/movement.jpg';
import recovery from '../../assets/images/recovery.jpg';
import mindset from '../../assets/images/mindset.webp';

const Articles = () => {
  const categories = [
    {
      title: 'Nutrition',
      description: 'Discover articles about healthy eating, diet tips, and nutritional guidance.',
      path: '/Articles/nutrition',
      icon: '🥗',
      photo: nutrition,
      color: 'text-green-600',
      overlay: 'from-green-500/50 to-green-900/50'
    },
    {
      title: 'Movement',
      description: 'Learn about exercise techniques, workout plans, and proper form.',
      path: '/Articles/movement',
      icon: '💪',
      photo: movement,
      color: 'text-blue-600',
      overlay: 'from-blue-500/50 to-blue-900/50'
    },
    {
      title: 'Recovery',
      description: 'Explore rest, rehabilitation, and recovery strategies for optimal performance.',
      path: '/Articles/recovery',
      icon: '🧘‍♀️',
      photo: recovery,
      color: 'text-purple-600',
      overlay: 'from-purple-500/50 to-purple-900/50'
    },
    {
      title: 'Mindset',
      description: 'Build mental strength, motivation, and positive habits for success.',
      path: '/Articles/mindset',
      icon: '🧠',
      photo: mindset,
      color: 'text-orange-600',
      overlay: 'from-orange-500/50 to-orange-900/50'
    }
  ];

  return (
    <div className="min-h-screen pt-30 bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Fitness Knowledge Hub
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive collection of fitness articles across four key areas of wellness and personal development.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.title}
              to={category.path}
              className="group bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={category.photo} 
                  alt={`${category.title} category`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-b ${category.overlay} opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{category.icon}</span>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {category.title}
                  </h2>
                  <svg 
                    className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-2 transition-all duration-300 ml-auto" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {category.description}
                </p>
                <div className={`mt-6 inline-flex items-center text-sm font-semibold ${category.color} group-hover:underline`}>
                  View Articles
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Articles;

