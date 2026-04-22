const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { program } = require('commander');

program
  .requiredOption('-h, --host <address>', 'server address')
  .requiredOption('-p, --port <number>', 'server port')
  .requiredOption('-c, --cache <path>', 'cache directory path');

program.parse(process.argv);
const options = program.opts();

const server = http.createServer(async (req, res) => {
  const statusCode = req.url.slice(1);
  const cachePath = path.join(options.cache, `${statusCode}.jpg`);

  if (req.method === 'GET') {
    try {
      const data = await fs.readFile(cachePath);
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Not Found in Cache');
    }
  } else {
    res.writeHead(405);
    res.end('Method Not Allowed');
  }
});

async function initCache() {
  try {
    await fs.access(options.cache);
  } catch {
    await fs.mkdir(options.cache, { recursive: true });
  }
}

initCache().then(() => {
  server.listen(options.port, options.host, () => {
    console.log(`Server running at http://${options.host}:${options.port}/`);
  });
});