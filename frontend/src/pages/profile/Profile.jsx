import React from 'react'
import { useParams } from 'react-router-dom'
import RightSidebar from './RightSidebar';
import ProfileDetails from './ProfileDetails';

export default function Profile() {
    const { username } = useParams();
    return (
        <section className='grid grid-cols-1 items-start md:grid-cols-4 mt-3 gap-x-4'>
            <ProfileDetails username={username} />

            <RightSidebar username={username} />
        </section>
    )
}
