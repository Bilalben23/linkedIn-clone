import React from 'react'
import { useSuggestedConnections } from '../../hooks/useConnections'
import SuggestedConnectionCard from './SuggestedConnectionCard';

export default function PeopleYouMayKnow() {
    const { data: suggestedConnections, isLoading, isError, error } = useSuggestedConnections(10);

    console.log(suggestedConnections);

    if (isError) {
        return <p className="text-red-500">Failed to load suggestions: {error.message}</p>;
    }

    return (
        <section className='border shadow-xs border-gray-300 rounded-box p-3 bg-base-100'>
            <h2 className='text-sm mb-2'>People you may know</h2>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                {
                    isLoading
                        ? <p>Loading...</p>
                        : suggestedConnections?.map(user => <SuggestedConnectionCard
                            key={user._id}
                            user={user}
                        />
                        )
                }
            </div>
        </section>
    )
}
