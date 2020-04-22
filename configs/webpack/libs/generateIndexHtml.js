const fs = require('fs');
const path = require('path');
const hbs = require('handlebars');

function generateIndexHtml (env) {
  const data = {
    scriptEnvSuffix: process.env.NODE_ENV === 'development'
      ? 'development'
      : 'production.min'
  };

  const tmplPath = path.join(__dirname, '../../../src/assets/index.hbs');
  const source = fs.readFileSync(tmplPath, 'utf-8');

  const tmpl = hbs.compile(source);
  const html = tmpl(data);

  const destPath = path.join(__dirname, '../../../dist/');
  try {
    fs.mkdirSync(destPath, { recursive:true });
  } catch (e) {
    console.error(e);
  }
  fs.writeFileSync(destPath + 'index.html', html, 'utf8');
}

module.exports = generateIndexHtml;
