const obj = {
  // 第一个参数接受一个日期，可以是date格式，或者是毫秒数或者是‘yyyy-mm-dd’的字符串格式
  // 第二个可选参数是要增加的日期，比如，现在是2017-10-16，增加一天就是2017-10-17, 可以是负增长来减少
  dateFormat(date, increment = 0) {
    const timeStamp = increment * 24 * 60 * 60 * 1000
    const time = new Date(Date.parse(new Date(date)) + timeStamp)
    const year = time.getFullYear()
    const month = (time.getMonth() < 9 ? '0' : '') + (time.getMonth() + 1)
    const day = (time.getDate() < 10 ? '0' : '') + time.getDate()
    return `${year}-${month}-${day}`
  },
  // 时间戳转换成全部
  allTurnTime(value) {
    let time = new Date(value)
    let year = time.getFullYear()
    let month = (time.getMonth() < 9 ? '0' : '') + (time.getMonth() + 1)
    let day = (time.getDate() < 10 ? '0' : '') + time.getDate()
    let hour = (time.getHours() < 10 ? '0' : '') + time.getHours()
    let minute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
    return year + '.' + month + '.' + day + ' ' + hour + ':' + minute
  },
  // 时间戳转换成年月日
  turnYMD(value) {
    let time = new Date(value)
    let year = time.getFullYear()
    let month = (time.getMonth() < 9 ? '0' : '') + (time.getMonth() + 1)
    let day = (time.getDate() < 10 ? '0' : '') + time.getDate()
    return year + '.' + month + '.' + day
  },
  // 时间戳转换成时分
  TimeSec(date) {
    const time = new Date(date)
    const hour = (time.getHours() < 10 ? '0' : '') + time.getHours()
    const minute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
    return `${hour}:${minute}`
  },
  // 分转换成元
  fenToYuan(value) {
    return (parseFloat(value) / 100).toFixed(2)
  },
}

export default obj
