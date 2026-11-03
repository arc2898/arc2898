import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const output = resolve(root, 'data/weekly.json');
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function get(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`GitHub API ${response.status}: ${url}`);
  return response.json();
}

const [profile, repositories] = await Promise.all([
  get('https://api.github.com/users/arc2898'),
  get('https://api.github.com/users/arc2898/repos?type=owner&per_page=100&sort=updated'),
]);
const publicRepos = repositories.filter(repo => !repo.private);
const now = new Date();
const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - ((now.getUTCDay() + 6) % 7)));
const snapshot = {
  weekOf: monday.toISOString().slice(0, 10),
  capturedAt: now.toISOString(),
  publicRepos: publicRepos.length,
  stars: publicRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
  forks: publicRepos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
  followers: profile.followers || 0,
  languages: [...new Set(publicRepos.map(repo => repo.language).filter(Boolean))].sort(),
};
let data = { snapshots: [] };
try { data = JSON.parse(await readFile(output, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const snapshots = (data.snapshots || []).filter(item => item.weekOf !== snapshot.weekOf);
snapshots.push(snapshot);
data = { snapshots: snapshots.sort((a, b) => a.weekOf.localeCompare(b.weekOf)).slice(-16) };
await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Saved snapshot for ${snapshot.weekOf}: ${snapshot.publicRepos} public repositories.`);
