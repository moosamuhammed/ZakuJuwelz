import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import { DefaultSidebar } from './Sidebar'

function Layout() {
  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <DefaultSidebar className="w-64 bg-white shadow-md hidden lg:block" />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar className="bg-white shadow-md p-4" />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
