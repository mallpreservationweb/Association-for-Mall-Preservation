const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const baseUrl = 'https://mallpreservation.org';

function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const htmlFiles = fs
    .readdirSync(rootDir)
    .filter((file) => file.endsWith('.html'))
    .sort();

  const urlEntries = htmlFiles
    .map((file) => {
      const loc = file === 'index.html' ? `${baseUrl}/` : `${baseUrl}/${file}`;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`;
    })
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

  fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemap);
  console.log(`Updated sitemap.xml with ${htmlFiles.length} URLs.`);
}

if (process.argv.includes('--watch')) {
  buildSitemap();
  fs.watch(rootDir, { persistent: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.html')) {
      buildSitemap();
    }
  });
  console.log('Watching for HTML changes...');
} else {
  buildSitemap();
}
