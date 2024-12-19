const fs = require('fs');
const path = require('path');

const basePath = '/lorawan_bolt';

function updatePaths(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
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
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated paths in ${filePath}`);
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      traverseDirectory(fullPath);
    } else if (path.extname(file) === '.html') {
      updatePaths(fullPath);
    }
  });
}

// Start from the project root
traverseDirectory(path.join(__dirname));
