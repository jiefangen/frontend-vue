/**
 * 获取UUID
 * // 0ccef3b3-f906-49af-8661-22e4d38f3186
 * @returns {string}
 */
export function getUuid() {
  const s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'
  const uuid = s.join('')
  return uuid
}

/**
 * 生成一个用不重复的ID
 * // 4 randomLength
 * e18gnpiza2o
 * @param { Number } randomLength
 */
export function getDtRdId(randomLength) {
  return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36)
}

/**
 * 生成指定长度和基数
 * // 8 character ID (base=2)
 * uuid(8, 2)  //  "01001010"
 * // 8 character ID (base=10)
 * uuid(8, 10) // "47473046"
 * // 8 character ID (base=16)
 * uuid(8, 16) // "098F4D35"
 * @param len 生成ID长度
 * @param radix 随机进制格式
 * @returns {string}
 */
export function getCustomUuid(len, radix) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uuid = []
  let i
  radix = radix || chars.length
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    let r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

/**
 * 根据时间以及随机数生成唯一ID
 * // 22051316590318
 * @returns {string}
 */
export function getDtId() {
  const currentTime = new Date()
  let year = currentTime.getFullYear()
  let month = currentTime.getMonth() + 1
  let date = currentTime.getDate()
  // const day = currentTime.getDay()
  let hours = currentTime.getHours()
  let minutes = currentTime.getMinutes()
  let seconds = currentTime.getSeconds()
  // const ms = currentTime.getMilliseconds()
  year = (year + '').substring(2)
  if (month <= 9) {
    month = '0' + month
  }
  if (date <= 9) {
    date = '0' + date
  }
  if (hours <= 9) {
    hours = '0' + hours
  }
  if (minutes <= 9) {
    minutes = '0' + minutes
  }
  if (seconds <= 9) {
    seconds = '0' + seconds
  }
  const num = Math.ceil(Math.random() * 100)
  const tId = year + month + date + hours + minutes + seconds + num
  return tId
}
