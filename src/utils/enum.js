/**
 * 枚举创建工厂（构造函数），扩展枚举对象：keys、values(含key值的[{key,text,type}])、formatter。
 * @param {*} enumObj 枚举值，支持标准模式{key:{text,type},}，简单模式{key:text,}（会自动转换为标准模式）
 * @param {*} keyParseFunc key的转换函数，默认null，如果key为整数则传 parseInt
 */
export default function EnumFactory(enumObj, keyParseFunc = null) {
    //复制（继承）enumObj
    Object.assign(this, enumObj)
  
    // keys：枚举的key集合[key]
    Object.defineProperty(this, 'keys', {
      value: keyParseFunc ? Object.keys(enumObj).map(s => keyParseFunc(s)) : Object.keys(enumObj)
    })
  
    // 处理 values
    let values = []
    const ovalues = Object.values(enumObj)
    // 主要区分下value是简单类型（字符串）还是对象类型
    if (typeof ovalues[0] === 'string') {
      ovalues.forEach((text, index) => {
        const obj = { key: this.keys[index], text }
        values.push(obj)
        this[this.keys[index]] = obj
      })
    }
    else {
      ovalues.forEach((item, index) => {
        item.key = this.keys[index]
        values.push(item)
      })
    }
    // 设置values属性
    Object.defineProperty(this, 'values', { value: values })
  
    // formatter：element中表格绑定枚举数据文本的formatter函数
    // r、c为行列，可传入null
    Object.defineProperty(this, 'formatter', {
      value: function(r, c, value) {
        return values.filter(v => v.key == value || v.text == value)[0]?.text || 'notfound'
      }
    })
  
    //枚举定义的数据都是常量，不可修改，冻结一下
    Object.freeze(this)
  }

export const valTypeEnum = new EnumFactory({
  'int': '整型',
  'float': '浮点型',
  'str': '字符串型',
  'bool': '布尔型',
})

export const boolEnum = new EnumFactory({
  true: '是',
  false: '否',
})

export const scheduleTypeEnum = new EnumFactory({
  10: '间隔',
  20: '定时',
}, parseInt)

export const schedulePeriodEnum = new EnumFactory({
  'seconds': '秒',
  'minutes': '分钟',
  'hours': '小时',
  'days': '天',
})
