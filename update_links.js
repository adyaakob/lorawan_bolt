const fs = require('fs');
const path = require('path');

const basePath = '/lorawan_bolt/';

function updateLinks(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update href attributes
  content = content.replace(/href="((?!http|#|\/).*?)"/g, `href="${basePath}$1"`);
  
  // Update src attributes
  content = content.replace(/src="((?!http|#|\/).*?)"/g, `src="${basePath}$1"`);
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated links in ${filePath}`);
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      traverseDirectory(fullPath);
    } else if (path.extname(file) === '.html') {
      updateLinks(fullPath);
    }
  });
}

// Start from the project root
traverseDirectory(path.join(__dirname));
