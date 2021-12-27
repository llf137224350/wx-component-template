/*
 * @Author: い 狂奔的蜗牛
 * @Date: 2020/6/17
 * @Description: 创建页面
 */
const os = require('os');
const path = require('path');
const fs = require('fs');
const log = require('./log');
require('console-color-mr');
// 降低允许权限
require('root-check')();
// 目标路径 - 执行脚本命令所在目录
const targetPath = process.cwd();
const currentDirName = targetPath.substring(
  targetPath.lastIndexOf(path.sep) + 1
);
// 模板路径
const sourcePath = path.resolve(__dirname, '../template');
const componentName = process.argv.slice(2)[0];
if (!componentName) {
  log.error('', '请传入组件名称!');
  return;
}
// 日期格式化
function dateFormat(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substring(4 - RegExp.$1.length)
    );
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? o[k]
          : ('00' + o[k]).substring(('' + o[k]).length)
      );
    }
  }
  return fmt;
}

function writeContent2File(content, fileName) {
  fileName = componentName + fileName.substring(fileName.indexOf('.'));
  const tempPath = path.resolve(targetPath, componentName + '/' + fileName);
  const data = new Uint8Array(Buffer.from(content));
  // 写入数据到对应文件
  fs.writeFileSync(tempPath, data);
}
// 首字母大写
function firstLetterCapitalized(str) {
  if (!str) {
    return '';
  }
  const firstLetter = str.slice(0, 1);
  const other = str.slice(1);
  return firstLetter.toUpperCase() + other;
}
// 获取类名
function getName() {
  const arr = componentName.split('_');
  let result = '';
  let selfComponentName = '';
  arr.forEach((item) => {
    selfComponentName += item + '-';
    result += firstLetterCapitalized(item);
  });
  selfComponentName = selfComponentName.slice(0, -1);
  // 输出建议引用方法
  console.log('\n引用建议\n'.green);
  console.log(
    `页面引用全局组件:       "${selfComponentName}": "../../../${currentDirName}/${componentName}/${componentName}"`
      .green
  );
  console.log(
    `页面引用当前目录下组件: "${selfComponentName}": "./${currentDirName}/${componentName}/${componentName}"`
      .green
  );
  console.log(
    `组件使用上级目录组件:   "${selfComponentName}": "../${componentName}/${componentName}"`
      .green
  );
  console.log(
    `组件使用全局组件:       "${selfComponentName}": "../../../../../${currentDirName}/${componentName}/${componentName}"\n`
      .green
  );
  return result;
}
// 读取文件内容
function readFileContent(path, fileName) {
  let content = fs.readFileSync(path).toString();
  if (fileName.indexOf('.js') !== -1 && fileName.indexOf('.json') === -1) {
    content = content.replace(/\$/gi, getName()) + os.EOL;
    // 替换年月日
    content = content.replace(/date/g, dateFormat(new Date()));
    writeContent2File(content.replace(os.EOL, ''), fileName);
  } else {
    writeContent2File(content, fileName);
  }
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
  fs.mkdir(
    path,
    {
      recursive: true
    },
    (error) => {
      if (error) {
        throw error;
      }
      // 开始读取资源目录
      readSourceDir();
    }
  );
}

makeSourceDir();
