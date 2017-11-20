function enCode (str) {
  if(!str) {
    return ''
  }
  let htmlStr = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;quot;/g, '').replace(/&amp;nbsp;/g, ' ')
  return htmlStr
}

export default enCode
