import React from 'react'

export default function NotificationSkeleton({ id }) {
    const isEven = id % 2 === 0;
    return (
        <div className='flex gap-x-2 p-4 items-center border-b border-gray-200'>
            <div className={`skeleton shrink-0 size-14 ${isEven ? "rounded-full" : "rounded-none"}`}></div>
            <div className='flex-1 flex flex-col gap-y-2'>
                <p className='skeleton w-3/4 h-2 rounded-full'></p>
                <p className='skeleton w-1/2 h-2 rounded-full'></p>
            </div>
            <div className='shrink-0 flex flex-col gap-y-2 items-center'>
                <p className='skeleton w-5 h-2 rounded-full'></p>
                <p className="skeleton rounded-full size-5"></p>
            </div>
        </div >
    )
}
