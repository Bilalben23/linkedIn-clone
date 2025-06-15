import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useFormik } from 'formik';
import { signinValidationSchema } from '../../validations/authValidations';
import { axiosInstance } from "../../utils/axiosInstance";
import { ClipLoader } from "react-spinners";
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';


export default function Signin() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

    const onSubmit = async (values, actions) => {
        try {
            const { data } = await axiosInstance.post("/api/v1/auth/signin", values);
            if (data.success) {
                toast.success(data.message);
                login(data.user, data.accessToken);
                navigate("/", { replace: true });
            } else {
                toast.error(data.message);
                actions.setFieldValue("password", "");
                actions.setFieldTouched("password", false);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Something went wrong!"

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
        values,
        isSubmitting,
        errors,
        isValid,
        touched
    } = useFormik({
        initialValues: {
            email: "",
            password: "",
            rememberMe: false
        },
        validationSchema: signinValidationSchema,
        onSubmit
    })

    useEffect(() => window.scrollTo(0, 0), [])

    return (
        <section className='min-h-screen px-5 pb-5'>

            <div className="flex items-center justify-between ">
                <div>
                    <img src="/assets/logo.svg" alt="linkedIn Logo" className='w-36 md:w-40 lg:44' />
                </div>
                <div>
                    <Link to="/signup" className='rounded-full btn btn-primary md:px-8'>Join Now</Link>
                </div>
            </div>

            <div className='flex items-center gap-x-10'>

                {/* Sign-in Form */}
                <div className="p-10 rounded-sm shadow md:flex-1">
                    <h1 className="mb-6 text-2xl font-medium leading-10 text-orange-900 md:text-3xl lg:text-4xl text-balance">Welcome to your professional community</h1>
                    <form onSubmit={handleSubmit}>

                        {/* Email Input */}
                        <div className="flex flex-col w-full mb-4">
                            <label
                                htmlFor="email"
                                className='text-sm mb-0.5 text-slate-800'>Email Address</label>
                            <input
                                type="text"
                                id="email"
                                placeholder='example@example.com'
                                name='email'
                                className={`input bg-transparent w-full text-base 
                                    ${errors.email && touched.email ? "input-error" : "input-neutral"}`}
                                {...getFieldProps("email")}
                                autoFocus
                            />
                            {
                                errors.email && touched.email && <p className='text-error text-xs mt-0.5'>{errors.email}</p>
                            }
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col w-full mb-4">
                            <label
                                htmlFor="password"
                                className='text-sm mb-0.5 text-slate-800'>Password</label>
                            <div className={`flex w-full items-center justify-between input bg-transparent pr-1 ${errors.password && touched.password ? "input-error" : "input-neutral"}`}>
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    id='password'
                                    placeholder='••••••••'
                                    name='password'
                                    className='w-full text-base'
                                    {...getFieldProps("password")}
                                />
                                <button type='button' className='p-2 cursor-pointer' onClick={togglePasswordVisibility}>
                                    {
                                        isPasswordVisible ? <FiEye size={20} /> : <FiEyeOff size={20} />
                                    }
                                </button>
                            </div>
                            {
                                errors.password && touched.password && <p className='text-error text-xs mt-0.5'>{errors.password}</p>
                            }
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className='flex justify-between mb-6 items-centers'>
                            <div className='flex space-x-2 items-centers'>
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    className="checkbox checkbox-primary checkbox-sm"
                                    checked={values.rememberMe}
                                    {...getFieldProps("rememberMe")}
                                />
                                <label htmlFor="rememberMe" className='text-sm'>Remember Me</label>
                            </div>
                            <div>
                                <Link to="#" className='text-sm link link-primary'>Forget Password?</Link>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className='mb-4'>
                            <button
                                type="submit"
                                className='btn btn-block rounded-full btn-neutral disabled:!bg-gray-400'
                                disabled={isSubmitting || !isValid}
                            >
                                {
                                    isSubmitting ? <>
                                        <ClipLoader size={22} color='white' /> Signing...
                                    </> : "Sign In"
                                }
                            </button>
                        </div>
                    </form>

                    <div className='my-6 divider divider-neutral'>Or</div>

                    {/* Social Sign-in & Signup Link */}
                    <div className='flex flex-col gap-y-3'>
                        <Link to="#" className='rounded-full btn btn-outline'>
                            <FcGoogle size={25} />
                            Continue with Google
                        </Link>
                        <Link to="/signup" className='rounded-full btn btn-primary'>
                            New To Linkedin? Join Now
                        </Link>
                    </div>

                </div>

                {/* Side Image */}
                <div className="hidden overflow-hidden md:flex-1 md:block">
                    <img src="/assets/login-image.svg" alt="login image" className="size-full" />
                </div>
            </div>

        </section>
    )
}
