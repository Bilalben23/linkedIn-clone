
export default function DeletePostConfirmationModal({ setIsConfirmPostDeletion, isDeleting, dialogFormRef }) {
    return <dialog id="deleteConfirmationModal" className="modal">
        <div className="modal-box w-sm">
            <h3 className="font-bold text-lg">Delete Post!</h3>
            <p className="py-4 text-black/60">Are you sure you want to permanently remove this post from LinkedIn?</p>
            <div className="modal-action">
                <form method="dialog" ref={dialogFormRef}>
                    <button className="btn btn-outline rounded-full btn-sm font-bold">Cancel</button>
                </form>
                <button
                    className="btn rounded-full btn-primary btn-sm font-bold"
                    onClick={() => setIsConfirmPostDeletion(true)}
                    disabled={isDeleting}>
                    {
                        isDeleting && <img
                            src='/assets/loading-spinner.gif'
                            alt='Loading spinner'
                            className="w-3"
                        />
                    }
                    Delete
                </button>
            </div>
        </div>
    </dialog>
}
