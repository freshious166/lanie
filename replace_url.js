const fs = require('fs');
const path = require('path');
const dir = 'apps/web-dashboard/views';

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.tsx')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        
        // Let's ensure API_URL is imported if it's used
        if (content.includes('API_URL') && !content.includes('import { API_URL }')) {
            content = "import { API_URL } from '../constants';\n" + content;
            fs.writeFileSync(path.join(dir, file), content);
            console.log('Fixed import in ' + file);
        }
    }
});
