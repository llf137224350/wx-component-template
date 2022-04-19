const dirSplit = require('dir-split');
const { sync: pathExists } = require('path-exists');

/**
 * 获取package.json文件目录
 * @returns {*}
 */
function getPackageJson(targetPath) {
  const dirs = dirSplit(targetPath, '/').reverse().map(function(item) {
    return item + '/' + 'package.json';
  });
  return dirs.find(function(filePath) {
    return pathExists(filePath);
  });
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

/**
 * 日期格式化
 * @param date
 * @param fmt
 * @returns {string}
 */
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
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substring(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substring(('' + o[k]).length));
    }
  }
  return fmt;
}

/**
 * 获取类名
 * @param componentName
 * @returns {string}
 */
function getName(currentDirName, componentName) {
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

module.exports = {
  getPackageJson,
  dateFormat,
  getName
};
