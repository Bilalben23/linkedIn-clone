import { FiEdit2 } from 'react-icons/fi';
const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;


export default function RightSidebar({ username }) {
    return (
        <div className='flex-col gap-y-2 hidden md:flex'>
            <div className='border px-3 border-gray-300 rounded-box shadow-xs bg-base-100'>

                <div className='py-3 border-b border-gray-200'>
                    <div className=' flex items-center justify-between gap-x-3'>
                        <p className='font-bold text-sm'>Profile language</p>
                        <button type="button" className='btn btn-sm border-0 btn-circle btn-ghost'>
                            <FiEdit2 strokeWidth={3} size={20} className='text-black/70' />
                        </button>
                    </div>
                    <p className='text-xs text-black/60'>English</p>
                </div>
                <div className='py-3'>
                    <div className=' flex items-center justify-between gap-x-3'>
                        <p className='font-bold text-sm'>Public profile & URL</p>
                        <button type="button" className='btn btn-sm border-0 btn-circle btn-ghost'>
                            <FiEdit2 strokeWidth={3} size={20} className='text-black/70' />
                        </button>
                    </div>
                    <p className='text-xs text-black/60 break-all select-all'>{CLIENT_URL}/profile/{username}</p>
                </div>

            </div>

            <div className='border border-gray-300 rounded-box shadow-xs bg-base-100'>
                <img src="/assets/hiring_thumbnail.png"
                    alt="Hiring Thumbnail"
                    className='rounded-box w-full'
                />
            </div>
        </div>
    )
}
