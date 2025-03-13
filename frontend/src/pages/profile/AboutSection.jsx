import React, { useState } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import UpdateAboutModal from './UpdateAboutModal';

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
                                    isMyProfile && <button type='button'
                                        className='btn btn-circle border-0 btn-ghost'
                                        onClick={() => document.getElementById('updateAboutModal').showModal()}>

                                        <FiEdit2 strokeWidth={3} size={20} />
                                    </button>
                                }
                                <UpdateAboutModal about={aboutContent} />
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
                        : isMyProfile
                            ? <div>
                                <div className='flex items-center gap-x-2 mb-3'>
                                    <img src="/assets/summary-structure.svg" alt="" />
                                    <p className='font-black text-xs'>Write a summary to highlight your personality or work experience</p>
                                </div>
                                <p className='mb-2 text-xs'>Members who include a summary receive up to 3.9 times as many profile views.</p>
                                <button className='btn font-black btn-outline btn-xs rounded-full' onClick={() => document.getElementById('updateAboutModal').showModal()}>
                                    Add a summary
                                </button>
                                <UpdateAboutModal about={""} />
                            </div>
                            : <div className="text-center text-gray-500 text-sm italic">
                                No summary available. The user has not added an about section yet.
                            </div>
            }
        </div>
    )
}
