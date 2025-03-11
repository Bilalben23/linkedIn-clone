import React, { useState } from 'react'
import { FiEdit2 } from 'react-icons/fi'

export default function AboutSection({ aboutContent, isMyProfile, isLoading }) {
    const [expandedText, setExpandedText] = useState(false);

    return (
        <div className='border border-gray-300 shadow-xs rounded-box p-4 bg-base-100'>

            {
                isLoading
                    ? <p>Loading....</p>
                    : aboutContent
                        ? <>
                            <div className='mb-2 flex items-center justify-between'>
                                <h2 className='font-black'>About</h2>
                                {
                                    isMyProfile && <button type='button' className='btn btn-circle border-0 btn-ghost'>
                                        <FiEdit2 strokeWidth={3} size={20} />
                                    </button>
                                }
                            </div>

                            <p className='text-xs'>
                                {expandedText ? aboutContent : aboutContent.slice(0, 480)}
                                {
                                    (aboutContent.length > 480 && !expandedText) && <button
                                        className='hover:text-primary cursor-pointer ml-1'
                                        onClick={() => setExpandedText(true)}
                                    >...more</button>
                                }
                            </p>

                        </>
                        : <div>
                            <div className='flex items-center gap-x-2 mb-3'>
                                <img src="/assets/summary-structure.svg" alt="" />
                                <p className='font-black text-xs'>Write a summary to highlight your personality or work experience</p>
                            </div>
                            <p className='mb-2 text-xs'>Members who include a summary receive up to 3.9 times as many profile views.</p>
                            <button className='btn font-black btn-outline btn-xs rounded-full'>
                                Add a summary
                            </button>
                        </div>
            }
        </div>
    )
}
