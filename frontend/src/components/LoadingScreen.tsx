import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#141414]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex flex-col items-center"
      >
        {/* Cinematic Logo Animation */}
        <motion.div 
          animate={{ 
            boxShadow: [
              "0 0 20px rgba(229, 9, 20, 0.2)",
              "0 0 50px rgba(229, 9, 20, 0.4)", 
              "0 0 20px rgba(229, 9, 20, 0.2)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8 flex h-24 w-24 items-center justify-center rounded-xl bg-gradient-to-br from-[#E50914] to-[#b81d24]"
        >
          <span className="text-5xl font-black text-white italic tracking-tighter">C</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl font-black tracking-[0.2em] text-white uppercase font-outfit"
        >
          CINEMATCH
        </motion.h1>
        
        <motion.div 
          className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-white/10"
        >
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }}
            className="h-full w-full bg-gradient-to-r from-transparent via-[#E50914] to-transparent"
          />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-4 text-xs font-medium tracking-widest text-[#b3b3b3] uppercase"
        >
          Initializing Experience
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
