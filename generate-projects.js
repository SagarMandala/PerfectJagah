/* Node script to generate project pages from projectData.json and project_template.html
 Usage: node generate-projects.js
*/
const fs = require('fs');
const path = require('path');
const data = require('./projectData.json');
const template = fs.readFileSync(path.join(__dirname,'project_template.html'),'utf8');

if(!data.projects || !Array.isArray(data.projects)){
 console.error('projectData.json must contain a projects array');
 process.exit(1);
}

function escapeHtml(str){
 return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

data.projects.forEach(proj=>{
 let out = template.replace(/\{\{TITLE\}\}/g, escapeHtml(proj.title))
 .replace(/\{\{ID\}\}/g, escapeHtml(proj.id))
 .replace(/\{\{LOCATION\}\}/g, escapeHtml(proj.location))
 .replace(/\{\{PRICE\}\}/g, escapeHtml(proj.price))
 .replace(/\{\{DESCRIPTION\}\}/g, escapeHtml(proj.description));

 // Inject amenities as HTML
 const amenitiesHtml = (proj.amenities || []).map(a => `<div class="amenity"><i class="${a.icon}"></i><div style="margin-top:8px">${a.name}</div></div>`).join('');
 out = out.replace('<!--AMENITIES_PLACEHOLDER-->', amenitiesHtml);

 // Inject documents
 const docsHtml = (proj.documents || []).map(d => ` <a class="document-item" href="${d.url}" download target="_blank"><div class="document-icon"><i class="${d.icon}"></i></div><div><strong>${d.name}</strong></div><div class="download-indicator"><i class="fas fa-download"></i></div></a>`).join('\n');
 out = out.replace('<!--DOCUMENTS_PLACEHOLDER-->', docsHtml);

 // Inject drive folder data as JS
 const driveScript = `\n<script>\nwindow.PROJECT_DRIVE = ${JSON.stringify(proj.driveFolder || {})};\nwindow.PROJECT_GALLERY = ${JSON.stringify(proj.driveFolder ? {folderId: proj.driveFolder.folderId, apiKey: proj.driveFolder.apiKey} : {})};\n</script>\n`;
 out = out.replace('<!--DRIVE_SCRIPT-->', driveScript);

 fs.writeFileSync(path.join(__dirname, proj.id + '.html'), out, 'utf8');
 console.log('Generated', proj.id + '.html');
});
