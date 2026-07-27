"use client";

import React, { useEffect } from "react";

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
    address: string;
    image: string | null;
    status: string;
    reportedCount: number;
    isReported: boolean;
    createdAt: string;
    updatedAt: string;
}

interface StudentViewModalProps {
    isOpen: boolean;
    student: Student | null;
    onClose: () => void;
}

export default function StudentViewModal({
    isOpen,
    student,
    onClose,
}: StudentViewModalProps) {
    
    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            // Prevent background scrolling
            document.body.style.overflow = "hidden";
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen || !student) return null;

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-black text-white p-6 flex justify-between items-center sticky top-0 z-10 rounded-t-lg">
                    <h2 id="modal-title" className="text-2xl font-bold">
                        Student Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white rounded-full p-2 transition"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Student Image (if available) */}
                    {student.image && (
                        <div className="flex justify-center mb-6">
                            <img
                                src={student.image}
                                alt={student.name}
                                className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-md"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Information Section */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                Personal Information
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                        Name
                                    </p>
                                    <p className="text-base text-gray-900">
                                        {student.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                        Gender
                                    </p>
                                    <p className="text-base text-gray-900 capitalize">
                                        {student.gender}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                        Date of Birth
                                    </p>
                                    <p className="text-base text-gray-900">
                                        {new Date(
                                            student.dob
                                        ).toLocaleDateString()}{" "}
                                        <span className="text-sm text-gray-500">
                                            ({calculateAge(student.dob)} years)
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                        Address
                                    </p>
                                    <p className="text-base text-gray-900">
                                        {student.address}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Academic Information Section */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                Academic Information
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                        Class
                                    </p>
                                    <p className="text-base text-gray-900">
                                        {student.class} - {student.section}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                        Roll Number
                                    </p>
                                    <p className="text-base text-gray-900">
                                        {student.rollNumber}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                        Admission Number
                                    </p>
                                    <p className="text-base text-gray-900">
                                        {student.admissionNumber}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                        Status
                                    </p>
                                    <p>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                                                student.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {student.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Parent Information Section */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                Parent/Guardian Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                        Parent Name
                                    </p>
                                    <p className="text-base text-gray-900">
                                        {student.parentName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                        Parent Phone
                                    </p>
                                    <p className="text-base text-gray-900">
                                        {student.parentPhone}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Report Information Section */}
                        {(student.isReported || student.reportedCount > 0) && (
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                    Report Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600">
                                            Reported
                                        </p>
                                        <p>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    student.isReported
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                            >
                                                {student.isReported
                                                    ? "Yes"
                                                    : "No"}
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600">
                                            Report Count
                                        </p>
                                        <p className="text-base text-gray-900">
                                            {student.reportedCount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Meta Information */}
                        <div className="md:col-span-2 pt-4 border-t mt-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p className="text-xs font-semibold text-gray-600">
                                        Created
                                    </p>
                                    <p className="text-gray-900">
                                        {new Date(
                                            student.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-600">
                                        Last Updated
                                    </p>
                                    <p className="text-gray-900">
                                        {new Date(
                                            student.updatedAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-xs font-semibold text-gray-600">
                                        Student ID
                                    </p>
                                    <p className="text-gray-900 text-xs truncate font-mono bg-gray-100 p-1 rounded">
                                        {student._id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-100 p-4 flex justify-end gap-3 sticky bottom-0 border-t rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-black cursor-pointer text-white font-semibold rounded-lg hover:bg-gray-800 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}