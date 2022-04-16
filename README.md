# 微信小程序创建组件模板工具
## 使用方式
* 安装 npm install wx-component-template -g
  1. 进入需要创建组件的目录
  2. component 组件名称，名称多个单词时使用下横线连接。如：component hello_world
  3. 如果文件时ts，类名处可以使用 $ 代替，会自动替换为输入的名称 如输入```component hello_world``` 会替换为HelloWorld
  
TS文件通过类名形式组织代码时
```typescript
// TS模板
export default class $ {
  
}
// 会被转为
export default class HelloWorld {

}
```

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
