import path from 'path';
import { createOctopus } from '@tangjs/octopus';
import templates from './templates.js';
import url from 'url';
import { createRequire } from 'module';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const require = createRequire(import.meta.url);

const version = require('../package.json').version;

createOctopus({
  name: '$NAME', // 工具的名字
  description: '',
  version,
  templatesDir: path.resolve(__dirname, './local'), // 模板目录
  templates,
});
