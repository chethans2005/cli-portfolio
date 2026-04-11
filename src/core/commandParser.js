import profileData from '../data/profile.json';
import {
  findProjectByQuery,
  getProjectAutocompleteTokens,
  getProjectCatalog,
  getProjectCatalogSummary,
  projectCatalogErrors,
} from '../data/projectCatalog';

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
    this.projects = getProjectCatalog();
    this.availableCommands = [
      'help',
      'about',
      'skills',
      'projects',
      'project',
      'stats',
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
      'exit',
    ];
  }

  executeCommand(input) {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    this.commandHistory.push(trimmedInput);
    this.historyIndex = this.commandHistory.length;

    const [command, ...args] = trimmedInput.split(/\s+/);
    const normalizedCommand = command.replace(/^\/+/, '');
    const cmd = normalizedCommand.toLowerCase();

    const commands = {
      help: () => this.help(),
      about: () => this.about(),
      skills: () => this.skills(),
      projects: () => this.listProjects(args),
      project: () => this.projectInfo(args.join(' ')),
      stats: () => this.stats(),
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
      exit: () => this.exit(),
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
  ${C.GREEN}ls${C.RESET}          - List directory contents
  ${C.GREEN}cd${C.RESET} [dir]    - Change directory
  ${C.GREEN}pwd${C.RESET}         - Print working directory
  ${C.GREEN}whoami${C.RESET}      - Display current user
  ${C.BRIGHT_MAGENTA}about${C.RESET}       - Learn more about me
  ${C.BRIGHT_MAGENTA}skills${C.RESET}      - View my technical skills
  ${C.BRIGHT_MAGENTA}contact${C.RESET}     - Get in touch
  ${C.BLUE}projects${C.RESET} [flags] - Browse projects (try --live or --featured)
  ${C.BLUE}project${C.RESET} <name> - Show project details
  ${C.BLUE}stats${C.RESET}       - Portfolio project stats
  ${C.BRIGHT_CYAN}run${C.RESET} [proj]  - Run a project demo
  ${C.BRIGHT_CYAN}github${C.RESET} [pr] - Open project or profile on GitHub
  ${C.BRIGHT_MAGENTA}neofetch${C.RESET}    - System information
  ${C.YELLOW}clear${C.RESET}       - Clear terminal
  ${C.RED}exit${C.RESET}          - Exit the terminal

${C.BRIGHT_YELLOW}Project Flags:${C.RESET}
  ${C.CYAN}projects --all${C.RESET}
  ${C.CYAN}projects --featured${C.RESET}
  ${C.CYAN}projects --live${C.RESET}
  ${C.CYAN}projects --wip${C.RESET}
  ${C.CYAN}projects --category=<name>${C.RESET}
  ${C.CYAN}projects --sort=name|newest|stars${C.RESET}`);
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

  listProjects(args = []) {
    if (projectCatalogErrors.length > 0) {
      this.output(`${C.YELLOW}Catalog warnings:${C.RESET}`);
      projectCatalogErrors.forEach((warning) => this.output(`  - ${warning}`));
    }

    const summary = getProjectCatalogSummary();
    let filtered = [...this.projects];

    const categoryFilter = this.getOptionValue(args, '--category');
    const sort = this.getOptionValue(args, '--sort');
    const hasFlags = args.some((arg) => arg.startsWith('--'));

    if (args.includes('--featured')) {
      filtered = filtered.filter((project) => project.featured);
    }

    if (args.includes('--live')) {
      filtered = filtered.filter((project) => project.deployed && project.demoUrl);
    }

    if (args.includes('--wip')) {
      filtered = filtered.filter((project) => ['in-progress', 'planned'].includes(project.status));
    }

    if (categoryFilter) {
      const normalizedCategory = categoryFilter.toLowerCase();
      filtered = filtered.filter((project) =>
        project.categories.some((category) => category.toLowerCase() === normalizedCategory)
      );
    }

    if (sort === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'newest') {
      filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
    } else if (sort === 'stars') {
      filtered.sort((a, b) => (b.stars || 0) - (a.stars || 0));
    }

    if (!hasFlags) {
      this.output(`${C.BLUE}Project catalog:${C.RESET} ${summary.total} total | ${summary.live} live | ${summary.featured} featured`);
      this.output(`${C.CYAN}Tip:${C.RESET} projects --featured | projects --live | project <name>`);
      this.output('');
      filtered = filtered.slice(0, 4);
    }

    if (filtered.length === 0) {
      this.output(`${C.RED}No projects matched your filters.${C.RESET}`);
      return;
    }

    filtered.forEach((project) => {
      const status = this.formatStatus(project.status);
      this.output(`  ${status} ${C.BRIGHT_CYAN}${project.name}${C.RESET}  ${C.MAGENTA}(${project.id})${C.RESET}`);
    });

    this.output('');
    this.output(`${C.BRIGHT_MAGENTA}Open repo:${C.RESET} github <project-name>`);
    this.output(`${C.BRIGHT_YELLOW}Run demo:${C.RESET} run <project-name>`);
    this.output(`${C.BRIGHT_GREEN}Inspect details:${C.RESET} project <project-name>`);
  }

  projectInfo(projectQuery) {
    if (!projectQuery) {
      this.output(`${C.RED}Usage: project <project-name>${C.RESET}`);
      return;
    }

    const project = this.getProject(projectQuery);
    if (!project) {
      this.output(`${C.RED}Project '${projectQuery}' not found.${C.RESET}`);
      this.output(`${C.CYAN}Try:${C.RESET} projects --all`);
      return;
    }

    this.output(`${C.BRIGHT_CYAN}${C.BOLD}${project.name}${C.RESET} ${this.formatStatus(project.status)}`);
    this.output(`${C.GREEN}ID:${C.RESET} ${project.id}`);
    if (project.year) this.output(`${C.GREEN}Year:${C.RESET} ${project.year}`);
    this.output(`${C.GREEN}Description:${C.RESET} ${project.description}`);

    if (project.technologies.length > 0) {
      this.output(`${C.GREEN}Tech:${C.RESET} ${project.technologies.join(', ')}`);
    }

    if (project.categories.length > 0) {
      this.output(`${C.GREEN}Categories:${C.RESET} ${project.categories.join(', ')}`);
    }

    if (project.highlights.length > 0) {
      this.output(`${C.GREEN}Highlights:${C.RESET}`);
      project.highlights.forEach((item) => this.output(`  - ${item}`));
    }

    this.output(`${C.BRIGHT_MAGENTA}Repo:${C.RESET} ${project.repoUrl || 'N/A'}`);
    this.output(`${C.BRIGHT_YELLOW}Demo:${C.RESET} ${project.demoUrl || 'Not deployed yet'}`);
  }

  stats() {
    const summary = getProjectCatalogSummary();
    this.output(`${C.BRIGHT_CYAN}${C.BOLD}Portfolio Stats${C.RESET}`);
    this.output(`${C.GREEN}Total projects:${C.RESET} ${summary.total}`);
    this.output(`${C.GREEN}Live demos:${C.RESET} ${summary.live}`);
    this.output(`${C.GREEN}Featured:${C.RESET} ${summary.featured}`);
    this.output(`${C.GREEN}In progress:${C.RESET} ${summary.inProgress}`);
    this.output(`${C.GREEN}Planned:${C.RESET} ${summary.planned}`);
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
      const projectMap = new Map(this.projects.map((project) => [project.name, project]));
      const lines = result.items.map((item) => {
        const project = projectMap.get(item.name);
        if (!project) return item.name;
        return `${this.formatStatus(project.status)} ${item.name}`;
      });
      this.output(lines.join('\n'));
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
      this.output(`${C.CYAN}Example: run neko.ai${C.RESET}`);
      return;
    }

    const project = this.getProject(projectId);
    if (!project) {
      this.output(`${C.RED}Project '${projectId}' not found.${C.RESET}`);
      this.output(`${C.CYAN}Use 'cd projects' then 'ls' to see available projects.${C.RESET}`);
      return;
    }

    if (project.deployed && project.demoUrl) {
      this.output(`${C.GREEN}Opening demo: ${project.demoUrl}${C.RESET}`);
      this.handlers.openUrl?.(project.demoUrl);
    } else {
      this.output(`${C.YELLOW}Project is not deployed yet.${C.RESET}`);
      if (project.repoUrl) {
        this.output(`${C.BRIGHT_MAGENTA}Opening repo instead: ${project.repoUrl}${C.RESET}`);
        this.handlers.openUrl?.(project.repoUrl);
      }
    }
  }

  github(projectId) {
    if (!projectId) {
      if (profileData.github) {
        this.output(`${C.GREEN}Opening profile GitHub: ${profileData.github}${C.RESET}`);
        this.handlers.openUrl?.(profileData.github);
      } else {
        this.output(`${C.RED}Usage: github [project-name]${C.RESET}`);
      }
      return;
    }

    const project = this.getProject(projectId);
    if (!project) {
      this.output(`${C.RED}Project '${projectId}' not found.${C.RESET}`);
      return;
    }

    if (!project.repoUrl) {
      this.output(`${C.RED}No GitHub URL configured for '${project.name}'.${C.RESET}`);
      return;
    }

    this.output(`${C.GREEN}Opening GitHub: ${project.repoUrl}${C.RESET}`);
    this.handlers.openUrl?.(project.repoUrl);
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
   /  __ \\       ${C.CYAN}-------------------${C.RESET}
   | |  | |       ${C.BRIGHT_YELLOW}OS:${C.RESET} neko.OS v1.0.0
   | |  | |       ${C.BRIGHT_MAGENTA}Kernel:${C.RESET} JavaScript
   | |__| |       ${C.BRIGHT_CYAN}Uptime:${C.RESET} ${Math.floor(performance.now() / 1000)}s
   \\_____/        ${C.GREEN}Shell:${C.RESET} xterm.js
                  ${C.BLUE}Resolution:${C.RESET} ${window.innerWidth}x${window.innerHeight}
   neko.OS        ${C.YELLOW}Terminal:${C.RESET} NekoTerminal
                  ${C.GREEN}Projects:${C.RESET} ${getProjectCatalogSummary().total} tracked
                  ${C.MAGENTA}Theme:${C.RESET} Neon Forest${C.RESET}
`);
  }

  exit() {
    this.output(`${C.YELLOW}Shutting down neko.OS...${C.RESET}`);
    window.setTimeout(() => {
      this.output(`${C.RED}Goodbye!${C.RESET}`);
      window.setTimeout(() => {
        const closed = window.close();
        if (!closed) {
          window.location.href = 'about:blank';
        }
      }, 800);
    }, 1200);
  }

  getProject(projectName) {
    return findProjectByQuery(projectName);
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
    const argumentIndex = endsWithSpace ? line.length : line.lastIndexOf(tokens[tokens.length - 1]);
    const replacer = (value) => `${line.slice(0, argumentIndex)}${value}`;

    if (command === 'run' || command === 'github' || command === 'project') {
      const matches = getProjectAutocompleteTokens().filter((name) =>
        name.toLowerCase().startsWith(argument.toLowerCase())
      );

      return this.applyAutocomplete(line, argument, matches, replacer);
    }

    if (command === 'projects') {
      const flagCandidates = [
        '--all',
        '--featured',
        '--live',
        '--wip',
        '--sort=name',
        '--sort=newest',
        '--sort=stars',
        '--category=ai',
        '--category=frontend',
        '--category=tooling',
      ];

      const matches = flagCandidates.filter((flag) =>
        flag.toLowerCase().startsWith(argument.toLowerCase())
      );

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
      if (!token) return `${line}${match}`;
      if (replacer) return replacer(match);
      return `${line.slice(0, line.length - token.length)}${match}`;
    }

    const lcp = matches.reduce((prefix, match) => {
      let i = 0;
      while (
        i < prefix.length &&
        i < match.length &&
        prefix[i].toLowerCase() === match[i].toLowerCase()
      ) {
        i++;
      }
      return prefix.slice(0, i);
    }, matches[0]);

    if (lcp.length > token.length) {
      if (replacer) return replacer(lcp);
      return `${line.slice(0, line.length - token.length)}${lcp}`;
    }

    this.output(`\n${matches.join('  ')}`);
    return null;
  }

  getOptionValue(args, key) {
    const option = args.find((arg) => arg.startsWith(`${key}=`));
    if (!option) return '';
    return option.slice(key.length + 1).trim();
  }

  formatStatus(status) {
    if (status === 'shipped') return `${C.BRIGHT_GREEN}[LIVE]${C.RESET}`;
    if (status === 'in-progress') return `${C.BRIGHT_YELLOW}[WIP ]${C.RESET}`;
    if (status === 'planned') return `${C.BLUE}[PLAN]${C.RESET}`;
    if (status === 'archived') return `${C.MAGENTA}[ARCH]${C.RESET}`;
    return `${C.CYAN}[INFO]${C.RESET}`;
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
