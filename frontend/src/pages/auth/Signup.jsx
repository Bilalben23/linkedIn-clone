import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useFormik } from 'formik';
import { signupValidationSchema } from '../../validations/authValidations';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { axiosInstance } from '../../utils/axiosInstance';

export default function Signup() {
    const [isPasswordShowed, setIsPasswordShowed] = useState(false);
    const navigate = useNavigate();
    const togglePasswordShowing = () => setIsPasswordShowed(!isPasswordShowed)

    const onSubmit = async (values, actions) => {
        try {
            const { data } = await axiosInstance.post("/api/v1/auth/signup", values);
            if (data.success) {
                toast.success(data.message);
                navigate("/signin", { replace: true });
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Something went wrong";
            if (err.response?.status === 400) {
                err.response.data.errors?.forEach(({ field, message }) => actions.setFieldError(field, message))
            } else {
                actions.setFieldValue("password", "");
                actions.setFieldTouched("password", false);
            }

            toast.error(errorMessage);
        } finally {
            actions.setSubmitting(false);
        }
    }

    const {
        getFieldProps,
        handleSubmit,
        isSubmitting,
        isValid,
        errors,
        touched
    } = useFormik({
        initialValues: {
            name: "",
            username: "",
            email: "",
            password: ""
        },
        validationSchema: signupValidationSchema,
        onSubmit
    })

    useEffect(() => window.scrollTo(0, 0), [])

    return (
        <section className='min-h-screen px-5 pb-5'>

            <div className="flex justify-between items-center ">
                <div>
                    <img src="/assets/logo.svg" alt="linkedIn Logo" className='w-36 md:w-40 lg:44' />
                </div>
                <div>
                    <Link to="/signin" className='btn btn-primary rounded-full md:px-8'>Sin in</Link>
                </div>
            </div>

            <div className='flex gap-x-10 items-center'>
                <div className="md:flex-1 p-10 shadow rounded-sm">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl text-balance font-medium leading-10 text-orange-900 mb-6">Welcome to your professional community</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 flex flex-col w-full">
                            <label
                                htmlFor="name"
                                className='text-sm mb-0.5 text-slate-800'>Full Name</label>
                            <input
                                type="text"
                                id="name"
                                placeholder='john doe'
                                name='name'
                                className={`input bg-transparent w-full text-base ${errors.name && touched.name ? "input-error" : "input-neutral"}`}
                                {...getFieldProps("name")}
                                autoFocus
                            />
                            {
                                errors.name && touched.name && <p className="text-error text-xs mt-0.5">{errors.name}</p>
                            }
                        </div>

                        <div className="mb-4 flex flex-col w-full">
                            <label
                                htmlFor="username"
                                className='text-sm mb-0.5 text-slate-800'>Username</label>
                            <input
                                type="text"
                                id="username"
                                placeholder='john233'
                                name='username'
                                className={`input bg-transparent w-full text-base ${errors.username && touched.username ? "input-error" : "input-neutral"}`}
                                {...getFieldProps("username")}
                            />
                            {
                                errors.username && touched.username && <p className="text-error text-xs mt-0.5">{errors.username}</p>
                            }
                        </div>

                        <div className="mb-4 flex flex-col w-full">
                            <label
                                htmlFor="email"
                                className='text-sm mb-0.5 text-slate-800'>Email</label>
                            <input
                                type="text"
                                id="email"
                                placeholder='example@example.com'
                                name='email'
                                className={`input bg-transparent w-full text-base ${errors.email && touched.email ? "input-error" : "input-neutral"}`}
                                {...getFieldProps("email")}
                            />
                            {
                                errors.email && touched.email && <p className="text-error text-xs mt-0.5">{errors.email}</p>
                            }
                        </div>

                        <div className="mb-6 flex flex-col w-full">
                            <label
                                htmlFor="password"
                                className='text-sm mb-0.5 text-slate-800'>Password</label>
                            <div className={`flex w-full items-center justify-between input bg-transparent pr-1 ${errors.password && touched.password ? "input-error" : "input-neutral"}`}>
                                <input
                                    type={isPasswordShowed ? "text" : "password"}
                                    id='password'
                                    placeholder='Password(6+ characters)'
                                    name='password'
                                    className='w-full text-base'
                                    {...getFieldProps("password")}
                                />
                                <button type='button' className='cursor-pointer p-2' onClick={togglePasswordShowing}>
                                    {
                                        isPasswordShowed ? <FiEye size={20} /> : <FiEyeOff size={20} />
                                    }
                                </button>
                            </div>
                            {
                                errors.password && touched.password && <p className="text-error text-xs mt-0.5">{errors.password}</p>
                            }
                        </div>

                        <div className='mb-4'>
                            <button
                                type="submit"
                                className='btn btn-block rounded-full disabled:!bg-gray-400'
                                disabled={isSubmitting || !isValid}
                            >
                                {
                                    isSubmitting ? <>
                                        <ClipLoader size={22} color='white' /> Agree and Joining...
                                    </> : "Agree and Join"
                                }
                            </button>
                        </div>
                    </form>

                    <div className='divider divider-neutral my-6'>Or</div>

                    <div className='flex flex-col gap-y-3'>
                        <Link to="#" className='btn btn-outline rounded-full'>
                            <FcGoogle size={25} />
                            Sing up with Google
                        </Link>
                        <Link to="/signin" className='btn btn-primary rounded-full'>
                            Already on Linkedin? Sign in
                        </Link>
                    </div>
                </div>

                <div className="md:flex-1 overflow-hidden hidden md:block">
                    <img src="/assets/login-image.svg" alt="login image" className="size-full" />
                </div>
            </div>

        </section>
    )
}
