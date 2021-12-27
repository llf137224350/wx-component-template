# 微信小程序创建组件模板工具
## 使用方式
* 安装 npm install wx-component-template-js -g
  * 1. 进入需要创建组件的目录
  * 2. component 组件名称，名称多个单词时使用下横线连接。如：component hello_world

## 个性化配置（package.json）
```javascript
/*
 * @Author: $author
 * @Date: $date
 * @Description:
 */
  "componentTemplateConfig": {
    "author": "い 狂奔的蜗牛",  // ts/js顶部注释$author
    "componentTemplateDir": "/Users/snail/Desktop/test_2"  // 自定义模板绝对路径（wxml、wxss、json、ts/js所在目录）,如果不指定，则使用自带模板
  }
