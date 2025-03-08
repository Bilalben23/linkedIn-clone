import React from 'react'
import InvitationItem from './InvitationItem'
import InvitationItemSkeleton from '../../components/skeletons/InvitationItemSkeleton'
import PaginationControls from './PaginationControls'

export default function Invitations({ invitations, isLoading, isError, error }) {

    if (isError) {
        return <div>
            <p>{error.message}</p>
        </div>
    }

    return (
        <div className='border shadow-xs rounded-box border-gray-300 bg-base-100'>
            <div className='flex text-xs items-center justify-between p-3 border-b border-gray-200'>
                <div>
                    <p>Invitations</p>
                </div>
                <div>
                    {
                        isLoading ?
                            <p className='skeleton w-32 h-3'></p> :
                            <p>Showing {invitations?.data?.length} out {invitations?.pagination?.totalPendingRequests}</p>
                    }
                </div>
            </div>
            <div className='flex flex-col *:last:!border-0'>
                {
                    isLoading
                        ? Array.from({ length: 6 }).map((_, i) => <InvitationItemSkeleton key={i} />)
                        : invitations?.data?.map(user => <InvitationItem
                            key={user._id}
                            user={user}
                        />)
                }
            </div>

            <PaginationControls
                isLoading={isLoading}
                pagination={invitations?.pagination}
            />

        </div>
    )
}
