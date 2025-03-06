export default function NotificationFilters({ filter, updateSearchParam }) {

    const filters = [
        { key: "all", label: "All" },
        { key: "jobs_all", label: "Jobs" },
        { key: "my_posts_all", label: "My posts" },
        { key: "mentions_all", label: "Mentions" },
    ];


    return (
        <div className='flex items-center gap-x-2 bg-white rounded-box p-3 shadow-xs border border-gray-300'>
            {filters.map(({ key, label }) => (
                <button
                    key={key}
                    type='button'
                    className={`btn px-3 py-3.5 ${filter === key ? "!bg-green-800 !text-base-100" : "btn-outline text-black/70"} btn-xs rounded-full !font-black`}
                    onClick={() => updateSearchParam(key)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};