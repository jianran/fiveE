/**
 * 需要用到的常量声明
 */
const MinYear = 1900;  //农历年
const MaxYear = 2050;  //农历年
// 阳历的日期
const MinDay = new Date(1900, 1, 30, 0, 0, 0, 0);
const MaxDay = new Date(2049, 12, 31, 0, 0, 0, 0);
// 中文数字
const HZNum = "零一二三四五六七八九";

/**
 * 下面是经过整理的150年内的阴历数据：
 * 共15行，每行10个数据。每个数据代表一年，从阳历1900.1.31日起，为第一个数据年的开始，即阳历1900.1.31＝阴历0.1.1。
 * 150个数据可推150年的阴历，因此目前最大只能推算到2049年，以后的推导，还需要从天文台得到新的数据后才能推导，否则将出现误差。
 */
const LunarDateArray = new Array(
    0x04BD8, 0x04AE0, 0x0A570, 0x054D5, 0x0D260, 0x0D950, 0x16554, 0x056A0, 0x09AD0, 0x055D2,
    0x04AE0, 0x0A5B6, 0x0A4D0, 0x0D250, 0x1D255, 0x0B540, 0x0D6A0, 0x0ADA2, 0x095B0, 0x14977,
    0x04970, 0x0A4B0, 0x0B4B5, 0x06A50, 0x06D40, 0x1AB54, 0x02B60, 0x09570, 0x052F2, 0x04970,
    0x06566, 0x0D4A0, 0x0EA50, 0x06E95, 0x05AD0, 0x02B60, 0x186E3, 0x092E0, 0x1C8D7, 0x0C950,
    0x0D4A0, 0x1D8A6, 0x0B550, 0x056A0, 0x1A5B4, 0x025D0, 0x092D0, 0x0D2B2, 0x0A950, 0x0B557,
    0x06CA0, 0x0B550, 0x15355, 0x04DA0, 0x0A5B0, 0x14573, 0x052B0, 0x0A9A8, 0x0E950, 0x06AA0,
    0x0AEA6, 0x0AB50, 0x04B60, 0x0AAE4, 0x0A570, 0x05260, 0x0F263, 0x0D950, 0x05B57, 0x056A0,
    0x096D0, 0x04DD5, 0x04AD0, 0x0A4D0, 0x0D4D4, 0x0D250, 0x0D558, 0x0B540, 0x0B6A0, 0x195A6,
    0x095B0, 0x049B0, 0x0A974, 0x0A4B0, 0x0B27A, 0x06A50, 0x06D40, 0x0AF46, 0x0AB60, 0x09570,
    0x04AF5, 0x04970, 0x064B0, 0x074A3, 0x0EA50, 0x06B58, 0x055C0, 0x0AB60, 0x096D5, 0x092E0,
    0x0C960, 0x0D954, 0x0D4A0, 0x0DA50, 0x07552, 0x056A0, 0x0ABB7, 0x025D0, 0x092D0, 0x0CAB5,
    0x0A950, 0x0B4A0, 0x0BAA4, 0x0AD50, 0x055D9, 0x04BA0, 0x0A5B0, 0x15176, 0x052B0, 0x0A930,
    0x07954, 0x06AA0, 0x0AD50, 0x05B52, 0x04B60, 0x0A6E6, 0x0A4E0, 0x0D260, 0x0EA65, 0x0D530,
    0x05AA0, 0x076A3, 0x096D0, 0x04BD7, 0x04AD0, 0x0A4D0, 0x1D0B6, 0x0D250, 0x0D520, 0x0DD45,
    0x0B5A0, 0x056D0, 0x055B2, 0x049B0, 0x0A577, 0x0A4B0, 0x0AA50, 0x1B255, 0x06D20, 0x0ADA0,
    0x14B63
);

// 干支转换的数据
const GanZhiStartYear = 1864; //阴历年，干支起始的年份
const GanZhiStartDay = new Date(1899, 12, 22, 0, 0, 0, 0); //阳历年月日，干支起始的日期
const GanStr = "甲乙丙丁戊己庚辛壬癸";
const ZhiStr = "子丑寅卯辰巳午未申酉戌亥";

/**
 * 中国日期，构造函数 
 * year  阳历年 int
 * month 阳历月 int
 * day   阳历日 int
 */
