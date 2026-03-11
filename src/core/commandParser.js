import projectsData from '../data/projects.json';
import skillsData from '../data/skills.json';
import profileData from '../data/profile.json';

const C = {
  CYAN: '\x1b[36m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  MAGENTA: '\x1b[35m',
  RED: '\x1b[31m',
  BRIGHT_GREEN: '\x1b[92m',
  BRIGHT_CYAN: '\x1b[96m',
  BOLD: '\x1b[1m',
  RESET: '\x1b[0m',
};

export class CommandParser {
  constructor(fileSystem, outputHandler, windowManager) {
    this.fs = fileSystem;
    this.output = outputHandler;
    this.windowManager = windowManager;
    this.commandHistory = [];
    this.historyIndex = -1;
  }

  executeCommand(input) {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    this.commandHistory.push(trimmedInput);
    this.historyIndex = this.commandHistory.length;

    const [command, ...args] = trimmedInput.split(' ');
    const cmd = command.toLowerCase();

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

  ${C.GREEN}help${C.RESET}        - Show this help message
  ${C.GREEN}about${C.RESET}       - Learn more about me
  ${C.GREEN}skills${C.RESET}      - View my technical skills
  ${C.GREEN}projects${C.RESET}    - Browse my projects
  ${C.GREEN}contact${C.RESET}     - Get in touch
  ${C.GREEN}ls${C.RESET}          - List directory contents
  ${C.GREEN}cd${C.RESET} [dir]    - Change directory
  ${C.GREEN}pwd${C.RESET}         - Print working directory
  ${C.GREEN}run${C.RESET} [proj]  - Run a project demo
  ${C.GREEN}github${C.RESET} [pr] - Open project on GitHub
  ${C.GREEN}clear${C.RESET}       - Clear terminal
  ${C.GREEN}whoami${C.RESET}      - Display current user
  ${C.GREEN}neofetch${C.RESET}    - System information

${C.MAGENTA}Pro tip:${C.RESET} Use ${C.CYAN}cd projects${C.RESET} then ${C.CYAN}ls${C.RESET} to explore my work!`);
  }

  about() {
    this.output(`${C.BRIGHT_CYAN}╔════════════════════════════════════════════════════╗${C.RESET}
${C.BRIGHT_CYAN}║               ABOUT ${profileData.name.toUpperCase()}                        ║${C.RESET}
${C.BRIGHT_CYAN}╚════════════════════════════════════════════════════╝${C.RESET}

${C.GREEN}Name:${C.RESET}     ${profileData.name}
${C.GREEN}Role:${C.RESET}     ${profileData.title}
${C.GREEN}Location:${C.RESET} ${profileData.location}

${C.MAGENTA}About Me:${C.RESET}
${profileData.bio}

${C.YELLOW}Links:${C.RESET}
  GitHub:   ${profileData.github}
  LinkedIn: ${profileData.linkedin}
  Twitter:  ${profileData.twitter}`);
  }

  skills() {
    this.output(`${C.BRIGHT_CYAN}╔════════════════════════════════════════════════════╗${C.RESET}
${C.BRIGHT_CYAN}║              TECHNICAL SKILLS                      ║${C.RESET}
${C.BRIGHT_CYAN}╚════════════════════════════════════════════════════╝${C.RESET}

${C.GREEN}Languages:${C.RESET}
  ${skillsData.languages.join(' | ')}

${C.MAGENTA}Frontend:${C.RESET}
  ${skillsData.frontend.join(' | ')}

${C.YELLOW}Backend:${C.RESET}
  ${skillsData.backend.join(' | ')}

${C.RED}DevOps:${C.RESET}
  ${skillsData.devops.join(' | ')}

${C.BRIGHT_CYAN}Tools:${C.RESET}
  ${skillsData.tools.join(' | ')}`);
  }

  projects() {
    if (this.fs.getCurrentPath().includes('projects')) {
      const result = this.fs.listDirectory('.');
      if (result.success) {
        this.output(`${C.GREEN}Projects in this directory:${C.RESET}
${result.items.map(item => `  [DIR] ${item.name}`).join('\n')}

${C.MAGENTA}Tip:${C.RESET} Use ${C.CYAN}'run [project-name]'${C.RESET} to view demo
     Use ${C.CYAN}'github [project-name]'${C.RESET} to view source`);
      }
    } else {
      this.output(`${C.BRIGHT_CYAN}╔════════════════════════════════════════════════════╗${C.RESET}
${C.BRIGHT_CYAN}║                MY PROJECTS                         ║${C.RESET}
${C.BRIGHT_CYAN}╚════════════════════════════════════════════════════╝${C.RESET}

${projectsData.map((proj, idx) => `${C.GREEN}${idx + 1}. ${proj.name}${C.RESET}
   ${proj.description}
   ${C.BRIGHT_CYAN}Tech:${C.RESET} ${proj.technologies.join(', ')}
   ${C.MAGENTA}Status:${C.RESET} ${proj.deployed ? '[DEPLOYED]' : '[IN DEVELOPMENT]'}`).join('\n\n')}

${C.YELLOW}Navigate to projects:${C.RESET} ${C.CYAN}cd projects${C.RESET}`);
    }
  }

  contact() {
    this.output(`${C.BRIGHT_CYAN}╔════════════════════════════════════════════════════╗${C.RESET}
${C.BRIGHT_CYAN}║              GET IN TOUCH                          ║${C.RESET}
${C.BRIGHT_CYAN}╚════════════════════════════════════════════════════╝${C.RESET}

${C.GREEN}Email:${C.RESET}    ${profileData.email}
${C.MAGENTA}GitHub:${C.RESET}   ${profileData.github}
${C.YELLOW}LinkedIn:${C.RESET} ${profileData.linkedin}
${C.RED}Twitter:${C.RESET}  ${profileData.twitter}

${C.BRIGHT_CYAN}Feel free to reach out for collaborations or opportunities!${C.RESET}`);
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

    const output = result.items.map(item => {
      const icon = item.isDir ? '[DIR]' : '[FILE]';
      const color = item.isDir ? C.BRIGHT_CYAN : C.RESET;
      return `  ${icon} ${color}${item.name}${C.RESET}`;
    }).join('\n');

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

    const project = projectsData.find(p => p.id === projectId);
    if (!project) {
      this.output(`${C.RED}Project '${projectId}' not found.${C.RESET}`);
      this.output(`${C.CYAN}Use 'projects' to see available projects.${C.RESET}`);
      return;
    }

    if (project.deployed && project.demoUrl) {
      this.output(`${C.GREEN}[RUN] Launching ${project.name}...${C.RESET}`);
      setTimeout(() => {
        window.open(project.demoUrl, '_blank');
      }, 500);
    } else {
      this.output(`${C.YELLOW}[INFO] Project not deployed yet.${C.RESET}`);
      this.output(`${C.BRIGHT_CYAN}Use 'github ${projectId}' to view the source code.${C.RESET}`);
    }
  }

  github(projectId) {
    if (!projectId) {
      this.output(`${C.RED}Usage: github [project-name]${C.RESET}`);
      return;
    }

    const project = projectsData.find(p => p.id === projectId);
    if (!project) {
      this.output(`${C.RED}Project '${projectId}' not found.${C.RESET}`);
      return;
    }

    this.output(`${C.GREEN}[RUN] Opening GitHub repository...${C.RESET}`);
    setTimeout(() => {
      window.open(project.github, '_blank');
    }, 500);
  }

  clear() {
    this.output('__CLEAR__');
  }

  whoami() {
    this.output(`${C.GREEN}${profileData.username}${C.RESET}`);
  }

  pwd() {
    this.output(`${C.BRIGHT_CYAN}${this.fs.currentPath}${C.RESET}`);
  }

  echo(text) {
    this.output(text || '');
  }

  neofetch() {
    this.output(`${C.BRIGHT_CYAN}
    _____         ${C.GREEN}${profileData.username}@neko${C.RESET}
   |  __ \\        ${C.CYAN}-------------------${C.RESET}
   | |  | |       ${C.YELLOW}OS:${C.RESET} neko.OS v1.0.0
   | |  | |       ${C.YELLOW}Kernel:${C.RESET} JavaScript
   | |__| |       ${C.YELLOW}Uptime:${C.RESET} ${Math.floor(performance.now() / 1000)}s
   |_____/        ${C.YELLOW}Shell:${C.RESET} xterm.js
                  ${C.YELLOW}Resolution:${C.RESET} ${window.innerWidth}x${window.innerHeight}
   neko.OS        ${C.YELLOW}Terminal:${C.RESET} NekoTerminal
                  ${C.YELLOW}Theme:${C.RESET} Cyberpunk${C.RESET}
`);
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
