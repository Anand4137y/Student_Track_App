"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "@/config";
import Pagination from "@/components/common/Pagination";
import StudentViewModal from "./modal/StudentViewModal";
import StudentAddModal from "./modal/StudentAddModal";
import TemporaryReportModal from "./modal/TemporaryReportModal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Student {
    _id: string;
    name: string;
    gender: string;
    dob: string;
    rollNumber: string;
    admissionNumber: string;
    class: string;
    section: string;
    parentName: string;
    parentPhone: string;
    phone?: string;
    address: string;
    image: string | null;
    status: string;
    reportedCount: number;
    isReported: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function StudentPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isTemporaryReportOpen, setIsTemporaryReportOpen] = useState(false);
    const router = useRouter();

    // Check for token on mount
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            alert("Unauthorized: No token found. Redirecting to login...");
            router.push("/auth/login");
        }
    }, [router]);

    const fetchStudents = async () => {
        setLoading(true);

        try {
            const token = Cookies.get("token");
            if (!token) {
                alert("Unauthorized: No token found. Redirecting to login...");
                router.push("/auth/login");
                return;
            }

            const params: any = { page: currentPage, limit };
            if (search) params.search = search;

            const res = await axios.get(
                `${config.baseUrl}/api/school/all-students`,
                {
                    params,
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data?.status) {
                setStudents(res.data.data || []);
                setTotalPages(res.data.pagination?.totalPages || 1);
            }
        } catch (err: any) {
            console.error("Failed to fetch students", err);

            // Handle Unauthorized
            if (err.response?.status === 401) {
                alert("Unauthorized: Session expired. Redirecting to login...");
                router.push("/auth/login");
            }
            // Handle Server Error
            if (err.response?.status === 500) {
                alert("Server error. Please try again later.");
            }
            // Network Error
            if (!err.response) {
                alert("Network error. Check your internet.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [currentPage, limit, search]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const openModal = (student: Student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };
    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleAddSuccess = () => {
        // refresh list
        fetchStudents();
    };

    const openTemporaryReportModal = () => {
        setIsTemporaryReportOpen(true);
    };

    const closeTemporaryReportModal = () => {
        setIsTemporaryReportOpen(false);
    };

    // call the report-student API with studentId as query param
    const reportStudent = async (id: string) => {
        const token = Cookies.get("token");
        if (!token) {
            alert("Unauthorized: No token found. Redirecting to login...");
            router.push("/auth/login");
            return;
        }

        try {
            const res = await axios.post(
                `${config.baseUrl}/api/student/report`,
                {},
                {
                    params: { studentId: id },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.data?.status) {
                toast.success("Student reported successfully");
                fetchStudents();
            } else {
                toast.error("Failed to report student");
            }
        } catch (err: any) {
            console.error("Report error", err);
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Error reporting student");
            }
        }
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Student Management</h1>
                <div className="space-x-2 flex">
                    <button
                        onClick={openAddModal}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 cursor-pointer transition"
                    >
                        + Add Student
                    </button>
                    <button
                        onClick={openTemporaryReportModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 cursor-pointer transition"
                    >
                        + Temporary Report
                    </button>
                </div>
            </div>

            {/* controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search students..."
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="text-sm">
                        Show{' '}
                        <select
                            className="border rounded px-2 py-1"
                            value={limit}
                            onChange={(e) => {
                                setLimit(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>{' '}
                        entries
                    </label>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Phone</th>
                            <th className="px-4 py-2">Class</th>
                            <th className="px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="text-center py-4">
                                    Loading...
                                </td>
                            </tr>
                        ) : students.length ? (
                            students.map((s) => (
                                <tr
                                    key={s._id}
                                    className="border-b hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-2 font-semibold">{s.name}</td>
                                    <td className="px-4 py-2">{s.parentPhone}</td>
                                    <td className="px-4 py-2 font-semibold">
                                        {s.class} - {s.section}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => openModal(s)}
                                                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 cursor-pointer transition font-semibold"
                                            >
                                                View
                                            </button>
                                            {!s.isReported ? (
                                                <button
                                                    onClick={() => reportStudent(s._id)}
                                                    className="border px-3 text-sm rounded-lg py-2 cursor-pointer bg-red-700"                                                >
                                                    Report
                                                </button>
                                            ) : (
                                                <span className="border px-3 text-sm rounded-lg py-2 cursor-pointer bg-gray-700">
                                                    Reported
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-4">
                                    No students found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Student View Modal */}
            <StudentViewModal
                isOpen={isModalOpen}
                student={selectedStudent}
                onClose={closeModal}
            />

            {/* Add Student Modal */}
            <StudentAddModal
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                onSuccess={handleAddSuccess}
            />

            {/* Temporary Report Modal */}
            <TemporaryReportModal
                isOpen={isTemporaryReportOpen}
                onClose={closeTemporaryReportModal}
                onSuccess={fetchStudents}
            />
        </div>
    );
}