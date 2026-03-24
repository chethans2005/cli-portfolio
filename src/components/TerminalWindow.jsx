import { motion as Motion } from 'framer-motion';
import Terminal from './Terminal';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&display=swap');

  .tw-root {
    font-family: 'Share Tech Mono', monospace;
    width: 66.666%;
    min-width: 24rem;
    height: 30rem;
    margin: 0 auto;
  }
  @media (min-width: 640px) {
    .tw-root { height: 33rem; }
  }

  .tw-shell {
    position: relative;
    width: 100%; height: 100%;
    background: #000;
    border: 1px solid #2a5a2a;
    overflow: hidden;
    box-sizing: border-box;
  }

  /* ambient outer glow — stronger and more vivid */
  .tw-glow {
    position: absolute;
    inset: -2px;
    border-radius: 0;
    background: transparent;
    box-shadow:
      0 0 28px rgba(75,255,114,0.35),
      0 0 60px rgba(75,255,114,0.18),
      0 0 120px rgba(75,255,114,0.08);
    pointer-events: none;
    z-index: -1;
  }

  /* scanlines — slightly lighter so they don't kill brightness */
  .tw-scanlines {
    position: absolute; inset: 0; pointer-events: none; z-index: 20;
    background: repeating-linear-gradient(
      0deg,
      transparent, transparent 2px,
      rgba(0,0,0,0.10) 2px, rgba(0,0,0,0.10) 4px
    );
  }

  /* grid bg — brighter lines */
  .tw-grid {
    position: absolute; inset: 0; pointer-events: none; z-index: 1;
    background-image:
      linear-gradient(rgba(100,255,100,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(100,255,100,0.07) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  /* vignette — softer so center stays bright */
  .tw-vignette {
    position: absolute; inset: 0; pointer-events: none; z-index: 19;
    background: radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.45) 100%);
  }

  /* corner brackets — more visible */
  .tw-corner { position: absolute; width: 14px; height: 14px; border-color: #3aaa3a; border-style: solid; z-index: 22; }
  .tw-corner-tl { top: 4px; left: 4px;   border-width: 1px 0 0 1px; }
  .tw-corner-tr { top: 4px; right: 4px;  border-width: 1px 1px 0 0; }
  .tw-corner-bl { bottom: 4px; left: 4px;  border-width: 0 0 1px 1px; }
  .tw-corner-br { bottom: 4px; right: 4px; border-width: 0 1px 1px 0; }

  /* topbar — brighter border and background */
  .tw-topbar {
    position: relative; z-index: 10;
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 16px;
    border-bottom: 1px solid #2e6b2e;
    background: rgba(0,25,0,0.80);
  }

  .tw-dots { display: flex; align-items: center; gap: 7px; }
  .tw-dot { width: 8px; height: 8px; border-radius: 50%; cursor: pointer; transition: filter .15s; }
  .tw-dot:hover { filter: brightness(1.5); }
  .tw-dot-r { background: #ff4f4f; box-shadow: 0 0 8px #ff4f4faa; }
  .tw-dot-y { background: #f5c518; box-shadow: 0 0 8px #f5c518aa; }
  .tw-dot-g { background: #4bff72; box-shadow: 0 0 8px #4bff72aa; }

  .tw-title-wrap {
    position: absolute; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    display: flex; align-items: center; gap: 8px;
    pointer-events: none;
  }
  .tw-title {
    font-family: 'VT323', monospace;
    font-size: 18px; letter-spacing: .18em;
    color: #e0ffe0; text-transform: uppercase;
    text-shadow: 0 0 10px rgba(75,255,114,0.6);
  }
  .tw-title-pulse {
    width: 7px; height: 7px; border-radius: 50%;
    background: #4bff72; box-shadow: 0 0 14px rgba(75,255,114,1);
    animation: tw-pulse 2s ease-in-out infinite;
  }
  @keyframes tw-pulse {
    0%,100% { box-shadow: 0 0 8px #4bff72; opacity: 1; }
    50%      { box-shadow: 0 0 20px #4bff72; opacity: .6; }
  }

  .tw-status {
    display: flex; align-items: center; gap: 5px;
    font-size: 10px; letter-spacing: .18em;
    color: #5a9b5a; text-transform: uppercase;
  }

  /* terminal content area */
  .tw-content {
    position: relative; z-index: 10;
    width: 100%;
    height: calc(100% - 42px);
    padding: 10px;
    box-sizing: border-box;
  }

  .tw-inner {
    width: 100%; height: 100%;
    border: 1px solid #2a4f2a;
    background: radial-gradient(120% 140% at 0% 0%, rgba(10,35,10,0.5), rgba(0,8,0,0.90));
    overflow: hidden;
    box-sizing: border-box;
  }

  /* scan sweep animation on mount */
  .tw-sweep {
    position: absolute;
    top: 0; left: -100%; width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(75,255,114,0.10), transparent);
    pointer-events: none; z-index: 15;
    animation: tw-sweep 1.2s ease-out forwards;
  }
  @keyframes tw-sweep {
    0%   { left: -40%; opacity: 1; }
    100% { left: 130%; opacity: 0; }
  }
`;

export default function TerminalWindow({ onOpenWindow }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <Motion.div
        className="tw-root"
        initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)', skewX: -1 }}
        animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0)', skewX: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="tw-shell">
          {/* decorative outer glow */}
          <div className="tw-glow" />

          {/* overlays */}
          <div className="tw-scanlines" />
          <div className="tw-grid" />
          <div className="tw-vignette" />
          <div className="tw-sweep" />

          {/* corner brackets */}
          <div className="tw-corner tw-corner-tl" />
          <div className="tw-corner tw-corner-tr" />
          <div className="tw-corner tw-corner-bl" />
          <div className="tw-corner tw-corner-br" />

          {/* topbar */}
          <div className="tw-topbar">
            <div className="tw-dots">
              <span className="tw-dot tw-dot-r" title="Close" />
              <span className="tw-dot tw-dot-y" title="Minimise" />
              <span className="tw-dot tw-dot-g" title="Maximise" />
            </div>

            <div className="tw-title-wrap">
              <span className="tw-title-pulse" />
              <span className="tw-title">neko.OS</span>
            </div>

            <div className="tw-status">
              <span>sys</span>
              <span style={{ color: '#2a4a2a' }}>·</span>
              <span style={{ color: '#4bff72' }}>online</span>
            </div>
          </div>

          {/* terminal body */}
          <div className="tw-content">
            <div className="tw-inner">
              <Terminal onOpenWindow={onOpenWindow} />
            </div>
          </div>
        </div>
      </Motion.div>
    </>
  );
}