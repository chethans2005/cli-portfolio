import { useEffect, useRef } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import HologramProfile from './HologramProfile';

function ContactWindow({ profile }) {
  return (
    <div className="space-y-4 font-mono text-sm text-[#7abf7a]">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#67e8f9]">Communication Channels</p>
      <div className="space-y-2 rounded border border-[#1a2f1a] bg-[rgba(0,18,0,0.55)] p-3">
        <p>
          <span className="mr-2 text-[#93c5fd]">EMAIL //</span>
          <a className="break-all text-[#a8ff78] underline decoration-[#2d5a2d] underline-offset-2 hover:text-[#c8ffb0]" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </p>
        <p>
          <span className="mr-2 text-[#fcd34d]">GITHUB //</span>
          <a
            className="break-all text-[#a8ff78] underline decoration-[#2d5a2d] underline-offset-2 hover:text-[#c8ffb0]"
            href={profile.github}
            target="_blank"
            rel="noreferrer"
          >
            {profile.github}
          </a>
        </p>
        <p>
          <span className="mr-2 text-[#c084fc]">LINKEDIN //</span>
          <a
            className="break-all text-[#a8ff78] underline decoration-[#2d5a2d] underline-offset-2 hover:text-[#c8ffb0]"
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            {profile.linkedin}
          </a>
        </p>
      </div>
    </div>
  );
}

function SkillsWindow({ skills }) {
  return (
    <div className="space-y-4 font-mono text-sm text-[#7abf7a]">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#67e8f9]">Skill Matrix</p>
      {(skills.bars || []).map((skill, index) => (
        <div key={skill.name} className="space-y-1.5">
          <div className="flex justify-between text-[#6aaa6a]">
            <span>{skill.name.toUpperCase()}</span>
            <span className="text-[#fcd34d]">{skill.value}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-sm border border-[#1a2f1a] bg-[#0d1a0d]">
            <Motion.div
              className="h-full bg-gradient-to-r from-[#4bff72] via-[#67e8f9] to-[#4bff72] shadow-[0_0_10px_rgba(75,255,114,0.45)]"
              initial={{ width: 0 }}
              animate={{ width: `${skill.value}%` }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WindowManager({ activeWindow, onClose, profile, skills }) {
  const isAboutOpen = activeWindow === 'about';
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!activeWindow) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [activeWindow, onClose]);

  return createPortal(
    <AnimatePresence>
      {activeWindow && (
        <Motion.div
          ref={overlayRef}
          className={`fixed inset-0 z-[9999] ${isAboutOpen ? 'bg-black/30 backdrop-blur-md' : 'bg-black/35'}`}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: isAboutOpen ? 'rgba(0, 0, 0, 0.30)' : 'rgba(0, 0, 0, 0.35)',
            backdropFilter: isAboutOpen ? 'blur(14px)' : 'none',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          {activeWindow === 'about' ? (
            <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4 lg:p-6">
              <Motion.div
                className="relative z-20 mx-auto max-h-[90vh] w-[min(94vw,72rem)] overflow-y-auto"
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                drag
                dragConstraints={overlayRef}
                dragMomentum={false}
                dragElastic={0.08}
                onMouseDown={(event) => event.stopPropagation()}
              >
                <HologramProfile profile={profile} onClose={onClose} />
              </Motion.div>
            </div>
          ) : (
            <div className="absolute inset-0 grid place-items-center p-4">
              <Motion.div
                className="relative z-10 w-full max-w-lg overflow-hidden rounded-lg border border-[#1a2a1a] bg-[rgba(0,0,0,0.82)] text-[#a8ff78] shadow-[0_0_24px_rgba(75,255,114,0.12),0_0_40px_rgba(56,189,248,0.08)]"
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
                drag
                dragConstraints={overlayRef}
                dragMomentum={false}
                dragElastic={0.08}
                onMouseDown={(event) => event.stopPropagation()}
              >
                <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,0,0,0.2)_3px,rgba(0,0,0,0.2)_4px)] opacity-60" />

                <div className="relative z-10 flex items-center justify-between border-b border-[#1f3d1f] bg-[linear-gradient(90deg,rgba(0,30,0,0.65),rgba(3,24,35,0.45),rgba(35,24,3,0.28))] px-4 py-3 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#ff4f4f] shadow-[0_0_6px_#ff4f4f]" />
                    <span className="h-2 w-2 rounded-full bg-[#f5c518] shadow-[0_0_6px_#f5c518]" />
                    <span className="h-2 w-2 rounded-full bg-[#4bff72] shadow-[0_0_6px_#4bff72]" />
                    <h2 className="ml-2 text-[11px] uppercase tracking-[0.2em] text-[#67e8f9]">sys://{activeWindow}.module</h2>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="grid h-7 w-7 place-items-center rounded-full border border-[#3a1a1a] bg-[#3a1a1a]/70 text-[#ff6b6b] transition hover:bg-[#4a1f1f] hover:text-[#ff8b8b]"
                    aria-label="Close window"
                  >
                    x
                  </button>
                </div>

                <div className="relative z-10 p-4">
                  {activeWindow === 'contact' && <ContactWindow profile={profile} />}
                  {activeWindow === 'skills' && <SkillsWindow skills={skills} />}
                </div>
              </Motion.div>
            </div>
          )}
        </Motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
