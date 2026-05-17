const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const outputFile = path.join(root, 'src', 'i18n', 'frDictionary.ts');
const cacheFile = path.join(root, 'scripts', '.translation-cache-fr.json');

const includeDirs = ['app', 'src'];
const includeExt = new Set(['.ts', '.tsx']);
const skipDirs = new Set(['node_modules', 'dist', 'export-check', '.expo', '.git']);

const contentFields = new Set([
  'title',
  'subtitle',
  'description',
  'tagline',
  'explanation',
  'example',
  'intuition',
  'whyItMatters',
  'prompt',
  'meaning',
]);

const uiProps = new Set(['label', 'placeholder', 'title', 'sublabel']);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) walk(path.join(dir, entry.name), files);
      continue;
    }
    if (includeExt.has(path.extname(entry.name))) files.push(path.join(dir, entry.name));
  }
  return files;
}

function propName(node) {
  if (!node || !ts.isPropertyAssignment(node.parent)) return '';
  const name = node.parent.name;
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) return name.text;
  return '';
}

function isImportOrRoute(value) {
  return (
    value.startsWith('../') ||
    value.startsWith('./') ||
    value.startsWith('/') ||
    value.startsWith('http') ||
    value.includes('supabase.co') ||
    value.includes('@') ||
    value.includes('\\') ||
    /^[A-E]\d{2}$/.test(value) ||
    /^[A-E]-[a-z0-9-]+$/i.test(value) ||
    /^(neuroscience|math|compneuro|aibasis|aineuro)$/.test(value) ||
    /^(intro|beginner|intermediate|advanced)$/.test(value) ||
    /^(primary|secondary|outline|ghost|web|ios|android|system|light|dark)$/.test(value) ||
    /^#[0-9a-f]{3,8}$/i.test(value) ||
    /^[A-Z_]+$/.test(value) ||
    /^[a-z_]+$/.test(value) && value.length > 16
  );
}

function shouldTranslate(value, file, node) {
  const text = value.trim();
  if (text.length < 2) return false;
  if (isImportOrRoute(text)) return false;
  if (/^[0-9\s.,:/%+-]+$/.test(text)) return false;
  if (/^[{}()[\].,;:?|&<>=!`'"\s-]+$/.test(text)) return false;

  const rel = path.relative(root, file).replace(/\\/g, '/');
  const prop = propName(node);
  if (rel.startsWith('src/content/')) {
    if (contentFields.has(prop)) return true;
    if (prop === 'options' || prop === 'keyTerms') return true;
    if (/[A-Za-z]/.test(text) && (text.includes(' ') || text.length <= 28)) return true;
  }

  if (prop && contentFields.has(prop)) return true;
  if (ts.isJsxAttribute(node.parent) && ts.isIdentifier(node.parent.name) && uiProps.has(node.parent.name.text)) {
    return true;
  }
  if (/[.!?]/.test(text) && /[A-Za-z]/.test(text)) return true;
  if (text.includes(' ') && /[A-Za-z]/.test(text) && text.length <= 140) return true;
  return false;
}

function collect() {
  const strings = new Set();
  for (const dir of includeDirs) {
    const abs = path.join(root, dir);
    if (!fs.existsSync(abs)) continue;
    for (const file of walk(abs)) {
      const source = fs.readFileSync(file, 'utf8');
      const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
      const visit = (node) => {
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
          if (shouldTranslate(node.text, file, node)) strings.add(node.text.trim());
        } else if (ts.isJsxText(node)) {
          const text = node.getText(sf).replace(/\s+/g, ' ').trim();
          if (shouldTranslate(text, file, node)) strings.add(text);
        }
        ts.forEachChild(node, visit);
      };
      visit(sf);
    }
  }
  return [...strings].sort((a, b) => a.localeCompare(b));
}

function protectText(text) {
  const tokens = [];
  let protectedText = text
    .replace(/[A-Z][0-9]{2}/g, (match) => {
      const token = `__NM${tokens.length}__`;
      tokens.push([token, match]);
      return token;
    })
    .replace(/[A-Za-z]_[A-Za-z0-9]+/g, (match) => {
      const token = `__NM${tokens.length}__`;
      tokens.push([token, match]);
      return token;
    });
  return { protectedText, tokens };
}

function restoreText(text, tokens) {
  let out = text;
  for (const [token, value] of tokens) out = out.replaceAll(token, value);
  return out;
}

async function translateOne(text) {
  const { protectedText, tokens } = protectText(text);
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', 'fr');
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', protectedText);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Translate failed ${response.status}`);
  const data = await response.json();
  const translated = (data[0] || []).map((part) => part[0]).join('');
  return restoreText(translated, tokens)
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s+'/g, "'");
}

async function main() {
  const strings = collect();
  const cache = fs.existsSync(cacheFile)
    ? JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
    : {};

  let completed = strings.filter((text) => cache[text]).length;
  const pending = strings.filter((text) => !cache[text]);
  let cursor = 0;
  const concurrency = Number(process.env.TRANSLATE_CONCURRENCY || 10);
  const saveProgress = () => {
    fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf8');
    console.log(`translated ${completed}/${strings.length}`);
  };

  async function worker() {
    while (cursor < pending.length) {
      const text = pending[cursor++];
      let lastError;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          cache[text] = await translateOne(text);
          break;
        } catch (error) {
          lastError = error;
          await new Promise((resolve) => setTimeout(resolve, 500 + attempt * 1000));
        }
      }
      if (!cache[text]) throw lastError;
      completed += 1;
      if (completed % 100 === 0) saveProgress();
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf8');
  const body = [
    '// Generated by scripts/generate-french-translations.js.',
    '// Keep English keys exact because runtime translation uses exact source strings.',
    'export const frDictionary: Record<string, string> = ',
    JSON.stringify(cache, Object.keys(cache).sort(), 2),
    ';\n',
  ].join('\n');
  fs.writeFileSync(outputFile, body, 'utf8');
  console.log(`wrote ${outputFile} with ${Object.keys(cache).length} entries`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
