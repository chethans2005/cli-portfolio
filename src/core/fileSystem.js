import projectsData from '../data/projects.json';

export class FileSystem {
  constructor() {
    const projectChildren = projectsData.reduce((acc, project) => {
      if (project?.name) {
        acc[project.name] = { type: 'dir', children: {} };
      }
      return acc;
    }, {});

    this.currentPath = '/home/chethan';
    this.structure = {
      '/': {
        type: 'dir',
        children: {
          'home': {
            type: 'dir',
            children: {
              'chethan': {
                type: 'dir',
                children: {
                  'projects': {
                    type: 'dir',
                    children: projectChildren
                  },
                  'about.txt': { type: 'file' },
                  'skills.txt': { type: 'file' },
                  'contact.txt': { type: 'file' },
                }
              }
            }
          }
        }
      }
    };
  }

  getCurrentPath() {
    return this.currentPath === '/home/chethan' ? '~' : this.currentPath;
  }

  normalizePath(path) {
    if (path === '~') return '/home/chethan';
    if (path === '..') {
      const parts = this.currentPath.split('/').filter(Boolean);
      parts.pop();
      return '/' + parts.join('/') || '/';
    }
    if (path.startsWith('/')) return path;
    if (path === '.') return this.currentPath;
    
    // Relative path
    return this.currentPath === '/' 
      ? '/' + path 
      : this.currentPath + '/' + path;
  }

  getNode(path) {
    const normalizedPath = this.normalizePath(path);
    const parts = normalizedPath.split('/').filter(Boolean);
    let current = this.structure['/'];

    for (const part of parts) {
      if (!current.children || !current.children[part]) {
        return null;
      }
      current = current.children[part];
    }

    return current;
  }

  changeDirectory(path) {
    if (path === '/') {
      this.currentPath = '/';
      return { success: true };
    }

    const node = this.getNode(path);
    if (!node) {
      return { success: false, error: `cd: ${path}: No such file or directory` };
    }
    if (node.type !== 'dir') {
      return { success: false, error: `cd: ${path}: Not a directory` };
    }

    this.currentPath = this.normalizePath(path);
    return { success: true };
  }

  listDirectory(path = '.') {
    const node = this.getNode(path);
    if (!node) {
      return { success: false, error: `ls: cannot access '${path}': No such file or directory` };
    }
    if (node.type !== 'dir') {
      return { success: false, error: `ls: ${path}: Not a directory` };
    }

    const items = Object.keys(node.children || {}).map(name => {
      const item = node.children[name];
      return {
        name,
        type: item.type,
        isDir: item.type === 'dir'
      };
    });

    return { success: true, items };
  }

  getPromptPath() {
    return this.currentPath.replace('/home/chethan', '~');
  }
}
