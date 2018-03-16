/**
 * 八字的计算
 */

//引入计算阴历，及八字的日期工具
const chineseDateUtils = require("../tools/dateUtils")

//一天内时间的干支
const TimeGanZhiTable = [
        ["甲子", "丙子", "戊子", "庚子", "壬子" ],
        ["乙丑", "丁丑", "己丑", "辛丑", "癸丑" ],
        ["丙寅", "戊寅", "庚寅", "壬寅", "甲寅" ],
        ["丁卯", "己卯", "辛卯", "癸卯", "乙卯" ],
        ["戊辰", "庚辰", "壬辰", "甲辰", "丙辰" ],
        ["己巳", "辛巳", "癸巳", "己巳", "丁巳" ],
        ["庚午", "壬午", "甲午", "丙午", "戊午" ],
        ["辛未", "癸未", "乙未", "丁未", "己未" ],
        ["壬申", "甲申", "丙申", "戊申", "庚申" ],
        ["癸酉", "乙酉", "丁酉", "己酉", "辛酉" ],
        ["甲戌", "丙戌", "戊戌", "庚戌", "壬戌" ],
        ["乙亥", "丁亥", "己亥", "辛亥", "癸亥" ]
    ];
const TianGan = "甲乙丙丁戊己庚辛壬癸";
const DiZhi = "子丑寅卯辰巳午未申酉戌亥";
/**
   天干地支的五行属性表
    天干： 甲-木、乙-木、丙-火、丁－火、戊－土、己－土、庚－金、辛－金、壬－水、癸－水
    地支： 子-水、丑-土、寅-木、卯－木、辰－土、巳－火、午－火、未－土、申－金、酉－金、戌－土、亥－水
*/
const TianGan_WuXingProp = [1, 1, 3, 3, 4, 4, 0, 0, 2, 2];
const DiZhi_WuXingProp   = [2, 4, 1, 1, 4, 3, 3, 4, 0, 0, 4, 2 ];
/**
   金 --- 0 
   木 --- 1
   水 --- 2
   火 --- 3
   土 --- 4
*/
const WuXingTable = [ '金', '木', '水', '火', '土' ];
/**
  五行相生关系表
  金生水，水生木，木生火，火生土，土生金
*/
const GenerationSourceTable = [ 4, 2, 0, 1, 3];

const TianGan_Strength = [
        [ 1.2,  1.2,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.2,  1.2 ],
        [ 1.06, 1.06, 1.0,  1.0,  1.1,  1.1,  1.14, 1.14, 1.1,  1.1 ],
        [ 1.14, 1.14, 1.2,  1.2,  1.06, 1.06, 1.0,  1.0,  1.0,  1.0 ],
        [ 1.2,  1.2,  1.2,  1.2,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0 ],
        [ 1.1,  1.1,  1.06, 1.06, 1.1,  1.1,  1.1,  1.1,  1.04, 1.04],
        [ 1.0,  1.0,  1.14, 1.14, 1.14, 1.14, 1.06, 1.06, 1.06, 1.06],
        [ 1.0,  1.0,  1.2,  1.2,  1.2,  1.2,  1.0,  1.0,  1.0,  1.0 ],
        [ 1.04, 1.04, 1.1,  1.1,  1.16, 1.16, 1.1,  1.1,  1.0,  1.0 ],
        [ 1.06, 1.06, 1.0,  1.0,  1.0,  1.0,  1.14, 1.14, 1.2,  1.2 ],
        [ 1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.2,  1.2,  1.2,  1.2 ],
        [ 1.0,  1.0,  1.04, 1.04, 1.14, 1.14, 1.16, 1.16, 1.06, 1.06],
        [ 1.2,  1.2,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.14, 1.14]
    ];
