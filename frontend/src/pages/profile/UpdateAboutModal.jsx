import { useRef } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { useUpdateProfile } from "../../hooks/useUserProfile";
import { useFormik } from "formik";
import * as yup from "yup";

const aboutSchema = yup.object().shape({
    about: yup.string()
        .trim()
        .optional()
});

export default function UpdateAboutModal({ about }) {
    const { mutate: updateProfile, isPending } = useUpdateProfile();
    const dialogFormRef = useRef();

    const {
        getFieldProps,
        handleSubmit,
        errors,
        touched,
        dirty
    } = useFormik({
        initialValues: {
            about: about || "",
        },
        validationSchema: aboutSchema,
        onSubmit: (values, actions) => {
            updateProfile(values, {
                onSuccess: () => {
                    dialogFormRef.current?.submit();
                    actions.resetForm();
                    toast.success("About section updated successfully");
                },
                onError: (err) => {
                    toast.error(err.response?.data?.message || "Something went wrong!");
                },
            });
        },
    });

    return (
        <dialog id="updateAboutModal" className="modal">
            <div className="modal-box !p-0">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                    <h1 className="font-bold text-lg">Edit About</h1>
                    <form method="dialog" ref={dialogFormRef}>
                        <button
                            type="submit"
                            className="btn btn-sm btn-circle btn-ghost border-none"
                            aria-label="Close"
                        >
                            <IoClose size={30} />
                        </button>
                    </form>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-y-3">
                    {/* About Textarea */}
                    <div>
                        <label htmlFor="about" className="text-xs mb-1">
                            About
                        </label>
                        <textarea
                            id="about"
                            name="about"
                            placeholder="Write something about yourself..."
                            {...getFieldProps("about")}
                            className={`textarea w-full py-1 text-xs ${errors.about && touched.about ? "input-error" : ""}`}
                            rows={4}
                            autoFocus
                        />
                        {errors.about && touched.about && (
                            <p className="text-xs text-red-500 mt-0.5">{errors.about}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end pt-4 gap-x-4">
                        <button
                            type="submit"
                            className="btn btn-sm disabled:!bg-gray-200 btn-primary rounded-full"
                            disabled={isPending || !dirty}
                        >
                            {isPending ? <>
                                <img src="/assets/loading-spinner.gif"
                                    alt="Spinner"
                                    className="size-4"
                                />
                                Saving...</> : "Save"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
}
