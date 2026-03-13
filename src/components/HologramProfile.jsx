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
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-cyan-200/20 pb-3">
          <div className="space-y-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-cyan-200/90">Criminal Record // Subject Dossier</p>
            <p className="font-mono text-xs text-white/80">
              <span className="text-cyan-200/90">CASE</span>{' '}
              <span className="text-cyan-50/95">{profile.caseId || 'NEKO-0X13'}</span>
              <span className="mx-2 text-white/30">|</span>
              <span className="text-cyan-200/90">CLEARANCE</span>{' '}
              <span className="text-cyan-50/95">{profile.clearance || 'OPEN SOURCE'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-black/30 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.85)]" />
              {status}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-cyan-200/30 bg-black/25 px-3 py-1.5 text-[11px] uppercase tracking-widest text-cyan-50/90 transition hover:bg-cyan-300/10 hover:border-cyan-200/45"
            >
              Close
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Top row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_240px]">
            {/* Top-left details */}
            <div className="rounded-xl border border-cyan-200/20 bg-black/30 p-4 shadow-[inset_0_0_24px_rgba(34,211,238,0.08)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200/90">Subject</p>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight text-white/90">{profile.name || 'Unknown'}</h3>
                  <p className="mt-1 font-mono text-sm text-cyan-50/80">
                    {role} <span className="text-white/30">•</span> @{profile.username || 'user'}
                  </p>
                </div>

                <div className="rounded-lg border border-cyan-200/15 bg-black/20 px-3 py-2 font-mono text-[11px] text-white/80">
                  <p>
                    <span className="text-cyan-200/90">SYSTEM ID</span> <span className="text-white/40">/</span>{' '}
                    <span className="text-cyan-50/90">{systemId}</span>
                  </p>
                  <p className="mt-1">
                    <span className="text-cyan-200/90">LOCATION</span> <span className="text-white/40">/</span>{' '}
                    <span className="text-cyan-50/90">{profile.location || '~/dev/world'}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-cyan-200/15 bg-black/20 p-3">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-cyan-200/85">Threat level</p>
                  <p className="mt-1 text-sm text-white/85">{profile.threat || 'LOW (collaborative)'}</p>
                </div>
                <div className="rounded-lg border border-cyan-200/15 bg-black/20 p-3">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-cyan-200/85">Specialization</p>
                  <p className="mt-1 text-sm text-white/85">{profile.specialization || 'Developer Tools / Systems'}</p>
                </div>
                <div className="rounded-lg border border-cyan-200/15 bg-black/20 p-3">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-cyan-200/85">Projects built</p>
                  <p className="mt-1 text-sm text-white/85">{(profile.projects || 0)}+</p>
                </div>
              </div>

              {profile.bio ? (
                <div className="mt-4 rounded-lg border border-cyan-200/15 bg-black/20 p-3">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-cyan-200/85">Notes</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/80">{profile.bio}</p>
                </div>
              ) : null}
            </div>

            {/* Top-right cat image */}
            <div className="relative overflow-hidden rounded-xl border border-cyan-200/20 bg-black/30 p-4">
              <div className="absolute inset-0 hologram-photo-glow" aria-hidden="true" />
              <div className="relative">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200/90">Subject photo</p>
                <div className="mt-3 grid place-items-center">
                  <div className="relative grid h-40 w-40 place-items-center overflow-hidden rounded-2xl border border-cyan-200/25 bg-gradient-to-br from-cyan-400/10 via-transparent to-sky-400/10 shadow-[0_0_26px_rgba(34,211,238,0.25)]">
                    <div className="absolute inset-0 hologram-scanlines opacity-30 rounded-2xl" aria-hidden="true" />
                    <img
                      src={catIdArt}
                      alt="Cat profile"
                      className="h-full w-full object-cover opacity-90 saturate-150 contrast-125"
                    />
                    <div className="pointer-events-none absolute -inset-10 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.18),transparent_55%)]" aria-hidden="true" />
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-cyan-200/15 bg-black/20 p-3 font-mono text-[11px] text-white/80">
                  <p>
                    <span className="text-cyan-200/85">MATCH</span> <span className="text-white/40">/</span>{' '}
                    <span className="text-white/85">{profile.match || '99.8%'}</span>
                  </p>
                  <p className="mt-1">
                    <span className="text-cyan-200/85">SIGNATURE</span> <span className="text-white/40">/</span>{' '}
                    <span className="text-white/85">{profile.signature || 'verified'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-cyan-200/20 bg-black/30 p-4">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200/90">Domains</p>
              <div className="flex flex-wrap gap-2">
                {domains.map((domain) => (
                  <span
                    key={domain}
                    className="rounded-full border border-cyan-200/15 bg-black/20 px-3 py-1 text-sm text-white/80"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-cyan-200/20 bg-black/30 p-4 lg:col-span-2">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200/90">Skills</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {skills.map((skill, index) => (
                  <div key={skill.name} className="rounded-lg border border-cyan-200/15 bg-black/20 p-3">
                    <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-white/80">
                      <span className="text-white/85">{skill.name}</span>
                      <span className="text-cyan-100/90">{skill.level}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded bg-white/10 overflow-hidden">
                      <Motion.div
                        className="h-full rounded bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300 shadow-[0_0_18px_rgba(34,211,238,0.45)]"
                        initial={{ width: 0, opacity: 0.8 }}
                        animate={{ width: `${skill.level}%`, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.25 + index * 0.06, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-cyan-200/15 bg-black/20 p-3 font-mono text-[11px] text-white/80">
                  <p className="uppercase tracking-widest text-cyan-200/85">Other details</p>
                  <div className="mt-2 space-y-1">
                    <p>LANGUAGES: <span className="text-white/85">{profile.languages || 'Python / JS / C'}</span></p>
                    <p>SYSTEM STATUS: <span className="text-white/85">{profile.systemStatus || 'ACTIVE'}</span></p>
                    <p>TARGET: <span className="text-white/85">{profile.specialization || 'Platform Engineering'}</span></p>
                  </div>
                </div>
                <div className="rounded-lg border border-cyan-200/15 bg-black/20 p-3 font-mono text-[11px] text-white/80">
                  <p className="uppercase tracking-widest text-cyan-200/85">Contact</p>
                  <div className="mt-2 space-y-1">
                    <p className="truncate">EMAIL: <span className="text-white/85">{profile.email || '—'}</span></p>
                    <p className="truncate">GITHUB: <span className="text-white/85">{profile.github || '—'}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Motion.div>
  );
}