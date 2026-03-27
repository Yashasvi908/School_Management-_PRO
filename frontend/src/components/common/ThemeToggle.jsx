import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 bg-card-base border border-border-base rounded-2xl text-text-dim hover:text-text-main hover:border-primary/30 transition-all group overflow-hidden"
      aria-label="Toggle Theme"
    >
      <motion.div
        animate={{
          y: theme === 'dark' ? 0 : 40,
          opacity: theme === 'dark' ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'backOut' }}
        className="flex items-center justify-center"
      >
        <Moon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{
          y: theme === 'light' ? -20 : 20,
          opacity: theme === 'light' ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'backOut' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform text-orange-400" />
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
