import React, { useState, useEffect } from 'react';
import { useTheme } from '../providers/ThemeProvider';

export default function AnimatedTypingTitle() {
  const { theme } = useTheme();
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Typing AI';
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseDuration = 2000;

    const timer = setTimeout(() => {
      if (!isDeleting && index < fullText.length) {
        // Typing
        setDisplayText(fullText.substring(0, index + 1));
        setIndex(index + 1);
      } else if (isDeleting && index > 0) {
        // Deleting
        setDisplayText(fullText.substring(0, index - 1));
        setIndex(index - 1);
      } else if (index === fullText.length) {
        // Pause before deleting
        setTimeout(() => setIsDeleting(true), pauseDuration);
      } else if (index === 0 && isDeleting) {
        // Start typing again
        setIsDeleting(false);
      }
    }, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timer);
  }, [index, isDeleting]);

  return (
    <div className="relative inline-block">
      <h2 className={`text-6xl font-black tracking-wider ${
        theme === 'dark' ? 'text-cyan-300' : 'text-sky-600'
      }`}>
        {displayText}
        <span className={`animate-pulse ml-1 ${
          theme === 'dark' ? 'text-cyan-400' : 'text-sky-500'
        }`}>
          |
        </span>
      </h2>
      
      {/* Glow effect */}
      <div className={`absolute inset-0 blur-lg opacity-50 -z-10 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-400/20' 
          : 'bg-gradient-to-r from-sky-400/30 to-emerald-300/30'
      }`}></div>
    </div>
  );
}
