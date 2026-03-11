import { Suspense, useState } from 'react';
import BackgroundScene from './components/three/BackgroundScene';
import TerminalWindow from './components/TerminalWindow';
import WindowManager from './components/WindowManager';
import profileData from './data/profile.json';
import skillsData from './data/skills.json';
import './App.css';

function App() {
  const [activeWindow, setActiveWindow] = useState(null);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 3D Background */}
      <Suspense fallback={null}>
        <BackgroundScene />
      </Suspense>

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
        <TerminalWindow onOpenWindow={setActiveWindow} />
      </div>

      <WindowManager
        activeWindow={activeWindow}
        onClose={() => setActiveWindow(null)}
        profile={profileData}
        skills={skillsData}
      />

      {/* Ambient glow overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-terminal-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-terminal-purple/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

export default App;
