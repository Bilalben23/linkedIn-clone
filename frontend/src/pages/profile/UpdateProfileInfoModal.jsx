import { useRef } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { useUpdateProfile } from "../../hooks/useUserProfile";
import { useFormik } from "formik";
import * as yup from "yup";
import useAuth from "../../hooks/useAuth";

const profileInfoSchema = yup.object().shape({
    name: yup.string()
        .trim()
        .required("Full name is required"),
    headline: yup.string()
        .trim()
        .optional(),
    location: yup.string()
        .trim()
        .optional()
});

export default function UpdateProfileInfoModal({ name, headline, location }) {
    const { mutate: updateProfile, isPending } = useUpdateProfile();
    const dialogFormRef = useRef();
    const { updateProfileDetails } = useAuth();

    const {
        getFieldProps,
        handleSubmit,
        errors,
        touched,
        dirty
    } = useFormik({
        initialValues: {
            name: name || "",
            headline: headline || "",
            location: location || "",
        },
        validationSchema: profileInfoSchema,
        onSubmit: (values, actions) => {
            updateProfile(values, {
                onSuccess: ({ data }) => {
                    dialogFormRef.current?.submit();
                    console.log(data.name);
                    updateProfileDetails("name", data.name);
                    updateProfileDetails("headline", data.headline);
                    updateProfileDetails("location", data.location);
                    actions.resetForm();
                    toast.success("Profile info updated successfully");
                },
                onError: (err) => {
                    toast.error(err.response?.data?.message || "Something went wrong!");
                },
            });
        },
    });

    return (
        <dialog id="updateProfileInfoModal" className="modal">
            <div className="modal-box !p-0">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                    <h1 className="font-bold text-lg">Edit Intro</h1>
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
                    {/* Full Name Input */}
                    <div>
                        <label htmlFor="name" className="text-xs mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your full name..."
                            {...getFieldProps("name")}
                            className={`input input-sm w-full ${errors.name && touched.name ? "input-error" : ""
                                }`}
                            autoFocus
                        />
                        {errors.name && touched.name && (
                            <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>
                        )}
                    </div>

                    {/* Headline Input */}
                    <div>
                        <label htmlFor="headline" className="text-xs mb-1">
                            Headline
                        </label>
                        <textarea
                            id="headline"
                            name="headline"
                            placeholder="Make your headline stand out..."
                            {...getFieldProps("headline")}
                            className={`textarea w-full py-1 text-xs ${errors.headline && touched.headline ? "input-error" : ""
                                }`}
                            rows={2}
                        />
                        {errors.headline && touched.headline && (
                            <p className="text-xs text-red-500 mt-0.5">{errors.headline}</p>
                        )}
                    </div>

                    {/* Location Input */}
                    <div>
                        <label htmlFor="location" className="text-xs mb-1">
                            Country/Region
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            placeholder="Enter your location..."
                            {...getFieldProps("location")}
                            className={`input input-sm w-full ${errors.location && touched.location ? "input-error" : ""
                                }`}
                        />
                        {errors.location && touched.location && (
                            <p className="text-xs text-red-500 mt-0.5">{errors.location}</p>
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
                                <img src="/assets/loading-spinner.gif" alt="Spinner" className="size-4" />
                                Saving...
                            </> : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
}
