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
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-[#2b6a2b]/65 p-3"
           style={{
             background: 'rgba(4, 12, 4, 0.9)',
             backdropFilter: 'blur(12px)',
             boxShadow: '0 0 40px rgba(75, 255, 114, 0.18), 0 0 80px rgba(56, 189, 248, 0.12), 0 0 110px rgba(245, 158, 11, 0.08)',
           }}>
        
        {/* Window Header */}
           <div className="relative flex items-center justify-between px-4 py-3 border-b border-[#1f3d1f]"
             style={{ background: 'linear-gradient(90deg, rgba(0, 22, 0, 0.68), rgba(7, 27, 15, 0.7), rgba(8, 20, 30, 0.42))' }}>
          
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
          <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center space-x-2">
            
            <div className="h-2 w-2 rounded-full bg-[#4bff72] animate-pulse shadow-[0_0_10px_rgba(75,255,114,0.8)]" />
          </div>
          <span className="font-mono text-sm font-bold tracking-[0.18em] text-[#b7ff7c]">
          neko.OS
              
            </span>
          <div className="w-20" aria-hidden="true" />
        </div>

        {/* Terminal Content */}
        <div className="w-full h-[calc(100%-49px)] p-3">
          <div className="w-full h-full rounded-lg border border-[#1f3d1f] bg-[radial-gradient(120%_140%_at_0%_0%,rgba(18,66,28,0.25),rgba(0,8,0,0.7))]">
            <Terminal onOpenWindow={onOpenWindow} />
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2f6f2f]/35 via-[#4bff72]/25 to-[#38bdf8]/30 rounded-xl blur-sm -z-10 opacity-60" />
      </div>
    </MotionDiv>
  );
}
