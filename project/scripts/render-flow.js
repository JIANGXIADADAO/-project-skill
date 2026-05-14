#!/usr/bin/env node
/**
 * Render flow.yaml → FLOW.md
 * Usage: node render-flow.js <flow.yaml path> [output path]
 * If output path omitted, writes to stdout.
 */

const fs = require('fs');
const path = require('path');

function parseFlowYaml(text) {
  const features = [];
  let current = null;

  for (const line of text.split('\n')) {
    // Match feature start: "  - id: F001"
    const idMatch = line.match(/^\s*- id:\s*(\S+)/);
    if (idMatch) {
      if (current) features.push(current);
      current = { id: idMatch[1], name: '', description: '', depends_on: [], verification: '', status: 'planned' };
      continue;
    }
    if (!current) continue;

    const nameMatch = line.match(/^\s*name:\s*"(.+)"$/);
    if (nameMatch) { current.name = nameMatch[1]; continue; }

    const descMatch = line.match(/^\s*description:\s*"(.+)"$/);
    if (descMatch) { current.description = descMatch[1]; continue; }

    const statusMatch = line.match(/^\s*status:\s*(\S+)$/);
    if (statusMatch) { current.status = statusMatch[1]; continue; }

    const verifyMatch = line.match(/^\s*verification:\s*"(.+)"$/);
    if (verifyMatch) { current.verification = verifyMatch[1]; continue; }

    // depends_on as inline list: "depends_on: [F001, F002]" or "depends_on: []"
    const depsMatch = line.match(/^\s*depends_on:\s*\[(.*)\]$/);
    if (depsMatch) {
      const deps = depsMatch[1].trim();
      if (deps) {
        current.depends_on = deps.split(',').map(s => s.trim()).filter(Boolean);
      }
      continue;
    }
  }
  if (current) features.push(current);
  return features;
}

function renderMarkdown(features, projectName, version) {
  const statusIcon = { implemented: '✅', verified: '✅', broken: '❌', planned: '⬜' };

  let md = `# ${projectName || 'Project'} — Feature Map (${version || 'v1'})\n\n`;
  md += `**Generated**: ${new Date().toISOString().slice(0, 10)}\n\n`;

  // Feature list
  md += '## Features\n\n';
  md += '| ID | Name | Depends On | Status | Verification |\n';
  md += '|----|------|------------|--------|-------------|\n';
  for (const f of features) {
    const deps = f.depends_on.length ? f.depends_on.join(', ') : '—';
    const icon = statusIcon[f.status] || '⬜';
    md += `| ${f.id} | ${f.name} | ${deps} | ${icon} ${f.status} | ${f.verification} |\n`;
  }

  // Summary
  const counts = {};
  for (const f of features) {
    counts[f.status] = (counts[f.status] || 0) + 1;
  }
  md += '\n## Summary\n\n';
  md += `- Total: ${features.length}\n`;
  for (const [status, count] of Object.entries(counts)) {
    const icon = statusIcon[status] || '';
    md += `- ${icon} ${status}: ${count}\n`;
  }

  // Dependency graph
  md += '\n## Dependency Graph\n\n```mermaid\ngraph TD\n';
  for (const f of features) {
    const label = `${f.id}[${f.name}]`;
    for (const dep of f.depends_on) {
      md += `  ${dep} --> ${f.id}\n`;
    }
  }
  // Also add standalone nodes
  for (const f of features) {
    if (!f.depends_on.length) {
      // Check if any feature depends on this
      const hasDependents = features.some(other => other.depends_on.includes(f.id));
      if (!hasDependents) {
        md += `  ${f.id}[${f.name}]\n`;
      }
    }
  }
  md += '```\n';

  return md;
}

// Main
const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node render-flow.js <flow.yaml> [output.md]');
  process.exit(1);
}

const yamlText = fs.readFileSync(inputPath, 'utf-8');
const features = parseFlowYaml(yamlText);

// Try to determine project name and version from context
const statePath = path.join(path.dirname(inputPath), 'state.json');
let projectName = '';
let version = '';
try {
  const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
  projectName = state.project_name || '';
  version = state.current_version || '';
} catch (_) {}

const output = renderMarkdown(features, projectName, version);

const outputPath = process.argv[3];
if (outputPath) {
  fs.writeFileSync(outputPath, output, 'utf-8');
  console.log(`FLOW.md written to ${outputPath}`);
} else {
  process.stdout.write(output);
}
