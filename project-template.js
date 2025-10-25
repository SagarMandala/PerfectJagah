// Script to generate project pages from a JSON data file (runs in Node.js)
// Usage: node project-template.js
const fs = require('fs');
const path = require('path');
const data = require('./projectData.json');
const template = fs.readFileSync(path.join(__dirname, 'project_template.html'), 'utf8');

if (!Array.isArray(data.projects)) {
    console.error('projectData.json must export { projects: [...] }');
    process.exit(1);
}

data.projects.forEach(proj => {
    const out = template.replace(/\{\{TITLE\}\}/g, proj.title)
        .replace(/\{\{ID\}\}/g, proj.id)
        .replace(/\{\{LOCATION\}\}/g, proj.location)
        .replace(/\{\{PRICE\}\}/g, proj.price)
        .replace(/\{\{DESCRIPTION\}\}/g, proj.description);
    fs.writeFileSync(path.join(__dirname, proj.id + '.html'), out);
    console.log('Wrote', proj.id + '.html');
});
