import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import useAuth from '../../hooks/useAuth';
import SuggestedConnections from './SuggestedConnections/SuggestedConnections';

export default function HomeLayout() {
    const { authState } = useAuth();

    return (
        <section className='grid grid-cols-1 items-start md:grid-cols-4 mt-3 gap-x-4'>
            <Sidebar user={authState.user} />

            <Outlet />

            <SuggestedConnections />
        </section>
    )
}