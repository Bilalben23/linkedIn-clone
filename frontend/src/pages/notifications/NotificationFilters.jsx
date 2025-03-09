export default function NotificationFilters({ filter, updateSearchParam, isLoading }) {

    const filters = [
        { key: "all", label: "All", disabled: false },
        { key: "my_posts_all", label: "My posts", disabled: false },
        { key: "mentions_all", label: "Mentions", disabled: true },
        { key: "jobs_all", label: "Jobs", disabled: true }
    ];

    return (
        <div className='flex items-center gap-x-2 bg-white md:rounded-box p-3 shadow-xs border border-gray-300'>
            {filters.map(({ key, label, disabled }) => (
                <button
                    key={key}
                    type='button'
                    className={`btn px-3 py-3.5 ${filter === key && !isLoading ? "!bg-green-800 !text-base-100" : "btn-outline text-black/70"} btn-xs rounded-full !font-black`}
                    onClick={() => updateSearchParam(key)}
                    disabled={isLoading || disabled}
                >
                    {label}
                </button>
            ))
            }
        </div >
    );
};