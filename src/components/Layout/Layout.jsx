import React from 'react'
import Navbar from '../Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'
import FitnessDataProvider from '../Context/FitnessDataContext'

export default function Layout() {
  return (
    <>
      <Navbar/>
      <FitnessDataProvider>
        <Outlet/>
      </FitnessDataProvider>
      <Footer/>
    </>
  )
}
