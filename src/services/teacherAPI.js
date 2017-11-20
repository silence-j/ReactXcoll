import request from '../utils/request.js'

const obj = {

	getCoachDetail(params) {
		const url = `/xcool/coach/getDetail?id=${params.id}`
		return request.get(url)
	},
	gettime(params) {
		const url = `/xcool/coach/getLatestSchedule?coachId=${params.coachId}`
		return request.get(url)
	},
	getlesson(params) {
		const url = `/xcool/course/getPrivateCourse?coachId=${params.coachId}`
		return request.get(url)
	},
	yuyue(params) {
    	const url = '/xcool/coach/reserve'
        return request.post(url, params)
  	},
  	getprice() {
		const url = `/xcool/course/getCoursePackage`
		return request.get(url)
	},
	wxpay(params) {
    	const url = '/xcool/order/create'
        return request.post(url, params)
  	},
  	isvip() {
		const url = `/xcool/user/get`
		return request.get(url)
	},
	pingjia(params) {
		const url = `/xcool/course/queryComment?type=${params.type}&id=${params.id}`
		return request.get(url)
	},
	erweima(params) {
		const url = `/xcool/coach/getReserveInfo?reserveId=${params.reserveId}`
		return request.get(url)
	},
  
  	issurvey() {
		const url = `/xcool/user/get`
		return request.get(url)
	},
	lessondetail (params){
		const url=`/xcool/course/getDetail?courseId=${params.courseId}`
		return request.get(url)
	}
	
}

export default obj