import React from 'react'
import InvitationItem from './InvitationItem'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import InvitationItemSkeleton from '../../components/skeletons/InvitationItemSkeleton'

export default function Invitations({ invitations, isLoading, isError, error }) {
    return (
        <div className='border shadow-xs rounded-box border-gray-300 bg-base-100'>
            <div className='flex text-xs items-center justify-between p-3 border-b border-gray-200'>
                <div>
                    <p>Invitations</p>
                </div>
                <div>
                    <p>Showing {invitations?.data?.length} out {invitations?.pagination?.totalPendingRequests}</p>
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
                    <button type="button" className="btn btn-sm btn-ghost border-none">
                        <FaChevronLeft />
                        Previous
                    </button>
                </div>
                <div className='flex items-center gap-x-1 gap-y-2 flex-wrap'>
                    <button type="button" className="btn btn-xs !border-none btn-circle btn-ghost">1</button>
                    <button type="button" className="btn btn-xs border-0 btn-circle btn-ghost">2</button>
                    <button type="button" className="btn btn-xs border-0 btn-circle btn-ghost">3</button>
                    <button type="button" className="btn btn-xs border-0 btn-circle btn-ghost">4</button>
                    <button type="button" className="btn btn-xs border-0 btn-circle btn-ghost">5</button>
                </div>
                <div>
                    <button type="button" className="btn btn-sm btn-ghost border-none">
                        Next
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        </div>
    )
}
