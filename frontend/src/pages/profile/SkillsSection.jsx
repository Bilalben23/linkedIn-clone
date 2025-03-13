import React from 'react'
import { FiEdit2, FiPlus } from 'react-icons/fi'

export default function SkillsSection({ skills = [], isMyProfile, isLoading }) {
    return (
        <div className='border border-gray-300 shadow-xs rounded-box p-4 bg-base-100'>

            {
                isLoading
                    ? <p>Loading...</p>

                    : skills.length !== 0 ? <>
                        <div className='mb-2 flex items-center justify-between'>
                            <h2 className='font-black'>Skills<span className='text-xs font-normal'>({skills.length})</span></h2>
                            {
                                isMyProfile && <>
                                    <div className='flex items-center'>
                                        <button type='button' className='btn btn-circle border-0 btn-ghost'>
                                            <FiPlus size={25} />
                                        </button>

                                        <button type='button' className='btn btn-circle border-0 btn-ghost'>
                                            <FiEdit2 strokeWidth={3} size={20} />
                                        </button>
                                    </div>
                                </>
                            }
                        </div>
                        <div className="max-h-[300px] overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-3">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 bg-gray-100 border border-gray-300 text-sm font-medium text-gray-700 rounded-sm hover:bg-gray-200 transition"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>

                    </>
                        : isMyProfile ? <>
                            <div className="flex items-center gap-2 mb-3">
                                <img src="/assets/skills-placeholder.png" alt="Skills Placeholder" className="w-7" />
                                <p className="font-bold text-sm text-gray-800">
                                    Add skills to showcase your expertise
                                </p>
                            </div>
                            <p className="mb-3 text-xs text-gray-600">
                                Members with skills listed receive up to 17x more profile views.
                            </p>
                            <button className="btn btn-outline btn-xs font-bold rounded-full">
                                Add skills
                            </button>
                        </>
                            : <div className="text-center text-gray-500 text-sm italic">
                                No skills added yet.
                            </div>
            }
        </div>
    )
}
