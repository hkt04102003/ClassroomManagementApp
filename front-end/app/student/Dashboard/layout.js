import Header from '@/app/components/Header/Header'
import Sidebar from '@/app/components/Sidebar/Sidebar'
import React from 'react'

export default function DashboardLayout({ children }) {
  return (
    <div>
      <Header/>
      <div className="flex ">
        <div>
            <Sidebar/>
        </div>
        <div className='w-full'>
            <main>{children}</main>
        </div>
      </div>
    </div>
  )
}

