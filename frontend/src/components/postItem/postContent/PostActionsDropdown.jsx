import { FaEllipsisH } from "react-icons/fa";
import { FiBookmark, FiLink, FiCode, FiEyeOff, FiFlag, FiStar, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function PostActionsDropdown({ isMyPost, onSave, onCopyLink, onEmbed, onNotInterested, onReport, onFeature, onEdit, onDelete }) {
    return (
        <div className="dropdown">
            <div tabIndex={0} role="button" className='btn btn-xs btn-ghost btn-circle border-0'>
                <FaEllipsisH size={15} />
            </div>
            <ul tabIndex={0} className='dropdown-content !mt-1 !right-0 menu menu-sm bg-base-100 rounded-box !rounded-tr-none z-[1] text-gray-700 w-56 py-1 font-bold shadow-md border border-gray-300 !px-0'>
                {isMyPost && (
                    <li>
                        <button type="button" className="rounded-none px-4 py-3" onClick={onFeature}>
                            <FiStar size={20} strokeWidth={3} /> Feature on top of profile
                        </button>
                    </li>
                )}
                <li>
                    <button type="button" className="rounded-none px-4 py-3" onClick={onSave}>
                        <FiBookmark size={20} strokeWidth={3} /> Save
                    </button>
                </li>
                <li>
                    <button type="button" className="rounded-none py-3 px-4" onClick={onCopyLink}>
                        <FiLink size={20} strokeWidth={3} />
                        Copy link to post
                    </button>
                </li>
                <li>
                    <button type="button" className="rounded-none px-4 py-3" onClick={onEmbed}>
                        <FiCode size={20} strokeWidth={3} />
                        Embed this post
                    </button>
                </li>
                {!isMyPost && (
                    <>
                        <li>
                            <button type="button" className="rounded-none px-4 py-3" onClick={onNotInterested}>
                                <FiEyeOff size={20} strokeWidth={3} />
                                Not interested
                            </button>
                        </li>
                        <li>
                            <button type="button" className="rounded-none px-4 py-3" onClick={onReport}>
                                <FiFlag size={20} fill='currentColor' strokeWidth={3} />
                                Report post
                            </button>
                        </li>
                    </>
                )}
                {isMyPost && (
                    <>
                        <li>
                            <button type="button" className="rounded-none px-4 py-3" onClick={onEdit}>
                                <FiEdit2 size={20} strokeWidth={3} />
                                Edit post
                            </button>
                        </li>
                        <li>
                            <button type="button" className="rounded-none px-4 py-3" onClick={onDelete}>
                                <FiTrash2 size={20} strokeWidth={3} />
                                Delete post
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
}