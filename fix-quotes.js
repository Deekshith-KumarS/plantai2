import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'ai-nursery-app', 'src');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // We have: fetch(`${API_URL}/api/some/path",
            // We want: fetch(`${API_URL}/api/some/path`,
            // Let's replace: /fetch\(\`\$\{API_URL\}\/api([^"]+)"/g  with  fetch(\`${API_URL}/api$1\`
            
            if (content.includes('fetch(`${API_URL}')) {
                const newContent = content.replace(/fetch\(\`\$\{API_URL\}\/api([^"]+)"/g, 'fetch(`${API_URL}/api$1`');
                if (content !== newContent) {
                    fs.writeFileSync(fullPath, newContent);
                    console.log(`Fixed quotes in ${file}`);
                }
            }
        }
    }
}

processDirectory(srcDir);
console.log('Done fixing quotes!');
