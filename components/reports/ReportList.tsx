"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "@/config";
import Pagination from "@/components/common/Pagination";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Report {
    _id: string;
    school: string;
    reportedBy: string | null;
    name: string;
    className: string;
    section: string;
    rollNumber: string;
    reason: string;
    reportType: string;
    status: string;
    phone: string;
    date: string;
    createdAt: string;
    updatedAt: string;
}

function ReportList() {
    const [reports, setReports] = useState<Report[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/auth/login");
        }
    }, [router]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const token = Cookies.get("token");
            if (!token) return;

            const res = await axios.get(
                `${config.baseUrl}/api/common/reported-students`,
                {
                    params: { page: currentPage, limit },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.data?.status) {
                setReports(res.data.data || []);
                setTotalPages(res.data.pagination?.totalPages || 1);
            }
        } catch (err: any) {
            console.error("Failed to fetch reports", err);
            if (err.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                router.push("/auth/login");
            } else {
                toast.error("Failed to fetch reports");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [currentPage, limit]);

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Reported Students</h1>

            {/* Controls */}
            <div className="flex justify-end mb-4">
                <div>
                    <label className="text-sm text-gray-600">
                        Show{' '}
                        <select
                            className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={limit}
                            onChange={(e) => {
                                setLimit(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>{' '}
                        entries
                    </label>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="px-4 py-2 font-semibold text-gray-700">Name</th>
                            <th className="px-4 py-2 font-semibold text-gray-700">Class</th>
                            <th className="px-4 py-2 font-semibold text-gray-700">Roll No</th>
                            <th className="px-4 py-2 font-semibold text-gray-700">Type</th>
                            <th className="px-4 py-2 font-semibold text-gray-700">Reason</th>
                            <th className="px-4 py-2 font-semibold text-gray-700">Date</th>
                            <th className="px-4 py-2 font-semibold text-gray-700">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : reports.length > 0 ? (
                            reports.map((report) => (
                                <tr key={report._id} className="hover:bg-gray-50 transition-colors border-b">
                                    <td className="px-4 py-2 font-medium text-gray-900">{report.name}</td>
                                    <td className="px-4 py-2 text-gray-600">{report.className} - {report.section}</td>
                                    <td className="px-4 py-2 text-gray-600">{report.rollNumber}</td>
                                    <td className="px-4 py-2 capitalize text-gray-600">{report.reportType}</td>
                                    <td className="px-4 py-2 text-gray-600 max-w-xs truncate" title={report.reason}>{report.reason}</td>
                                    <td className="px-4 py-2 text-gray-600">
                                        {new Date(report.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(report.status)}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-gray-500">
                                    No reports found.
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

export default ReportList;
