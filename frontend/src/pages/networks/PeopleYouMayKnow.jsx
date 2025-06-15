import React from 'react'
import { useSuggestedConnections } from '../../hooks/useConnections'
import SuggestedConnectionCard from './SuggestedConnectionCard';
import { FaUserSlash } from 'react-icons/fa';

export default function PeopleYouMayKnow() {
    const { data: suggestedConnections, isLoading, isError, error } = useSuggestedConnections(10);

    return (
        <section className='border shadow-xs border-gray-300 sm:rounded-box p-3 bg-base-100'>
            <h2 className='text-sm mb-2'>People you may know</h2>
            {
                isError
                    ? <div className='border border-red-400 shadow-xs rounded-box p-3 bg-red-50'>
                        <p className="text-red-600 text-center text-sm font-medium">
                            Failed to load suggestions: {error?.message || "Something went wrong."}
                        </p>
                    </div>
                    : <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                        {
                            isLoading
                                ? <p>Loading...</p>
                                : suggestedConnections.length === 0
                                    ? <div className='col-span-full'>
                                        <p className='text-sm text-center mt-4 flex flex-col items-center text-gray-600'>
                                            <FaUserSlash size={20} className="mb-1 text-gray-500" />
                                            No suggested users found for you
                                        </p>
                                    </div>
                                    : suggestedConnections?.map(user => <SuggestedConnectionCard
                                        key={user._id}
                                        user={user}
                                    />)
                        }
                    </div>
            }
        </section>
    )
}
