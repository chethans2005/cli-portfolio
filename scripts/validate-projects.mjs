import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const filePath = path.resolve(process.cwd(), 'src/data/projects.json');
const raw = fs.readFileSync(filePath, 'utf8');
const projects = JSON.parse(raw);

const errors = [];

if (!Array.isArray(projects)) {
  errors.push('projects.json must be an array.');
}

const seenIds = new Set();
const seenNames = new Set();

for (let i = 0; i < projects.length; i += 1) {
  const p = projects[i];
  const indexLabel = `projects[${i}]`;

  if (!p || typeof p !== 'object') {
    errors.push(`${indexLabel} must be an object.`);
    continue;
  }

  if (!p.id || typeof p.id !== 'string') {
    errors.push(`${indexLabel}.id is required and must be a string.`);
  } else if (seenIds.has(p.id)) {
    errors.push(`${indexLabel}.id '${p.id}' is duplicated.`);
  } else {
    seenIds.add(p.id);
  }

  if (!p.name || typeof p.name !== 'string') {
    errors.push(`${indexLabel}.name is required and must be a string.`);
  } else if (seenNames.has(p.name.toLowerCase())) {
    errors.push(`${indexLabel}.name '${p.name}' is duplicated.`);
  } else {
    seenNames.add(p.name.toLowerCase());
  }

  if (!p.repo && !p.githubUrl) {
    errors.push(`${indexLabel} must define either repo or githubUrl.`);
  }

  if (p.status && !['planned', 'in-progress', 'shipped', 'archived'].includes(p.status)) {
    errors.push(`${indexLabel}.status '${p.status}' is invalid.`);
  }

  if (p.deployed && !(p.demoUrl || p.demo)) {
    errors.push(`${indexLabel} is deployed but missing demoUrl.`);
  }

  if (p.technologies && !Array.isArray(p.technologies)) {
    errors.push(`${indexLabel}.technologies must be an array when provided.`);
  }

  if (p.categories && !Array.isArray(p.categories)) {
    errors.push(`${indexLabel}.categories must be an array when provided.`);
  }

  if (p.highlights && !Array.isArray(p.highlights)) {
    errors.push(`${indexLabel}.highlights must be an array when provided.`);
  }
}

if (errors.length > 0) {
  console.error('Project catalog validation failed:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Project catalog validation passed (${projects.length} entries).`);
