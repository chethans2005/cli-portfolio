import { motion } from 'framer-motion';
import Terminal from './Terminal';

export default function TerminalWindow() {
  const MotionDiv = motion.div;
  
  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-5xl h-[600px] mx-auto"
    >
      {/* Terminal Window */}
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-terminal-cyan/30"
           style={{
             background: 'rgba(10, 14, 20, 0.85)',
             backdropFilter: 'blur(10px)',
             boxShadow: '0 0 40px rgba(0, 255, 65, 0.15), 0 0 80px rgba(0, 255, 255, 0.1)',
           }}>
        
        {/* Window Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-terminal-cyan/20"
             style={{ background: 'rgba(0, 0, 0, 0.4)' }}>
          
          {/* macOS-style buttons */}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer transition-colors" 
                 title="Close" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer transition-colors" 
                 title="Minimize" />
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer transition-colors" 
                 title="Maximize" />
          </div>

          {/* Window Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
            <span className="text-terminal-cyan font-mono text-sm font-semibold tracking-wider">
              neko.OS
            </span>
            <div className="w-2 h-2 rounded-full bg-terminal-text animate-pulse" />
          </div>

          {/* Empty space for balance */}
          <div className="w-20"></div>
        </div>

        {/* Terminal Content */}
        <div className="w-full h-[calc(100%-49px)]">
          <Terminal />
        </div>

        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-terminal-text/20 via-terminal-cyan/20 to-terminal-purple/20 rounded-xl blur-sm -z-10 opacity-50" />
      </div>
    </MotionDiv>
  );
}
