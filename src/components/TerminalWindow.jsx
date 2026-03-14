import { motion } from 'framer-motion';
import Terminal from './Terminal';

export default function TerminalWindow({ onOpenWindow }) {
  const MotionDiv = motion.div;
  
  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-2/3 min-w-[24rem] h-[30rem] sm:h-[33rem] mx-auto"
    >
      {/* Terminal Window */}
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-cyan-200/30 p-3"
           style={{
             background: 'rgba(6, 11, 20, 0.88)',
             backdropFilter: 'blur(12px)',
             boxShadow: '0 0 40px rgba(56, 189, 248, 0.14), 0 0 80px rgba(14, 165, 233, 0.12)',
           }}>
        
        {/* Window Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-200/20"
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
            <div className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
          </div>

          {/* Empty space for balance */}
          <div className="w-20" aria-hidden="true" />
        </div>

        {/* Terminal Content */}
        <div className="w-full h-[calc(100%-49px)] p-3">
          <div className="w-full h-full rounded-lg border border-cyan-200/20 bg-black/35">
            <Terminal onOpenWindow={onOpenWindow} />
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-200/20 via-sky-300/20 to-blue-300/20 rounded-xl blur-sm -z-10 opacity-50" />
      </div>
    </MotionDiv>
  );
}
