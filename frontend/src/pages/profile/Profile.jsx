import React from 'react'
import { useParams } from 'react-router-dom'
import { useFetchProfile } from '../../hooks/useUserProfile';
import RightSidebar from './RightSidebar';
import ProfileDetails from './ProfileDetails';

export default function Profile() {
    const { username } = useParams();
    const { data, isLoading, isError, error } = useFetchProfile(username);

    console.log(data);


    return (
        <section className='grid grid-cols-1 items-start md:grid-cols-4 mt-3 gap-x-4'>
            <ProfileDetails />

            <RightSidebar username={username} />
        </section>
    )
}
