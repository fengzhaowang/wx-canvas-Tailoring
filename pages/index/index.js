let index = 0, items = [], flag = true, itemId = 1;
Page({
  data: {
    itemList:[],
    imgSrc:'https://xiamaliu.xyz/fei/clothes3.png',

    x: 0,
    y: 0,
    hidden: true


  },
  start: function (e) {
    // console.log(e)
    this.setData({
      hidden: false,
      x: e.touches[0].pageX,
      y: e.touches[0].pageY
    })
  },
  move: function (e) {
    this.setData({
      x: e.touches[0].pageX,
      y: e.touches[0].pageY
    })
  },
  end: function (e) {
    this.setData({
      hidden: true
    })
  },
  onLoad: function (options) {
    items = this.data.itemList;
    this.setDropItem({
      url: 'https://xiamaliu.xyz/fei/clothes.jpg',
      drawImageX:0,
      drawImageY:0
      // url: '/img/1.png'
    });
    //背景图片
    this.setData({
      BackgrounndSrc: 'https://xiamaliu.xyz/fei/clothes.jpg'
    })
  },
  
  setDropItem(imgData) {
    var that = this
    const ctxBackground = wx.createCanvasContext('canvasBackground');
    let data = {}

    var width = 0,height = 0;

    wx.getImageInfo({
      src: imgData.url,
      success: res => {
        width = res.width
        height = res.height
      }
    })

    ctxBackground.save();
    //开始一个新的绘制路径
    ctxBackground.beginPath();
    //设置路径起点坐标
    var x = 49;
    var y = 30;
    ctxBackground.moveTo(x, y);
    ctxBackground.lineTo(x * 2, y / 5);
    ctxBackground.lineTo(x * 3, y / 5);
    ctxBackground.lineTo(x * 4, y);
    ctxBackground.lineTo(x * 5, y * 3);
    ctxBackground.lineTo(x * 4 + 20, y * 4 + 20);
    ctxBackground.lineTo(x * 4, y * 4 + 20);
    ctxBackground.lineTo(x * 4, y * 10);
    ctxBackground.lineTo(x + 20, y * 10);
    ctxBackground.lineTo(x + 20, y * 4 + 20);
    ctxBackground.lineTo(x, y * 4 + 20);
    ctxBackground.lineTo(x / 8, y * 3 + 10);
    ctxBackground.lineTo(x, y);
    //先关闭绘制路径。注意，此时将会使用直线连接当前端点和起始端点。
    ctxBackground.closePath();
    ctxBackground.clip();
    ctxBackground.stroke(); //画线轮廓


    wx.getImageInfo({
      src: imgData.url,
      success: res => {
        // 初始化数据
        data.imgwidth = res.width;//宽度
        data.imgheight = res.height;//高度
        data.width = 240;
        data.height = 300;
        data.image = imgData.url;//地址
        data.id = ++itemId;//id
        data.top = 0;//top定位
        data.left = 0;//left定位
        //圆心坐标
        data.x = data.left + data.width / 2;
        data.y = data.top + data.height / 2;
        data.scale = 1;//scale缩放
        data.oScale = 1;//方向缩放
        data.rotate = 1;//旋转角度
        data.active = false;//选中状态
        items[items.length] = data;
        that.setData({
          itemList: items
        })
        // ctxBackground.drawImage(res.path, 0, 0, wx.getSystemInfoSync().windowWidth, res.height > 500 ? 500 : res.height);
        ctxBackground.drawImage(res.path, imgData.drawImageX * -1 + 7, imgData.drawImageY * -1, res.width, res.height);
        ctxBackground.restore();
        ctxBackground.draw();
      }
    })
  },
  WraptouchEnd: function (e) {
    var that = this;
    that.data.itemList = [];
    var drawImageXAfter = e.changedTouches[0].clientX - that.data.drawImageXBefor;
    var drawImageYAfter = e.changedTouches[0].clientY - that.data.drawImageYBefor;
    that.setDropItem({
      url: 'https://xiamaliu.xyz/fei/clothes.jpg',
      drawImageX: drawImageXAfter,
      drawImageY: drawImageYAfter
    });
    console.log(that.data.itemList)
  },
  save: function () {
    var that = this
    wx.canvasToTempFilePath({
      canvasId: 'canvasBackground',
      success(res) {
        // console.log(res)
        that.setData({
          src: res.tempFilePath
        })
      }
    })
  },
  // 点击主图
  WraptouchStart:function(e){
    var that = this;
    that.setData({
      drawImageXBefor: e.changedTouches[0].clientX,
      drawImageYBefor: e.changedTouches[0].clientY
    })
    // console.log(e)
    // 显示图片轮廓
    for (let i = 0; i < items.length; i++) {
      items[i].active = false;
      if (e.currentTarget.dataset.id == items[i].id) {
        index = i;
        items[index].active = true;
      }
    }
    this.setData({
      itemList: items
    })
    //记录初始位置，供移动使用
    // items[index].lx = e.touches[0].x;
    // items[index].ly = e.touches[0].y;
    items[index].lx = e.touches[0].clientX;
    items[index].ly = e.touches[0].clientY;
  },
  // 进行拖拽
  WraptouchMove:function(e){
    // console.log(e)
    if (flag) {
      flag = false;
      setTimeout(() => {
        flag = true;
      }, 1)
    }
    // items[index]._lx = e.touches[0].x;
    // items[index]._ly = e.touches[0].y;
    // items[index].left += items[index]._lx - items[index].lx;
    // items[index].top += items[index]._ly - items[index].ly;
    // items[index].x += items[index]._lx - items[index].lx;
    // items[index].y += items[index]._ly - items[index].ly;
    // items[index].lx = e.touches[0].x;
    // items[index].ly = e.touches[0].y;
    items[index]._lx = e.touches[0].clientX;
    items[index]._ly = e.touches[0].clientY;
    items[index].left += items[index]._lx - items[index].lx;
    items[index].top += items[index]._ly - items[index].ly;
    items[index].x += items[index]._lx - items[index].lx;
    items[index].y += items[index]._ly - items[index].ly;
    items[index].lx = e.touches[0].clientX;
    items[index].ly = e.touches[0].clientY;
    this.setData({
      itemList: items
    })
  },
  
  // 缩放按钮点击开始
  oTouchStart: function (e) {
    //找到点击的那个图片对象，并记录
    for (let i = 0; i < items.length; i++) {
      items[i].active = false;
      if (e.currentTarget.dataset.id == items[i].id) {
        index = i;
        items[index].active = true;
      }
    }
    //获取作为移动前角度的坐标
    items[index].tx = e.touches[0].clientX;
    items[index].ty = e.touches[0].clientY;
    //移动前的角度
    items[index].anglePre = this.countDeg(items[index].x, items[index].y, items[index].tx, items[index].ty)
    //获取图片半径
    items[index].r = this.getDistancs(items[index].x, items[index].y, items[index].left, items[index].top);
  },
  // 缩放按钮松开
  oTouchMove: function (e) {
    if (flag) {
      flag = false;
      setTimeout(() => {
        flag = true;
      }, 100)
    }
    //记录移动后的位置
    items[index]._tx = e.touches[0].clientX;
    items[index]._ty = e.touches[0].clientY;
    //移动的点到圆心的距离
    items[index].disPtoO = this.getDistancs(items[index].x, items[index].y, items[index]._tx, items[index]._ty - 10)

    items[index].scale = items[index].disPtoO / items[index].r;
    items[index].oScale = 1 / items[index].scale;

    //移动后位置的角度
    items[index].angleNext = this.countDeg(items[index].x, items[index].y, items[index]._tx, items[index]._ty)
    //角度差
    items[index].new_rotate = items[index].angleNext - items[index].anglePre;

    //叠加的角度差
    items[index].rotate += items[index].new_rotate;
    items[index].angle = items[index].rotate; //赋值

    //用过移动后的坐标赋值为移动前坐标
    items[index].tx = e.touches[0].clientX;
    items[index].ty = e.touches[0].clientY;
    items[index].anglePre = this.countDeg(items[index].x, items[index].y, items[index].tx, items[index].ty)

    //赋值setData渲染
    this.setData({
      itemList: items
    })

  },
  //计算数字的平方根
  getDistancs(cx, cy, pointer_x, pointer_y) {
    var ox = pointer_x - cx;
    var oy = pointer_y - cy;
    return Math.sqrt(
      ox * ox + oy * oy
    );
  },
  /*
     *参数1和2为图片圆心坐标
     *参数3和4为手点击的坐标
     *返回值为手点击的坐标到圆心的角度
     */
  countDeg: function (cx, cy, pointer_x, pointer_y) {
    var ox = pointer_x - cx;
    var oy = pointer_y - cy;
    var to = Math.abs(ox / oy);
    var angle = Math.atan(to) / (2 * Math.PI) * 360;
    // console.log("ox.oy:", ox, oy)
    if (ox < 0 && oy < 0)//相对在左上角，第四象限，js中坐标系是从左上角开始的，这里的象限是正常坐标系  
    {
      angle = -angle;
    } else if (ox <= 0 && oy >= 0)//左下角,3象限  
    {
      angle = -(180 - angle)
    } else if (ox > 0 && oy < 0)//右上角，1象限  
    {
      angle = angle;
    } else if (ox > 0 && oy > 0)//右下角，2象限  
    {
      angle = 180 - angle;
    }
    return angle;
  }
})

