import { useState } from 'react'
import './App.css'
import { Toaster } from 'react-hot-toast'
import Header from "./components/header/Header"
import { Outlet } from "react-router-dom";
import React from 'react'
import Footer from "./components/footer/Footer";

function App() {

  return (
    <>
      <Toaster position="top-right" toastOptions={{

        success: {

          theme: {

            primary: '#4aed88'
          }

        }
      }
      }>

      </Toaster>
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    </>
  )
}

export default App
