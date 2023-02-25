const path = require('path');
const { createOctopus } = require('@tangjs/octopus');
const templates = require('./config');

const version = require('./package.json').version;

createOctopus({
  name: '$NAME', // 工具的名字
  description: '',
  version,
  templatesDir: path.resolve(__dirname, './local'), // 模板目录
  templates,
});
