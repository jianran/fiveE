export function play(opts) {
  // 处理用户传入的动画时间，默认为1000ms
  // 因为用户有可能传入duration为0，所以不能用opts.duration = opts.duration || 1000 来做默认值处理
  // 否则用户传入0也会处理成默认值1000
  opts.duration = typeof opts.duration === 'undefined' ? 1000 : opts.duration;

  let startTimeStamp = null;

  function step(timestamp) {
    if (startTimeStamp === null) {
      startTimeStamp = timestamp;
    }
    if (timestamp - startTimeStamp < opts.duration) {
      // 计算出动画的进度
      let process = (timestamp - startTimeStamp) / opts.duration;
      // 触发动画每一步的回调，传入进度process
      opts.onProcess && opts.onProcess(process);
      // 动画进行中，执行下一次动画
      requestAnimationFrame(step);
    } else {
      // 动画结束
      opts.onProcess && opts.onProcess(1);
      // 触发动画结束回调
      opts.onAnimationFinish && opts.onAnimationFinish();
    }
  }

  requestAnimationFrame(step);
}