import fs from 'fs';
import path from 'path';
import prettier from 'prettier';

const prettierJsOptions = {
  parser: 'babel',
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'avoid',
};

const prettierCssOptions = {
  parser: 'css',
  printWidth: 100,
  tabWidth: 2,
};

function maskInterpolations(code) {
  const interpolations = [];
  let result = '';
  let i = 0;

  while (i < code.length) {
    if (code[i] === '$' && code[i + 1] === '{') {
      const start = i;
      let depth = 1;
      i += 2;
      while (i < code.length && depth > 0) {
        if (code[i] === '{') depth++;
        else if (code[i] === '}') depth--;
        i++;
      }
      const original = code.slice(start, i);
      const token = `__INTERP_${interpolations.length}__`;
      interpolations.push({ token, original });
      result += token;
    } else {
      result += code[i];
      i++;
    }
  }

  return { masked: result, interpolations };
}

function restoreInterpolations(code, interpolations) {
  let restored = code;
  for (const item of interpolations) {
    restored = restored.replace(item.token, item.original);
  }
  return restored;
}

async function formatJs(code, filepath = 'file.js') {
  try {
    return await prettier.format(code, { ...prettierJsOptions, filepath });
  } catch (err) {
    console.warn(`Could not format JS in ${filepath}:`, err.message);
    return code;
  }
}

async function formatJsWithInterpolations(code) {
  const { masked, interpolations } = maskInterpolations(code);

  try {
    const formatted = await prettier.format(masked, prettierJsOptions);
    return restoreInterpolations(formatted, interpolations);
  } catch (err) {
    console.warn('Could not format JS with interpolations:', err.message);
    return code;
  }
}

async function formatCssWithInterpolations(code) {
  const { masked, interpolations } = maskInterpolations(code);

  try {
    const formatted = await prettier.format(masked, prettierCssOptions);
    return restoreInterpolations(formatted, interpolations);
  } catch (err) {
    console.warn('Could not format CSS with interpolations:', err.message);
    return code;
  }
}

async function replaceAsync(str, regex, asyncFn) {
  const matches = [];
  str.replace(regex, (...args) => {
    matches.push(args);
  });
  const replacements = await Promise.all(matches.map(m => asyncFn(...m)));
  let i = 0;
  return str.replace(regex, () => replacements[i++]);
}

const uiTemplateFiles = [
  'worker/ui/desktop-game.js',
  'worker/ui/mobile-game.js',
  'worker/ui/mode-cards.js',
  'worker/ui/round-ranking.js',
  'worker/ui/final-standings.js',
  'worker/ui/guess-input.js',
  'worker/ui/game-audio.js',
  'worker/modes/auction/auction-ui.js',
  'worker/modes/battleship/battleship-ui.js',
  'worker/modes/number/number-ui.js',
  'worker/modes/product/product-ui.js',
];

async function formatUiTemplateFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Format any Style template literals
  const styleRegex = /(export const \w*Styles\w*\s*=\s*String\.raw`)([\s\S]*?)(`;)/g;
  content = await replaceAsync(content, styleRegex, async (match, p1, p2, p3) => {
    const formatted = await formatCssWithInterpolations(p2);
    return p1 + '\n' + formatted.trim() + '\n' + p3;
  });

  // Format any Client template literals
  const clientRegex = /(export const \w*Client\w*\s*=\s*String\.raw`)([\s\S]*?)(`;)/g;
  content = await replaceAsync(content, clientRegex, async (match, p1, p2, p3) => {
    const formatted = await formatJsWithInterpolations(p2);
    return p1 + '\n' + formatted.trim() + '\n' + p3;
  });

  fs.writeFileSync(file, content, 'utf8');
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
    const formattedCss = await formatCssWithInterpolations(rawCss);
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
      const norm = full.replace(/\\/g, '/');
      if (norm !== 'worker/ui/app-shell.js' && !uiTemplateFiles.includes(norm) && norm !== 'scripts/format-repo.mjs') {
        results.push(full);
      }
    }
  }
  return results;
}

const files = getAllJsFiles('.');
console.log(`Formatting ${files.length} regular JavaScript files...`);

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  const formatted = await formatJs(original, file);
  if (formatted !== original) {
    fs.writeFileSync(file, formatted, 'utf8');
  }
}

console.log(`Formatting ${uiTemplateFiles.length} UI submodules...`);
for (const file of uiTemplateFiles) {
  await formatUiTemplateFile(file);
}

console.log('Formatting worker/ui/app-shell.js...');
await formatAppShell();

console.log('Prettier formatting complete across all files!');
