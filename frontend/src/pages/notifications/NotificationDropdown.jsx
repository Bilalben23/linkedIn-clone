import { FaBell, FaChevronRight, FaEllipsisH, FaTrash } from "react-icons/fa";

export default function NotificationDropdown({ onDelete, isDeleting }) {
    return (
        <div className="dropdown">
            <div tabIndex={0} role="button" className='btn btn-circle btn-sm border-0 btn-ghost'>
                <FaEllipsisH className='text-black/70' />
            </div>
            <ul tabIndex={0} className='dropdown-content !mt-1 !right-0 menu menu-sm bg-base-100 rounded-box !rounded-tr-none z-[1] text-gray-700 !px-0 w-fit py-1 font-bold shadow-md border border-gray-300'>
                <li>
                    <button
                        type='button'
                        className='rounded-none btn-sm btn btn-ghost leading-loose whitespace-nowrap tracking-wide !justify-start border-none' disabled>
                        <FaBell /> Change notification preferences
                        <FaChevronRight />
                    </button>
                </li>
                <li>
                    <button type='button'
                        className='rounded-none btn-sm btn btn-ghost leading-loose whitespace-nowrap tracking-wide !justify-start border-none' onClick={onDelete}
                        disabled={isDeleting}>
                        <FaTrash /> Delete Notification
                    </button>
                </li>
            </ul>
        </div>
    )
};
