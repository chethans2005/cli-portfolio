import { AnimatePresence, motion as Motion } from 'framer-motion';
import { createPortal } from 'react-dom';

function AboutWindow({ profile }) {
  return (
    <div className="space-y-3 text-sm text-white/90">
      <div>
        <p className="text-white font-semibold">{profile.name}</p>
        <p className="text-cyan-200/90">{profile.title}</p>
      </div>
      <p className="leading-relaxed">{profile.bio}</p>
      <div>
        <p className="font-semibold text-white">Interests</p>
        <p className="text-cyan-100/80">{(profile.interests || []).join(' | ')}</p>
      </div>
    </div>
  );
}

function ContactWindow({ profile }) {
  return (
    <div className="space-y-3 text-sm text-white/90">
      <p>
        GitHub:{' '}
        <a
          className="text-cyan-300 hover:text-cyan-200 underline"
          href={profile.github}
          target="_blank"
          rel="noreferrer"
        >
          {profile.github}
        </a>
      </p>
      <p>
        LinkedIn:{' '}
        <a
          className="text-cyan-300 hover:text-cyan-200 underline"
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
        >
          {profile.linkedin}
        </a>
      </p>
      <p>
        Email:{' '}
        <a className="text-cyan-300 hover:text-cyan-200 underline" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      </p>
    </div>
  );
}

function SkillsWindow({ skills }) {
  return (
    <div className="space-y-4 text-sm text-white/90">
      {(skills.bars || []).map((skill, index) => (
        <div key={skill.name} className="space-y-1">
          <div className="flex justify-between">
            <span>{skill.name}</span>
            <span>{skill.value}%</span>
          </div>
          <div className="h-2 rounded bg-white/10 overflow-hidden">
            <Motion.div
              className="h-full rounded bg-gradient-to-r from-cyan-400 to-emerald-400"
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
  return createPortal((
    <AnimatePresence>
      {activeWindow && (
        <Motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Motion.div
            className="w-full max-w-lg rounded-xl border border-cyan-300/20 bg-black/55 backdrop-blur-xl shadow-2xl pointer-events-auto"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            drag
            dragMomentum={false}
            dragElastic={0.1}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-300/20 bg-black/35">
              <h2 className="text-cyan-200 font-semibold tracking-wide uppercase text-xs">{activeWindow}</h2>
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                x
              </button>
            </div>

            <div className="p-4">
              {activeWindow === 'about' && <AboutWindow profile={profile} />}
              {activeWindow === 'contact' && <ContactWindow profile={profile} />}
              {activeWindow === 'skills' && <SkillsWindow skills={skills} />}
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  ), document.body);
}
