import { useEffect } from 'react';
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

    window.setTimeout(() => {
      context.close();
    }, 420);
  } catch {
    // Best-effort sound effect; silently fail if audio context is unavailable.
  }
}

export default function HologramProfile({ profile = {}, onClose = () => {} }) {
  useEffect(() => {
    playScanSound();
  }, []);

  const role = profile.role || profile.title || 'Developer';
  const status = profile.status || 'Active';
  const systemId = profile.systemId || 'neko-user-01';
  const domains = profile.domains || profile.interests || [];
  const skills = profile.skills || [];
  const profileLinks = [
    { label: 'GitHub', href: profile.github },
    { label: 'LinkedIn', href: profile.linkedin },
  ].filter((item) => Boolean(item.href));

  return (
    <Motion.div
      className="relative isolate min-h-[30rem] w-full overflow-hidden rounded-2xl border border-cyan-100/35 bg-slate-950/85 backdrop-blur-xl hologram-panel hologram-dossier"
      initial={{ opacity: 0, y: 36, scale: 0.98, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.48, ease: 'easeOut', delay: 0.15 }}
      style={{
        boxShadow:
          '0 0 36px rgba(34, 211, 238, 0.30), 0 0 110px rgba(14, 165, 233, 0.18), inset 0 0 44px rgba(34, 211, 238, 0.10)',
      }}
    >
      <Motion.div
        className="pointer-events-none absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-300/90 to-transparent"
        initial={{ y: -8, opacity: 0.7 }}
        animate={{ y: '110%', opacity: [0.3, 1, 0.25] }}
        transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.1 }}
      />

      <Motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0.45 }}
        animate={{ opacity: [0.4, 0.2, 0.15], x: [0, 2, -1, 0] }}
        transition={{ duration: 0.38, delay: 0.1, times: [0, 0.4, 0.8, 1] }}
        style={{ background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.16), transparent 40%, rgba(14, 165, 233, 0.1))' }}
      />

      <div className="hologram-scanlines pointer-events-none absolute inset-0 opacity-40" />
      <div className="hologram-grid pointer-events-none absolute inset-0 opacity-35" />
      <div className="hologram-noise pointer-events-none absolute inset-0 opacity-[0.12]" />

      <div className="relative z-10 p-5 text-cyan-50 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-cyan-200/20 pb-4">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-cyan-200/90">Resume // Profile</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white/95">{profile.name || 'Unknown'}</h2>
            <p className="mt-1 text-base text-cyan-100/90">{profile.title || role}</p>
            <p className="mt-2 font-mono text-xs text-white/75">
              @{profile.username || 'user'} <span className="mx-2 text-white/30">|</span> {profile.location || '~/dev/world'}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="relative overflow-hidden rounded-xl border border-cyan-200/25 bg-black/25 p-2 shadow-[0_0_18px_rgba(34,211,238,0.22)]">
              <div className="absolute inset-0 hologram-photo-glow" aria-hidden="true" />
              <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-cyan-200/25">
                <div className="absolute inset-0 hologram-scanlines opacity-35" aria-hidden="true" />
                <img src={catIdArt} alt="Cat profile" className="h-full w-full object-cover opacity-95 saturate-150 contrast-125" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-black/30 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.85)]" />
                {status}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close resume window"
                className="grid h-8 w-8 place-items-center rounded-full border border-red-300/55 bg-red-500/35 text-red-100 transition hover:bg-red-500/55 hover:text-white"
              >
                <span className="text-sm font-bold leading-none">x</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
          <section className="space-y-4 rounded-xl border border-cyan-200/20 bg-black/30 p-4 shadow-[inset_0_0_24px_rgba(34,211,238,0.07)]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200/90">Professional Summary</p>
              <p className="mt-2 text-sm leading-relaxed text-white/85">
                {profile.bio || 'Focused on building reliable software systems and practical developer experiences.'}
              </p>
            </div>

            <div className="border-t border-cyan-200/15 pt-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200/90">Core Competencies</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {domains.map((domain) => (
                  <span key={domain} className="rounded-full border border-cyan-200/20 bg-black/20 px-3 py-1 text-sm text-white/85">
                    {domain}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-cyan-200/15 pt-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200/90">Skill Proficiency</p>
              <div className="mt-3 space-y-3">
                {skills.map((skill, index) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm text-white/85">
                      <span>{skill.name}</span>
                      <span className="font-mono text-xs text-cyan-100/90">{skill.level}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <Motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300 shadow-[0_0_18px_rgba(34,211,238,0.45)]"
                        initial={{ width: 0, opacity: 0.8 }}
                        animate={{ width: `${skill.level}%`, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.25 + index * 0.06, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 border-t border-cyan-200/15 pt-4 sm:grid-cols-3">
              <div className="rounded-lg border border-cyan-200/15 bg-black/20 p-3">
                <p className="font-mono text-[11px] uppercase tracking-widest text-cyan-200/85">Projects</p>
                <p className="mt-1 text-xl font-semibold text-white/90">{profile.projects || 0}+</p>
              </div>
              <div className="rounded-lg border border-cyan-200/15 bg-black/20 p-3">
                <p className="font-mono text-[11px] uppercase tracking-widest text-cyan-200/85">Specialization</p>
                <p className="mt-1 text-sm text-white/85">{profile.specialization || 'Developer Tools / Systems'}</p>
              </div>
              <div className="rounded-lg border border-cyan-200/15 bg-black/20 p-3">
                <p className="font-mono text-[11px] uppercase tracking-widest text-cyan-200/85">Clearance</p>
                <p className="mt-1 text-sm text-white/85">{profile.clearance || 'OPEN SOURCE'}</p>
              </div>
            </div>
          </section>

          <aside className="space-y-4 rounded-xl border border-cyan-200/20 bg-black/30 p-4">
            <div className="rounded-lg border border-cyan-200/15 bg-black/20 p-3 text-sm text-white/85">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-200/90">Snapshot</p>
              <div className="mt-2 space-y-1.5">
                <p><span className="text-cyan-200/90">Projects:</span> {(profile.projects || 0)}+</p>
                <p><span className="text-cyan-200/90">Languages:</span> {profile.languages || 'Python / JS / C'}</p>
                <p><span className="text-cyan-200/90">System ID:</span> {systemId}</p>
                <p><span className="text-cyan-200/90">Status:</span> {profile.systemStatus || 'ACTIVE'}</p>
              </div>
            </div>

            <div className="rounded-lg border border-cyan-200/15 bg-black/20 p-3 text-sm text-white/85">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-200/90">Contact</p>
              <div className="mt-2 space-y-1.5">
                <p className="break-all">{profile.email || '—'}</p>
                {profileLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block break-all text-cyan-100/90 underline decoration-cyan-300/45 underline-offset-2 hover:text-cyan-50"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Motion.div>
  );
}