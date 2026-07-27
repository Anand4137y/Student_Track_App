"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "@/config";
import Pagination from "@/components/common/Pagination";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Teacher {
    _id: string;
    name: string;
    email: string;
    phone: string;
    permission: string;
    createdAt: string;
}

export default function StaffPage() {

    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("requested");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Check for token on mount
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            alert("Unauthorized: No token found. Redirecting to login...");
            router.push("/auth/login");
        }
    }, [router]);

    const fetchTeachers = async () => {
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
            if (filter && filter !== "all") params.permission = filter;

            const res = await axios.get(
                `${config.baseUrl}/api/school/all-teacher`,
                {
                    params,
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            if (res.data?.status) {
                setTeachers(res.data.data || []);
                setTotalPages(res.data.pagination?.totalPages || 1);
            }

        } catch (err: any) {
            console.error("Failed to fetch teachers", err);

            // 🔥 Handle Unauthorized
            if (err.response?.status === 401) {
                alert("Unauthorized: Session expired. Redirecting to login...");
                router.push("/auth/login");
            }


            // 🔥 Handle Server Error
            if (err.response?.status === 500) {
                alert("Server error. Please try again later.");
            }

            // 🔥 Network Error
            if (!err.response) {
                alert("Network error. Check your internet.");
            }

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
        // re-run when search/filter/page/limit change
    }, [currentPage, limit, search, filter]);

  // action handler
  const handleAction = async (id: string, permission: "approved" | "rejected") => {
    const token = Cookies.get("token");
    if (!token) {
      alert("Unauthorized: No token found. Redirecting to login...");
      router.push("/auth/login");
      return;
    }

    try {
      setLoading(true);
      await axios.patch(
        `${config.baseUrl}/api/school/staff-permission/${id}`,
        { permission },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // refresh list after update
      fetchTeachers();
    } catch (err: any) {
      console.error("Failed to update permission", err);
      if (err.response?.status === 401) {
        alert("Unauthorized: Session expired. Redirecting to login...");
        router.push("/auth/login");
      } else {
        alert("Could not update permission. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Teacher Management</h1>

            {/* controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search teachers..."
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                        value={filter}
                        onChange={handleFilterChange}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All</option>
                        <option value="requested">Requested</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
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
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Phone</th>
                            <th className="px-4 py-2">Permission</th>
                            <th className="px-4 py-2">Created</th>
                            {filter === "requested" && <th className="px-4 py-2">Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={filter === "requested" ? 6 : 5} className="text-center py-4">
                                    Loading...
                                </td>
                            </tr>
                        ) : teachers.length ? (
                            teachers.map((t) => (
                                <tr
                                    key={t._id}
                                    className="border-b hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-2">{t.name}</td>
                                    <td className="px-4 py-2">{t.email}</td>
                                    <td className="px-4 py-2">{t.phone}</td>
                                    <td className="px-4 py-2 capitalize">{t.permission}</td>
                                    <td className="px-4 py-2">
                                        {new Date(t.createdAt).toLocaleDateString()}
                                    </td>
                                    {filter === "requested" && (
                                        <td className="px-4 py-2 flex space-x-4">
                                            <button
                                                onClick={() => handleAction(t._id, "approved")}
                                                title="Approve"
                                                className="text-green-600 hover:scale-110 transition"
                                            >
                                                ✅
                                            </button>
                                            <button
                                                onClick={() => handleAction(t._id, "rejected")}
                                                title="Reject"
                                                className="text-red-600 hover:scale-110 transition"
                                            >
                                                ❌
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={filter === "requested" ? 6 : 5} className="text-center py-4">
                                    No teachers found
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
        </div>
    );
}

