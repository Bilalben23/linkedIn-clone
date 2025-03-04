export default function Tooltip({ children, tip }) {
    return (
        <div className="tooltip before:!text-xs after:!hidden before:!shadow-md before:!z-50 before:border before:border-gray-100 before:!px-2 before:!py-1.5 before:!rounded-md before:!bg-base-100 before:!text-black" data-tip={tip}>
            {children}
        </div>
    )
}