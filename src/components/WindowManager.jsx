import { useEffect, useRef } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import HologramProfile from './HologramProfile';

/* ── shared styles injected once ───────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&display=swap');

  .wm-overlay {
    position: fixed; inset: 0; z-index: 9999;
    display: grid; place-items: center; padding: 16px;
  }
  .wm-overlay-about {
    background: rgba(0,0,0,0.30);
    backdrop-filter: blur(14px);
  }
  .wm-overlay-panel {
    background: rgba(0,0,0,0.35);
  }

  .wm-panel {
    font-family: 'Share Tech Mono', monospace;
    background: #000;
    color: #a8ff78;
    width: 100%;
    max-width: 480px;
    position: relative;
    overflow: hidden;
    border: 1px solid #1a2a1a;
    box-sizing: border-box;
  }

  /* scanlines */
  .wm-scanlines {
    position: absolute; inset: 0; pointer-events: none; z-index: 20;
    background: repeating-linear-gradient(
      0deg,
      transparent, transparent 2px,
      rgba(0,0,0,0.22) 2px, rgba(0,0,0,0.22) 4px
    );
  }

  /* grid bg */
  .wm-grid {
    position: absolute; inset: 0; pointer-events: none; z-index: 1;
    background-image:
      linear-gradient(rgba(100,255,100,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(100,255,100,0.04) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  /* corner brackets */
  .wm-corner { position: absolute; width: 14px; height: 14px; border-color: #1f3d1f; border-style: solid; z-index: 12; }
  .wm-corner-tl { top: 4px; left: 4px;   border-width: 1px 0 0 1px; }
  .wm-corner-tr { top: 4px; right: 4px;  border-width: 1px 1px 0 0; }
  .wm-corner-bl { bottom: 4px; left: 4px;  border-width: 0 0 1px 1px; }
  .wm-corner-br { bottom: 4px; right: 4px; border-width: 0 1px 1px 0; }

  /* topbar */
  .wm-topbar {
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid #1f3d1f;
    padding: 9px 16px;
    background: rgba(0,20,0,0.6);
    position: relative; z-index: 10;
  }
  .wm-topbar-left { display: flex; align-items: center; gap: 8px; }
  .wm-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
  .wm-dot-r { background: #ff4f4f; box-shadow: 0 0 5px #ff4f4f; }
  .wm-dot-y { background: #f5c518; box-shadow: 0 0 5px #f5c518; }
  .wm-dot-g { background: #4bff72; box-shadow: 0 0 5px #4bff72; }
  .wm-title {
    margin-left: 8px;
    font-size: 11px; letter-spacing: .22em;
    color: #3a6b3a; text-transform: uppercase;
  }
  .wm-close-btn {
    background: transparent;
    border: 1px solid #3a1a1a;
    color: #8a3a3a;
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px; padding: 2px 9px; cursor: pointer;
    letter-spacing: .15em; transition: all .15s;
  }
  .wm-close-btn:hover { background: #3a1a1a; color: #ff6b6b; }

  /* body */
  .wm-body { position: relative; z-index: 10; padding: 18px 20px; }

  .wm-sec-label {
    font-size: 10px; letter-spacing: .28em; color: #2d5a2d;
    text-transform: uppercase; margin-bottom: 12px;
    display: flex; align-items: center; gap: 8px;
  }
  .wm-sec-label::after { content: ''; flex: 1; height: 1px; background: #162616; }

  /* ── Contact ── */
  .wm-contact-row {
    display: flex; align-items: flex-start; gap: 0;
    border-bottom: 1px dashed #162616;
    padding: 10px 0;
  }
  .wm-contact-row:first-child { border-top: 1px dashed #162616; }
  .wm-contact-key {
    font-size: 10px; letter-spacing: .18em; min-width: 96px;
    text-transform: uppercase; padding-top: 1px;
  }
  .wm-contact-val {
    font-size: 12px; color: #a8ff78; word-break: break-all;
    text-decoration: none; transition: color .15s;
  }
  .wm-contact-val:hover { color: #c8ffb0; }
  .wm-contact-arrow { font-size: 10px; color: #1f3d1f; margin-right: 8px; flex-shrink: 0; padding-top: 2px; }

  /* ── Skills ── */
  .wm-skill-row { margin-bottom: 12px; }
  .wm-skill-header {
    display: flex; justify-content: space-between;
    font-size: 11px; color: #6aaa6a; letter-spacing: .08em;
    margin-bottom: 5px;
  }
  .wm-skill-pct { color: #4bff72; font-size: 10px; }
  .wm-skill-bg {
    height: 5px; background: #0d1a0d;
    border: 1px solid #1a2f1a; overflow: hidden;
  }
  .wm-skill-fill {
    height: 100%;
    background: #4bff72;
    box-shadow: 0 0 8px rgba(75,255,114,.45);
  }

  /* status badge */
  .wm-status {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10px; letter-spacing: .15em; color: #4bff72;
    border: 1px solid #1f3d1f; padding: 2px 8px; margin-top: 14px;
  }
  .wm-pulse {
    width: 5px; height: 5px; border-radius: 50%;
    background: #4bff72; box-shadow: 0 0 6px #4bff72;
    animation: wm-pulse 2s ease-in-out infinite;
  }
  @keyframes wm-pulse {
    0%,100% { box-shadow: 0 0 4px #4bff72; opacity: 1; }
    50%      { box-shadow: 0 0 10px #4bff72; opacity: .55; }
  }

  .wm-footer {
    font-size: 10px; color: #1f3a1f; letter-spacing: .12em;
    border-top: 1px solid #162616; padding-top: 10px; margin-top: 14px;
    display: flex; justify-content: space-between;
  }
`;

function InjectStyles() {
  return <style dangerouslySetInnerHTML={{ __html: STYLES }} />;
}

/* ── Panel shell ──────────────────────────────────────── */
function Panel({ title, onClose, children, maxWidth }) {
  return (
    <div className="wm-panel" style={maxWidth ? { maxWidth } : {}}>
      <div className="wm-scanlines" />
      <div className="wm-grid" />
      <div className="wm-corner wm-corner-tl" />
      <div className="wm-corner wm-corner-tr" />
      <div className="wm-corner wm-corner-bl" />
      <div className="wm-corner wm-corner-br" />

      <div className="wm-topbar">
        <div className="wm-topbar-left">
          <span className="wm-dot wm-dot-r" />
          <span className="wm-dot wm-dot-y" />
          <span className="wm-dot wm-dot-g" />
          <span className="wm-title">sys://{title}.module</span>
        </div>
        <button className="wm-close-btn" type="button" onClick={onClose} aria-label="Close window">
          [ ESC ]
        </button>
      </div>

      <div className="wm-body">{children}</div>
    </div>
  );
}

/* ── glitch entrance / exit variants ─────────────────── */
const panelVariants = {
  initial: { opacity: 0, clipPath: 'inset(100% 0 0 0)', skewX: -2 },
  animate: { opacity: 1, clipPath: 'inset(0% 0 0 0)', skewX: 0 },
  exit:    { opacity: 0, clipPath: 'inset(0 0 100% 0)', skewX: 2 },
};
const panelTransition = { duration: 0.46, ease: 'easeOut' };

/* ── Contact window ───────────────────────────────────── */
function ContactWindow({ profile, onClose }) {
  const channels = [
    { key: 'EMAIL //',    color: '#93c5fd', href: `mailto:${profile.email}`,  label: profile.email },
    { key: 'GITHUB //',   color: '#fcd34d', href: profile.github,             label: profile.github },
    { key: 'LINKEDIN //', color: '#c084fc', href: profile.linkedin,           label: profile.linkedin },
  ].filter((c) => Boolean(c.label));

  return (
    <Panel title="contact" onClose={onClose}>
      <div className="wm-sec-label">// comm channels</div>
      {channels.map((c) => (
        <div className="wm-contact-row" key={c.key}>
          <span className="wm-contact-arrow">&gt;</span>
          <span className="wm-contact-key" style={{ color: c.color }}>{c.key}</span>
          <a className="wm-contact-val" href={c.href} target="_blank" rel="noreferrer">
            {c.label}
          </a>
        </div>
      ))}
      <div className="wm-status">
        <span className="wm-pulse" />
        CHANNELS ONLINE
      </div>
      <div className="wm-footer">
        <span>contact.v2 // cli-portfolio</span>
        <span>{channels.length} channels active</span>
      </div>
    </Panel>
  );
}

/* ── Skills window ────────────────────────────────────── */
function SkillsWindow({ skills, onClose }) {
  const bars = skills?.bars || [];
  return (
    <Panel title="skills" onClose={onClose}>
      <div className="wm-sec-label">// skill matrix</div>
      {bars.map((skill, i) => (
        <div className="wm-skill-row" key={skill.name}>
          <div className="wm-skill-header">
            <span>{skill.name.toUpperCase()}</span>
            <span className="wm-skill-pct">{skill.value}%</span>
          </div>
          <div className="wm-skill-bg">
            <Motion.div
              className="wm-skill-fill"
              initial={{ width: 0 }}
              animate={{ width: `${skill.value}%` }}
              transition={{ duration: 0.75, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      ))}
      <div className="wm-footer">
        <span>skills.v2 // cli-portfolio</span>
        <span>{bars.length} entries loaded</span>
      </div>
    </Panel>
  );
}

/* ── WindowManager ────────────────────────────────────── */
export default function WindowManager({ activeWindow, onClose, profile, skills }) {
  const isAbout = activeWindow === 'about';
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!activeWindow) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeWindow, onClose]);

  return createPortal(
    <>
      <InjectStyles />
      <AnimatePresence>
        {activeWindow && (
          <Motion.div
            ref={overlayRef}
            className={`wm-overlay ${isAbout ? 'wm-overlay-about' : 'wm-overlay-panel'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={onClose}
          >
            {isAbout ? (
              /* ── About: full HologramProfile ── */
              <Motion.div
                style={{
                  position: 'relative', zIndex: 20,
                  width: 'min(94vw, 72rem)',
                  maxHeight: '90vh', overflowY: 'auto',
                }}
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={panelTransition}
                drag
                dragConstraints={overlayRef}
                dragMomentum={false}
                dragElastic={0.08}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <HologramProfile profile={profile} onClose={onClose} />
              </Motion.div>
            ) : (
              /* ── Contact / Skills panels ── */
              <Motion.div
                style={{ position: 'relative', zIndex: 20, width: '100%', maxWidth: 480 }}
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={panelTransition}
                drag
                dragConstraints={overlayRef}
                dragMomentum={false}
                dragElastic={0.08}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {activeWindow === 'contact' && (
                  <ContactWindow profile={profile} onClose={onClose} />
                )}
                {activeWindow === 'skills' && (
                  <SkillsWindow skills={skills} onClose={onClose} />
                )}
              </Motion.div>
            )}
          </Motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}