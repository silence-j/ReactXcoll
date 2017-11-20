const obj = {
    // 手机号码中间四位用*代替
    phoneReplace(data) {
        if (!data) {
            return
        }
        return data.substr(0 , 3) + '****' + data.substr(7)
    }
}
export default obj
