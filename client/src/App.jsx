import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import {
  Home, Login, DefaultLayout, Register, Job, Introduction, Company, Forgotpassword,
  UserInfo, DetailPostJob, DetailBusiness, ChangePassword, CVList, WishlistBusiness,
  Wishlistjob
} from './page/public';
import {
  BusinessLayout, DashboardBusiness, CreateBusiness, BusinessBuyPostJob,
  BusinessPostJob, HistoryBuy, ManagerStaff, ManagerInfoBusi, CreateStaff,
  ManagerPostJob, UpdatePostJob, DetailCV
} from './page/business';
import {
  Adminlayout, DashboardAdmin, ManagerJob, ManagerLevel, ManagerPacketPost, ManagerSalaryRange
  , ManagerSkill, ManagerStyleJob, ManagerUser, Graph, ManagerExp, ManagerCompany, PostAdmin,
  ManagerCompanyDetail, ManagerPostDetail, CreateCV
} from './page/admin';
import path from './ultils/path';
import './App.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <Routes>
        <Route path={path.PUBLIC} element={<DefaultLayout />} >
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.REGISTER} element={<Register />} />
          <Route path={path.INTRODUCTION} element={<Introduction />} />
          <Route path={path.JOB} element={<Job />} />
          <Route path={path.COMPANY} element={<Company />} />
          <Route path={path.FORGOT_PASSWORD} element={<Forgotpassword />} />

          <Route path={path.CVLIST} element={<CVList />} />
          <Route path={path.WISHLISTJOB} element={<Wishlistjob />} />
          <Route path={path.WISHLISTBUSINESS} element={<WishlistBusiness />} />
          <Route path={path.CHANGEPASSWORD} element={<ChangePassword />} />
          <Route path={path.USERINFO} element={<UserInfo />} />
          <Route path={path.DETAILCOMPANY} element={<DetailBusiness />} />
          <Route path={path.DETAILJOB} element={<DetailPostJob />} />
        </Route>
        <Route path={path.BUSINESS} element={<BusinessLayout />} >
          <Route path={path.DASHBOARDBUSINESS} element={<DashboardBusiness />} />
          <Route path={path.CREATEBUSINESS} element={<CreateBusiness />} />
          <Route path={path.BUSINESSBUYPOSTJOB} element={<BusinessBuyPostJob />} />
          <Route path={path.BUSINESSPOSTJOB} element={<BusinessPostJob />} />
          <Route path={path.HISTORYBUY} element={<HistoryBuy />} />
          <Route path={path.MANAGERSTAFF} element={<ManagerStaff />} />
          <Route path={path.MANAGERINFOBUSI} element={<ManagerInfoBusi />} />
          <Route path={path.CREATESTAFF} element={<CreateStaff />} />
          <Route path={path.MANAGERPOSTJOB} element={<ManagerPostJob />} />
          <Route path={path.UPDATEPOSTJOB} element={<UpdatePostJob />} />
          <Route path={path.CVPOSTJOBMAIN} element={<DetailCV />} />
        </Route>
        <Route path={path.ADMIN} element={<Adminlayout />} >
          <Route path={path.DASHBOARDADMIN} element={<DashboardAdmin />} />
          <Route path={path.JOBADMIN} element={<ManagerJob />} />
          <Route path={path.LEVELADMIN} element={<ManagerLevel />} />
          <Route path={path.STYLEJOBADMIN} element={<ManagerStyleJob />} />
          <Route path={path.SALARYRANGEADMIN} element={<ManagerSalaryRange />} />
          <Route path={path.PACKETPOSTADMIN} element={<ManagerPacketPost />} />
          <Route path={path.USERADMIN} element={<ManagerUser />} />
          <Route path={path.GRAPHADMIN} element={<Graph />} />
          <Route path={path.EXPADMIN} element={<ManagerExp />} />
          <Route path={path.SKILLADMIN} element={<ManagerSkill />} />
          <Route path={path.COMPANYADMIN} element={<ManagerCompany />} />
          <Route path={path.COMPANYADMINDETAIL} element={<ManagerCompanyDetail />} />
          <Route path={path.POSTADMIN} element={<PostAdmin />} />
          <Route path={path.POSTADMINDETAIL} element={<ManagerPostDetail />} />
          <Route path={path.CREATECVADMIN} element={<CreateCV />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        pauseOnHover
        theme="colored"
      />
    </>
  )
}

export default App
