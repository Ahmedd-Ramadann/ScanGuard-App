// Package the Expo web export as one HTML file for easy prototype review.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const script = html.match(/<script src="([^"]+)" defer><\/script>/);
if (!script) throw new Error('No Expo web script found. Run npm run export:web first.');
let js = fs.readFileSync(path.join(dist, script[1]), 'utf8');

function embedFonts(folder) {
  for (const item of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, item.name);
    if (item.isDirectory()) embedFonts(file);
    else if (item.name.endsWith('.ttf')) {
      const source = '/' + path.relative(dist, file).split(path.sep).join('/');
      js = js.replaceAll(source, 'data:font/ttf;base64,' + fs.readFileSync(file).toString('base64'));
    }
  }
}

embedFonts(dist);
html = html.replace(script[0], () => '<script>' + js.replaceAll('</script', '<\\/script') + '</script>');
fs.writeFileSync(path.join(root, 'Preview.html'), html);
console.log('Created Preview.html');
