
//验证手机号
export function verifyPhone(rule, value, callback) {
	let reg = /^[1][3, 4, 5, 6, 7, 8, 9][0-9]{9}$/
	if(!reg.test(value)){
		return callback(new Error('请输入正确的手机号码'))
	}
	callback()
}

//车牌号码
export function verifyCars(rule, value, callback) {
	let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/
	if(!reg.test(value)){
		return callback(new Error('请输入正确的车牌号码'))
	}
	callback()
}
export function genTree(data) {
	const result = []
	if (!Array.isArray(data)) {
	  return result
	}
	data.forEach(item => {
	  delete item.children
	})
	const map = {}
	data.forEach(item => {
	  item.label = item.name
	  item.parentId = item.parent
	  if(item.fullname){
		item.label = item.fullname
	  }
	  item.value = item.id
	  map[item.id] = item
	})
	data.forEach(item => {
	  const parent = map[item.parent]
	  if (parent) {
		(parent.children || (parent.children = [])).push(item)
	  } else {
		result.push(item)
	  }
	})
	return result
  }
