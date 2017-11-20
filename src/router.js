import React from 'react'
import { Router, Route, Switch } from 'dva/router'
import IndexPage from './routes/Index/IndexPage.jsx'
import CourseDetail from './routes/courseDetail/courseDetail'
import Payment from './routes/payment/payment'
import Login from './routes/login/login'
import LinkTo from './routes/linkTo/linkto.jsx'
import LoverLink from './routes/loverlink/loverLink.jsx'
import AnotherLover from './routes/loverlink/anotherLover.jsx'
import Moment from './routes/moment/moment'
import CardDetail from './routes/clubCard/cardDetail/CardDetail'
import Payoff from './routes/clubCard/cardDetail/payoff/Payoff'
import Detail from './routes/detail/Detail.jsx'
import Ysuccess from './routes/Notvip/Notvip.jsx'
import Survey from './routes/clubCard/cardDetail/payoff/survey/Survey'
import Target from './routes/clubCard/cardDetail/payoff/target/Target'
import PersonalInfo from './routes/clubCard/cardDetail/payoff/personalInfo/PersonalInfo'
import Homepage from './routes/personalCenter/homepage/Homepage'
import MyClubCard from './routes/personalCenter/center/myClubCard/MyClubCard'
import IndexCool from './routes/indexCool/indexCool'
import Activity from './routes/personalCenter/activity/Activity'
import Expense from './routes/personalCenter/expense/Expense'
import History from './routes/personalCenter/history/History'
import ActivityAssess from './routes/personalCenter/activityAssess/ActivityAssess'
import Social from './routes/social/social.jsx'
import Release from './routes/social/upload/upload'
import ActiveDetail from './routes/social/activeDetail/activeDetail'
import Vipbuy from './routes/detail/price/vipbuy.jsx'
import LessonBuy from './routes/detail/lessonbuy/lessonbuy.jsx'
import Cancel from './routes/appointment/cancel/Cancel'
import HisCourse from './routes/personalCenter/hisCourse/HisCourse'
import Personsuccess from './routes/personsuccess/personsuccess.jsx'
import SocialHot from './routes/social/show/show'
import Open from './routes/open/open'
import Lessondetail from './routes/detail/lessondetail/lessondetail.jsx'
import Declaration from './routes/declaration/declaration.js'


function RouterConfig({ history }) {
  if (history.location.pathname === '/') {
    history.replace('/index/course')
  }
  return (
    <Router history={history}>
      <Switch>
        <Route path="/index" component={IndexPage} />
        <Route path="/indexCool" component={IndexCool} />
        <Route path="/login" component={Login} />
        <Route path="/linkTo" component={LinkTo} />
        <Route path="/loverLink" component={LoverLink} />
        <Route path="/anotherlover" component={AnotherLover} />
        <Route path="/moment" component={Moment} />
        <Route path="/payment" component={Payment} />
        <Route path="/courseDetail" component={CourseDetail} />
        <Route path="/cardDetail" component={CardDetail} />
        <Route path="/payoff" component={Payoff} />
        <Route path="/teacher" component={Detail} />
        <Route path="/ysuccess" component={Ysuccess} />
        <Route path="/survey" component={Survey} />
        <Route path="/target" component={Target} />
        <Route path="/personalInfo" component={PersonalInfo} />
        <Route path="/homepage" component={Homepage} />
        <Route path="/myClubCard" component={MyClubCard} />
        <Route path="/activity" component={Activity} />
        <Route path="/expense" component={Expense} />
        <Route path="/history" component={History} />
        <Route path="/hisCourse" component={HisCourse} />
        <Route path="/activityAssess" component={ActivityAssess} />
    	  <Route path="/social" component={Social} />
      	<Route path="/release" component={Release} />
   	   	<Route path="/activeDetail" component={ActiveDetail}/>
		    <Route path="/vipdetail" component={Vipbuy} />
        <Route path="/reallesson" component={LessonBuy} />
        <Route path="/cancel" component={Cancel} />   
      	<Route path="/personsuccess" component={Personsuccess} />
      	<Route path="/socialHot" component={SocialHot} />
      	<Route path="/open" component={Open} />
        <Route path="/lessondetail" component={Lessondetail} />
        <Route path="/declaration" component={Declaration} />
      </Switch>
    </Router>
  )
}

export default RouterConfig;
