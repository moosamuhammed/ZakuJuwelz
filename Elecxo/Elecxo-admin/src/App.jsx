import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashbord from './pages/admin/Dashbord'
import Layout from './layout/admin/Layout'
import Addproduct from './pages/admin/Addproduct'
import Login from './pages/admin/Login'
import Category from './pages/admin/Category'
import Editproduct from './pages/admin/Editproduct'
import CategoryManagement from './pages/admin/Categorymanage'
import EditCategory from "./pages/admin/Editcategory";
import AdminStockPage from './pages/admin/Stocks'
import Stocks from './pages/admin/Stockseeingpage'
import Orders from './pages/admin/order'


function App() {
  return (
    <div>
    <Routes>
      <Route  path='/admin' element={<Layout/>}>
        <Route path='dashboard' element={<Dashbord/>}></Route>
        <Route path='addproducts' element={<Addproduct/>}></Route>
        <Route path='addcategory' element={<Category/>}></Route>
        <Route path='editproduct/:id' element={<Editproduct/>}></Route>
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="editcategory/:id" element={<EditCategory />} />
        <Route path="stock" element={<AdminStockPage />} />
       <Route path='stockssee' element={<Stocks />}/>
       <Route path="orders" element={<Orders />} />
      </Route>
      <Route path='/admin/login' element={<Login/>}></Route>
      
    </Routes>
    </div>
  )
}

export default App

