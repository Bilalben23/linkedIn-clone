import React from 'react'

export default function InvitationItemSkeleton() {
    return (
        <div className='flex items-center justify-between gap-x-3 p-3 border-b border-gray-300'>
            <div className='skeleton shrink-0 size-14 rounded-full'></div>
            <div className='flex-1 flex flex-col gap-y-2'>
                <span className='skeleton w-[80%] h-3'></span>
                <span className='skeleton w-[60%] h-3'></span>
            </div>
            <div className='shrink-0 flex items-center gap-x-3'>
                <span className='skeleton h-7 w-18'></span>
                <span className='skeleton h-7 w-18'></span>
            </div>
        </div>
    )
}