var ChineseDate = function (year, month, day, isChineseDate, isLeapMonthFlag) {
  this.year = year;
  this.month = month;
  this.day = day;
  //阴历的月日
  this._cYear = year;
  this._cMonth = month;
  this._cDay = day;
  //根据不同类型去初始化数据
  if (isChineseDate == false) {
    //设置转换阴历
    this._datetime = new Date(year, month, day, 0, 0, 0, 0);
    //转换年， 计算两天的基本差距[即1900到当天的天差]
    var offsetDay = (this._datetime - MinDay) / (24 * 60 * 60 * 1000);
    var temp = 0;
    var last = 0;
    for (this._cYear = MinYear; this._cYear <= MaxYear; this._cYear++) {
      temp = this.getChineseYearDays(this._cYear);  //求当年农历年天数
      last = offsetDay - temp;
      if (last < 1) {
        break;
      } else {
        offsetDay = last;
      }
    }

    this._cIsLeapYear = false; //当月是否闰月
    var leapMonth = this.getChineseLeapMonth(this._cYear);//计算该年闰哪个月
    //设定当年是否有闰月
    if (leapMonth > 0) {
      this._cIsLeapYear = true;
    }
    //转换阴历月 与 阴历日
    this._cIsLeapMonth = false;  //当月是否闰月
    var idxMonth;
    for (idxMonth = 1; idxMonth <= 12; idxMonth++) {
      //闰月
      if (leapMonth > 0
        && idxMonth == (leapMonth + 1)
        && this._cIsLeapMonth == false) {
        this._cIsLeapMonth = true;
        idxMonth = idxMonth - 1;
        temp = this.getChineseLeapMonthDays(this._cYear); //计算闰月天数
      } else {
        this._cIsLeapMonth = false;
        temp = this.getChineseMonthDays(this._cYear, idxMonth);//计算非闰月天数
      }
      last = offsetDay - temp;
      if (last <= 0) {
        break;
      } else {
        offsetDay = last;
      }
    }
    this._cMonth = idxMonth;
    this._cDay = offsetDay;
  }else{
    //设置阴历转换成阳历
    var i, temp, offset;
    // this.checkChineseDateLimit(cy, cm, cd, isLeapMonthFlag);
    var cy = this._cYear ;
    var cm = this._cMonth;
    var cd = this._cDay;
    //年的处理
    offset = 0;
    for (i = MinYear; i < this._cYear; i++) {
      temp = this.getChineseYearDays(i); //求当年农历年天数
      offset = offset + temp;
    }

    var leap = this.getChineseLeapMonth(this._cYear);// 计算该年应该闰哪个月
    if (leap != 0) {
      this._cIsLeapYear = true;
    } else {
      this._cIsLeapYear = false;
    }
    // 月的处理
    if (this._cMonth != leap) {
      this._cIsLeapMonth = false;  //当前日期并非闰月
    } else {
      this._cIsLeapMonth = isLeapMonthFlag;  //使用用户输入的是否闰月月份
    }

    if (this._cIsLeapYear == false //当年没有闰月
      || this._cMonth < leap) {    //计算月份小于闰月
      for (i = 1; i < cm; i++) {
        temp = this.getChineseMonthDays(this._cYear, i);//计算非闰月天数
        offset = offset + temp;
      }
      //检查日期是否大于最大天
      if (this._cDay > this.getChineseMonthDays(this._cYear, this._cMonth)) {
        throw new Exception("不合法的农历日期");
      }
      offset = offset + this._cDay; //加上当月的天数
    } else {
      //是闰年，且计算月份大于或等于闰月
      for (i = 1; i < this._cMonth; i++) {
        temp = this.getChineseMonthDays(this._cYear, i); //计算非闰月天数
        offset = offset + temp;
      }
      if (this._cMonth > leap) { //计算月大于闰月
        temp = this.getChineseLeapMonthDays(this._cYear);   //计算闰月天数
        offset = offset + temp;               //加上闰月天数

        if (this._cDay > this.getChineseMonthDays(this._cYear, this._cMonth)) {
          throw new Exception("不合法的农历日期");
        }
        offset = offset + this._cDay;
      } else { //计算月等于闰月
        //如果需要计算的是闰月，则应首先加上与闰月对应的普通月的天数
        if (this._cIsLeapMonth == true) {//计算月为闰月
          temp = this.getChineseMonthDays(this._cYear, this._cMonth); //计算非闰月天数
          offset = offset + temp;
        }
        if (this._cDay > this.getChineseLeapMonthDays(this._cYear)) {
          throw new Exception("不合法的农历日期");
        }
        offset = offset + this._cDay;
      }
    }
    //初始日期，加天数
    this._datetime = new Date(MinDay);
    this._datetime.setDate(MinDay.getDate() + offset); 
  }
  //计算干支年月日
  this._ganZhi = this.calculateGanZhiString();
};

/**
 * 返回干支纪年
 */
ChineseDate.prototype.getGanZhiString = function () {
  return this._ganZhi;
};

/**
 * 计算干支纪年
 */
