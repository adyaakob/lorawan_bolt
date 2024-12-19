import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const basePath = '/lorawan_bolt';

function updatePaths(filePath) {
  let content = readFileSync(filePath, 'utf8');
  
  // Update internal links
  content = content.replace(/href="\//g, `href="${basePath}/`);
  content = content.replace(/src="\//g, `src="${basePath}/`);
  
  // Update relative paths
  content = content.replace(/href="(?!http|#|\/lorawan_bolt)(.*?)"/g, `href="${basePath}/$1"`);
  content = content.replace(/src="(?!http|#|\/lorawan_bolt)(.*?)"/g, `src="${basePath}/$1"`);
  
  // Fix any double slashes in paths
  content = content.replace(/\/\//g, '/');
  
  // Don't modify external URLs
  content = content.replace(`${basePath}/http`, 'http');
  
  writeFileSync(filePath, content);
  console.log(`Updated paths in ${filePath}`);
}

function traverseDirectory(dir) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      traverseDirectory(fullPath);
    } else if (extname(file) === '.html') {
      updatePaths(fullPath);
    }
  });
}

// Start from the project root
traverseDirectory(join(__dirname));
