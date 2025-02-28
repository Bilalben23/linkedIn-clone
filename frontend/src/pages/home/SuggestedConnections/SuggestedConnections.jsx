import React from 'react'
import useSuggestedConnections from '../../../hooks/useSuggestedConnections'
import { Link } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import useSendConnectionRequest from '../../../hooks/useSendConnectionRequest';
import SuggestedConnectionItem from './SuggestedConnectionItem';

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;


export default function SuggestedConnections() {
    const {
        data: suggestedConnections,
        isLoading,
        isError,
        error
    } = useSuggestedConnections();

    console.log(suggestedConnections);

    return (
        <div className='border p-4 bg-base-100 hidden md:block shadow-xs rounded-box border-gray-300'>
            <h2 className='font-bold text-sm'>People you may know</h2>
            <div className='flex flex-col'>
                {
                    suggestedConnections?.map(user => {
                        return <SuggestedConnectionItem
                            key={user?._id}
                            user={user}
                        />
                    })
                }
            </div>
        </div>
    )
}
