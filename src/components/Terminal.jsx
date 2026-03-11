import { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { FileSystem } from '../core/fileSystem';
import { CommandParser } from '../core/commandParser';
import 'xterm/css/xterm.css';
import profileData from '../data/profile.json';

const BOOT_SEQUENCE = [
  { text: 'Booting neko.OS...', delay: 100 },
  { text: '[OK] Loading kernel modules...', delay: 150 },
  { text: '[OK] Initializing file system...', delay: 150 },
  { text: '[OK] Starting network services...', delay: 150 },
  { text: '[OK] Loading developer modules...', delay: 150 },
  { text: '[OK] Initializing environment...', delay: 200 },
  { text: '', delay: 100 },
  { text: 'System ready.', delay: 300 },
  { text: '', delay: 100 },
];

const ASCII_BANNER = `
 _   _      _         _____ _____ 
| \\ | |    | |       |  _  /  ___|
|  \\| | ___| | _____ | |/' / /__ _
| . ' |/ _ \\ |/ / _ \\|  /| | '_ \\|
| |\\  |  __/   < (_) \\  \\| | |_) |
\\_| \\_/\\___|_|\\_\\___/ \\__/\\_/\\___(_)

  Developer Portfolio Terminal v1.0.0
  Type 'help' to get started
`;

const WELCOME_MESSAGE = `Welcome to neko.OS!

Type 'help' to see available commands.
Type 'about' to learn more about me.
`;

export default function Terminal() {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const fileSystemRef = useRef(null);
  const commandParserRef = useRef(null);
  const [isBooted, setIsBooted] = useState(false);
  
  const currentLineRef = useRef('');
  const cursorPosRef = useRef(0);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm
    const term = new XTerm({
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: '"Fira Code", Consolas, Monaco, monospace',
      fontSize: 12,
      theme: {
        background: '#0a0e14',
        foreground: '#00ff41',
        cursor: '#00ff41',
        cursorAccent: '#0a0e14',
        black: '#000000',
        red: '#ff5555',
        green: '#50fa7b',
        yellow: '#f1fa8c',
        blue: '#8be9fd',
        magenta: '#bd93f9',
        cyan: '#00ffff',
        white: '#f8f8f2',
        brightBlack: '#6272a4',
        brightRed: '#ff6e6e',
        brightGreen: '#69ff94',
        brightYellow: '#ffffa5',
        brightBlue: '#a4ffff',
        brightMagenta: '#d6acff',
        brightCyan: '#4dffff',
        brightWhite: '#ffffff',
      },
      allowTransparency: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Initialize file system and command parser
    fileSystemRef.current = new FileSystem();
    
    const outputHandler = (text) => {
      if (text === '__CLEAR__') {
        term.clear();
        return;
      }
      term.writeln(text);
    };

    commandParserRef.current = new CommandParser(
      fileSystemRef.current,
      outputHandler,
      null
    );

    // Boot sequence
    let bootIndex = 0;
    const runBootSequence = () => {
      if (bootIndex < BOOT_SEQUENCE.length) {
        const { text, delay } = BOOT_SEQUENCE[bootIndex];
        setTimeout(() => {
          if (text) {
            term.writeln(`\x1b[36m${text}\x1b[0m`);
          } else {
            term.writeln('');
          }
          bootIndex++;
          runBootSequence();
        }, delay);
      } else {
        // Show banner and welcome
        setTimeout(() => {
          term.writeln(`\x1b[36m${ASCII_BANNER}\x1b[0m`);
          term.writeln(WELCOME_MESSAGE);
          setIsBooted(true);
          writePrompt();
        }, 300);
      }
    };

    runBootSequence();

    const writePrompt = () => {
      const path = fileSystemRef.current.getPromptPath();
      term.write(`\r\n\x1b[32m${profileData.username}@neko\x1b[0m:\x1b[34m${path}\x1b[0m$ `);
    };

    // Handle input
    term.onData((data) => {
      if (!isBooted && bootIndex < BOOT_SEQUENCE.length) return;

      const code = data.charCodeAt(0);

      if (code === 13) { // Enter
        term.write('\r\n');
        const command = currentLineRef.current.trim();
        if (command) {
          commandParserRef.current.executeCommand(command);
        }
        currentLineRef.current = '';
        cursorPosRef.current = 0;
        writePrompt();
      } else if (code === 127) { // Backspace
        if (cursorPosRef.current > 0) {
          currentLineRef.current = 
            currentLineRef.current.slice(0, -1);
          cursorPosRef.current--;
          term.write('\b \b');
        }
      } else if (code === 27) { // Escape sequences (arrow keys)
        // Handle arrow keys for history
        if (data === '\x1b[A') { // Up arrow
          const prevCmd = commandParserRef.current.getPreviousCommand();
          if (prevCmd !== null) {
            // Clear current line
            term.write('\r\x1b[K');
            writePrompt();
            term.write(prevCmd);
            currentLineRef.current = prevCmd;
            cursorPosRef.current = prevCmd.length;
          }
        } else if (data === '\x1b[B') { // Down arrow
          const nextCmd = commandParserRef.current.getNextCommand();
          // Clear current line
          term.write('\r\x1b[K');
          writePrompt();
          term.write(nextCmd);
          currentLineRef.current = nextCmd;
          cursorPosRef.current = nextCmd.length;
        }
      } else if (code >= 32) { // Printable characters
        currentLineRef.current += data;
        cursorPosRef.current++;
        term.write(data);
      }
    });

    // Handle resize
    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, [isBooted]);

  return (
    <div className="w-full h-full p-4 overflow-hidden">
      <div 
        ref={terminalRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
}
