# 原生js编写的进度条选择插件

此插件不依赖其他类库，完成由原生js编写，经过测试，此插件兼容到ie7及其以上。本插件目前不支持小数
#### 1. 首先你要将`slider.js`和`slider.css`引入你要使用的文件中
#### 2. 在你的html页面写入
```html
<!-- 滑动条容器 -->
<div class="sliderBar-wrapper" id="slide-bar">
  <div class="sliderBar-container">
      <!-- 整个滑动条 -->
      <div class="entire-bar"></div> 
      <!-- 活动部分的滑动条 -->
      <div class="action-bar"></div>
      <!-- 滑动块 -->
      <div class="action-block"></div>
  </div>
  <div class="sliderBar-scale"></div>
</div>

<div style="margin-top: 20px;">
  你想绑定的input框：<input type="text" id="inputBox">
</div>
```
默认的滑动条容器的宽度为800px，你可以根据你的业务需求在你的文件中重写sliderBar-wrapper的宽度。所有的暴露出来的具有类名的样式，你都可以去修改
#### 3.创建一个SlideBar实例
1. 在页面加载完成之后创建一个SlideBar的实例，并且传入一些必选参数，比如：
```javascript
// 最简单的小例子，包含必选参数的SlideBar实例，刻度值从0开始，刻度值最大为你传入的maxNumber，刻度步长为scaleStep
new masia.SlideBar({ // 这里使用了名为masia的命名空间
  slideBar: 'slide-bar', // 必选，滑动条容器的id值
  scaleStep: 10, // 必选，刻度值的步长
  maxNumber: 100, // 必选，总数
  inputBox: 'inputBox', // 必选，绑定的input框的id值
}) 
```
2. 根据业务需求来传入更多的参数，来实现你想要的功能
```javascript
new masia.SlideBar({ // 这里使用了名为masia的命名空间
  slideBar: 'slide-bar', // 必选，滑动条容器的id值
  scaleStep: 10, // 必选，刻度值的步长
  maxNumber: 100, // 必选，总数
  inputBox: 'inputBox', // 必选，绑定的input框的id值
  unit: 'G', // 设置一个单位名称，默认为空
  minNumber: 10, // 你可以设置一个用户可选的最小值，若不设置，则最小值默认为0
  defaultVal: 25, // 你可以置一个默认值，供页面实例创建完成之后使用，若不设置，则为最小值，若最小值也不设置，则为0
  freeModel: false, // 自由模式，默认开启，用户可选的数值以1为步长。关闭之后，用户选择的数值以你设置的步长为单位跳动
  numStep: 5, // 设置非自由模式下的步长，若不设置，则为刻度值步长scaleStep
  slideCompleteCallback: function (value) { // 设置选择完成之后的回调函数，只有一个参数，值为选择的数值
    console.log(value)
  }
})
``` 
+ 操作方式：
  1. 直接拖动小滑块或者点击滑动条区域，输入框的值会发生相应的改变，当你松开鼠标时，会执行你传入的回调函数，参数就是你选择的数值，类型为number
  2. 给你所绑定的输入框输入数值，当前的输入框失去焦点或者你敲击回车时，小滑块会移动到相应的位置，并且执行你传入的回调函数，参数为你选择的数值，类型为number
  3. 给输入框输入数值，小滑块滑到相应位置，并且执行你传入的回调函数，参数为你选择的数值，类型为number
  4. 当你选择了非自由模式，也就是将参数值`freeModel`设置为`false`，你选择的数值会被修正成你设置的步长的倍数的值。比如你设置的步长为10，你选择的值为16，插件就会帮会你修成20。
