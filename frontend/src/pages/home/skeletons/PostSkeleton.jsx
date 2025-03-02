

export default function PostSkeleton() {
    return (
        <div className='bg-base-100 rounded-box shadow-2xs border border-gray-300 py-2'>
            <div className="flex px-4 gap-x-2.5 items-center">
                <div className="shrink-0">
                    <p className="skeleton size-11 rounded-full "></p>
                </div>
                <div className="flex-1 flex flex-col gap-y-1.5">
                    <p className="skeleton w-[40%] h-2.5"></p>
                    <p className="skeleton w-[60%] h-2"></p>
                    <p className="skeleton w-[30%] h-2"></p>
                </div>
            </div>
            <div className="mt-4 flex flex-col gap-y-1.5 px-4">
                <p className="skeleton w-full h-2.5"></p>
                <p className="skeleton w-[60%] h-2.5"></p>
            </div>
            <div className="skeleton rounded-none w-full h-[350px] mt-3"></div>
            <div className="mt-3 flex justify-between items-center px-4">
                <div className="flex items-center gap-x-0.5">
                    <p className="skeleton size-3.5 rounded-full"></p>
                    <p className="skeleton size-3.5 rounded-full"></p>
                    <p className="skeleton size-3.5 rounded-full"></p>
                    <p className="skeleton w-22 h-2"></p>
                </div>
                <p className="skeleton w-15 h-2"></p>
            </div>
            <div className="px-4 flex items-center justify-between mt-3">
                {Array(4).fill(null).map((_, i) => (
                    <div key={i} className="flex items-center gap-x-1">
                        <div className="skeleton size-5 rounded-full"></div>
                        <div className="w-18 h-2 skeleton"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}
