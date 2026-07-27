"use client"
import SchoolProfile, { SchoolData } from '@/components/profile/SchoolProfile'
import StaffProfile, { StaffData } from '@/components/profile/StaffProfile'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import config from "@/config";

function page() {
    const [data, setData] = useState<SchoolData | StaffData | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const router = useRouter();

    const isSchoolData = (value: SchoolData | StaffData | null): value is SchoolData => {
        return value !== null && "schoolName" in value;
    };

    useEffect(() => {
        // Set role from localStorage on client
        const storedRole = localStorage.getItem('role');
        setRole(storedRole);

        const fetchData = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) {
                    toast.error('Please login to access your profile');
                    router.push('/');
                }
                const res = await axios.get(`${config.baseUrl}/api/common/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if(res?.data?.status) {
                    setData(res?.data?.data)
                }
            } catch (er) {
                console.log(er);
                toast.error('Failed to fetch profile data');
            }
        }

        fetchData();
    }, [])

    // Show loading until role is determined
    if (role === null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {
                role === 'school' ? (data && isSchoolData(data) ? <SchoolProfile data={data} /> : <div>Loading...</div>) : <StaffProfile data={data as StaffData | null} />
            }
        </div>
    )
}

export default page
