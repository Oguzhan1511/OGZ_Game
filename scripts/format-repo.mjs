import fs from 'fs';
import path from 'path';
import prettier from 'prettier';

const prettierOptions = {
  parser: 'babel',
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'avoid',
};

async function formatJs(code, filepath = 'file.js') {
  try {
    return await prettier.format(code, { ...prettierOptions, filepath });
  } catch (err) {
    console.warn(`Could not format JS in ${filepath}:`, err.message);
    return code;
  }
}

async function formatCss(code) {
  try {
    return await prettier.format(code, {
      parser: 'css',
      printWidth: 100,
      tabWidth: 2,
    });
  } catch (err) {
    console.warn('Could not format CSS:', err.message);
    return code;
  }
}

async function formatAppShell() {
  const filePath = 'worker/ui/app-shell.js';
  let content = fs.readFileSync(filePath, 'utf8');

  // Format CSS part: between <style> and ${finalStandingsStyles}
  const styleStartTag = '<style>';
  const styleEndMarker = '${finalStandingsStyles}';
  const styleStart = content.indexOf(styleStartTag);
  const styleEnd = content.indexOf(styleEndMarker);

  if (styleStart !== -1 && styleEnd !== -1) {
    const rawCss = content.slice(styleStart + styleStartTag.length, styleEnd);
    const formattedCss = await formatCss(rawCss);
    content =
      content.slice(0, styleStart + styleStartTag.length) +
      '\n' +
      formattedCss.trim() +
      '\n' +
      content.slice(styleEnd);
  }

  // Format client JS part: from const $ = ... to </script>
  const jsStartMarker = 'const $ = (s) => document.querySelector(s);';
  const jsStartMarkerOld = 'const $=s=>document.querySelector(s);';
  let jsStart = content.indexOf(jsStartMarker);
  if (jsStart === -1) jsStart = content.indexOf(jsStartMarkerOld);
  const jsEnd = content.lastIndexOf('</script>');

  if (jsStart !== -1 && jsEnd !== -1) {
    const rawJs = content.slice(jsStart, jsEnd);
    const formattedJs = await formatJs(rawJs, 'client.js');
    content = content.slice(0, jsStart) + formattedJs.trim() + '\n' + content.slice(jsEnd);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

const skipDirs = ['node_modules', '.git', 'dist', 'public'];
function getAllJsFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDirs.includes(entry.name)) results.push(...getAllJsFiles(full));
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs')) {
      if (
        full !== 'worker\\ui\\app-shell.js' &&
        full !== 'worker/ui/app-shell.js' &&
        full !== 'scripts\\format-repo.mjs' &&
        full !== 'scripts/format-repo.mjs'
      ) {
        results.push(full);
      }
    }
  }
  return results;
}

const files = getAllJsFiles('.');
console.log(`Formatting ${files.length} JavaScript files...`);

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  const formatted = await formatJs(original, file);
  if (formatted !== original) {
    fs.writeFileSync(file, formatted, 'utf8');
  }
}

await formatAppShell();
console.log('Prettier formatting complete across all files!');
