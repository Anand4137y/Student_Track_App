"use client"
import React, { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import config from '@/config'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';
import Link from 'next/link';

// Define the type for a single school
type School = {
    _id: string;
    schoolName: string;
    schoolCode: string
};

// Define the type for the form inputs
type Inputs = {
    name: string;
    email: string;
    password: string;
    schoolCode: string;
    phone: string;
}

function StaffSignUp({ setShowStaffSignUp }: { setShowStaffSignUp: (show: boolean) => void }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();
    const [loading, setLoading] = useState<boolean>(false);
    const [schools, setSchools] = useState<School[]>([]);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            router.push('/');
        }
    }, [router]);

    // Fetch schools for the dropdown
    useEffect(() => {
        const fetchSchools = async () => {
            try {
                // Assuming an endpoint to get all schools
                const res = await axios.get(`${config.baseUrl}/api/staff/get-school-code`);
                if (res.data) {
                    console.log("Schools fetched:", res.data?.data);
                    setSchools(res.data?.data || []);
                }
            } catch (error) {
                toast.error("Failed to fetch schools");
                console.error(error);
            }
        };

        fetchSchools();
    }, []);

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            setLoading(true);
            // Assuming an endpoint to create a new staff member
            const res = await axios.post(`${config.baseUrl}/api/staff/register`, data);
            if (res.data) {
                console.log(res?.data)
                toast.success('Staff registration successful!');
                router.push('/auth/login'); // Redirect to login after successful registration
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error?.response?.data?.message || 'Registration failed');
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='bg-gray-100 h-screen flex items-center justify-center p-4'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'>
                <h1 className='text-center font-bold text-2xl mb-6 text-gray-800'>Staff SignUp</h1>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="name">Full Name</label>
                        <input {...register("name", { required: "Name is required" })} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id="name" type="text" placeholder="Enter Full Name" />
                        {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="email">Email</label>
                        <input {...register("email", { required: "Email is required" })} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id="email" type="email" placeholder="Enter Email" />
                        {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">Password</label>
                        <input {...register("password", { required: "Password is required" })} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id="password" type="password" placeholder="Enter Password" />
                        {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
                    </div>
                    <div>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="phone">Phone</label>
                        <input {...register("phone", { required: "Phone number is required" })} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id="phone" type="text" placeholder="Enter Phone Number" />
                        {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="schoolCode">School</label>
                        <select {...register("schoolCode", { required: "School is required" })} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id="schoolCode">
                            <option value="">Select a school</option>
                            {schools.map(school => (
                                <option key={school._id} value={school?.schoolCode}>{school?.schoolName}</option>
                            ))}
                        </select>
                        {errors.schoolCode && <p className="text-red-500 text-xs italic">{errors.schoolCode.message}</p>}
                    </div>
                    <div className='mt-6'>
                        <button disabled={loading} className='w-full cursor-pointer bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 disabled:bg-blue-300' type="submit">
                            {loading ? 'Registering...' : 'Register Staff'}
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
                    <div className=" text-center">
                        <p className="text-sm text-gray-600">
                            Or register as a School?{' '}
                            <button type="button" onClick={() => setShowStaffSignUp(false)} className="font-medium text-blue-600 hover:underline focus:outline-none">
                                School Sign up
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default StaffSignUp
