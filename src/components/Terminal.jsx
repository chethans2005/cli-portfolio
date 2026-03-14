import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { FileSystem } from '../core/fileSystem';
import { CommandParser } from '../core/commandParser';
import 'xterm/css/xterm.css';
import profileData from '../data/profile.json';
import { ASCII_BANNER } from '../data/banner';

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

const WELCOME_MESSAGE = `Welcome to neko.OS!
Type 'about' to learn more about me.
`;

const BOOT_COLORS = [ '\x1b[93m', '\x1b[95m'];

export default function Terminal({ onOpenWindow }) {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const fileSystemRef = useRef(null);
  const commandParserRef = useRef(null);
  const isBootedRef = useRef(false);
  
  const currentLineRef = useRef('');
  const cursorPosRef = useRef(0);

  useEffect(() => {
    const timeoutIds = [];
    const schedule = (fn, delay) => {
      const id = window.setTimeout(fn, delay);
      timeoutIds.push(id);
    };
    if (!terminalRef.current) return;

    // Initialize xterm
    const term = new XTerm({
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: '"Fira Code", Consolas, Monaco, monospace',
      fontSize: 13,
      theme: {
        background: '#06090f',
        foreground: '#eaffea',
        cursor: '#a5f3fc',
        cursorAccent: '#071007',
        black: '#1a2233',
        red: '#ff3b3b',
        green: '#7fff7f',
        yellow: '#ffe066',
        blue: '#5fd7ff',
        magenta: '#ff7fff',
        cyan: '#76fff9',
        white: '#ffffff',
        brightBlack: '#6b7280',
        brightRed: '#ff4d6d',
        brightGreen: '#baffc9',
        brightYellow: '#fff685',
        brightBlue: '#aeefff',
        brightMagenta: '#ffd6fa',
        brightCyan: '#b9fff9',
        brightWhite: '#f8fff8',
      },
      allowTransparency: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(
      new WebLinksAddon((event, uri) => {
        event.preventDefault();
        window.open(uri, '_blank', 'noopener,noreferrer');
      })
    );
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

      String(text)
        .split('\n')
        .forEach((line) => term.writeln(line));
    };

    commandParserRef.current = new CommandParser(
      fileSystemRef.current,
      outputHandler,
      {
        openWindow: onOpenWindow,
        openUrl: (url) => window.open(url, '_blank', 'noopener,noreferrer'),
      }
    );

    // Boot sequence
    let bootIndex = 0;
    const writePrompt = (newLine = true) => {
      const path = fileSystemRef.current.getPromptPath();
      term.write(`${newLine ? '\r\n' : '\r'}\x1b[92m${profileData.username}@neko\x1b[0m:\x1b[96m${path}\x1b[0m\x1b[95m$\x1b[0m `);
    };

    const renderInputLine = () => {
      term.write('\r\x1b[K');
      writePrompt(false);
      term.write(currentLineRef.current);
    };

    const runBootSequence = () => {
      if (bootIndex < BOOT_SEQUENCE.length) {
        const { text, delay } = BOOT_SEQUENCE[bootIndex];
        schedule(() => {
          if (text) {
            const color = text.startsWith('[OK]')
              ? BOOT_COLORS[bootIndex % BOOT_COLORS.length]
              : text.includes('System ready')
                ? '\x1b[93m'
                : '\x1b[96m';
            term.writeln(`${color}${text}\x1b[0m`);
          } else {
            term.writeln('');
          }
          bootIndex++;
          runBootSequence();
        }, delay);
      } else {
        // Show banner and welcome
        schedule(() => {
          ASCII_BANNER.split('\n').forEach((line) => {
            term.writeln(`\x1b[36m${line}\x1b[0m`);
          });
          term.writeln(WELCOME_MESSAGE);
          isBootedRef.current = true;
          writePrompt(false);
        }, 300);
      }
    };

    runBootSequence();

    // Handle input
    term.onData((data) => {
      if (!isBootedRef.current && bootIndex < BOOT_SEQUENCE.length) return;

      const code = data.charCodeAt(0);

      if (code === 13) { // Enter
        term.write('\r\n');
        const command = currentLineRef.current.trim();
        if (command) {
          commandParserRef.current.executeCommand(command);
        }
        currentLineRef.current = '';
        cursorPosRef.current = 0;
        writePrompt(true);
      } else if (code === 9) { // Tab
        const autocompleted = commandParserRef.current.autocomplete(currentLineRef.current);
        if (autocompleted !== currentLineRef.current) {
          currentLineRef.current = autocompleted;
          cursorPosRef.current = autocompleted.length;
          renderInputLine();
        } else {
          term.write('\x07');
        }
      } else if (code === 127) { // Backspace
        if (cursorPosRef.current > 0) {
          currentLineRef.current = currentLineRef.current.slice(0, -1);
          cursorPosRef.current--;
          term.write('\b \b');
        }
      } else if (code === 27) { // Escape sequences (arrow keys)
        // Handle arrow keys for history
        if (data === '\x1b[A') { // Up arrow
          const prevCmd = commandParserRef.current.getPreviousCommand();
          if (prevCmd !== null) {
            currentLineRef.current = prevCmd;
            cursorPosRef.current = prevCmd.length;
            renderInputLine();
          }
        } else if (data === '\x1b[B') { // Down arrow
          const nextCmd = commandParserRef.current.getNextCommand();
          currentLineRef.current = nextCmd;
          cursorPosRef.current = nextCmd.length;
          renderInputLine();
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
      timeoutIds.forEach((id) => window.clearTimeout(id));
      term.dispose();
    };
  }, [onOpenWindow]);

  return (
    <div className="w-full h-full pt-5 pr-5 pb-5 pl-4 overflow-hidden">
      <div 
        ref={terminalRef} 
        className="w-full h-full"
        style={{ minHeight: '430px' }}
      />
    </div>
  );
}
