import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

export default function PaginationControls({ isLoading, pagination }) {
    const [_, setSearchParams] = useSearchParams();
    const updatePageParam = (page) => setSearchParams({ page });

    if (isLoading || pagination?.totalPages <= 1) return null;

    const currentPage = pagination?.currentPage;

    return (
        <div className='flex items-center justify-between py-1.5 px-3 mt-3'>
            <div>
                <button
                    type="button"
                    className="btn btn-sm btn-ghost border-none"
                    onClick={() => updatePageParam(currentPage - 1)}
                    disabled={isLoading || !pagination?.hasPrevPage}
                >
                    <FaChevronLeft />
                    <span className='hidden sm:inline'>Previous</span>
                </button>
            </div>
            <div className='flex items-center gap-x-1 gap-y-2 flex-wrap'>
                {Array.from({ length: pagination?.totalPages }).map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        className={`btn btn-xs !border-none btn-circle btn-ghost ${currentPage === i + 1 ? 'btn-active' : ''}`}
                        onClick={() => updatePageParam(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <div>
                <button
                    type="button"
                    className="btn btn-sm btn-ghost border-none"
                    onClick={() => updatePageParam(currentPage + 1)}
                    disabled={isLoading || !pagination?.hasNextPage}
                >
                    <span className='hidden sm:inline'>Next</span>
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
};

