import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function updateModules(filePath) {
  let content = readFileSync(filePath, 'utf8');
  
  // Add type="module" to external scripts
  content = content.replace(/<script src="(https:\/\/[^"]+)"><\/script>/g, '<script type="module" src="$1"></script>');
  
  // Update local script paths
  content = content.replace(/src="src\//g, 'src="./src/');
  content = content.replace(/href="src\//g, 'href="./src/');
  
  // Update relative paths for pages
  if (filePath.includes('/pages/')) {
    content = content.replace(/src="\.\//g, 'src="../');
    content = content.replace(/href="\.\//g, 'href="../');
  }
  
  writeFileSync(filePath, content);
  console.log(`Updated modules in ${filePath}`);
}

function traverseDirectory(dir) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      traverseDirectory(fullPath);
    } else if (extname(file) === '.html') {
      updateModules(fullPath);
    }
  });
}

// Start from the project root
traverseDirectory(join(__dirname));
