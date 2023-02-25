const { getNpmInfo } = require('ice-npm-utils');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const path = require('path');
const chalk = require('chalk');

// 检测目录
async function checkTargetDir(dirPath) {
  const isExist = await fs.exists(dirPath);

  if (isExist) {
    const files = await fs.readdir(dirPath);

    if (files.length > 0) {
      const { go } = await inquirer.prompt({
        type: 'confirm',
        name: 'go',
        message:
          'The existing file in the current directory. Are you sure to continue?',
        default: false,
      });
      if (!go) process.exit(1);
    }
  }
}

// 修改文件内容
async function changeFileContent(filePath, callback) {
  return fs.readFile(filePath, 'utf-8').then((content) => {
    const newContent = callback(content);
    fs.writeFile(filePath, newContent, 'utf-8');
  });
}

async function createX() {
  const initCommand = process.argv.slice(2)[0];

  if (!initCommand) {
    console.error('You must enter the init command');
    process.exit(-1);
  }

  let organization;
  let npmName;
  let fullPackageName;
  if (initCommand.includes('@')) {
    const word = initCommand.split('/');

    organization = word[0];
    npmName = `create-${word[1]}`;
  } else {
    npmName = `create-${initCommand}`;
  }

  const dirPath = path.resolve(process.cwd(), npmName);
  // eslint-disable-next-line prefer-const
  fullPackageName = organization ? `${organization}/${npmName}` : npmName;

  try {
    const data = await getNpmInfo(fullPackageName);
    if (data.name) {
      console.error(
        `[${data.name}] This package name already exists, please replace it`
      );
      process.exit(-1);
    }
  } catch (error) {}

  await checkTargetDir(dirPath);

  // 复制项目
  await fs.copy(path.resolve(__dirname, '../template'), dirPath);

  // 修改参数
  const indexPath = path.resolve(dirPath, 'index.js');
  await changeFileContent(indexPath, (content) => {
    return content.replace('$NAME', npmName);
  });

  const pkgJsonPath = path.resolve(dirPath, 'package.json');
  await changeFileContent(pkgJsonPath, (content) => {
    const newContent = content
      .replace('$CRAETE_NAME', fullPackageName)
      .replace('$CRAETE_BIN', npmName);
    return newContent;
  });

  // 给出提示
  console.log(chalk.greenBright('Project creation completed'));
  console.log(' ');
  console.log('├── local            # local template directory');
  console.log('├── src');
  console.log('│   ├── config.js    # template profile');
  console.log('│   ├── index.js  ');
  console.log('├── package.json  ');

  console.log(' ');
  console.log(chalk.cyanBright(` cd ${npmName}`));
  console.log(chalk.cyanBright(' npm install'));
  console.log(' ');
}

createX();
