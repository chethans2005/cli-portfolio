import { useEffect, useRef, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import catIdArt from '../assets/cat-id-art.svg';

function playScanSound() {
  try {
    const AudioContextType = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextType) return;
    const context = new AudioContextType();
    const now = context.currentTime;
    const carrier = context.createOscillator();
    carrier.type = 'triangle';
    carrier.frequency.setValueAtTime(820, now);
    carrier.frequency.exponentialRampToValueAtTime(300, now + 0.18);
    const mod = context.createOscillator();
    mod.type = 'square';
    mod.frequency.setValueAtTime(38, now);
    const modGain = context.createGain();
    modGain.gain.setValueAtTime(40, now);
    mod.connect(modGain);
    modGain.connect(carrier.frequency);
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.02, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    carrier.connect(gain);
    gain.connect(context.destination);
    carrier.start(now);
    mod.start(now);
    carrier.stop(now + 0.28);
    mod.stop(now + 0.28);
    window.setTimeout(() => context.close(), 420);
  } catch {
    // best-effort
  }
}

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function HologramProfile({ profile = {}, onClose = () => {} }) {
  const [barsVisible, setBarsVisible] = useState(false);
  const [uptime, setUptime] = useState('00:00:00');
  const [timestamp, setTimestamp] = useState('');
  const startRef = useRef(0);

  const role         = profile.role || profile.title || 'Developer';
  const status       = profile.status || 'Active';
  const systemId     = profile.systemId || 'neko-user-01';
  const domains      = profile.domains || profile.interests || [];
  const skills       = profile.skills || [];
  const profileLinks = [
    { label: 'GitHub //',   href: profile.github },
    { label: 'LinkedIn //', href: profile.linkedin },
    { label: 'Portfolio //', href: profile.portfolio },
  ].filter((l) => Boolean(l.href));

  useEffect(() => {
    playScanSound();
    const t = setTimeout(() => setBarsVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    startRef.current = Date.now();

    function tick() {
      const now  = new Date();
      const secs = Math.floor((Date.now() - startRef.current) / 1000);
      const h = Math.floor(secs / 3600);
      const m = Math.floor((secs % 3600) / 60);
      const s = secs % 60;
      setUptime(`${pad(h)}:${pad(m)}:${pad(s)}`);
      setTimestamp(now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&display=swap');

        .hp-root {
          font-family: 'Share Tech Mono', monospace;
          background: #000;
          color: #a8ff78;
          position: relative;
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }

        /* scanlines */
        .hp-scanlines {
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent, transparent 2px,
            rgba(0,0,0,0.22) 2px, rgba(0,0,0,0.22) 4px
          );
          pointer-events: none; z-index: 20;
        }

        /* vignette */
        .hp-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.75) 100%);
          pointer-events: none; z-index: 19;
        }

        /* grid bg */
        .hp-grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(100,255,100,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,255,100,0.045) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none; z-index: 1;
        }

        /* corner brackets */
        .hp-corner { position: absolute; width: 18px; height: 18px; border-color: #1f3d1f; border-style: solid; z-index: 12; }
        .hp-corner-tl { top: 5px; left: 5px;   border-width: 1px 0 0 1px; }
        .hp-corner-tr { top: 5px; right: 5px;  border-width: 1px 1px 0 0; }
        .hp-corner-bl { bottom: 5px; left: 5px;  border-width: 0 0 1px 1px; }
        .hp-corner-br { bottom: 5px; right: 5px; border-width: 0 1px 1px 0; }

        /* topbar */
        .hp-topbar {
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid #1f3d1f;
          padding: 10px 18px;
          background: rgba(0,30,0,0.6);
        }
        .hp-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        .hp-dot-r { background: #ff4f4f; box-shadow: 0 0 6px #ff4f4f; }
        .hp-dot-y { background: #f5c518; box-shadow: 0 0 6px #f5c518; }
        .hp-dot-g { background: #4bff72; box-shadow: 0 0 6px #4bff72; }

        .hp-label  { font-size: 12px; letter-spacing: .2em; color: #67e8f9; text-transform: uppercase; font-weight: 700; }
        .hp-status-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; letter-spacing: .15em; color: #4bff72; font-weight: 700;
          border: 1px solid #1f3d1f; padding: 4px 9px;
        }
        .hp-pulse {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4bff72; box-shadow: 0 0 8px #4bff72;
          animation: hp-pulse-dot 2s ease-in-out infinite;
        }
        @keyframes hp-pulse-dot {
          0%,100% { box-shadow: 0 0 4px #4bff72; opacity: 1; }
          50%      { box-shadow: 0 0 12px #4bff72; opacity: .6; }
        }

        .hp-close-btn {
          background: transparent;
          border: 1px solid #3a1a1a;
          color: #ff6b6b;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px; font-weight: 700; padding: 4px 12px; cursor: pointer;
          letter-spacing: .15em; transition: all .15s;
        }
        .hp-close-btn:hover { background: #3a1a1a; color: #ff6b6b; }

        /* body layout */
        .hp-body {
          display: grid;
          grid-template-columns: 220px 1fr;
          min-height: 460px;
        }

        /* sidebar */
        .hp-sidebar {
          border-right: 1px solid #215021;
          padding: 20px 16px;
          display: flex; flex-direction: column; gap: 20px;
          background: rgba(0,12,0,0.5);
        }

        /* avatar */
        .hp-avatar-wrap {
          position: relative; width: 100%; aspect-ratio: 1; max-width: 120px;
          margin: 0 auto; border: 1px solid #2a5a2a; overflow: hidden;
        }
        .hp-avatar-wrap::before {
          content: ''; position: absolute; inset: 0; z-index: 2;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 4px
          );
        }
        .hp-avatar-wrap::after {
          content: ''; position: absolute;
          top: 0; left: -100%; width: 30%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(150,255,150,0.15), transparent);
          animation: hp-scan-h 3s linear infinite; z-index: 3;
        }
        @keyframes hp-scan-h {
          0%   { left: -30%; }
          100% { left: 130%; }
        }
        .hp-avatar-img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          filter: sepia(.4) hue-rotate(70deg) saturate(1.4) brightness(.85) contrast(1.2);
        }
        .hp-av-corner { position: absolute; width: 10px; height: 10px; border-color: #4bff72; border-style: solid; z-index: 5; }
        .hp-av-tl { top: 3px; left: 3px;   border-width: 2px 0 0 2px; }
        .hp-av-tr { top: 3px; right: 3px;  border-width: 2px 2px 0 0; }
        .hp-av-bl { bottom: 3px; left: 3px;  border-width: 0 0 2px 2px; }
        .hp-av-br { bottom: 3px; right: 3px; border-width: 0 2px 2px 0; }

        /* id block */
        .hp-name {
          font-family: 'VT323', monospace; font-size: 34px;
          color: #c8ffb0; letter-spacing: .05em; line-height: 1.1; margin: 0;
          font-weight: 700;
          text-align: center;
        }
        .hp-role     { font-size: 14px; color: #67e8f9; letter-spacing: .14em; margin-top: 4px; text-transform: uppercase; text-align: center; font-weight: 700; }
        .hp-location { font-size: 12px; color: #93c5fd; margin-top: 6px; letter-spacing: .1em; text-align: center; font-weight: 600; }

        .hp-meta-row {
          display: flex; justify-content: space-between;
          font-size: 12px; color: #7abf7a; font-weight: 700;
          border-top: 1px solid #162616; padding-top: 6px; margin-top: 2px;
          letter-spacing: .08em;
        }
        .hp-meta-val { color: #b7ff7c; font-weight: 700; }

        .hp-sec-title {
          font-size: 12px; letter-spacing: .22em; color: #67e8f9; font-weight: 700;
          text-transform: uppercase; border-bottom: 1px solid #162616;
          padding-bottom: 4px; margin-bottom: 8px;
        }
        .hp-tag {
          display: inline-block; font-size: 12px;
          border: 1px solid #1f3d1f; color: #b7ff7c; font-weight: 700;
          padding: 3px 7px; margin: 2px; letter-spacing: .08em;
        }
        .hp-link-item {
          display: block; font-size: 12px; color: #fcd34d; font-weight: 700;
          text-decoration: none; letter-spacing: .1em;
          padding: 3px 0; border-bottom: 1px dashed #162616;
          transition: color .15s;
        }
        .hp-link-item:hover { color: #c084fc; }

        /* main panel */
        .hp-main { padding: 20px 22px; display: flex; flex-direction: column; gap: 18px; }

        .hp-section-header {
          font-size: 12px; letter-spacing: .24em; color: #67e8f9; font-weight: 700;
          text-transform: uppercase; margin-bottom: 10px;
          display: flex; align-items: center; gap: 8px;
        }
        .hp-section-header::after {
          content: ''; flex: 1; height: 1px; background: #162616;
        }

        .hp-bio {
          font-size: 15px; font-weight: 600; color: #c8ffb0; line-height: 1.7; letter-spacing: .03em;
          border-left: 2px solid #1f3d1f; padding-left: 12px; margin: 0;
        }

        /* skills */
        .hp-skill-row { display: flex; align-items: center; gap: 10px; margin-bottom: 9px; }
        .hp-skill-name { font-size: 13px; color: #b7ff7c; letter-spacing: .06em; min-width: 120px; font-weight: 700; }
        .hp-skill-bar-bg {
          flex: 1; height: 6px; background: #0d1a0d;
          border: 1px solid #1a2f1a; overflow: hidden;
        }
        .hp-skill-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #4bff72, #67e8f9 55%, #4bff72);
          box-shadow: 0 0 8px rgba(75,255,114,.5);
          transition: width .8s cubic-bezier(.22,1,.36,1);
        }
        .hp-skill-pct { font-size: 12px; color: #fcd34d; min-width: 38px; text-align: right; font-weight: 700; }

        /* stat cards */
        .hp-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .hp-stat-card {
          border: 1px solid #1a2a1a; padding: 10px 12px;
          background: rgba(0,15,0,.5); position: relative; overflow: hidden;
        }
        .hp-stat-card::before {
          content: ''; position: absolute; top: 0; left: 0;
          width: 2px; height: 100%; background: #1f3d1f;
        }
        .hp-stat-label { font-size: 10px; color: #67e8f9; letter-spacing: .2em; text-transform: uppercase; font-weight: 700; }
        .hp-stat-val {
          font-family: 'VT323', monospace; font-size: 28px;
          color: #a8ff78; line-height: 1.1; margin-top: 2px;
          font-weight: 700;
        }

        /* contact chips */
        .hp-contact-row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .hp-contact-chip {
          font-size: 12px; border: 1px solid #1a2a1a; color: #67e8f9; font-weight: 700;
          padding: 4px 10px; letter-spacing: .08em; background: rgba(0,20,0,.4);
        }

        /* footer row */
        .hp-footer {
          border-top: 1px solid #162616; padding-top: 10px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .hp-footer-label { font-size: 11px; color: #7abf7a; letter-spacing: .15em; font-weight: 700; }
        .hp-footer-ts    { font-size: 11px; color: #93c5fd; letter-spacing: .1em; font-weight: 700; }

        .hp-blink { animation: hp-blink 1.2s step-end infinite; }
        @keyframes hp-blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>

      <Motion.div
        className="hp-root"
        style={{ border: '1px solid #1a2a1a' }}
        initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)', skewX: -2 }}
        animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0)', skewX: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="hp-scanlines" />
        <div className="hp-vignette" />
        <div className="hp-grid-bg" />
        <div className="hp-corner hp-corner-tl" />
        <div className="hp-corner hp-corner-tr" />
        <div className="hp-corner hp-corner-bl" />
        <div className="hp-corner hp-corner-br" />

        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* ── Topbar ── */}
          <div className="hp-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="hp-dot hp-dot-r" />
              <span className="hp-dot hp-dot-y" />
              <span className="hp-dot hp-dot-g" />
              <span className="hp-label" style={{ marginLeft: 8 }}>sys://dossier.v2</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="hp-status-badge">
                <span className="hp-pulse" />
                {status.toUpperCase()}
              </span>
              <button className="hp-close-btn" type="button" onClick={onClose} aria-label="Close profile">
                [ ESC ]
              </button>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="hp-body">
            {/* Sidebar */}
            <div className="hp-sidebar">
              {/* Avatar */}
              <div className="hp-avatar-wrap">
                <div className="hp-av-corner hp-av-tl" />
                <div className="hp-av-corner hp-av-tr" />
                <div className="hp-av-corner hp-av-bl" />
                <div className="hp-av-corner hp-av-br" />
                <img src={catIdArt} alt="Profile" className="hp-avatar-img" />
              </div>

              {/* Identity */}
              <div>
                <p className="hp-name">{(profile.name || 'UNKNOWN').toUpperCase()}</p>
                <p className="hp-role">{profile.title || role}</p>
                <p className="hp-location">{profile.location || '~/dev/world'}</p>
              </div>

              {/* Meta */}
              <div>
                <div className="hp-meta-row">
                  <span>SYS-ID</span>
                  <span className="hp-meta-val">{systemId}</span>
                </div>
                <div className="hp-meta-row">
                  <span>USERNAME</span>
                  <span className="hp-meta-val">@{profile.username || 'user'}</span>
                </div>
                <div className="hp-meta-row">
                  <span>CLEARANCE</span>
                  <span className="hp-meta-val">{(profile.clearance || 'OPEN SOURCE').slice(0, 10)}</span>
                </div>
                <div className="hp-meta-row">
                  <span>UPTIME</span>
                  <span className="hp-meta-val">{uptime}</span>
                </div>
              </div>

              {/* Domains */}
              {domains.length > 0 && (
                <div>
                  <div className="hp-sec-title">domains</div>
                  <div>
                    {domains.map((d) => (
                      <span key={d} className="hp-tag">{d}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {profileLinks.length > 0 && (
                <div>
                  <div className="hp-sec-title">channels</div>
                  {profileLinks.map((l) => (
                    <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="hp-link-item">
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Main panel */}
            <div className="hp-main">
              {/* Bio */}
              <div>
                <div className="hp-section-header">// summary</div>
                <p className="hp-bio">
                  {profile.bio || 'Focused on building reliable software systems and practical developer experiences.'}
                </p>
              </div>

              {/* Skills */}
              {skills.length > 0 && (
                <div>
                  <div className="hp-section-header">// skill matrix</div>
                  {skills.map((skill, i) => (
                    <div key={skill.name} className="hp-skill-row">
                      <span className="hp-skill-name">{skill.name}</span>
                      <div className="hp-skill-bar-bg">
                        <Motion.div
                          className="hp-skill-bar-fill"
                          initial={{ width: 0 }}
                          animate={{ width: barsVisible ? `${skill.level}%` : 0 }}
                          transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <span className="hp-skill-pct">{skill.level}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div>
                <div className="hp-section-header">// metrics</div>
                <div className="hp-stats">
                  <div className="hp-stat-card">
                    <div className="hp-stat-label">projects</div>
                    <div className="hp-stat-val">{profile.projects || 0}+</div>
                  </div>
                  <div className="hp-stat-card">
                    <div className="hp-stat-label">speciality</div>
                    <div className="hp-stat-val" style={{ fontSize: 14, lineHeight: 1.3, color: '#7abf7a' }}>
                      {profile.specialization || 'Developer Tools'}
                    </div>
                  </div>
                  <div className="hp-stat-card">
                    <div className="hp-stat-label">clearance</div>
                    <div className="hp-stat-val" style={{ fontSize: 15, color: '#4bff72' }}>
                      {(profile.clearance || 'OPEN').split(' ')[0]}
                      <span className="hp-blink">_</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <div className="hp-section-header">// contact</div>
                <div className="hp-contact-row">
                  {profile.email && (
                    <span className="hp-contact-chip">{profile.email}</span>
                  )}
                  {profileLinks.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hp-contact-chip"
                      style={{ color: '#2d5a2d', textDecoration: 'none', cursor: 'pointer' }}
                    >
                      &gt; ping {l.label.replace(' //', '').toLowerCase()}
                    </a>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="hp-footer">
                <span className="hp-footer-label">PROFILE v2.0 // CLI-PORTFOLIO</span>
                <span className="hp-footer-ts">{timestamp}</span>
              </div>
            </div>
          </div>
        </div>
      </Motion.div>
    </>
  );
}