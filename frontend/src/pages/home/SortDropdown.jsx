
export default function SortDropdown({ handleSortChange, sortOption }) {
    return (
        <div className="divider px-3 before:h-[1px] divider-end text-xs">
            <span className='text-gray-800'>Sort By: </span>
            <div className="dropdown">
                <div tabIndex={0} role="button" className="cursor-pointer flex items-center justify-center gap-x-1">
                    <span className='font-semibold select-none capitalize'>{sortOption}</span>
                    <svg width="12" height="10" viewBox="0 0 10 10" fill="black" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="0,0 10,0 5,6" />
                    </svg>
                </div>
                <ul tabIndex={0} className="dropdown-content !mt-4 !right-0 menu bg-base-100 rounded-box !rounded-tr-none z-[1] !px-0 w-36 py-2 shadow-md border border-gray-300">
                    <li>
                        <button
                            type="button"
                            className={`${sortOption === "top" ? "border-l-2 border-green-800" : ""} !rounded-none`}
                            onClick={() => handleSortChange("top")}
                        >Top</button>
                    </li>
                    <li>
                        <button
                            type="button"
                            className={`${sortOption === "recent" ? "border-l-2 border-green-800" : ""} !rounded-none`}
                            onClick={() => handleSortChange("recent")}
                        >Recent</button>
                    </li>
                </ul>
            </div>
        </div>
    )
}
