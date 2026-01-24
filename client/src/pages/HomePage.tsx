import React, { useState, useEffect } from 'react';
import { useTheme } from '../providers/ThemeProvider';

export default function HomePage() {
  const { theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      id: 1,
      icon: '⚡',
      title: 'AI-Generated Topics',
      description: 'Get custom typing exercises generated for any topic',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      icon: '📊',
      title: 'Real-time Statistics',
      description: 'Track your WPM, accuracy, and improvement over time',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      icon: '🏁',
      title: 'Competitive Racing',
      description: 'Race against other players in real-time multiplayer',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { value: '1M+', label: 'Users', icon: '👥' },
    { value: '10B+', label: 'Words Typed', icon: '⌨️' },
    { value: '50+', label: 'Languages', icon: '🌍' }
  ];

  return (
    <div className="overflow-hidden">
      {/* Animated blob shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob ${
          theme === 'dark' ? 'bg-blue-500' : 'bg-blue-400'
        }`} />
        <div className={`absolute top-40 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 ${
          theme === 'dark' ? 'bg-purple-500' : 'bg-purple-400'
        }`} />
        <div className={`absolute -bottom-8 left-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 ${
          theme === 'dark' ? 'bg-pink-500' : 'bg-pink-400'
        }`} />
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 pt-0">
        {/* Animated blob shapes overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob ${
            theme === 'dark' ? 'bg-blue-500' : 'bg-blue-400'
          }`} />
          <div className={`absolute top-40 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 ${
            theme === 'dark' ? 'bg-purple-500' : 'bg-purple-400'
          }`} />
          <div className={`absolute -bottom-8 left-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 ${
            theme === 'dark' ? 'bg-pink-500' : 'bg-pink-400'
          }`} />
        </div>

        {/* Hero Content */}
        <div className="relative text-center max-w-4xl mx-auto z-10 py-20">
          <div className="mb-8 animate-bounce" style={{ animationDuration: '3s' }}>
            <span className="text-7xl">⌨️</span>
          </div>
          
          <h1 className={`text-6xl md:text-7xl font-black mb-6 animate-fade-in ${
            theme === 'dark'
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
          }`}>
            Master Typing
            <br />
            at Lightning Speed
          </h1>

          <p className={`text-xl md:text-2xl mb-8 font-light animate-fade-in ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`} style={{ animationDelay: '0.2s' }}>
            Powered by AI • Real-time Multiplayer • Instant Feedback
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300">
              Start Typing
            </button>
            <button className={`px-8 py-4 font-bold rounded-lg border-2 transition-all duration-300 ${
              theme === 'dark'
                ? 'border-purple-400 text-purple-400 hover:bg-purple-400/10'
                : 'border-purple-600 text-purple-600 hover:bg-purple-50'
            }`}>
              Watch Demo
            </button>
          </div>
        </div>

        {/* Animated keyboard illustration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent to-transparent opacity-50" />
      </div>

      {/* Stats Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`relative group cursor-pointer`}
              style={{ animation: `slideUp 0.8s ease-out ${idx * 0.2}s both` }}
            >
              <div className={`absolute inset-0 rounded-2xl transition-all duration-300 group-hover:blur-xl ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/40 group-hover:to-purple-500/40'
                  : 'bg-gradient-to-r from-blue-400/20 to-purple-400/20 group-hover:from-blue-400/40 group-hover:to-purple-400/40'
              }`} />
              <div className={`relative p-8 rounded-2xl text-center backdrop-blur-sm transform transition-transform duration-300 group-hover:scale-105 ${
                theme === 'dark' ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/50 border border-white/20'
              }`}>
                <div className="text-5xl mb-2">{stat.icon}</div>
                <div className="text-4xl font-black bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-black mb-4 ${
              theme === 'dark'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'
            }`}>
              Powerful Features
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Everything you need to become a typing master
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={feature.id}
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative cursor-pointer"
                style={{ animation: `slideUp 0.8s ease-out ${idx * 0.15}s both` }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${feature.gradient}`} />
                
                {/* Card content */}
                <div className={`relative p-8 rounded-2xl backdrop-blur-md transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2 ${
                  theme === 'dark'
                    ? 'bg-gray-800/60 border border-gray-700 group-hover:border-gray-600'
                    : 'bg-white/60 border border-gray-200 group-hover:border-gray-300'
                }`}>
                  <div className="text-6xl mb-4 transform transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
                    {feature.icon}
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
                    hoveredCard === feature.id
                      ? 'text-white'
                      : theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`transition-colors duration-300 ${
                    hoveredCard === feature.id
                      ? 'text-gray-100'
                      : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`relative rounded-3xl p-12 text-center overflow-hidden group ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/20'
              : 'bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <div className="relative">
              <h3 className={`text-3xl md:text-4xl font-black mb-4 ${
                theme === 'dark'
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'
              }`}>
                Ready to Improve?
              </h3>
              <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Join thousands of users improving their typing skills every day
              </p>
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300">
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