const DiZhi_Strength =
  [
    new ZiStrength('子', '癸', [1.2,  1.1,   1.0,   1.0,  1.04,  1.06,  1.0,  1.0,   1.2,   1.2, 1.06, 1.14] ),
    new ZiStrength('丑', '癸', [0.36, 0.33,  0.3,   0.3,  0.312, 0.318, 0.3,  0.3,   0.36,  0.36, 0.318, 0.342]),
    new ZiStrength('丑', '辛', [0.2,  0.228, 0.2,   0.2,  0.23,  0.212, 0.2,  0.22,  0.228, 0.248, 0.232, 0.2]),
    new ZiStrength('丑', '己', [0.5,  0.55,  0.53,  0.5,  0.55,  0.57,  0.6,  0.58,  0.5,   0.5, 0.57, 0.5 ]),
    new ZiStrength('寅', '丙', [0.3,  0.3,   0.36,  0.36, 0.318, 0.342, 0.36, 0.33,  0.3,   0.3, 0.342, 0.318]),
    new ZiStrength('寅', '甲', [0.84, 0.742, 0.798, 0.84, 0.77,  0.7,   0.7,  0.728, 0.742, 0.7, 0.7, 0.84 ]),
    new ZiStrength('卯', '乙', [1.2,  1.06,  1.14,  1.2,  1.1,   1.0,   1.0,  1.04,  1.06,  1.0, 1.0, 1.2 ]),
    new ZiStrength('辰', '乙', [0.36, 0.318, 0.342, 0.36, 0.33,  0.3,   0.3,  0.312, 0.318, 0.3, 0.3, 0.36 ]),
    new ZiStrength('辰', '癸', [0.24, 0.22,  0.2,   0.2,  0.208, 0.2,   0.2,  0.2,   0.24,  0.24, 0.212, 0.228]),
    new ZiStrength('辰', '戊', [0.5,  0.55,  0.53,  0.5,  0.55,  0.6,   0.6,  0.58,  0.5,   0.5, 0.57, 0.5 ]),
    new ZiStrength('巳', '庚', [0.3,  0.342, 0.3,   0.3,  0.33,  0.3,   0.3,  0.33,  0.342, 0.36, 0.348, 0.3 ]),
    new ZiStrength('巳', '丙', [0.7,  0.7,   0.84,  0.84, 0.742, 0.84,  0.84, 0.798, 0.7,   0.7, 0.728, 0.742 ]),
    new ZiStrength('午', '丁', [1.0,  1.0,   1.2,   1.2,  1.06,  1.14,  1.2,  1.1,   1.0,   1.0, 1.04, 1.06 ]),
    new ZiStrength('未', '丁', [0.3,  0.3,   0.36,  0.36, 0.318, 0.342, 0.36, 0.33,  0.3,   0.3, 0.312, 0.318 ]),
    new ZiStrength('未', '乙', [0.24, 0.212, 0.228, 0.24, 0.22,  0.2,   0.2,  0.208, 0.212, 0.2, 0.2, 0.24 ]),
    new ZiStrength('未', '己', [0.5,  0.55,  0.53,  0.5,  0.55,  0.57,  0.6,  0.58,  0.5,   0.5, 0.57, 0.5 ]),
    new ZiStrength('申', '壬', [0.36, 0.33,  0.3,   0.3,  0.312, 0.318, 0.3,  0.3,   0.36,  0.36, 0.318, 0.342 ]),
    new ZiStrength('申', '庚', [0.7,  0.798, 0.7,   0.7,  0.77,  0.742, 0.7,  0.77,  0.798, 0.84, 0.812, 0.7 ]),
    new ZiStrength('酉', '辛', [1.0,  1.14,  1.0,   1.0,  1.1,   1.06,  1.0,  1.1,   1.14,  1.2, 1.16, 1.0 ]),
    new ZiStrength('戌', '辛', [0.3,  0.342, 0.3,   0.3,  0.33,  0.318, 0.3,  0.33,  0.342, 0.36, 0.348, 0.3 ]),
    new ZiStrength('戌', '丁', [0.2,  0.2,   0.24,  0.24, 0.212, 0.228, 0.24, 0.22,  0.2,   0.2, 0.208, 0.212 ]),
    new ZiStrength('戌', '戊', [0.5,  0.55,  0.53,  0.5,  0.55,  0.57,  0.6,  0.58,  0.5,   0.5, 0.57, 0.5 ]),
    new ZiStrength('亥', '甲', [0.36, 0.318, 0.342, 0.36, 0.33,  0.3,   0.3,  0.312, 0.318, 0.3, 0.3, 0.36 ]),
    new ZiStrength('亥', '壬', [0.84, 0.77,  0.7,   0.7,  0.728, 0.742, 0.7,  0.7,   0.84,  0.84, 0.724, 0.798 ])
  ];
/**
 * 地支的分值对象
 */
function ZiStrength(gan, zhi, strengh){
  this.diZhi=gan;
  this.zhiCang = zhi;
  this.strength = strengh;
}

/**
 * 计算八字及五行属性的类
 * BaziComputer
 */
function BaziComputer(year, month, day, hour) {
  this._year = year;
  this._month = month;
  this._day = day;
  this._hour = hour;
  this._chineseDate = chineseDateUtils.ChineseDateP(year, month, day);
  this._sixBaZi = this._chineseDate.getGanZhiString();
  //计算最终的八字
  this._baZi = computeTimeGan(this._sixBaZi, hour);
  //计算五行
  return calculateBazi(this._baZi);
}

/**
 * 获取阴历的年月日
 */
BaziComputer.prototype.getChineseDateString = function () {
  return this._chineseDate.getChineseDateString();
}

/**
 * 获取八字
 */
BaziComputer.prototype.getBazi = function () {
  return this._baZi;
}
/**
 * 获取五行描述
 */
BaziComputer.prototype.getWuxing = function(){
  return this._wuxing;
}

