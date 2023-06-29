# color-to-names

只需要根据一个hex或rgb颜色值，就可以将找出其对应的中英文颜色名，使用DeltaE算法计算色差，更符合人眼感知

## 特点

- 支持多种模块 - CommonJS, ESM modules and IIFE
- Typed，用Typescript编写
- 使用DeltaE算法计算色差，更符合人眼感知
- 默认支持中英文颜色名，可扩展其他语言

## 安装

通过如下命令安装

```shell
npm i color-to-names
```

## 使用

### 直接使用

```ts
import { colorToNames } from 'color-to-names'

colorToNames("#2A52BE") // return ["#2A52BE", "Cerulean blue", "蔚蓝",]
colorToNames("#B22222") // return ["#B22222", "Fire Brick", "砖红色",]

```

### 使用自定义颜色库

默认使用的是维基百科的颜色库，如需自定义，则使用`setConfig`方法。
你也可以添加更多的语言支持，只需要符合如下的颜色格式，其中数组第一项必须是hex色值，其他项任意，可以增加更多的项


```ts
import { setConfig } from 'color-to-names'

setConfig({
  colorJson: [
    ['#ff0000', 'red', '红色'],
    ['#00ff00', 'green', '绿色'],
    ['#0000ff', 'blue', '蓝色'],
    ['#FFFFFF', 'white', '白色'],
    ['#000000', 'black', '黑色'],
  ]
})

colorToNames('#9f1d1d') // return ['#ff0000', 'red', '红色']
```
