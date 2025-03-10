import { Link } from "react-router-dom";

export default function NotificationSidebar() {
    return <div className='p-4 hidden md:block bg-base-100 shadow-xs border border-gray-300 rounded-box md:sticky md:top-18'>
        <p className='font-bold text-base'>Manage your notifications</p>
        <Link to="#" className='text-[#378fe9] font-bold link-hover text-xs'>View settings</Link>
    </div>
};