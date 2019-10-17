module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {}, //将使用基于浏览器支持的特性和属性数据添加前缀
    "postcss-px-to-viewport": { 
      "ViewportWidth": 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
      "ViewportHeight": 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
      "unitPrecision": 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
      "viewportUnit": 'vw', // 指定需要转换成的视窗单位，建议使用vw
      "selectorBlackList": ['.ignore', '.hairlines'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      "minPixelValue": 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      "mediaQuery": false  // 允许在媒体查询中转换`px`
    },
    "cssnano": {
      "preset": 'advanced',
      "autoprefixer": false,
      "postcss-zindex": false //autoprefixer和postcss-zindex禁掉了。前者是有重复调用，后者是一个讨厌的东东。只要启用了这个插件，z-index的值就会重置为1。这是一个天坑，千万记得将postcss-zindex设置为false。
    }
  }
}
