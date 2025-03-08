import React from 'react'
import { Link } from 'react-router-dom';

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

export default function InvitationItem({ user }) {
    console.log(user);
    return (
        <div className='flex items-center justify-between p-3 border-b border-gray-300 gap-x-3'>
            <Link to={`/profile/${user.username}`} className='shrink-0 block'>
                <img
                    src={user.profilePicture
                        ? `${CLOUDINARY_BASE_URL + user.profilePicture}`
                        : '/assets/avatar.png'}
                    alt={`${user.username}'s avatar`}
                    className='size-14 rounded-full'
                />
            </Link>
            <div className='flex-1'>
                <p className='text-sm mb-1'>
                    <Link to={`/profile/${user.username}`} className='font-semibold link-hover'>{user.name}</Link>
                    <span> is inviting you to connect</span>
                </p>
                <p className='text-black/70 line-clamp-1 text-xs'>{user.headline}</p>
            </div>
            <div className='shrink-0 flex items-center gap-x-3'>
                <button type="button" className='btn btn-ghost btn-sm text-black/80 !border-none'>Ignore</button>
                <button type="button" className='btn btn-primary btn-sm btn-outline rounded-full'>Accept</button>
            </div>
        </div>
    )
}
