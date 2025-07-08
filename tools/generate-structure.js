const fs = require('fs');
const path = require('path');

const IGNORE = ['node_modules', '.git', '.github', '.DS_Store'];

function walk(dir, prefix = '', depth = 0) {
  const items = fs.readdirSync(dir).filter(i => !IGNORE.includes(i));
  let tree = '';

  items.forEach((item, index) => {
    const fullPath = path.join(dir, item);
    const isDir = fs.statSync(fullPath).isDirectory();
    const pointer = index === items.length - 1 ? '└── ' : '├── ';
    const line = `${prefix}${pointer}${item}${isDir ? '/' : ''}\n`;

    tree += line;

    if (isDir) {
      const newPrefix = prefix + (index === items.length - 1 ? '    ' : '│   ');
      tree += walk(fullPath, newPrefix, depth + 1);
    }
  });

  return tree;
}

const root = '.';
const outputFile = 'project-structure.md';

const content = `\`\`\`text\n${walk(root)}\`\`\``;

fs.writeFileSync(outputFile, content);
console.log(`✅ Folder structure written to ${outputFile}`);
