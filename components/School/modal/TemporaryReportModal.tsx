"use client";

import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "@/config";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface TemporaryReportForm {
    name: string;
    className: string;
    section: string;
    rollNumber: string;
    reason: string;
    reportType: string;
    phone: string;
    place: string;
}

interface TemporaryReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TemporaryReportModal({
    isOpen,
    onClose,
    onSuccess,
}: TemporaryReportModalProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState<TemporaryReportForm>({
        name: "",
        className: "",
        section: "",
        rollNumber: "",
        reason: "",
        reportType: "absent",
        phone: "",
        place: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = Cookies.get("token");
        if (!token) {
            alert("Unauthorized: No token found. Redirecting to login...");
            router.push("/auth/login");
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.post(
                `${config.baseUrl}/api/student/report`,
                form,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.data?.status) {
                toast.success("Temporary report submitted successfully");
                setForm({
                    name: "",
                    className: "",
                    section: "",
                    rollNumber: "",
                    reason: "",
                    reportType: "absent",
                    phone: "",
                    place: "",
                });
                onClose();
                onSuccess();
            } else {
                toast.error("Failed to submit temporary report");
            }
        } catch (err: any) {
            console.error("Temporary report error", err);
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Error submitting temporary report");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-blue-600 text-white p-6 flex justify-between items-center sticky top-0 z-10 rounded-t-lg">
                    <h2 className="text-2xl font-bold">Temporary Report</h2>
                    <button
                        onClick={onClose}
                        className="text-white rounded-full p-2 transition hover:bg-blue-700"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Student name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Class
                            </label>
                            <input
                                type="text"
                                name="className"
                                value={form.className}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 10th"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Section
                            </label>
                            <input
                                type="text"
                                name="section"
                                value={form.section}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., A"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Roll Number
                            </label>
                            <input
                                type="text"
                                name="rollNumber"
                                value={form.rollNumber}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Phone number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Place
                            </label>
                            <input
                                type="text"
                                name="place"
                                value={form.place}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Location"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Report Type
                            </label>
                            <select
                                name="reportType"
                                value={form.reportType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="absent">Absent</option>
                                <option value="disciplinary">Disciplinary</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Reason
                            </label>
                            <input
                                type="text"
                                name="reason"
                                value={form.reason}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Reason"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? "Submitting..." : "Submit Report"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
