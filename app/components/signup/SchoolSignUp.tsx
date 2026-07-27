"use client"
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import config from '@/config'
import axios from 'axios'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';
import Link from 'next/link';

type Inputs = {
    schoolName: string
    email: string
    password: string
    phone: string
    address: string
    city: string
    state: string
    district: string
    schoolCode: string
    pinCode: string
}

function SchoolSignUp({ setShowStaffSignUp }: { setShowStaffSignUp: (show: boolean) => void }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            router.push('/');
        }
    }, [router]);

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            setLoading(true);
            const res = await axios.post(`${config.baseUrl}/api/school/create`, data);
            if (res.data) {
                toast.success('School registration successful!');
                router.push('/auth/login');
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error?.response?.data?.message);
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='bg-gray-100 h-screen md:p-10'>
            <form onSubmit={handleSubmit(onSubmit)} className='bg-white h-full rounded-lg shadow-lg p-6 overflow-y-auto'>
                <h1 className='text-center font-bold text-2xl mb-6 text-gray-800'>Register School</h1>
                <div className='grid lg:grid-cols-2 gap-6'>
                    <div className=' p-2'>
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="schoolName">School Name</label>
                            <input {...register("schoolName", { required: "School Name is required" })} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id="schoolName" type="text" placeholder="Enter School Name" />
                            {errors.schoolName && <p className="text-red-500 text-xs italic">{errors.schoolName.message}</p>}
                        </div>
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="email">Email</label>
                            <input {...register("email", { required: "Email is required" })} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id="email" type="email" placeholder="Enter Email" />
                            {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
                        </div>
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">Password</label>
                            <input {...register("password", { required: "Password is required" })} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id="password" type="password" placeholder="Enter Password" />
                            {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
                        </div>
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="phone">Phone</label>
                            <input {...register("phone", { required: "Phone number is required" })} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id="phone" type="text" placeholder="Enter Phone Number" />
                            {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone.message}</p>}
                        </div>
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="address">Address</label>
                            <textarea {...register("address")} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id="address" rows={3} placeholder="Enter Address"></textarea>
                        </div>
                    </div>
                    <div className='p-2'>
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="city">City</label>
                            <input {...register("city")} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id="city" type="text" placeholder="Enter City" />
                        </div>
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="state">State</label>
                            <input {...register("state")} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id="state" type="text" placeholder="Enter State" />
                        </div>
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="district">District</label>
                            <input {...register("district")} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id="district" type="text" placeholder="Enter District" />
                        </div>
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="schoolCode">School Code</label>
                            <input {...register("schoolCode", { required: "School Code is required" })} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id="schoolCode" type="text" placeholder="Enter School Code" />
                            {errors.schoolCode && <p className="text-red-500 text-xs italic">{errors.schoolCode.message}</p>}
                        </div>
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="pinCode">Pin Code</label>
                            <input {...register("pinCode")} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id="pinCode" type="text" placeholder="Enter Pin Code" />
                        </div>
                        <div className='mt-6'>
                            <button disabled={loading} className='w-full cursor-pointer bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 disabled:bg-blue-300' type="submit">
                                {loading ? 'Registering...' : 'Register School'}
                            </button>
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href="/auth/login" className="font-medium text-blue-600 hover:underline">
                                    Log in
                                </Link>
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Or register as Staff?{' '}
                                <button type="button" onClick={() => setShowStaffSignUp(true)} className="font-medium text-blue-600 hover:underline focus:outline-none">
                                    Staff Sign up
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SchoolSignUp
