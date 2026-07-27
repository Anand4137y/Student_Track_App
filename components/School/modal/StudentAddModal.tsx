"use client";

import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import config from "@/config";
import toast from "react-hot-toast";

interface AddStudentForm {
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
}

interface StudentAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StudentAddModal({ isOpen, onClose, onSuccess }: StudentAddModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddStudentForm>({
    defaultValues: {
      gender: "",
      class: "",
      section: ""
    },
  });

  const onSubmit = async (data: AddStudentForm) => {
    const token = Cookies.get("token");
    if (!token) {
      alert("Unauthorized: Please login again.");
      return;
    }

    try {
      await axios.post(
        `${config.baseUrl}/api/student/create`,
        data,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Student added successfully");
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to add student", err);
      toast.error(err.response?.data?.message || "Error creating student");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="bg-black text-white p-6 flex justify-between items-center sticky top-0">
          <h2 className="text-2xl font-bold">Add Student</h2>
          <button
            onClick={onClose}
            className="text-white cursor-pointer rounded-full p-2 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                {...register("name", { required: true })}
                className="mt-1 block w-full border rounded px-3 py-2"
              />
              {errors.name && <span className="text-red-500 text-xs">Required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                {...register("gender", { required: true })}
                className="mt-1 block w-full border rounded px-3 py-2"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && <span className="text-red-500 text-xs">Required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">DOB</label>
              <input
                type="date"
                {...register("dob", { required: true })}
                className="mt-1 block w-full border rounded px-3 py-2"
              />
              {errors.dob && <span className="text-red-500 text-xs">Required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input
                {...register("rollNumber", { required: true })}
                className="mt-1 block w-full border rounded px-3 py-2"
              />
              {errors.rollNumber && <span className="text-red-500 text-xs">Required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Admission Number</label>
              <input
                {...register("admissionNumber", { required: true })}
                className="mt-1 block w-full border rounded px-3 py-2"
              />
              {errors.admissionNumber && <span className="text-red-500 text-xs">Required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Class</label>
              <input
                {...register("class", { required: true })}
                className="mt-1 block w-full border rounded px-3 py-2"
              />
              {errors.class && <span className="text-red-500 text-xs">Required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Section</label>
              <input
                {...register("section", { required: true })}
                className="mt-1 block w-full border rounded px-3 py-2"
              />
              {errors.section && <span className="text-red-500 text-xs">Required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Parent Name</label>
              <input
                {...register("parentName", { required: true })}
                className="mt-1 block w-full border rounded px-3 py-2"
              />
              {errors.parentName && <span className="text-red-500 text-xs">Required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Parent Phone</label>
              <input
                {...register("parentPhone", { required: true })}
                className="mt-1 block w-full border rounded px-3 py-2"
              />
              {errors.parentPhone && <span className="text-red-500 text-xs">Required</span>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                {...register("address", { required: true })}
                className="mt-1 block w-full border rounded px-3 py-2"
              />
              {errors.address && <span className="text-red-500 text-xs">Required</span>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 cursor-pointer transition"
            >
              {isSubmitting ? "Adding..." : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
