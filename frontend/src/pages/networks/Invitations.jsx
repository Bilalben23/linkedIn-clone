import React from 'react'
import InvitationItem from './InvitationItem'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import InvitationItemSkeleton from '../../components/skeletons/InvitationItemSkeleton'
import { useSearchParams } from 'react-router-dom'

export default function Invitations({ invitations, currentPage, isLoading, isError, error }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const updatePageParam = (page) => setSearchParams({ page });



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
            <div className='flex items-center justify-between py-1.5 px-3 mt-3'>
                <div>
                    <button
                        type="button"
                        className="btn btn-sm btn-ghost border-none"
                        disabled={isLoading}
                    >
                        <FaChevronLeft />
                        Previous
                    </button>
                </div>
                <div className='flex items-center gap-x-1 gap-y-2 flex-wrap'>
                    {
                        Array.from({ length: 6 }).map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                className="btn btn-xs !border-none btn-circle btn-ghost"
                                disabled={isLoading || currentPage === i + 1}
                            >{i + 1}</button>
                        ))
                    }
                </div>
                <div>
                    <button
                        type="button"
                        className="btn btn-sm btn-ghost border-none"
                        disabled={isLoading}
                    >
                        Next
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        </div>
    )
}
