import React from 'react'
import { useSuggestedConnections } from '../../../hooks/useConnections'
import SuggestedConnectionItem from './SuggestedConnectionItem';
import SuggestedConnectionSkeleton from '../../../components/skeletons/SuggestedConnectionSkeleton';
import { FaUserSlash } from 'react-icons/fa';

export default function SuggestedConnections() {
    const {
        data: suggestedConnections,
        isLoading,
        isError,
        error
    } = useSuggestedConnections(4);

    return (
        <div className='border p-4 bg-base-100 hidden md:block shadow-xs rounded-box border-gray-300'>
            <h2 className='font-bold text-sm'>People you may know</h2>
            {
                !isError
                    ? <div className='flex flex-col'>
                        {
                            isLoading
                                ? Array.from({ length: 4 }).map((_, i) => <SuggestedConnectionSkeleton key={i} />)
                                : suggestedConnections?.length > 0
                                    ? suggestedConnections?.map(user => {
                                        return <SuggestedConnectionItem
                                            key={user?._id}
                                            user={user}
                                        />
                                    })
                                    : <p className='text-sm text-center mt-4 flex flex-col items-center text-gray-600'>
                                        <FaUserSlash size={20} className="mb-1 text-gray-500" />
                                        No suggested users found for you
                                    </p>}
                    </div>
                    : <div className="py-3 border mt-3 text-xs border-red-300 bg-red-50 text-red-600 rounded-lg text-center">
                        <p>⚠️ Error fetching suggestions</p>
                        <p>{error?.message}</p>
                    </div>
            }
        </div>
    )
}
