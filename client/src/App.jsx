import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import { Home, Login, DefaultLayout, Register, Job, Introduction, Company } from './page/public';
import path from './ultils/path';
import './App.css'

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
        </Route>
      </Routes>
    </>
  )
}

export default App
