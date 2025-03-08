import React, { useRef } from 'react'
import InvitationItem from './InvitationItem'
import InvitationItemSkeleton from '../../components/skeletons/InvitationItemSkeleton'
import PaginationControls from './PaginationControls'
import { useSearchParams } from 'react-router-dom';
import { usePendingRequests } from '../../hooks/useConnections';

const CONNECT_SOUND_URL = "/assets/sounds/connect.mp3";

export default function Invitations() {
    const connectSoundEffect = useRef(null);
    const [searchParams] = useSearchParams();
    const currentPage = +searchParams.get("page") || 1;

    const {
        data: invitations,
        isLoading,
        isError,
        error
    } = usePendingRequests(currentPage);


    if (isError) {
        return <div>
            <p>{error.message}</p>
        </div>
    }


    return (
        <div className='border shadow-xs rounded-box border-gray-300 bg-base-100'>
            <div className='flex text-xs items-center justify-between p-3 border-b border-gray-200'>
                <div>
                    <h1>Invitations</h1>
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
