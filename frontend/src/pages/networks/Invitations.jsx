import React, { useRef } from 'react'
import InvitationItem from './InvitationItem'
import InvitationItemSkeleton from '../../components/skeletons/InvitationItemSkeleton'
import PaginationControls from './PaginationControls'

const CONNECT_SOUND_URL = "/assets/sounds/connect.mp3";

export default function Invitations({ invitations, isLoading, isError, error }) {
    const connectSoundEffect = useRef(null);

    if (isError) {
        return <div>
            <p>{error.message}</p>
        </div>
    }

    console.log(invitations);

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
                            invitations?.pagination?.totalPendingRequests !== 0 && <p>Showing {invitations?.data?.length} out {invitations?.pagination?.totalPendingRequests}</p>
                    }
                </div>
            </div>
            {
                !isLoading && invitations?.pagination?.totalPendingRequests === 0
                    ? <p className='p-3 text-sm text-gray-600'>
                        You're all caught up! No pending invitations at the moment.
                    </p>

                    : <div className='flex flex-col *:last:!border-0'>

                        {
                            isLoading
                                ? Array.from({ length: 6 }).map((_, i) => <InvitationItemSkeleton key={i} />)
                                : invitations?.data?.map(user => (
                                    <>
                                        <InvitationItem
                                            key={user._id}
                                            user={user}
                                            connectSoundEffect={connectSoundEffect}
                                        />
                                    </>
                                ))
                        }
                        <audio
                            ref={connectSoundEffect}
                            src={CONNECT_SOUND_URL}
                            preload="auto"
                        />
                    </div>
            }
            <PaginationControls
                isLoading={isLoading}
                pagination={invitations?.pagination}
            />

        </div>
    )
}
