var masia = (function () {
  function SlideBar (data) {
    // 定义私有的属性
    /**
     * data中的参数：
     * *slideBar: String // 整个外层slide容器
     * freeModel: Boolean // 是否开启自由模式，默认是false
     * *scaleStep: Number // 刻度单位步长(如: 100)，默认值为10
     * unit: String // 单位描述(如：G) 
     * *maxNumber: Number // 总数或者最大值(如：1000)
     * minNumber: Number // 用户选择的最小值(如: 10)，默认是0
     * minScale: Number // 刻度开始值（如：总数1000时，我要刻度值为10)，默认0
     * showInput: String|id // 是否显示与指定input框关联
     * slideCompleteCallback: Function // 选择完成之后的回调函数 ，参数为返回的数值
     */
    this.oSlideBar = document.getElementById(data.slideBar); // 获取slidebar外层容器
    this.oEntireBar = this.oSlideBar.querySelector('.entire-bar'); // 获取整个基层slide条
    this.oActionBar = this.oSlideBar.querySelector('.action-bar'); // 获取活动部分的slide条
    this.oActionBlock = this.oSlideBar.querySelector('.action-block'); // 获取滑块
    this.oScales = this.oSlideBar.querySelector('.sliderBar-scale')

    this.barLength = this.oSlideBar.clientWidth // 获取整个滑动条容器的宽度  
    this.minScaleSliceWidth = this.barLength/data.maxNumber // 最小的刻度划分所占宽度
    //  参数初始化
    this.scaleStep = data.scaleStep || 10, 
    this.numStep = data.numStep || this.scaleStep, // 选择数值步长，如果不传，默认为刻度单位步长
    this.maxNumber = data.maxNumber || 100,
    this.minNumber = data.minNumber || 0, // 可以预设最小值，若不预设，默认值为0
    this.defaultVal = data.defaultVal || this.minNumber, // 可以预设默认值。如果不设，则为最小值（注意：不设置最小值，最小值为0，则默认值也为0）
    this.freeModel = data.freeModel === false ? false : true ,
    this.minScale = data.minScale || 0,
    this.unit = data.unit || '',
    this.oInput = document.getElementById(data.inputBox) || undefined,
    this.slideCompleteCallback = data.slideCompleteCallback || undefined
    this.initExecuteCb = data.initExecuteCb || false // 初始化完成之后立即执行回调函数，默认位不执行
    this._init()
    
  }
  Object.assign(SlideBar.prototype, {
    _init: function () {
      // 初始化刻度区域
      var scaleNum = this.maxNumber / this.scaleStep // 刻度总数
      var leftUnit = this.barLength / scaleNum // 刻度left值的单位
      for ( var i = 0; i <= scaleNum; i ++ ) {
        // 动态创建元素
        var oTextWrapper = document.createElement('div')
        oTextWrapper.style.position = 'absolute'
        
        var oScaleLine = document.createElement('div')
        oScaleLine.style.textAlign = 'center'
        oScaleLine.style.backgroundColor = '#d5d5d5'
        oScaleLine.style.width = '1px'
        oScaleLine.style.height = '8px'
        oScaleLine.style.margin = '0 auto'
        oTextWrapper.appendChild(oScaleLine)
        var oText = document.createElement('div')
        oText.style.textAlign = 'center'
        oText.style.lineHeight = '20px'
        oText.style.fontSize = '14px'
        oText.style.color = '#000'
        // if (i == 0 && this.minScale) {
        //   oText.innerHTML = this.minScale + this.unit
        // } else {
        //   oText.innerHTML = i + this.unit
        // }
        oText.innerHTML = this.scaleStep*i + this.unit
        oTextWrapper.appendChild(oText)
        this.oScales.appendChild(oTextWrapper)

        oTextWrapper.style.left = i * leftUnit - oTextWrapper.clientWidth / 2 + 'px'
        // console.log('宽度', oTextWrapper.clientWidth)
        // 执行事件绑定
        this.bindEvent()
        // 初始化滑动条和输入框
        this.InputAndSlide(this.defaultVal)
        if (this.initExecuteCb) {
          this.slideCompleteCallback && this.slideCompleteCallback(this.defaultVal)
        }
      }
    },
    // 事件绑定
    bindEvent: function () {
      var _this = this;
      // 根据鼠标位置改变滑动条位置的钩子函数
      var oSlideBarFun = function (e) {
        // console.log('触发了父级的onmouseup')
        var mousePosition = _this.getMousePosition(e) // 1.获取鼠标距离容器左边的相对位置
        var num = _this.transPosNum(mousePosition)  // 2.把位置值转换为数值 
        _this.InputAndSlide(num)  
        
      }
      // 滑动条的click事件
      this.oSlideBar.onmouseup = function (e) {
        oSlideBarFun(e)
        _this.slideCompleteCallback && _this.slideCompleteCallback(Number(_this.oInput.value))
      }
      // 滑动块的拖拽事件
      this.oActionBlock.onmousedown = function (e) {
        // 阻止子元素滑块的按下事件冒泡到父元素滑条上面
        e.stopPropagation()
        var recordEvent = _this.oSlideBar.onmouseup
        _this.oSlideBar.onmouseup = null
        // 即使没有设置滑动块的鼠标抬起事件，但在鼠标在滑动条区域抬起的时候，依然会触发滑动条的鼠标抬起事件
        // 所以在滑块按下的时候，先记录滑条的点击事件，然后把滑条的点击事件取消，等到鼠标从文档中松开时，再给滑条的点击事件加上
        document.onmousemove = function (e) {
          e.preventDefault()
          oSlideBarFun(e)
        }
        document.onmouseup = function () {
          document.onmousemove = document.onmouseup = null
          // this.oSlideBar.onmouseup = recordEvent
          // console.log('document.onmouseup', document.onmouseup)
          // console.log('document.onmousemove', document.onmousemove)
          // console.log('this.oActionBlock.onmousedown', _this.oActionBlock.onmousedown)
          _this.oSlideBar.onmouseup = recordEvent
          _this.slideCompleteCallback && _this.slideCompleteCallback(Number(_this.oInput.value))
        }
      }
      // input框的失去焦点事件
      this.oInput.onblur = function () { // 为input添加blur事件
        if (_this.inputIsNum(this.value)) {
          _this.InputAndSlide(this.value)
        }
        _this.slideCompleteCallback && _this.slideCompleteCallback(Number(_this.oInput.value))
      }
      // input框的回车事件
      this.oInput.onkeyup = function (e) { // 为input添加回车事件
        if (e && e.keyCode==13) {
          if (_this.inputIsNum(this.value)) {
            _this.InputAndSlide(this.value)
          }
          _this.slideCompleteCallback && _this.slideCompleteCallback(Number(_this.oInput.value))
        }
      }
    },
    inputIsNum: function (value) {
      var reg=/^[1-9]\d*$|^0$/;
      if(!reg.test(value)){
        alert('请输入合法的数值，否则恢复默认值')
        this.InputAndSlide(this.defaultVal)
        return false;
      }
      return true;
    },
    InputAndSlide: function (num) { // 输入数值
      // 判断输入框的值类型
      num = this.judgeNum(num) // 3. 修正数值
      var position = this.transNumPos(num) // 4.把修正后的数值转为位置值
      this.contorlSlide(position)// 5.输入位置值，自动滑动
      this.oInput.value = num
    },
    contorlSlide: function (pos) { // 输入位置自动滑动
      this.oActionBar.style.width = pos + 'px',
      this.oActionBlock.style.left = pos-(this.oActionBlock.offsetWidth/2) + 'px'
    },
    transNumPos: function (num) { // 数值转位置
      return num * this.barLength / this.maxNumber
    },
    transPosNum: function (pos) { // 位置转数值
      return this.maxNumber * pos / this.barLength
    },
    judgeNum: function (num) { // 数值修正，把小数转整数，强制最小值，强制最大值，非自由模式强制赋值
      var num = Math.round(num) // 小数部分四舍五入
      if (!this.freeModel) { // 如果为非自由模式
        var remainder = num % this.numStep
        if (remainder >= Math.round(this.numStep/2)) {
          num = num - remainder + this.numStep
        } else {
          num = num - remainder
        }
      }

      if (num < this.minNumber) { // 强制最小值
        num = this.minNumber
      } else if (num > this.maxNumber) {
        num = this.maxNumber
      }
      return num
    },
    getMousePosition: function (e) { // 获取鼠标在滑动条区域的相对位置，e是mouseEvent
      function getOffsetLeft (e) {// 获取元素距离左边文档的距离
        var currentOffsetLeft = e.offsetLeft
        var parent = e.offsetParent
        while (parent) {
          currentOffsetLeft += parent.offsetLeft
          parent = parent.offsetParent
        }
        return currentOffsetLeft;
      }
      return (e.pageX - getOffsetLeft(this.oSlideBar))
    }
  });
  return {
    SlideBar: SlideBar
  }
})();