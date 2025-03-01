import React from 'react'
import useSuggestedConnections from '../../../hooks/useSuggestedConnections'
import SuggestedConnectionItem from './SuggestedConnectionItem';

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