ChineseDate.prototype.calculateGanZhiString = function () {
  //干支年的计算
  var offsetYear = (this._cYear - GanZhiStartYear) % 60; //计算干支
  var ganZhiYear = GanStr.charAt(offsetYear % 10) + "" + ZhiStr.charAt(offsetYear % 12);
  
  //干支月的计算
  //根据当年的干支年的干来计算月干的第一个
  var ganIndex = 1;
  switch (offsetYear % 10) {
    case 0: //甲
      ganIndex = 3;
      break;
    case 1: //乙
      ganIndex = 5;
      break;
    case 2: //丙
      ganIndex = 7;
      break;
    case 3: //丁
      ganIndex = 9;
      break;
    case 4: //戊
      ganIndex = 1;
      break;
    case 5: //己
      ganIndex = 3;
      break;
    case 6: //庚
      ganIndex = 5;
      break;
    case 7: //辛
      ganIndex = 7;
      break;
    case 8: //壬
      ganIndex = 9;
      break;
    case 9: //癸
      ganIndex = 1;
      break;
  }
  var ganMonth = GanStr.charAt((ganIndex + this._cMonth - 2) % 10);
  //每个月的地支总是固定的,而且总是从寅月开始
  var zhiIndex;
  if (this._cMonth > 10) {
    zhiIndex = this._cMonth - 10;
  } else {
    zhiIndex = this._cMonth + 2;
  }
  var zhiMonth = ZhiStr.charAt(zhiIndex - 1);
  //干支月
  var ganZhiMonth = ganMonth + "" + zhiMonth;

  //干支日的计算
  var offsetDay = (this._datetime - GanZhiStartDay) / (24 * 60 * 60 * 1000); 
  var ganZhiOffset = offsetDay % 60;
  var ganZhiDay = GanStr.charAt(ganZhiOffset % 10) + "" + ZhiStr.charAt(ganZhiOffset % 12);
  //最终干支字符串
  return ganZhiYear + ganZhiMonth + ganZhiDay;
};

/**
 * 获取阴历的年月日
 * 农历:2018年闰1月3日
 */
ChineseDate.prototype.getChineseDateString = function() {
  if (this._cIsLeapMonth == true) {
    return "农历:" + this._cYear + "年闰" + this._cMonth + "月" + this._cDay + "日";
  } else {
    return "农历:" + this._cYear + "年"   + this._cMonth + "月" + this._cDay + "日";
  }
};

/**
 *
 * 返回农历 y年m月的总天数
 * year  农历年
 * month 农历月
 */
ChineseDate.prototype.getChineseMonthDays = function(year, month){
  //0X0FFFF[0000 {1111 1111 1111} 1111]
  if (this.bitTest32((LunarDateArray[year - MinYear] & 0x0000FFFF), (16 - month))) {
    return 30;
  } else {
    return 29;
  }
};
/**
 * 测试某位是否为真
 * num        第几位
 * bitpostion 位串
 */
ChineseDate.prototype.bitTest32 = function(num, bitpostion){
  var bit = 1 << bitpostion;
  if ((num & bit) == 0) {
    return false;
  } else {
    return true;
  }
};

/**
 * 求当年农历年天数
 * year 是农历年
 */
ChineseDate.prototype.getChineseYearDays = function(year){
  var sumDay = 348; //29天 X 12个月
  var i = 0x8000;
  var info = LunarDateArray[year - MinYear] & 0x0FFFF;
  //0x04BD8  & 0x0FFFF 中间12位，即4BD，每位代表一个月，为1则为大月，为0则为小月
  //计算12个月中有多少天为30天
  var f = 0;
  for (var m = 0; m < 12; m++) {
    f = info & i; // 0x04BD8  & 0x0FFFF  & 0x8000[1000 0000 0000 0000]
    if (f != 0) {
      sumDay++;
    }
    i = i >> 1;
  }
  return sumDay + this.getChineseLeapMonthDays(year);
};

/**
 * 返回农历 y年闰月的天数
 * year 是农历年
 */
ChineseDate.prototype.getChineseLeapMonthDays = function(year) {
  if (this.getChineseLeapMonth(year) != 0) {
    //前4位，即0在这一年是润年时才有意义，它代表这年润月的大小月。
    if ((LunarDateArray[year - MinYear] & 0x10000) != 0) {
      //为1则润大月
      return 30;
    } else {
      //为0则润小月
      return 29;
    }
  } else {
    return 0;
  }
};

/**
 * 返回农历 y年闰哪个月 1-12 , 没闰传回 0
 * year 是农历年
 */
ChineseDate.prototype.getChineseLeapMonth = function(year) {
  //最后4位，即8，代表这一年的润月月份，为0则不润。首4位要与末4位搭配使用
  return LunarDateArray[year - MinYear] & 0xF;
};

/**
 * 抛出去的方法
 */
module.exports = {
  buildChineseDate: function (year, month, day, dtype, isLeapMonthFlag ) {
    var isChineseDate = true;
    if(dtype == "0" || dtype == 0){
      isChineseDate = false;
    }
    return new ChineseDate(year, month, day, isChineseDate, isLeapMonthFlag);
  }
};
