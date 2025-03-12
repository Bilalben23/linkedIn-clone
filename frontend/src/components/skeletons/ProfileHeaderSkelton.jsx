import React from 'react'

export default function ProfileHeaderSkelton() {
    return (
        <div>
            <div className='relative mb-13'>
                <div className='skeleton w-full h-[220px] !rounded-b-none !rounded-t-lg'></div>
                <div className='skeleton size-32 rounded-full border-4 border-white absolute -bottom-10 left-[5%]'> </div>
            </div>
            <div className="pb-4 px-5">
                <div className='skeleton w-42 h-4'></div>
                <div className='flex flex-col gap-y-1.5 my-3'>
                    <p className='skeleton w-3/4 h-2'></p>
                    <p className='skeleton w-1/2 h-2'></p>
                </div>
                <p className='skeleton w-[60%] h-2 mb-3'></p>
                <p className='skeleton w-32 h-3'></p>
                <div className='flex items-center gap-x-2 mt-3'>
                    <div className='skeleton w-28 h-6 rounded-full'></div>
                    <div className='skeleton w-28 h-6 rounded-full'></div>
                </div>
            </div>
        </div>
    )
}
