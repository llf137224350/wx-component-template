/*
 * @Author: い 狂奔的蜗牛
 * @Date: 2020/6/17
 * @Description: 创建页面
 */
const path = require('path');
const fs = require('fs');
const pathExists = require('path-exists').sync;
const log = require('./log');
const convertFilepath = require('convert-filepath');
require('console-color-mr');
const { getName, dateFormat, getPackageJson } = require('./util');
// 降低允许权限
require('root-check')();
// 目标路径 - 执行脚本命令所在目录
const targetPath = process.cwd();
const currentDirName = targetPath.substring(targetPath.lastIndexOf(path.sep) + 1);
// 模板路径
let sourcePath = convertFilepath(path.resolve(__dirname, '../template'));
// 作者
let author = '';
const componentName = process.argv.slice(2)[0];
if (!componentName) {
  log.error('', '请传入组件名称!');
  return;
}


function writeContent2File(content, fileName) {
  fileName = componentName + fileName.substring(fileName.indexOf('.'));
  const tempPath = convertFilepath(path.resolve(targetPath, componentName + '/' + fileName));
  const data = new Uint8Array(Buffer.from(content));
  // 写入数据到对应文件
  fs.writeFileSync(tempPath, data);
}


// 读取文件内容
function readFileContent(path, fileName) {
  let content = fs.readFileSync(path).toString();
  if (fileName.indexOf('.js') !== -1 && fileName.indexOf('.json') === -1 || fileName.indexOf('.ts') !== -1) {
    // 替换作者
    content = content.replace(/\$author/g, author);
    // 替换日期
    content = content.replace(/\$date/g, dateFormat(new Date()));
    // 如果是TS尝试替换类名
    if (fileName.indexOf('.ts') !== -1) {
      content = content.replace(/class\s+\$/i, 'class ' + getName(currentDirName, componentName));
    }
  }
  writeContent2File(content, fileName);
}

// 读取目录下所有文件
function readSourceDir() {
  let files = fs.readdirSync(sourcePath, {
    withFileTypes: true
  });
  files.forEach((item) => {
    // 如果为文件
    if (item.isFile()) {
      readFileContent(path.resolve(sourcePath, item.name), item.name);
    }
  });
  log.success('', '执行成功');
}

// 创建目标目录
function makeSourceDir() {
  const path = `${targetPath}/${componentName}`;
  const exist = fs.existsSync(path);
  if (exist) {
    log.error('', '终止执行，原因：目标目录已存在');
    return;
  }
  fs.mkdir(path, {
    recursive: true
  }, (error) => {
    if (error) {
      throw error;
    }
    // 开始读取资源目录
    readSourceDir();
  });
}

// 获取package.json文件，判断是否配置了pageTemplateDir
function readConfig() {
  const packageJsonPath = getPackageJson(targetPath);
  if (packageJsonPath) {
    const package = require(packageJsonPath);
    if (package && package.componentTemplateConfig) {
      // 配置了路径
      if (package.componentTemplateConfig.componentTemplateDir && !pathExists(package.componentTemplateConfig.componentTemplateDir)) {
        log.error('', '配置的componentTemplateDir目录不存在，请检查!');
        return;
      } else {
        // 作者
        author = package.componentTemplateConfig.author || package.author || '';
        // 配置了模板路径
        if (package.componentTemplateConfig.componentTemplateDir) {
          sourcePath = convertFilepath(package.componentTemplateConfig.componentTemplateDir);
        }
      }
    } else {
      author = package.author || '';
    }
  }

  makeSourceDir();
}

readConfig();

