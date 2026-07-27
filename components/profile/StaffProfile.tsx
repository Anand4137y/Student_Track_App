import React from "react";

interface School {
  _id: string;
  schoolName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  schoolCode: string;
  district: string;
  status: string;
  permission: string;
}

export interface StaffData {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  isActive: boolean;
  permission: string;
  school: School;
  createdAt: string;
}

function StaffProfile({ data }: { data: StaffData | null }) {
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const getBadgeColor = (status: string) => {
    const styles: Record<string, string> = {
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      requested: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };
    return styles[status?.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              Profile Information
            </h3>
            
            <div className="space-y-5">
              <InfoItem label="Name" value={data.name} />
              <InfoItem label="Role" value={data.role.split('')[0].toUpperCase() + data.role.slice(1)} />
              <InfoItem label="Email Address" value={data.email} />
              <InfoItem label="Phone Number" value={data.phone} />
              <InfoItem label="Staff ID" value={data._id} truncate />
              <InfoItem label="Date Joined" value={new Date(data.createdAt).toLocaleDateString()} />
            </div>
          </div>
        </div>

        {/* School Info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
              School Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem label="School Name" value={data.school?.schoolName} fullWidth />
              <InfoItem label="School Code" value={data.school?.schoolCode} />
              <InfoItem label="District" value={data.school?.district} />
              <InfoItem label="Email" value={data.school?.email} />
              <InfoItem label="Phone" value={data.school?.phone} />
              <InfoItem label="Address" value={data.school?.address} fullWidth />
              <InfoItem label="City" value={data.school?.city} />
              <InfoItem label="State" value={data.school?.state} />
              <InfoItem label="Pin Code" value={data.school?.pinCode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, fullWidth = false, truncate = false }: { label: string; value: string; fullWidth?: boolean; truncate?: boolean }) {
  return (
    <div className={`${fullWidth ? "md:col-span-2" : ""}`}>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className={`text-sm font-medium text-gray-900 ${truncate ? "truncate" : ""}`} title={value}>
        {value || <span className="text-gray-400 italic">Not provided</span>}
      </div>
    </div>
  );
}

export default StaffProfile;