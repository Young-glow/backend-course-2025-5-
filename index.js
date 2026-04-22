const { program } = require('commander');
const fs = require('node:fs/promises');

program
  .requiredOption('-h, --host <address>', 'server address')
  .requiredOption('-p, --port <number>', 'server port')
  .requiredOption('-c, --cache <path>', 'cache directory path');

program.parse(process.argv);
const options = program.opts();

async function initCache() {
  try {
    await fs.access(options.cache);
  } catch {
    await fs.mkdir(options.cache, { recursive: true });
  }
}
initCache();