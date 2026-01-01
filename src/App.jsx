import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './Navbar'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register';
import AdminRoute from './pages/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import CarDetails from './pages/CarDetails';
import AdminEnquery from './pages/AdminEnqury'
import Status from './pages/Status'


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<About />} />
        <Route path='/*' element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/car/:id" element={<CarDetails />} />
        <Route path='/enquiries' element={<AdminEnquery/>}/>
         <Route path='/status' element={<Status/>}/>


        <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />


      </Routes>
    </BrowserRouter>
  )
}
