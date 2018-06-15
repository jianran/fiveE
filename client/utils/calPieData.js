export function calPieAngle(series, process = 1) {
  // 计算数据总和
  let count = 0;
  series.forEach((item) => {
    count += item.data;
  });

  // 计算出开始的弧度和所占比例
  let startAngle = -90;
  return series.map((item) => {
    item.proportion = item.data / count * process;
    item.startAngle = startAngle;
    startAngle += 2 * Math.PI * item.proportion;
    return item;
  });
}