/**
     * 根据八字计算五行平衡
     * 输入参数：bazi，年月日时的干支，即俗称的八字
     * 输出结果：分析结果字符串，Unicode编码
     * @param bazi
     * @return
     */
BaziComputer.prototype.calculateBazi = function(bazi) {
  var strengthResult = new double[5];
  var monthIndex = computeZhiIndex(bazi.charAt(3));
  if (monthIndex == -1) {
    return null;
  }

  var sResultBuf = new StringBuffer();
  sResultBuf.append(bazi).append("\n\n");

  for (var wuXing = 0; wuXing < 5; wuXing++) {
    var value1 = 0.0, value2 = 0.0;
    var i;
    //扫描4个天干
    for (i = 0; i < 8; i += 2) {
      var gan = bazi.charAt(i);
      var index = computeGanIndex(gan);
      if (index == -1) {
        return null;
      }
      if (TianGan_WuXingProp[index] == wuXing) {
        value1 += TianGan_Strength[monthIndex][index];
      }
    }
    //扫描支藏
    for (i = 1; i < 8; i += 2) {
      var zhi = bazi.charAt(i);
      for (var j = 0; j < DiZhi_Strength.length; j++) {
        if (DiZhi_Strength[j].diZhi == zhi) {
          var zhiCangIndex = computeGanIndex(DiZhi_Strength[j].zhiCang);
          if (zhiCangIndex == -1) {
            return null;
          }
          if (TianGan_WuXingProp[zhiCangIndex] == wuXing) {
            value2 += DiZhi_Strength[j].strength[monthIndex];
            break;
          }
        }
      }
    }

    strengthResult[wuXing] = value1 + value2;
    //输出一行计算结果
    {
      var tmpBuf = String.format(":%.3f + %.3f = %.3f\n", value1,value2, (value1 + value2));
      sResultBuf.append(WuXingTable[wuXing]);
      sResultBuf.append(":\t");
      sResultBuf.append(tmpBuf);
    }

    return sResultBuf;
  }

  //根据日干求命里属性
  var fateProp, srcProp;
  {
    fateProp = TianGan_WuXingProp[computeGanIndex(bazi.charAt(4))];
    if (fateProp == -1) {
      return null;
    }
    sResultBuf.append("\n命属");
    sResultBuf.append(WuXingTable[fateProp]);
    sResultBuf.append("\n\n");
  }

  //求同类和异类的强度值
  srcProp = GenerationSourceTable[fateProp];
  {
    var tongLei = strengthResult[fateProp] + strengthResult[srcProp];
    var yiLei = 0.0;

    for (var i = 0; i < 5; i++){
      yiLei += strengthResult[i];
    }
    yiLei -= tongLei;
    var tmpBuf = String.format("%.3f + %.3f = %.3f\n", strengthResult[fateProp],
      strengthResult[srcProp], tongLei);

    sResultBuf.append("同类：")
      .append(WuXingTable[fateProp])
      .append("+")
      .append(WuXingTable[srcProp])
      .append("，");
    sResultBuf.append(tmpBuf);
    //
    tmpBuf = String.format("%.3f\n", yiLei);
    sResultBuf.append("异类：总和为 ");
    sResultBuf.append(tmpBuf);
  }

  return sResultBuf.toString();
}

/**
 * 计算干的位置
 * @param gan
 * @return
 */
BaziComputer.prototype.computeGanIndex = function (gan) {
  var i = 0;
  for (i = 0; i < 10; i++) {
    if (TianGan.charAt(i) == gan) {
      break;
    }
  }
  if (i >= 10) {
    return -1;
  }
  return i;
}

/**
 * 计算支的位置
 * @param zhi
 * @return
 */
BaziComputer.prototype.computeZhiIndex = function(zhi) {
  var i = 0;
  for (i = 0; i < 12; i++) {
    if (DiZhi.charAt(i) == zhi) {
      break;
    }
  }
  if (i >= 12) {
    return -1;
  }
  return i;
}

/**
 * 根据出生年月日的干支计算时辰干支
 * 输入参数：bazi，年月日的干支，即八字中的前六个字
 * 输入参数：hour，出生时间的小时数，-1~22
 * 输出结果：八字字符串，Unicode编码
 */
BaziComputer.prototype.computeTimeGan = function( bazi,  hour) {
  var dayGan = bazi.charAt(4);
  var indexX, indexY;
  var i;
  for (i = 0; i < 10; i++) {
    if (dayGan == TianGan.charAt(i)) {
      break;
    }
  }
  if (i >= 10) {
    return null;
  }
  indexX = i;
  if (indexX >= 5) {
    indexX -= 5;
  }
  indexY = (hour + 1) / 2;
  return bazi + TimeGanZhiTable[indexY][indexX];
}

module.exports = function (ctx, next) {
  ctx.state.data = { msg: 'Hello World' }
  ctx.state.data = { msg: BaziComputer(2018, 3, 16, 10)}

}
