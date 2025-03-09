import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

export default function Layout() {
    return (
        <div className='min-h-screen'>
            <Navbar />

            <main className='max-w-7xl mx-auto sm:px-4 py-6 mt-9'>
                <Outlet />
            </main>
        </div>
    )
}
