import { Link } from 'react-router-dom'
import useLogout from '../../hooks/useLogout';
import { MdHome, MdPeopleAlt, MdNotifications, MdSearch, MdLogout } from "react-icons/md";
import useUnreadNotificationsCount from '../../hooks/useUnreadNotificationsCount';
import usePendingRequestsCount from '../../hooks/usePendingRequestsCount';
import useAuth from '../../hooks/useAuth';

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;


export default function Navbar() {
    const logout = useLogout();
    const { unreadCount } = useUnreadNotificationsCount();
    const { pendingRequestsCount } = usePendingRequestsCount();

    const { authState: { user } } = useAuth();


    return (
        <header className='py-3 px-8 flex items-center justify-between shadow-xs border-b border-gray-300 w-full fixed top-0 bg-base-100 z-50'>
            <div className='flex items-center gap-x-3'>
                <div>
                    <img src="/assets/small-logo.png" alt="linkedIn logo" className='w-8 rounded-md' />
                </div>
                <form>
                    <div className="flex items-center input-sm input bg-blue-50 rounded-md px-2 transition-all duration-300 focus-within:w-70 w-50">
                        <MdSearch size={25} />
                        <input
                            type="text"
                            className="w-full bg-transparent outline-none transition-all duration-500 focus:w-full"
                            placeholder="Search"
                        />
                    </div>

                </form>
            </div>

            <nav>
                <ul className='flex items-center gap-x-8'>
                    <li>
                        <Link to="/" className='flex flex-col items-center opacity-70 transition-opacity hover:opacity-100'>
                            <MdHome size={30} />
                            <span className='text-xs'>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/networks" className='flex flex-col items-center group'>
                            <span className='indicator'>
                                <MdPeopleAlt size={30} className='opacity-70 transition-opacity group-hover:opacity-100' />
                                {
                                    pendingRequestsCount !== 0 && <span className='indicator-item flex items-center justify-center size-[22px] shadow bg-red-700 top-0.5 rounded-full text-[12px] text-white font-semibold right-1'>{pendingRequestsCount}</span>
                                }

                            </span>
                            <span className='text-xs opacity-70 transition-opacity group-hover:opacity-100'>My Network</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/notifications" className='flex flex-col items-center group'>
                            <span className='indicator'>
                                <MdNotifications size={30} className='opacity-70 transition-opacity group-hover:opacity-100' />
                                {
                                    unreadCount !== 0 && <span className='indicator-item flex items-center justify-center size-[22px] shadow bg-red-700 right-1 top-0.5 rounded-full text-[12px] text-white font-semibold'>{unreadCount}</span>
                                }
                            </span>
                            <span className='text-xs opacity-70 transition-opacity group-hover:opacity-100'>Notifications</span>
                        </Link>
                    </li>

                    <li>
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className='flex flex-col cursor-pointer justify-center items-center'>
                                <img src={user.profilePicture
                                    ? `${CLOUDINARY_BASE_URL + user.profilePicture}`
                                    : '/assets/avatar.png'
                                }
                                    alt={`${user.name}'s avatar`}
                                    className='w-7 rounded-full'
                                />
                                <p className='text-xs flex justify-center items-center gap-x-1'>
                                    <span>Me</span>
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="black" xmlns="http://www.w3.org/2000/svg">
                                        <polygon points="0,0 10,0 5,6" />
                                    </svg>
                                </p>
                            </div>
                            <ul tabIndex={0} className="dropdown-content mt-4 !right-0 rounded-box z-[1] w-52 p-2 shadow-lg bg-base-100" role='menu'>
                                <li className='border-b pb-3 border-gray-300'>
                                    <Link to="/profile" className='flex items-start gap-x-2 mb-1'>
                                        <div className='shrink-0'>
                                            <img src={user.profilePicture
                                                ? `${CLOUDINARY_BASE_URL + user.profilePicture}`
                                                : "/assets/avatar.png"
                                            }
                                                alt="avatar"
                                                className='w-11 rounded-full'
                                            />
                                        </div>
                                        <div >
                                            <p className='font-semibold mb-0.5 text-sm'>{user.name}</p>
                                            <p className='text-xs'>{user.headline}</p>
                                        </div>
                                    </Link>
                                    <Link to="/profile" className='btn btn-outline btn-block rounded-full btn-xs btn-primary'>View Profile</Link>
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
