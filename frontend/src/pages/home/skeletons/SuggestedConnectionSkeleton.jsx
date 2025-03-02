export default function SuggestedConnectionSkeleton() {
    return (
        <div className="flex gap-x-2 border-gray-300 last:border-0 gap-y-2 border-b py-4">
            <div className="skeleton size-8 rounded-full"></div>
            <div className='flex flex-col flex-1 gap-y-1'>
                <p className="skeleton w-[50%] h-2.5"></p>
                <p className="skeleton w-[90%] h-2"></p>
                <div className='mt-2 flex items-center gap-x-1'>
                    <p className="skeleton size-4 rounded-full"></p>
                    <p className="skeleton w-14 h-3"></p>
                </div>
            </div>
        </div>
    )
}

