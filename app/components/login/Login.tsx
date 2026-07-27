"use client"
import React, { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import config from '@/config'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

type Inputs = {
    email: string
    password: string
}

function Login() {
    const {
        register,
        handleSubmit,
    } = useForm<Inputs>();
    const [loading, setLoading] = useState<boolean>(false);
    const [showStaffLogin, setStaffLogin] = useState<boolean>(true);
    const router = useRouter();
    const { setUser } = useAuth();

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            router.push('/');
        }
    }, [router]);

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            setLoading(true);
            if (showStaffLogin) {
                const res = await axios.post(`${config.baseUrl}/api/staff/login`, data);
                const role = res?.data?.data?.role;
                const name = res?.data?.data?.name;
                localStorage.setItem('role', role)
                localStorage.setItem('name', name)
                setUser({ role, name });

                if (res.data?.token) {
                    Cookies.set('token', res.data.token);
                    toast.success('Login successful');
                    router.push('/')
                }
            } else {
                const res = await axios.post(`${config.baseUrl}/api/school/login`, data);
                const role = res?.data?.data?.role;
                const name = res?.data?.data?.schoolName;
                localStorage.setItem('role', role)
                localStorage.setItem('name', name)
                setUser({ role, name });

                if (res.data?.token) {
                    Cookies.set('token', res.data.token);
                    toast.success('Login successful');
                    router.push('/')
                }
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error?.response?.data?.message || 'Login failed');
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="bg-gray-100 h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className='grid grid-cols-2'>
                    <h1 onClick={() => setStaffLogin(true)} className={`text-center font-semibold text-xl mb-6  ${showStaffLogin ? 'border-b-2 border-gray-500' : ''} text-gray-800 cursor-pointer`}>Staff Login</h1>
                    <h1 onClick={() => setStaffLogin(false)} className={`text-center font-bold text-xl mb-6 text-gray-800 ${!showStaffLogin ? 'border-b-2 border-gray-500' : ''}  cursor-pointer`}>School Login</h1>
                </div>

                <div
                    key={showStaffLogin ? "staff" : "school"}
                    className="animate-switch"
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                {...register("email")}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                placeholder="Enter Email"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                {...register("password")}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                placeholder="Enter Password"
                            />
                        </div>
                        <div className="mt-6">
                            <button
                                className="w-full cursor-pointer bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                                type="submit"
                            >
                                Login
                            </button>
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-gray-600 text-sm">
                                Don't have an account?{' '}
                                <a onClick={() => router.push('/auth/signup')} className="text-blue-600 hover:underline font-medium cursor-pointer">
                                    Sign up
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
