#!/usr/bin/env node
/**
 * Scan project directory → PROJECT_STRUCTURE.md
 * Usage: node scan-structure.js <project-root> <output-path> [flow.yaml path]
 */

const fs = require('fs');
const path = require('path');

const EXCLUDE_DIRS = new Set([
  'node_modules', '.git', '__pycache__', '.venv', 'venv',
  'dist', 'build', '.next', '.turbo', '.cache', 'coverage',
  '.claude-project', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9',
  '.claude', '.idea', '.vscode'
]);

const EXCLUDE_FILES = new Set([
  '.DS_Store', 'Thumbs.db', '.env', '.env.local'
]);

const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp',
  '.woff', '.woff2', '.ttf', '.eot',
  '.mp3', '.mp4', '.webm', '.wav',
  '.pdf', '.zip', '.tar', '.gz'
]);

function shouldExcludeDir(name) {
  return EXCLUDE_DIRS.has(name) || name.startsWith('.');
}

function shouldExcludeFile(name) {
  if (EXCLUDE_FILES.has(name)) return true;
  const ext = path.extname(name).toLowerCase();
  return BINARY_EXTENSIONS.has(ext);
}

function loadFeatureMap(flowPath) {
  if (!flowPath) return {};
  try {
    const text = fs.readFileSync(flowPath, 'utf-8');
    const map = {};
    const lines = text.split('\n');
    let currentId = null;
    for (const line of lines) {
      const idMatch = line.match(/^\s*- id:\s*(\S+)/);
      if (idMatch) { currentId = idMatch[1]; continue; }
      if (currentId) {
        const nameMatch = line.match(/^\s*name:\s*"(.+)"$/);
        if (nameMatch) { map[currentId] = nameMatch[1]; currentId = null; continue; }
      }
    }
    return map;
  } catch (_) {
    return {};
  }
}

function scanDir(dirPath, rootPath, featureMap, prefix = '') {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  // Sort: dirs first, then files
  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  let output = '';
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const isLast = i === entries.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const childPrefix = prefix + (isLast ? '    ' : '│   ');

    if (entry.isDirectory()) {
      if (shouldExcludeDir(entry.name)) {
        output += `${prefix}${connector}${entry.name}/ [...]\n`;
      } else {
        output += `${prefix}${connector}${entry.name}/\n`;
        const fullPath = path.join(dirPath, entry.name);
        output += scanDir(fullPath, rootPath, featureMap, childPrefix);
      }
    } else {
      if (shouldExcludeFile(entry.name)) continue;
      const fullPath = path.join(dirPath, entry.name);
      const relPath = path.relative(rootPath, fullPath).replace(/\\/g, '/');

      // Check if file maps to a feature
      const basename = path.basename(entry.name, path.extname(entry.name));
      let annotation = '';
      for (const [fid, fname] of Object.entries(featureMap)) {
        if (basename.toLowerCase().includes(fname.toLowerCase().replace(/\s+/g, '').slice(0, 6))) {
          annotation = `  (${fid})`;
          break;
        }
      }

      output += `${prefix}${connector}${entry.name}${annotation}\n`;
    }
  }
  return output;
}

function generateModuleMap(featureMap, rootPath) {
  // Build a suggested mapping by scanning for feature names in files
  let table = '';
  for (const [fid, fname] of Object.entries(featureMap)) {
    table += `| | ${fid} | ${fname} |\n`;
  }
  return table;
}

// Main
const rootPath = process.argv[2];
const outputPath = process.argv[3];
const flowPath = process.argv[4];

if (!rootPath || !outputPath) {
  console.error('Usage: node scan-structure.js <project-root> <output.md> [flow.yaml]');
  process.exit(1);
}

const featureMap = loadFeatureMap(flowPath);

const tree = scanDir(rootPath, rootPath, featureMap);

let md = '# Project Structure\n\n';
md += `**Generated**: ${new Date().toISOString().slice(0, 19).replace('T', ' ')}\n\n`;
md += '## Directory Tree\n\n```\n';
md += path.basename(rootPath) + '/\n';
md += tree;
md += '```\n\n';

if (Object.keys(featureMap).length > 0) {
  md += '## Module → Feature Mapping\n\n';
  md += '| Module/File | Feature ID | Feature Name |\n';
  md += '|-------------|-----------|-------------|\n';
  md += generateModuleMap(featureMap, rootPath);
}

fs.writeFileSync(outputPath, md, 'utf-8');
console.log(`PROJECT_STRUCTURE.md written to ${outputPath}`);
