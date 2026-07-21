const fs = require('fs');
const path = require('path');

const dirs = ['apps/web-dashboard/views', 'apps/web-dashboard/layouts', 'apps/web-dashboard/components'];

const mappings = [
    { from: /bg-background-dark/g, to: 'bg-background-light' },
    { from: /bg-\[#192433\]/g, to: 'bg-white' },
    { from: /bg-\[#233348\]/g, to: 'bg-gray-100' },
    { from: /text-white/g, to: 'text-gray-900' },
    { from: /text-\[#92a9c9\]/g, to: 'text-gray-500' },
    { from: /border-white\/10/g, to: 'border-gray-200' },
    { from: /border-white\/5/g, to: 'border-gray-100' },
    { from: /bg-\[#324867\]/g, to: 'bg-gray-300' }
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    
    fs.readdirSync(dir).forEach(file => {
        if (file.endsWith('.tsx')) {
            const filePath = path.join(dir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;

            mappings.forEach(map => {
                if (map.from.test(content)) {
                    content = content.replace(map.from, map.to);
                    modified = true;
                }
            });

            if (modified) {
                fs.writeFileSync(filePath, content);
                console.log('Updated theme in: ' + filePath);
            }
        }
    });
});
