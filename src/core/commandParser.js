import projectsData from '../data/projects.json';
import profileData from '../data/profile.json';

const C = {
  CYAN: '\x1b[36m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  RED: '\x1b[31m',
  BRIGHT_GREEN: '\x1b[92m',
  BRIGHT_CYAN: '\x1b[96m',
  BRIGHT_YELLOW: '\x1b[93m',
  BRIGHT_MAGENTA: '\x1b[95m',
  BOLD: '\x1b[1m',
  RESET: '\x1b[0m',
};

export class CommandParser {
  constructor(fileSystem, outputHandler, handlers = {}) {
    this.fs = fileSystem;
    this.output = outputHandler;
    this.handlers = handlers;
    this.commandHistory = [];
    this.historyIndex = -1;
    this.availableCommands = [
      'help',
      'about',
      'skills',
      'projects',
      'contact',
      'clear',
      'ls',
      'cd',
      'run',
      'github',
      'whoami',
      'pwd',
      'echo',
      'neofetch',
    ];
  }

  executeCommand(input) {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    this.commandHistory.push(trimmedInput);
    this.historyIndex = this.commandHistory.length;

    const [command, ...args] = trimmedInput.split(' ');
    const normalizedCommand = command.replace(/^\/+/, '');
    const cmd = normalizedCommand.toLowerCase();

    const commands = {
      help: () => this.help(),
      about: () => this.about(),
      skills: () => this.skills(),
      projects: () => this.projects(),
      contact: () => this.contact(),
      clear: () => this.clear(),
      ls: () => this.ls(args[0]),
      cd: () => this.cd(args[0]),
      run: () => this.run(args[0]),
      github: () => this.github(args[0]),
      whoami: () => this.whoami(),
      pwd: () => this.pwd(),
      echo: () => this.echo(args.join(' ')),
      neofetch: () => this.neofetch(),
    };

    if (commands[cmd]) {
      commands[cmd]();
    } else {
      this.output(`${C.RED}Command not found: ${command}${C.RESET}`);
      this.output(`Type ${C.CYAN}'help'${C.RESET} to see available commands.`);
    }
  }

  help() {
    this.output(`${C.BRIGHT_CYAN}${C.BOLD}Available Commands:${C.RESET}

  ${C.BRIGHT_GREEN}help${C.RESET}        - Show this help message
  ${C.BRIGHT_YELLOW}about${C.RESET}       - Learn more about me
  ${C.BRIGHT_MAGENTA}skills${C.RESET}      - View my technical skills
  ${C.BLUE}projects${C.RESET}    - Browse my projects
  ${C.CYAN}contact${C.RESET}     - Get in touch
  ${C.GREEN}ls${C.RESET}          - List directory contents
  ${C.GREEN}cd${C.RESET} [dir]    - Change directory
  ${C.GREEN}pwd${C.RESET}         - Print working directory
  ${C.BRIGHT_GREEN}run${C.RESET} [proj]  - Run a project demo
  ${C.BRIGHT_CYAN}github${C.RESET} [pr] - Open project on GitHub
  ${C.YELLOW}clear${C.RESET}       - Clear terminal
  ${C.MAGENTA}whoami${C.RESET}      - Display current user
  ${C.BRIGHT_MAGENTA}neofetch${C.RESET}    - System information

${C.BRIGHT_YELLOW}Pro tip:${C.RESET} Use ${C.CYAN}cd projects${C.RESET} then ${C.BRIGHT_CYAN}ls${C.RESET} to explore my work.`);
  }

  about() {
    this.output(`${C.YELLOW}Accessing secure records...${C.RESET}`);

    window.setTimeout(() => {
      this.output(`${C.BRIGHT_CYAN}Scanning subject...${C.RESET}`);
    }, 220);

    window.setTimeout(() => {
      this.handlers.openWindow?.('about');
      this.output(`${C.BRIGHT_CYAN}Opened about window.${C.RESET}`);
    }, 560);
  }

  skills() {
    this.handlers.openWindow?.('skills');
    this.output(`${C.BRIGHT_CYAN}Opened skills window.${C.RESET}`);
  }

  projects() {
    this.output(`${C.BLUE}Project workspace:${C.RESET} ${C.CYAN}cd projects${C.RESET}`);
    this.output(`${C.BRIGHT_GREEN}Then list:${C.RESET} ${C.BRIGHT_CYAN}ls${C.RESET}`);
    this.output(`${C.BRIGHT_MAGENTA}Open repo:${C.RESET} ${C.CYAN}github <project-name>${C.RESET}`);
    this.output(`${C.BRIGHT_YELLOW}Run demo:${C.RESET} ${C.BRIGHT_GREEN}run <project-name>${C.RESET}`);
  }

  contact() {
    this.handlers.openWindow?.('contact');
    this.output(`${C.BRIGHT_CYAN}Opened contact window.${C.RESET}`);
  }

  ls(path = '.') {
    const result = this.fs.listDirectory(path);
    if (!result.success) {
      this.output(`${C.RED}${result.error}${C.RESET}`);
      return;
    }

    if (result.items.length === 0) {
      this.output(`${C.CYAN}Empty directory${C.RESET}`);
      return;
    }

    const inProjectsDir = this.fs.getCurrentPath().includes('projects') && path === '.';
    if (inProjectsDir) {
      this.output(result.items.map((item) => item.name).join('\n'));
      return;
    }

    const output = result.items
      .map((item) => {
        const icon = item.isDir ? '[DIR]' : '[FILE]';
        const color = item.isDir ? C.BRIGHT_CYAN : C.RESET;
        return `  ${icon} ${color}${item.name}${C.RESET}`;
      })
      .join('\n');

    this.output(output);
  }

  cd(path) {
    if (!path) {
      this.fs.changeDirectory('~');
      return;
    }

    const result = this.fs.changeDirectory(path);
    if (!result.success) {
      this.output(`${C.RED}${result.error}${C.RESET}`);
    }
  }

  run(projectId) {
    if (!projectId) {
      this.output(`${C.RED}Usage: run [project-name]${C.RESET}`);
      this.output(`${C.CYAN}Example: run ai-tutor${C.RESET}`);
      return;
    }

    const project = this.getProject(projectId);
    if (!project) {
      this.output(`${C.RED}Project '${projectId}' not found.${C.RESET}`);
      this.output(`${C.CYAN}Use 'cd projects' then 'ls' to see available projects.${C.RESET}`);
      return;
    }

    if (project.deployed && project.demo) {
      this.output(`${C.GREEN}Opening demo: ${project.demo}${C.RESET}`);
      this.handlers.openUrl?.(project.demo);
    } else {
      const githubUrl = `https://github.com/${project.repo}`;
      this.output(`${C.YELLOW}Not deployed github repo: ${githubUrl}${C.RESET}`);
    }
  }

  github(projectId) {
    if (!projectId) {
      this.output(`${C.RED}Usage: github [project-name]${C.RESET}`);
      return;
    }

    const project = this.getProject(projectId);
    if (!project) {
      this.output(`${C.RED}Project '${projectId}' not found.${C.RESET}`);
      return;
    }

    const githubUrl = `https://github.com/${project.repo}`;
    this.output(`${C.GREEN}Opening GitHub: ${githubUrl}${C.RESET}`);
    this.handlers.openUrl?.(githubUrl);
  }

  clear() {
    this.output('__CLEAR__');
  }

  whoami() {
    this.output(`${C.BRIGHT_MAGENTA}${profileData.username}${C.RESET}`);
  }

  pwd() {
    this.output(`${C.BRIGHT_CYAN}${this.fs.currentPath}${C.RESET}`);
  }

  echo(text) {
    this.output(text || '');
  }

  neofetch() {
    this.output(`${C.BRIGHT_CYAN}
    _____         ${C.BRIGHT_GREEN}${profileData.username}@neko${C.RESET}
   /  __ \        ${C.CYAN}-------------------${C.RESET}
   | |  | |       ${C.BRIGHT_YELLOW}OS:${C.RESET} neko.OS v1.0.0
   | |  | |       ${C.BRIGHT_MAGENTA}Kernel:${C.RESET} JavaScript
   | |__| |       ${C.BRIGHT_CYAN}Uptime:${C.RESET} ${Math.floor(performance.now() / 1000)}s
   \_____/        ${C.GREEN}Shell:${C.RESET} xterm.js
                  ${C.BLUE}Resolution:${C.RESET} ${window.innerWidth}x${window.innerHeight}
   neko.OS        ${C.YELLOW}Terminal:${C.RESET} NekoTerminal
                  ${C.MAGENTA}Theme:${C.RESET} Neon Forest${C.RESET}
`);
  }

  getProject(projectName) {
    const normalizedName = projectName.toLowerCase().trim();
    return projectsData.find((project) => project.name.toLowerCase() === normalizedName);
  }

  autocomplete(line) {
    const trimmed = line.trimStart();
    const endsWithSpace = /\s$/.test(line);
    const tokens = trimmed ? trimmed.split(/\s+/) : [];

    if (tokens.length === 0) {
      return line;
    }

    if (tokens.length === 1 && !endsWithSpace) {
      const matches = this.availableCommands.filter((command) => command.startsWith(tokens[0].toLowerCase()));
      return this.applyAutocomplete(line, tokens[0], matches);
    }

    const command = tokens[0].toLowerCase();
    const argument = endsWithSpace ? '' : tokens[tokens.length - 1];
    const replacer = (value) => {
      const commandPrefix = line.slice(0, line.lastIndexOf(argument));
      return `${commandPrefix}${value}`;
    };

    if (command === 'run' || command === 'github') {
      const matches = projectsData
        .map((project) => project.name)
        .filter((name) => name.startsWith(argument.toLowerCase()));

      return this.applyAutocomplete(line, argument, matches, replacer);
    }

    if (command === 'cd') {
      const directoryResult = this.fs.listDirectory('.');
      const directoryNames = directoryResult.success
        ? directoryResult.items.filter((item) => item.isDir).map((item) => item.name)
        : [];
      const candidates = [...new Set(['~', '..', ...directoryNames])];
      const matches = candidates.filter((name) => name.startsWith(argument));
      return this.applyAutocomplete(line, argument, matches, replacer);
    }

    return line;
  }

  applyAutocomplete(line, token, matches, replacer = null) {
    if (matches.length === 0) {
      return line;
    }

    if (matches.length === 1) {
      const match = `${matches[0]} `;
      if (!token) {
        return `${line}${match}`;
      }

      if (replacer) {
        return replacer(match);
      }

      const prefixLength = line.length - token.length;
      return `${line.slice(0, prefixLength)}${match}`;
    }

    this.output(matches.join('  '));
    return line;
  }

  getPreviousCommand() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      return this.commandHistory[this.historyIndex];
    }
    return null;
  }

  getNextCommand() {
    if (this.historyIndex < this.commandHistory.length - 1) {
      this.historyIndex++;
      return this.commandHistory[this.historyIndex];
    }
    this.historyIndex = this.commandHistory.length;
    return '';
  }
}
