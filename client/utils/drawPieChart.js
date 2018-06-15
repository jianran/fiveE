var calPieData = require('calPieData.js')

export function drawPieAngle(series, process = 1) {
  var context = wx.createCanvasContext('firstCanvas');
  let pieSeries = calPieData.calPieAngle(series, process);
  pieSeries.forEach((item) => {
    context.beginPath();
    // 设置填充颜色
    context.setFillStyle(item.color);
    // 移动到原点
    context.moveTo(120, 80);
    // 绘制弧度
    context.arc(120, 80, 80, item.startAngle, item.startAngle + 2 * Math.PI * item.proportion);
    context.closePath();
    context.fill();
  });
  context.setLineWidth(2);
  context.setStrokeStyle('#ffffff');
  let i=0
  pieSeries.forEach((item) => {
    if (++ i  == 1 ||  i == 2) {
      context.beginPath();
      context.setFillStyle(item.color);
      context.moveTo(120, 80);
      context.arc(120, 80, 80, item.startAngle, item.startAngle + 2 * Math.PI * item.proportion);
      context.closePath();
      context.fill();
      context.stroke();
    }
  })
  context.beginPath();
  context.setFontSize(15);
  context.setFillStyle('#f7a35c');
  context.fillText('金', 220, 50);
  context.stroke();
  context.setFillStyle('#90ed7d');
  context.fillText('木', 220, 70);
  context.stroke();
  context.setFillStyle('#7cb5ec');
  context.fillText('水', 220, 90);
  context.stroke();
  context.setFillStyle('#ff0000');
  context.fillText('火', 220, 110);
  context.stroke();
  context.setFillStyle('#434348');
  context.fillText('土', 220, 130);
  context.stroke();
  context.closePath();
  context.draw()
  
}