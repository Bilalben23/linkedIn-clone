import { Link, NavLink } from 'react-router-dom'
import useLogout from '../../hooks/useLogout';
import { MdHome, MdPeopleAlt, MdNotifications, MdSearch, MdLogout } from "react-icons/md";
import { useUnreadNotificationsCount } from '../../hooks/useNotifications';
import { usePendingRequestsCount } from '../../hooks/useConnections';
import useAuth from '../../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;


export default function Navbar() {
    const queryClient = useQueryClient();
    const logout = useLogout();
    const { data: unreadCount, isLoading: isUnreadNotificationsCountLoading } = useUnreadNotificationsCount();
    const { pendingRequestsCount, isLoading: isPendingRequestsCountLoading } = usePendingRequestsCount();
    const { authState: { user } } = useAuth();

    const queryState = queryClient.getQueryState(['postsFeed']);

    const isStale = queryState?.dataUpdatedAt
        ? Date.now() - queryState.dataUpdatedAt > 1000 * 60 * 5
        : false;

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ["notifications"], exact: false, refetchType: "none" });
    }, [unreadCount])

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
    }, [pendingRequestsCount])

    return (
        <header className='px-4 md:px-8 flex items-center justify-between shadow-xs border-b border-gray-300 w-full fixed top-0 bg-base-100 z-50'>
            <div className='flex items-center gap-x-3'>
                <div>
                    <img src="/assets/small-logo.png" alt="linkedIn logo" className='w-7 md:w-8 rounded-md' />
                </div>

                {/* icon for small devices*/}
                <button type="button" className='md:hidden p-2 cursor-pointer hover:opacity-80'>
                    <MdSearch size={30} className="opacity-70" />
                </button>

                <div className="hidden md:flex items-center input-sm input bg-blue-50 rounded-md px-2 transition-all duration-300 focus-within:w-70 w-50">
                    <MdSearch size={25} />
                    <input
                        type="text"
                        className="w-full bg-transparent outline-none transition-all duration-500 focus:w-full"
                        placeholder="Search"
                    />
                </div>

            </div>

            <nav>
                <ul className='flex items-center gap-x-3'>
                    <li className='flex-1'>
                        <NavLink to="/" className={({ isActive }) => `relative group flex flex-col after:w-0 py-2 px-1 md:px-5 items-center  ${isActive ? "active-link after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-[2px] after:bg-black after:transition-[width] after:duration-300" : ""}`}>
                            <span className='indicator'>
                                <MdHome size={30} className='opacity-70 group-[.active-link]:opacity-100 transition-opacity group-hover:opacity-100' />
                                {
                                    isStale && <span className='indicator-item flex items-center justify-center size-[18px] shadow bg-red-700 top-0.5 rounded-full text-[11px] text-white before:content-[""] before:absolute before:size-[8px] before:left-1/2 before:top-1/2 before:-translate-1/2 before:rounded-full before:bg-white before:inset-0 font-semibold right-1'></span>
                                }

                            </span>
                            <span className='hidden md:block text-xs group-[.active-link]:opacity-100 opacity-70 transition-opacity group-hover:opacity-100' title='Home'>Home</span>
                        </NavLink>
                    </li>
                    <li className='flex-1'>
                        <NavLink to="/networks" className={({ isActive }) => `relative group flex flex-col after:w-0 py-2 px-1 md:px-3 items-center  ${isActive ? "active-link after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-[2px] after:bg-black after:transition-[width] after:duration-300" : ""}`}>
                            <span className='indicator'>
                                <MdPeopleAlt size={30} className='opacity-70 group-[.active-link]:opacity-100 transition-opacity group-hover:opacity-100' />
                                {
                                    (pendingRequestsCount !== 0 && !isPendingRequestsCountLoading) && <span className='indicator-item flex items-center justify-center size-[20px] shadow bg-red-700 top-0.5 rounded-full text-[11px] text-white font-semibold right-1'>{pendingRequestsCount}</span>
                                }

                            </span>
                            <span className='hidden md:block text-xs group-[.active-link]:opacity-100 opacity-70 transition-opacity group-hover:opacity-100 whitespace-nowrap' title='My Network'>My Network</span>
                        </NavLink>
                    </li>
                    <li className='flex-1'>
                        <NavLink to="/notifications?filter=all" className={({ isActive }) => `relative group flex flex-col after:w-0 py-2 px-1 md:px-3 items-center  ${isActive ? "active-link after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-[2px] after:bg-black after:transition-[width] after:duration-300" : ""}`}>
                            <span className='indicator'>
                                <MdNotifications size={30} className='opacity-70 transition-opacity group-hover:opacity-100 group-[.active-link]:opacity-100' />
                                {
                                    (unreadCount !== 0 && !isUnreadNotificationsCountLoading) && <span className='indicator-item flex items-center justify-center size-[20px] shadow bg-red-700 right-1 top-0.5 rounded-full text-[11px] text-white font-semibold'>{unreadCount}</span>
                                }
                            </span>
                            <span className='hidden md:block text-xs opacity-70 transition-opacity group-hover:opacity-100 group-[.active-link]:opacity-100' title="Notifications">Notifications</span>
                        </NavLink>
                    </li>

                    <li className='flex-1'>
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className='flex md:px-2 flex-col cursor-pointer justify-center items-center'>
                                <img src={user.profilePicture
                                    ? `${CLOUDINARY_BASE_URL + user.profilePicture}`
                                    : '/assets/avatar.png'
                                }
                                    alt={`${user.name}'s avatar`}
                                    className='size-6 md:size-7 rounded-full'
                                />
                                <p className='text-[14px] hidden md:flex justify-center items-center gap-x-1'>
                                    <span>Me</span>
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="black" xmlns="http://www.w3.org/2000/svg">
                                        <polygon points="0,0 10,0 5,6" />
                                    </svg>
                                </p>
                            </div>
                            <ul tabIndex={0} className="dropdown-content mt-3 md:mt-1 border border-gray-200 !right-0 rounded-b-box rounded-tl-box z-[1] w-52 p-2 shadow-lg bg-base-100" role='menu'>
                                <li className='border-b pb-3 border-gray-300'>
                                    <Link to={`/profile/${user.username}`} className='flex items-start gap-x-2 mb-1'>
                                        <div className='shrink-0'>
                                            <img src={user.profilePicture
                                                ? `${CLOUDINARY_BASE_URL + user.profilePicture}`
                                                : "/assets/avatar.png"
                                            }
                                                alt={`${user.username}'s avatar`}
                                                className='size-11 rounded-full select-none'
                                            />
                                        </div>
                                        <div>
                                            <p className='font-semibold mb-0.5 text-sm select-none'>{user.name}</p>
                                            <p className='text-xs'>{user.headline}</p>
                                        </div>
                                    </Link>
                                    <Link to={`/profile/${user.username}`} className='btn btn-outline btn-block rounded-full btn-xs btn-primary'>View Profile</Link>
                                </li>
                                <li className='mt-3'>
                                    <button type='button' className='btn btn-sm btn-outline rounded-full btn-block' onClick={logout}>
                                        <MdLogout size={20} />
                                        Sign Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </nav>
        </header >
    )
}
