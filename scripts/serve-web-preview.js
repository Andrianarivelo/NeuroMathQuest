const fs = require('fs');
const http = require('http');
const path = require('path');

const basePath = '/NeuroMathQuest';
const distDir = path.resolve(__dirname, '..', 'dist');
const port = Number(process.env.PORT || 8082);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function sendFile(response, filePath, statusCode = 200) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    response.writeHead(statusCode, {
      'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream',
    });
    response.end(content);
  });
}

function resolveStaticFile(urlPath) {
  if (urlPath.endsWith('/')) {
    return path.join(distDir, urlPath, 'index.html');
  }

  const exactPath = path.join(distDir, urlPath);
  if (fs.existsSync(exactPath) && fs.statSync(exactPath).isFile()) {
    return exactPath;
  }

  const htmlPath = `${exactPath}.html`;
  if (fs.existsSync(htmlPath)) {
    return htmlPath;
  }

  return path.join(distDir, 'index.html');
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url || '/', `http://localhost:${port}`);

  if (requestUrl.pathname === '/') {
    response.writeHead(302, { Location: `${basePath}/` });
    response.end();
    return;
  }

  if (!requestUrl.pathname.startsWith(basePath)) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  const relativePath = decodeURIComponent(requestUrl.pathname.slice(basePath.length) || '/');
  sendFile(response, resolveStaticFile(relativePath));
});

server.listen(port, () => {
  console.log(`Serving ${distDir}`);
  console.log(`Preview: http://localhost:${port}${basePath}/`);
});
