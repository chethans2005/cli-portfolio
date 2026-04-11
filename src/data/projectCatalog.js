import rawProjects from './projects.json';

const STATUS_ORDER = {
  planned: 0,
  'in-progress': 1,
  shipped: 2,
  archived: 3,
};

function toSlug(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeProject(project, index) {
  const name = String(project?.name || '').trim();
  const id = String(project?.id || toSlug(name) || `project-${index + 1}`);
  const repoUrl = project?.githubUrl
    ? String(project.githubUrl)
    : project?.repo
      ? `https://github.com/${String(project.repo).replace(/^\/+/, '')}`
      : '';
  const demoUrl = String(project?.demoUrl || project?.demo || '').trim();
  const deployed = Boolean(project?.deployed ?? demoUrl);
  const status = String(
    project?.status || (deployed ? 'shipped' : 'in-progress')
  ).toLowerCase();

  return {
    id,
    name,
    slug: toSlug(name || id),
    description: String(project?.description || 'No description provided yet.'),
    technologies: Array.isArray(project?.technologies) ? project.technologies : [],
    highlights: Array.isArray(project?.highlights) ? project.highlights : [],
    categories: Array.isArray(project?.categories) ? project.categories : [],
    featured: Boolean(project?.featured),
    year: Number.isFinite(project?.year) ? project.year : null,
    stars: Number.isFinite(project?.stars) ? project.stars : null,
    status,
    statusOrder: STATUS_ORDER[status] ?? 9,
    deployed,
    demoUrl,
    repoUrl,
    private: Boolean(project?.private),
    order: Number.isFinite(project?.order) ? project.order : index + 1,
    source: project,
  };
}

export const projectCatalog = rawProjects
  .map(normalizeProject)
  .filter((project) => project.name);

export const projectCatalogErrors = projectCatalog
  .filter((project) => !project.repoUrl)
  .map((project) => `Project '${project.name}' is missing a repository URL.`);

export function getProjectCatalog() {
  return [...projectCatalog].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.order !== b.order) return a.order - b.order;
    return a.name.localeCompare(b.name);
  });
}

export function getProjectCatalogSummary() {
  const total = projectCatalog.length;
  const live = projectCatalog.filter((project) => project.deployed && project.demoUrl).length;
  const featured = projectCatalog.filter((project) => project.featured).length;
  const inProgress = projectCatalog.filter((project) => project.status === 'in-progress').length;
  const planned = projectCatalog.filter((project) => project.status === 'planned').length;

  return { total, live, featured, inProgress, planned };
}

function scoreProjectMatch(project, normalizedQuery) {
  if (!normalizedQuery) return -1;
  if (project.slug === normalizedQuery || project.id.toLowerCase() === normalizedQuery) return 100;
  if (project.name.toLowerCase() === normalizedQuery) return 98;
  if (project.slug.startsWith(normalizedQuery)) return 90;
  if (project.name.toLowerCase().startsWith(normalizedQuery)) return 85;
  if (project.slug.includes(normalizedQuery)) return 75;

  const tokens = normalizedQuery.split('-').filter(Boolean);
  const containsAllTokens = tokens.every((token) => project.slug.includes(token));
  if (containsAllTokens) return 70;

  return -1;
}

export function findProjectByQuery(query) {
  const normalizedQuery = toSlug(query);
  if (!normalizedQuery) return null;

  let best = null;
  for (const project of projectCatalog) {
    const score = scoreProjectMatch(project, normalizedQuery);
    if (score < 0) continue;
    if (!best || score > best.score) {
      best = { project, score };
    }
  }

  return best?.project || null;
}

export function getProjectAutocompleteTokens() {
  const tokens = new Set();
  for (const project of projectCatalog) {
    tokens.add(project.name);
    tokens.add(project.id);
    tokens.add(project.slug);
  }
  return Array.from(tokens);
}
