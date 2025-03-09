import React, { useRef } from 'react'
import InvitationItem from './InvitationItem'
import InvitationItemSkeleton from '../../components/skeletons/InvitationItemSkeleton'
import PaginationControls from './PaginationControls'
import { useSearchParams } from 'react-router-dom';
import { usePendingRequests } from '../../hooks/useConnections';
import { useFetchNotifications } from '../../hooks/useNotifications';

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

    const { data: connectionAcceptedNotifications } = useFetchNotifications("connection_accepted");

    console.log(connectionAcceptedNotifications);

    if (isError) {
        return (
            <div className='border border-red-400 shadow-xs md:rounded-box p-3 bg-red-50'>
                <p className="text-red-600 text-center text-sm font-medium">
                    Failed to load invitations: {error?.message || "Something went wrong."}
                </p>
            </div>
        );
    }

    return (
        <div className='border shadow-xs md:rounded-box border-gray-300 bg-base-100'>
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
                <div className='p-3 flex flex-col gap-y-2'>
                    <div>
                        <p>Accept Connections notifications</p>
                    </div>
                </div>
            }
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
                                    <InvitationItem
                                        key={user._id}
                                        user={user}
                                        connectSoundEffect={connectSoundEffect}
                                    />
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
