import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import { Home, Login, DefaultLayout, Register, Job, Introduction, Company, Forgotpassword } from './page/public';
import { BusinessLayout, DashboardBusiness } from './page/business';
import {
  Adminlayout, DashboardAdmin, ManagerJob, ManagerLevel, ManagerPacketPost, ManagerSalaryRange
  , ManagerSkill, ManagerStyleJob, ManagerUser, Graph, ManagerExp, ManagerCompany, PostAdmin
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
        </Route>
        <Route path={path.BUSINESS} element={<BusinessLayout />} >
          <Route path={path.DASHBOARDBUSINESS} element={<DashboardBusiness />} />
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
          <Route path={path.POSTADMIN} element={<PostAdmin />} />
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
